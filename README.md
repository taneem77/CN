Project #5: SDN-Based Packet Logging System

Student Name: Tanmayi Nagabhairava

SRN: PES1UG24CS493

Course: Computer Networks - UE24CS252B



1. Objective & Problem Understanding
The goal of this project is to implement a packet-logging SDN controller using POX and Mininet.

Interception: The controller intercepts packet_in events to parse header information.

Monitoring: It logs MAC and IP addresses to the console.

Connectivity: It maintains network connectivity while logging.

2. Network Topology & Environment
Following the Mininet Installation Manual:

Topology: Single Switch with 3 Hosts (--topo single,3).

Controller: Remote POX Controller.

Justification: This setup allows for clear observation of how the controller handles multi-host traffic and ARP/IP flows.

3. SDN Logic & Implementation
Packet_In Handling: The logger.py script listens for OpenFlow PacketIn events.

Match-Action Logic: The script extracts Source/Destination MACs and IPs.

Functional Correctness: A flood action is sent back to the switch to permit forwarding.

Code Location: pox/ext/logger.py

4. Performance Observation & Analysis
Based on the functional demo captured in the screenshots:

Connectivity: Successfully achieved 0% packet loss during h1 ping h2.

Latency (RTT): Min/Avg/Max: 3.716 / 7.866 / 18.695 ms.

Interpretation: The first packet (icmp_seq=1) took 18.7 ms, which is significantly higher than subsequent packets (~3.9 ms).

Technical Reason: The first packet triggered a packet_in event to the controller, while subsequent packets were handled by the switch's flow rules.

5. Proof of Execution (Screenshots)
Screenshot 1: Mininet terminal showing net topology and ping results with 0% loss.

Screenshot 2: POX console logs showing [PACKET LOGGED BY TANMAYI - 493] with MAC/IP details.

<img width="1920" height="920" alt="VirtualBox_Ubuntu 24 04 3_10_04_2026_13_50_53" src="https://github.com/user-attachments/assets/fbb58dd0-9e19-41ee-98dc-3f6d6289fc0f" />

<img width="1920" height="920" alt="VirtualBox_Ubuntu 24 04 3_10_04_2026_13_51_12" src="https://github.com/user-attachments/assets/470e5438-237d-4b55-9ec8-db464c28d9c1" />

<img width="1920" height="920" alt="VirtualBox_Ubuntu 24 04 3_10_04_2026_13_51_31" src="https://github.com/user-attachments/assets/1e9e56b8-ea84-4b41-9731-76052eb6e397" />


