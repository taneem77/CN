import socket, threading, json, datetime, time

# --- CONFIGURATION ---
HOST, PORT = '127.0.0.1', 65432
state = {"conn": None, "temp": "N/A"}

def logger(msg):
    ts = datetime.datetime.now().strftime("%H:%M:%S")
    print(f"[LOG {ts}] {msg}")

def handle_device():
    """The Server Logic (Tanmayi's Part)"""
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        server.bind((HOST, PORT))
        server.listen(1)
        logger(f"SYSTEM ONLINE. Waiting for Pav on Port {PORT}...")
        while True:
            conn, addr = server.accept()
            state["conn"] = conn
            logger(f"Network: Device connected from {addr}")
            try:
                while True:
                    data = conn.recv(1024).decode('utf-8')
                    if not data: break
                    payload = json.loads(data)
                    if "temp" in payload: state["temp"] = payload["temp"]
            except: pass
            finally:
                state["conn"] = None
                logger("Network: Device disconnected.")
                conn.close()
    except Exception as e: print(f"Error: {e}")

# --- START SERVER IN BACKGROUND ---
threading.Thread(target=handle_device, daemon=True).start()

def run_menu():
    """The Frontend Logic (Tan's Part)"""
    time.sleep(1) # Wait for server to boot
    print("\n" + "="*30)
    print("   TAN & TANMAYI'S SYSTEM   ")
    print("="*30)
    
    while True:
        print("\n1. [LED] Turn ON  |  2. [LED] Turn OFF")
        print("3. [DATA] Check Temp  |  4. [EXIT]")
        
        choice = input("\nSelect Action: ")
        
        if choice in ["1", "2"]:
            action = "LED_ON" if choice == "1" else "LED_OFF"
            if state["conn"]:
                try:
                    state["conn"].sendall(json.dumps({"action": action}).encode('utf-8'))
                    print(f">>> SUCCESS: {action} sent to Pav's Device")
                except: print(">>> ERROR: Send failed")
            else:
                print(">>> ERROR: Device Offline. Is Pav running device_mock.py?")
        
        elif choice == "3":
            status = "ONLINE" if state["conn"] else "OFFLINE"
            print(f">>> Status: {status} | Current Temp: {state['temp']}°C")
        
        elif choice == "4":
            break

if __name__ == "__main__":
    run_menu()
