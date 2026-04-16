Since you want this to look exactly like a professional GitHub repository front page, I have added clear horizontal breaks (---), distinct code blocks, and formatted everything to look perfect in a README.md file.

You can copy the entire block below and paste it directly into your new GitHub file.

Remote Device Control & Monitoring System
Project #24 — TCP/IP Socket-Based IoT Infrastructure
👥 Contributors
This project was developed by:

Tanmayi — PES1UG24CS493

Tanisha — PES1UG24CS491

Pavithra — PES1UG24CS489

🏗️ Project Overview
This system implements a high-reliability communication bridge between an Edge IoT Device and a Central Controller. While built on raw TCP/IP sockets to ensure guaranteed packet delivery, the project's core value lies in its Hardware Intelligence Layer—a suite of six real-world engineering solutions designed to handle the physical constraints of industrial hardware.

🧠 The 6 Real-World Engineering Challenges
1. Short-Cycle Protection (Hysteresis & Lockout Logic)
In HVAC systems, rapid toggling of the compressor (Short-Cycling) causes high pressure and overheating, leading to motor burnout.

The Logic: We implemented a SC_LOCKOUT variable. Once the AC turns OFF, the system ignores any "Turn ON" signals for a period of 15 seconds (simulating a 3-minute industrial lockout).

Benefit: This prevents the hardware from responding to minor temperature oscillations around the threshold point.

2. Moving-Average Filter (Signal De-noising)
Raw sensor data is rarely "clean." Electromagnetic Interference (EMI) from the AC's own motor can cause random, extreme temperature spikes.

The Logic: We use a deque with a maxlen of 10. The controller calculates the arithmetic mean of these 10 samples.

Benefit: A single glitch reading only affects the average by 10%, preventing a false "Emergency Alarm" from triggering.

3. Watchdog Timer (Process Monitoring)
In OS design, a Watchdog ensures a process hasn't "hung." In this IoT context, it ensures the hardware is actually effective.

The Logic: When the AC turns ON, the controller records the starting temperature. If the temperature does not drop by at least 1.5°C within 15 seconds, the Watchdog concludes the AC has failed.

Benefit: Detects mechanical issues like refrigerant leaks or a stuck-open door that a simple thermostat would miss.

4. Relay Interfacing & Electrical Isolation
This module addresses the physical gap between logic circuits and power circuits.

The Logic: Our code simulates Galvanic Isolation provided by a relay. The software "energizes a coil" (3.3V logic) to move a physical switch for the 230V AC load.

Benefit: Illustrates how to protect a microcontroller's sensitive GPIO pins from high-voltage back-EMF and surges.

5. Multi-Stage PWM Fan Control
Modern "Inverter" class appliances use variable speeds to save energy rather than simple binary ON/OFF states.

The Logic: We implemented a 4-stage Pulse Width Modulation (PWM) simulation:

Low: Temp is 0-1°C above threshold.

Medium: 1-2°C above threshold.

High: 2-4°C above threshold.

Max: >4°C (Critical zone).

Benefit: Greatly reduces energy consumption and noise by only running the fan as fast as necessary.

6. Non-Volatile State Recovery (NVRAM)
If a power cut occurs, a basic script resets to default values, which can be dangerous in controlled environments like server rooms.

The Logic: Operating modes and temperature thresholds are committed to a persistent storage layer.

Benefit: On "Power Restoration," the system checks for a saved state and resumes its previous configuration instantly, ensuring 24/7 autonomous operation.

📊 Dashboard & Monitoring
The project includes a Live Dashboard (index.html) that visualizes the interaction between these six layers:

Thermal Alarms: Triggers after a sustained "Critical" temperature streak.

Mode Switching: Supports Manual, Auto, and Scheduled (Night-time) operations.

Live Shell: A terminal-style log showing the raw TCP JSON payloads and Round-Trip Time (RTT).

🏁 Conclusion
The Remote Device Control & Monitoring System successfully demonstrates the integration of low-level networking with high-level industrial safety logic. By utilizing raw TCP/IP sockets, we achieved a "zero-middleware" architecture that provides the reliability required for mission-critical environments.

The project goes beyond simple data streaming by addressing the physical realities of hardware engineering, specifically focusing on Fault Tolerance, Hardware Longevity, and Resilient Design. Ultimately, this project highlights that an "Internet of Things" system is only as reliable as its ability to handle "real-world" unpredictability through robust feedback loops and safety constraints.
