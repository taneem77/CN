from pox.core import core
import pox.openflow.libopenflow_01 as of

log = core.getLogger()

def _handle_PacketIn (event):
    packet = event.parsed
    
    # --- LOGGING (Your Project Requirement) ---
    print("\n" + "="*30)
    print(" [PACKET LOGGED BY TANMAYI - 493] ")
    print(" Source MAC: %s | Dest MAC: %s" % (packet.src, packet.dst))
    
    ip_pkt = packet.find('ipv4')
    if ip_pkt:
        print(" Protocol: IPv4 | Src IP: %s | Dst IP: %s" % (ip_pkt.srcip, ip_pkt.dstip))
    print("="*30)

    # --- FORWARDING LOGIC (Fixes the Ping) ---
    # This tells the switch to flood the packet so it reaches the destination
    msg = of.ofp_packet_out()
    msg.data = event.ofp
    msg.actions.append(of.ofp_action_output(port = of.OFPP_FLOOD))
    event.connection.send(msg)

def launch ():
    core.openflow.addListenerByName("PacketIn", _handle_PacketIn)
    print("Packet Logger with Forwarding for SRN 493 is active...")
