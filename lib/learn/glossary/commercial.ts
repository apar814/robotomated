import type { GlossaryTerm } from "../glossary-types";

export const COMMERCIAL_TERMS: GlossaryTerm[] = [
  {
    slug: "raas",
    term: "Robotics-as-a-Service (RaaS)",
    definition:
      "A commercial model in which robots are provided under a subscription or usage-based contract rather than purchased outright. The provider typically retains ownership of the hardware and bundles deployment, software, maintenance, and support into a recurring fee. For buyers, RaaS shifts robotics spending from capital expenditure to operating expenditure and lowers the upfront commitment, at the cost of ongoing fees and dependence on the provider's contract terms.",
    related: ["lease-vs-finance", "tco", "rsp", "fleet-management"],
    explore: [{ label: "Robot marketplace", href: "/explore" }],
    group: "commercial",
  },
  {
    slug: "tco",
    term: "Total cost of ownership (TCO)",
    definition:
      "The full cost of acquiring and operating a robot system over its useful life, not just the purchase price. TCO accounts for items such as integration, tooling, software licenses, training, energy, consumables, maintenance, spare parts, downtime, and eventual decommissioning or resale. Comparing robots on TCO rather than sticker price gives buyers a more accurate basis for decisions, since integration and lifetime support costs often differ substantially between otherwise similar systems.",
    related: ["roi", "payback-period", "lease-vs-finance", "raas"],
    group: "commercial",
  },
  {
    slug: "systems-integrator",
    term: "Systems integrator",
    definition:
      "A firm that designs, builds, installs, and commissions complete automation systems from components supplied by robot manufacturers and other vendors. Integrators handle tasks the robot maker typically does not, including cell layout, end-of-arm tooling, guarding and safety compliance, PLC and controls programming, and connection to plant systems. Most industrial robot deployments are delivered through an integrator, so integrator selection and scope definition are as consequential for a buyer as the robot choice itself.",
    related: ["rsp", "brownfield-vs-greenfield", "pilot-program", "risk-assessment"],
    explore: [{ label: "RoboWork services", href: "/robowork" }],
    group: "commercial",
  },
  {
    slug: "rsp",
    term: "Robotics service provider (RSP)",
    definition:
      "A company that delivers robotics capability as an ongoing service, covering some combination of deployment, operation, monitoring, maintenance, and fleet support. An RSP differs from a traditional systems integrator in that its engagement continues through the operating life of the system rather than ending at commissioning. Buyers working with an RSP should define responsibilities, response commitments, and data ownership in the service contract.",
    related: ["systems-integrator", "raas", "service-level-agreement", "fleet-management"],
    explore: [{ label: "RoboWork services", href: "/robowork" }],
    group: "commercial",
  },
  {
    slug: "certified-pre-owned",
    term: "Certified pre-owned (robotics)",
    definition:
      "A used robot that has been inspected, refurbished as needed, and resold with some form of warranty or performance guarantee, typically by the original manufacturer or an authorized reseller. Certification distinguishes these units from as-is secondary-market equipment, where condition, service history, and controller compatibility are the buyer's risk to verify. For buyers, certified pre-owned can reduce acquisition cost while preserving support access, though available models and controller generations are limited to what the resale channel carries.",
    related: ["tco", "lease-vs-finance", "systems-integrator"],
    explore: [{ label: "Robot marketplace", href: "/explore" }],
    group: "commercial",
  },
  {
    slug: "lease-vs-finance",
    term: "Lease vs. finance",
    definition:
      "Two acquisition structures for robot equipment. Under a lease, the buyer pays for use of the equipment over a term and may return, renew, or purchase it at the end; under financing, the buyer takes ownership and repays a loan secured against the asset. The choice affects balance-sheet treatment, tax handling, upgrade flexibility, and who bears residual-value risk, so it is usually made with finance and accounting input rather than by the operations team alone.",
    related: ["raas", "tco", "certified-pre-owned", "payback-period"],
    group: "commercial",
  },
  {
    slug: "roi",
    term: "Return on investment (ROI)",
    definition:
      "A measure of the financial benefit of an automation project relative to its cost, expressed as the net gain divided by the total investment. For robotics, the benefit side typically includes labor reallocation, quality improvements, scrap reduction, and added capacity, while the cost side should reflect total cost of ownership rather than purchase price alone. ROI figures in vendor proposals are only as sound as their assumptions, so buyers should validate inputs such as utilization, staffing impact, and integration cost against their own operation.",
    related: ["payback-period", "tco", "throughput", "proof-of-concept"],
    group: "commercial",
  },
  {
    slug: "payback-period",
    term: "Payback period",
    definition:
      "The time required for the cumulative net savings or earnings from an automation investment to equal its total cost. It is a simple screening measure: shorter payback means capital is recovered sooner and the project carries less exposure to changes in demand or product mix. Payback ignores benefits that continue after the break-even point and does not discount future cash flows, so it is best used alongside ROI or a discounted cash-flow analysis rather than as the sole decision criterion.",
    related: ["roi", "tco", "lease-vs-finance"],
    group: "commercial",
  },
  {
    slug: "pilot-program",
    term: "Pilot program",
    definition:
      "A limited production deployment of a robot system used to validate performance, reliability, and operational fit before a wider rollout. Unlike a proof of concept, a pilot runs on real work in the real environment, with actual operators, parts, and schedules, and is measured against agreed success criteria. A well-structured pilot defines its duration, metrics, exit conditions, and scale-up plan in advance so the outcome produces a clear go or no-go decision rather than an open-ended trial.",
    related: ["proof-of-concept", "brownfield-vs-greenfield", "systems-integrator", "uptime"],
    group: "commercial",
  },
  {
    slug: "proof-of-concept",
    term: "Proof of concept (PoC)",
    definition:
      "A short, controlled demonstration that a robot can perform a specific task with representative parts, typically run in a lab, demo cell, or vendor facility rather than in production. A PoC answers the technical feasibility question — can the robot do this at all — but not the operational questions of reliability, integration, and cost that a pilot addresses. Buyers should treat a successful PoC as permission to plan a pilot, not as evidence that the full deployment will succeed.",
    related: ["pilot-program", "systems-integrator", "sim-to-real"],
    group: "commercial",
  },
  {
    slug: "brownfield-vs-greenfield",
    term: "Brownfield vs. greenfield",
    definition:
      "A distinction between deploying automation into an existing facility with established equipment, layouts, and workflows (brownfield) and designing automation into a new facility from the start (greenfield). Brownfield projects must work around legacy constraints such as floor space, existing conveyors, IT systems, and production that cannot stop, which raises integration effort and favors flexible equipment. Greenfield projects allow the building, material flow, and automation to be designed together, but carry the risks of any new-facility program.",
    related: ["systems-integrator", "pilot-program", "amr", "wms"],
    group: "commercial",
  },
  {
    slug: "uptime",
    term: "Uptime",
    definition:
      "The proportion of scheduled operating time during which a robot or system is available to run, commonly reported as availability over a defined period. Uptime is reduced by failures, unplanned maintenance, and recovery from faults; how planned maintenance and changeovers are counted must be defined for the figure to be comparable. Buyers should ask how a quoted uptime number is measured and over what fleet and period, and should tie uptime commitments to remedies in the service agreement.",
    related: ["oee", "service-level-agreement", "fleet-management"],
    group: "commercial",
  },
  {
    slug: "oee",
    term: "Overall equipment effectiveness (OEE)",
    definition:
      "A composite manufacturing metric, commonly defined as the product of availability, performance, and quality, that expresses how much of a machine's scheduled time produces good parts at the intended rate. Availability captures downtime losses, performance captures speed losses relative to the ideal cycle, and quality captures defect and rework losses. For robot buyers, OEE is useful both for quantifying the losses an automation project is meant to remove and for tracking whether an installed system delivers its expected output.",
    related: ["uptime", "cycle-time", "throughput"],
    group: "commercial",
  },
  {
    slug: "cycle-time",
    term: "Cycle time",
    definition:
      "The time a robot or workcell takes to complete one full unit of work, from the start of one part to the start of the next. It is determined by motion paths, process time, part handling, and any waiting on upstream or downstream equipment, and it sets the cell's maximum output rate. Quoted robot cycle times often reflect ideal motion under light payloads, so buyers should validate cycle time with their own parts, tooling, and path constraints during a proof of concept or pilot.",
    related: ["takt-time", "throughput", "oee", "payload"],
    group: "commercial",
  },
  {
    slug: "throughput",
    term: "Throughput",
    definition:
      "The rate at which a system produces completed units or handles items over a period of time. For a single cell, throughput follows from cycle time and availability; for a line or a mobile-robot fleet, it is governed by the slowest constraint in the flow, so adding robot capacity elsewhere may not raise it. Buyers should evaluate throughput at the system level under realistic mix and interruption conditions, not from the rated speed of an individual robot.",
    related: ["cycle-time", "takt-time", "oee", "fleet-management"],
    group: "commercial",
  },
  {
    slug: "takt-time",
    term: "Takt time",
    definition:
      "The pace at which units must be completed to meet customer demand, calculated by dividing available production time by required output. Takt time comes from demand, not from the equipment: it is the target that cycle times must fit within, with margin for variability and minor stoppages. In automation planning, comparing each station's cycle time against takt time shows where robots relieve bottlenecks and how much headroom a proposed cell leaves for demand growth.",
    related: ["cycle-time", "throughput", "oee"],
    group: "commercial",
  },
  {
    slug: "wms",
    term: "Warehouse management system (WMS)",
    definition:
      "Software that manages warehouse operations, including inventory locations, order picking, replenishment, and labor tasks. Mobile robots and automated storage systems usually connect to the WMS directly or through a fleet-management or warehouse-execution layer that translates orders into robot tasks. For buyers, the integration between a robot fleet and the existing WMS is often the largest source of deployment effort and risk, so interface scope and responsibility should be settled early with the vendor or integrator.",
    related: ["amr", "agv", "fleet-management", "brownfield-vs-greenfield"],
    group: "commercial",
  },
  {
    slug: "service-level-agreement",
    term: "Service-level agreement (SLA)",
    definition:
      "A contractual commitment defining the level of service a robot vendor or service provider must deliver, such as availability targets, support response and resolution times, and spare-parts turnaround. An SLA also specifies how the metrics are measured and what remedies apply when commitments are missed, which is what gives the targets commercial force. Buyers should confirm that SLA definitions match how the equipment is actually scheduled and used, since exclusions for planned maintenance, misuse, or environmental conditions determine what the guarantee covers in practice.",
    related: ["uptime", "raas", "rsp"],
    group: "commercial",
  },
];
