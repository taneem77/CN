
# Project #5: SDN-Based Packet Logging and Monitoring
**Student Name:** Tanmayi Nagabhairava  
**SRN:** PES1UG24CS493  
**Course:** Computer Networks - UE24CS252B  

---

## 1. Project Overview
This project implements a custom Software-Defined Networking (SDN) application that provides real-time monitoring of network traffic. By leveraging the **POX Controller** and **OpenFlow** protocol, the system intercepts packets to log critical header information (MAC and IP addresses) while ensuring seamless data plane forwarding.

## 2. Environment & Topology
The network is emulated using **Mininet** with the following configuration:
* **Controller:** Remote POX Controller (`127.0.0.1:6633`)
* **Switch:** 1 OpenFlow-enabled Virtual Switch (`s1`)
* **Hosts:** 3 Virtual Hosts (`h1`, `h2`, `h3`)
* **Topology Command:**
  ```bash
  sudo mn --controller=remote,ip=127.0.0.1 --mac --topo=single,3
  ```

## 3. Implementation Logic (`logger.py`)
The controller logic is written in Python using the POX framework. It reactively installs rules and logs traffic as it arrives at the switch.

```python
def _handle_PacketIn (event):
    packet = event.parsed
    
    # --- LOGGING ---
    print("\n" + "="*30)
    print(" [PACKET LOGGED BY TANMAYI - 493] ")
    print(" Source MAC: %s | Dest MAC: %s" % (packet.src, packet.dst))
    
    ip_pkt = packet.find('ipv4')
    if ip_pkt:
        print(" Protocol: IPv4 | Src IP: %s | Dst IP: %s" % (ip_pkt.srcip, ip_pkt.dstip))
    print("="*30)

    # --- FORWARDING LOGIC ---
    msg = of.ofp_packet_out()
    msg.data = event.ofp
    msg.actions.append(of.ofp_action_output(port = of.OFPP_FLOOD))
    event.connection.send(msg)
```

## 4. Performance Observation & Analysis
The following latency metrics were captured during a 4-packet ICMP connectivity test between `h1` and `h2`:

| Metric | Result |
| :--- | :--- |
| **Connectivity** | 0% Packet Loss |
| **Minimum RTT** | 3.716 ms |
| **Average RTT** | **7.866 ms** |
| **Maximum RTT** | 18.695 ms |

### **Observation:**
The initial packet (`icmp_seq=1`) exhibited a latency of **18.7 ms**, which is significantly higher than subsequent packets (~3.9 ms). 
* **Theoretical Explanation:** This delay represents the **Reactive Flow Setup** time. Since the switch lacks a flow entry for new traffic, it must encapsulate the packet and query the POX controller via a `packet_in` event. Once the controller provides the `flood` instruction, subsequent packets are handled at wire speed by the switch.

## 5. Proof of Execution
### **A. Network Topology & Connectivity**
The `net` and `nodes` commands verify the successful creation of the 3-host topology, followed by a successful ping test.
<img width="1920" height="920" alt="VirtualBox_Ubuntu 24 04 3_10_04_2026_13_50_53" src="https://github.com/user-attachments/assets/da9ad8e3-3a2b-405a-9c72-b2b96a8c1922" />
<img width="1920" height="920" alt="VirtualBox_Ubuntu 24 04 3_10_04_2026_13_51_12" src="https://github.com/user-attachments/assets/f754a6fe-8b48-4f8f-ae78-1b3d0774ba8d" />


### **B. Controller Monitoring Output**
The POX console confirms that the `logger.py` application is successfully parsing and logging MAC/IP headers for every transaction.
<img width="1920" height="920" alt="VirtualBox_Ubuntu 24 04 3_10_04_2026_13_51_31" src="https://github.com/user-attachments/assets/e7b89a32-0479-45a0-95a6-d9fe9b90e023" />


