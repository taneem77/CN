Remote Device Control & Monitoring System
Project #24 — TCP/IP Socket-Based IoT Infrastructure
1. Contributors
Tanmayi — PES1UG24CS493

Tanisha — PES1UG24CS491

Pavithra — PES1UG24CS489

2. Project Objectives
The objective of this system is to establish a high-reliability, full-duplex communication bridge between an Edge IoT Device and a Central Controller.



By utilizing raw TCP/IP sockets, the project demonstrates a "zero-middleware" approach to industrial monitoring, specifically focusing on Fault Tolerance, Hardware Longevity, and Resilient Design.

3. Environment & Topology
The project architecture emulates a real-world industrial monitoring environment:

Controller Node: A Python-based Server running on 127.0.0.1:65432.

Edge Device Node: A simulated IoT client that injects EMI-style sensor noise for testing.

Data Plane: Raw TCP Sockets providing guaranteed, ordered delivery of JSON-formatted telemetry.

Execution Command: ```bash

Terminal 1: Initialize the Controller (Server)
python controller.py

Terminal 2: Initialize the IoT Device (Client)
python device_mock.py


---

## 4. Implementation Logic (controller.py)  
The controller is built using reactive logic in Python. It parses incoming packets and maintains safety state variables (lockouts, averages, and timestamps) to protect the physical hardware.  

<br>

```python
def start_smart_controller():
    # --- LOGGING BY TANMAYI (493), TANISHA (491), PAVITHRA (489) ---
    print("\n" + "="*30)
    print(" [TELEMETRY LOGGED] ")
    
    # --- PHASE 1: SENSOR FILTERING ---
    raw_temp = json.loads(data.decode())["temp"]
    readings.append(raw_temp)
    avg = sum(readings) / len(readings)
    
    # --- PHASE 2: SAFETY DISPATCH ---
    if avg >= THRESH_HIGH:
        if now - last_off_ts >= SC_LOCKOUT:
            command = "LED_ON"
    elif avg <= THRESH_LOW:
        command = "LED_OFF"
    
    print(f" RAW: {raw_temp} | AVG: {avg:.1f} | CMD: {command}")
    print("="*30)
```

