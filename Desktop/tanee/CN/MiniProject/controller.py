import socket, threading, json, datetime, time

HOST, PORT = '127.0.0.1', 65432
device_connection = None
last_received_temp = "N/A"

def logger(msg):
    ts = datetime.datetime.now().strftime("%H:%M:%S")
    with open("system_logs.txt", "a") as f:
        f.write(f"[{ts}] {msg}\n")
    print(f"[LOG {ts}] {msg}")

def handle_device():
    global device_connection, last_received_temp
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        server.bind((HOST, PORT))
        server.listen(1)
        print(f"\n>>> TANMAYI'S CONTROLLER ONLINE (Port {PORT}) <<<")
        while True:
            conn, addr = server.accept()
            device_connection = conn
            logger(f"Connected to Device at {addr}")
            try:
                while True:
                    data = conn.recv(1024).decode('utf-8')
                    if not data: break
                    payload = json.loads(data)
                    if "temp" in payload: last_received_temp = payload["temp"]
            except: pass
            finally:
                device_connection = None
                logger("Device Disconnected.")
                conn.close()
    except Exception as e: print(f"Error: {e}")

def send_command(action):
    if device_connection:
        try:
            device_connection.sendall(json.dumps({"action": action}).encode('utf-8'))
            logger(f"Sent: {action}")
            return {"status": "SUCCESS", "message": f"Command {action} Sent"}
        except: return {"status": "ERROR", "message": "Send Failed"}
    return {"status": "ERROR", "message": "Device Offline"}

def get_status():
    return {"temperature": last_received_temp, "online": device_connection is not None}

threading.Thread(target=handle_device, daemon=True).start()

if __name__ == "__main__":
    try:
        while True: time.sleep(1)
    except KeyboardInterrupt: print("\nStopping...")
