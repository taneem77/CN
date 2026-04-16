Project #5: SDN Packet LoggerStudent 
Name: Tanmayi Nagabhairava 
SRN: PES1UG24CS493 
Course: Computer Networks - UE24CS252B  

1. Objective & Problem Understanding 
The goal is to implement a packet-logging SDN controller using POX and Mininet. The controller intercepts packet_in events, parses header information (MAC and IP addresses), and logs them to the console while maintaining network connectivity. 

2. Network Topology
Following the Mininet Installation Manual: 
Topology: Single Switch with 3 Hosts (--topo single,3). 
Controller: Remote POX Controller. 
Justification: This setup allows for clear observation of how the controller handles multi-host traffic and ARP/IP flows. 

3. SDN Logic & Implementation 
Packet_In Handling: The logger.py script listens for OpenFlow PacketIn events. 
Match-Action: The script extracts Source/Destination MACs and IPs. To ensure Functional Correctness, a flood action is sent back to the switch to permit forwarding. 
Code Location: pox/ext/logger.py 

4. Performance Observation & Analysis 
Based on the functional demo: 
Connectivity: Successfully achieved 0% packet loss during h1 ping h2. 
Latency (RTT): * Min/Avg/Max: 3.716 / 7.866 / 18.695 ms. 
Interpretation: The first packet (icmp_seq=1) took 18.7 ms, which is significantly higher than subsequent packets (~3.9 ms). This is because the first packet triggered a packet_in event to the controller, while subsequent packets were handled by the flow rules. 

5. Proof of Execution (Screenshots) 
Screenshot 1: Mininet terminal showing net topology and ping results with 0% loss. 
Screenshot 2: POX console logs showing [PACKET LOGGED BY TANMAYI - 493] with MAC/IP details.


<img width="1920" height="920" alt="VirtualBox_Ubuntu 24 04 3_10_04_2026_13_50_53" src="https://github.com/user-attachments/assets/02611fce-6918-4dbe-a26b-0a7167a1f92f" />
<img width="1920" height="920" alt="VirtualBox_Ubuntu 24 04 3_10_04_2026_13_51_12" src="https://github.com/user-attachments/assets/e5b633ee-8053-458d-9544-fcf0a1de7cc6" />
<img width="1920" height="920" alt="VirtualBox_Ubuntu 24 04 3_10_04_2026_13_51_31" src="https://github.com/user-attachments/assets/7d2e2cbd-5559-4003-acd5-dd0028f88857" />


