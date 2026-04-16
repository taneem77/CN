from pox.core import core
import pox.openflow.libopenflow_01 as of
from pox.lib.util import dpid_to_str
from pox.lib.revent import 
from pox.lib.recoco import Timer

log = core.getLogger()

class OrangeMonitor(object)
    def __init__(self)
        core.openflow.addListeners(self)
        # Requirement Periodic monitoring (reports every 10 seconds)
        Timer(10, self._request_stats, recurring=True)

    def _request_stats(self)
        for connection in core.openflow._connections.values()
            # Send standard OpenFlow stats request to observe network behavior
            connection.send(of.ofp_stats_request(body=of.ofp_flow_stats_request()))
        log.info(--- Statistics Request Sent to Switches ---)

    def _handle_FlowStatsReceived(self, event)
        stats = event.stats
        log.info(n[STATS REPORT] Switch ID %s, dpid_to_str(event.dpid))
        log.info(PACKETS  BYTES    PORT_IN  ETH_DST)
        log.info(-------- -------- -------- -----------------)
        for f in stats
            # Displays packet and byte counts as required by the project guidelines
            if f.packet_count  0 
                log.info(%8d %8d %8s %17s, f.packet_count, f.byte_count, 
                         f.match.in_port, f.match.dl_dst)

    def _handle_ConnectionUp(self, event)
        log.info(Switch %s connected. Monitoring logic active., dpid_to_str(event.dpid))

def launch()
    # Load l2_learning to handle packet_in events and install flow rules
    import pox.forwarding.l2_learning
    pox.forwarding.l2_learning.launch()
    # Register the custom monitor
    core.registerNew(OrangeMonitor)