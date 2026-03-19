import socket, json, time, random

HOST, PORT = '127.0.0.1', 65432

def start_device():
    print("\n--- PAV'S VIRTUAL DEVICE ---")
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        client.connect((HOST, PORT))
        print(f"Connected to Controller at {HOST}:{PORT}")
        while True:
            # Send Temp
            temp = round(random.uniform(22.0, 28.0), 2)
            client.sendall(json.dumps({"temp": temp}).encode('utf-8'))
            # Check for Command
            client.settimeout(0.5)
            try:
                data = client.recv(1024).decode('utf-8')
                if data:
                    cmd = json.loads(data)
                    print(f"\n[ACTION] {cmd['action']} received!")
            except socket.timeout: pass
            time.sleep(2)
    except Exception as e: print(f"Error: {e}")
    finally: client.close()

if __name__ == "__main__":
    start_device()
