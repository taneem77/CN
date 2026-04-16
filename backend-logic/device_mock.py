import socket
import json
import time
import random

def get_noisy_temp(base):
    """Simulates DHT11 sensor noise with a 5% chance of EMI spikes."""
    if random.random() < 0.05: # Phase 3: Glitch
        return round(base + random.uniform(15, 25), 1)
    return round(base + random.uniform(-0.3, 0.3), 1)

def start_noisy_device():
    HOST, PORT = '127.0.0.1', 65432
    base_temp = 24.0 # Initial baseline temperature
    
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.connect((HOST, PORT))
            print("📡 Connected to Controller.")
            
            while True:
                # Generate noisy reading
                temp = get_noisy_temp(base_temp)
                
                # Send JSON payload
                s.sendall(json.dumps({"temp": temp}).encode())
                
                # Receive response safely
                data = s.recv(1024)
                if not data:
                    print("⚠️ Connection closed by Controller.")
                    break
                
                try:
                    response = json.loads(data.decode())
                    cmd = response.get("action", "KEEP_STATE")
                    
                    # Simulate physical feedback loop
                    if cmd == "LED_ON": 
                        base_temp -= 0.4 # AC cooling effect
                    else: 
                        base_temp += 0.2 # Natural warming effect
                    
                    print(f"Telemetry: {temp:>4}°C | Controller says: {cmd}")
                    
                except json.JSONDecodeError:
                    print("❌ Error: Received malformed JSON from Controller.")
                
                time.sleep(1) # Frequency: 1 Hz
                
        except ConnectionRefusedError:
            print("❌ Connection Refused: Is the Controller running?")
        except Exception as e:
            print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    start_noisy_device()