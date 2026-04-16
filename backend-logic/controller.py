import socket
import json
import time
from collections import deque

# --- CONFIGURATION ---
HOST, PORT = '127.0.0.1', 65432
THRESH_HIGH, THRESH_LOW = 26.0, 23.0
MA_WINDOW = 10          
SC_LOCKOUT = 15         
WD_TIMEOUT = 15         

# --- STATE VARIABLES ---
readings = deque(maxlen=MA_WINDOW)
last_off_ts = 0
ac_on_ts = None
ac_on_temp = None

def get_filtered_temp():
    return sum(readings) / len(readings) if readings else None

def start_smart_controller():
    # ADD THESE THREE LINES TO FIX THE ERROR
    global last_off_ts
    global ac_on_ts
    global ac_on_temp
    
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((HOST, PORT))
        s.listen(1)
        print(f"✅ Controller listening on {PORT}...")
        
        conn, addr = s.accept()
        with conn:
            print(f"📡 Device connected from {addr}")
            while True:
                try:
                    data = conn.recv(1024)
                    if not data: break
                    
                    raw_temp = json.loads(data.decode())["temp"]
                    readings.append(raw_temp)
                    avg = get_filtered_temp()
                    now = time.time()
                    
                    command = "KEEP_STATE"

                    # 1. CASE: SHORT-CYCLE PROTECTION
                    if avg >= THRESH_HIGH:
                        if now - last_off_ts < SC_LOCKOUT:
                            print(f"⚠️ SC LOCKOUT: Temp {avg:.1f}°C but compressor blocked.")
                        else:
                            command = "LED_ON"
                            if ac_on_ts is None: 
                                ac_on_ts, ac_on_temp = now, avg
                    
                    # 2. CASE: NORMAL SHUTDOWN
                    elif avg <= THRESH_LOW:
                        command = "LED_OFF"
                        if ac_on_ts is not None: 
                            last_off_ts = now 
                            ac_on_ts = None

                    # 3. CASE: WATCHDOG TIMER
                    if ac_on_ts and (now - ac_on_ts) >= WD_TIMEOUT:
                        if avg >= ac_on_temp - 1.5:
                            print("🔧 MAINTENANCE REQUIRED: AC running but no cooling!")

                    response = {"action": command, "avg": round(avg, 1)}
                    conn.sendall(json.dumps(response).encode())
                    
                    print(f"RAW: {raw_temp:>4} | AVG: {avg:.1f} | CMD: {command}")
                    
                except Exception as e:
                    print(f"❌ Error in controller: {e}")
                    break

if __name__ == "__main__":
    start_smart_controller()