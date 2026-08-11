import type { Explainer } from "../explainer-types";

export const explainer: Explainer = {
  slug: "robot-total-cost-of-ownership",
  title: "Total cost of ownership for a commercial robot — what buyers forget",
  description:
    "The full cost picture of a commercial robot: acquisition, facility prep, integration, training, maintenance, software, and the items buyers overlook.",
  readTime: 7,
  publishedAt: "2026-08-10",
  sections: [
    {
      paragraphs: [
        "The price on a robot quote is the beginning of the cost conversation, not the end of it. Total cost of ownership — TCO — is the discipline of counting everything a robot will cost you from the day you sign to the day it leaves your building: the hardware, yes, but also the facility work, the integration, the training, the maintenance, the software subscriptions, the insurance, and the productivity you lose when it is down. Buyers who compare robots on sticker price alone routinely choose the wrong machine, because the categories that dominate lifetime cost are the ones that never appear on the initial quote.",
        "This guide walks through the cost categories one at a time, then calls out the specific items that experienced buyers say they underestimated. There are no example figures here, deliberately: every deployment's numbers are different, and a plausible-looking figure from someone else's project is worse than no figure at all. What transfers between projects is the structure — the checklist of categories you must price for your own facility before the business case means anything.",
      ],
    },
    {
      heading: "Acquisition is more than the robot",
      paragraphs: [
        "The acquisition line item starts with the robot arm or mobile platform, but it rarely ends there. An industrial arm does nothing without an end effector — the gripper, vacuum tool, welding torch, or camera-guided hand that actually touches your product — and end effectors are specified, purchased, and often custom-engineered separately. A robot that handles a wide mix of products may need several tools and a tool-change system to swap between them.",
        "Safeguarding is the next acquisition cost. Depending on the robot, the application, and the outcome of your risk assessment, this can mean physical fencing, interlocked gates, light curtains, area scanners, safety-rated controllers, and emergency stop circuits. Collaborative robots reduce some of this but do not eliminate it — the risk assessment is on the application, not the robot, and even a cobot cell can require guarding when the part, the tool, or the process is dangerous. Finally, deployments commonly involve peripheral equipment: conveyors, part presentation fixtures, vision systems, charging stations for mobile robots. Each is a purchase order the robot quote did not include.",
      ],
    },
    {
      heading: "Facility preparation",
      paragraphs: [
        "Robots inherit the condition of the building they move into. Fixed automation may need new electrical service at the cell, compressed air, and structural work to anchor equipment. Mobile robot fleets have their own facility demands: floors that are flat and sound enough for reliable navigation, door widths and ramp grades the platforms can handle, dedicated charging areas with adequate power, and — the item that surprises the largest number of first-time AMR buyers — wireless network coverage that is genuinely continuous across the operating area, not merely present. A fleet that loses connectivity in an aisle does not just slow down; it strands vehicles and generates exceptions your staff must clear.",
        "Safety infrastructure extends beyond the cell itself: floor markings, pedestrian segregation, signage, lighting in shared zones, and sometimes physical changes to traffic flow so people and robots cross paths as rarely as possible. None of this is optional once the risk assessment identifies it, and all of it is your cost, not the vendor's.",
      ],
    },
    {
      heading: "Integration, programming, and training",
      paragraphs: [
        "Integration is the cost category that most often rivals the hardware itself in effort and expense. Making a robot do useful work in your process means engineering the cell layout, programming the motion and logic, connecting the robot to your existing systems — warehouse management, manufacturing execution, quality databases — building the part fixtures, and then commissioning the whole thing until it runs at rate. If you hire a systems integrator, this arrives as a project fee; if you do it in-house, it arrives as engineering months. Either way it is real, and buyers who budget only for hardware discover it the hard way.",
        "Training belongs in the same bucket. Operators need to run the cell, recover from faults, and know when to call for help. Maintenance staff need vendor training on the specific platform. Someone — ideally more than one someone — needs to be able to modify programs when the product changes. Training is not a one-time event either: staff turn over, and the knowledge must be re-taught or it walks out the door.",
      ],
    },
    {
      heading: "The ongoing costs: maintenance, software, and insurance",
      paragraphs: [
        "Maintenance splits into preventive and corrective. Preventive maintenance is the scheduled work — lubrication, inspection, calibration, battery health checks — that the manufacturer's schedule prescribes and that warranty terms often require. Corrective maintenance is everything unplanned: the failed motor, the crashed tool, the sensor that drifts. Both consume spare parts, and a sensible TCO model includes a spares inventory for the components whose failure would stop production, plus the consumables that wear by design — gripper fingers, suction cups, belts, filters, and, for mobile robots, batteries, which are wear items with finite service lives, not permanent fixtures.",
        "Software has become a recurring cost center of its own. Fleet management platforms, simulation and offline programming tools, vision software, and connectivity services increasingly ship as subscriptions or annual licenses rather than one-time purchases. Support contracts with the manufacturer or integrator — the phone number you call when the line is down — are typically annual as well. Insurance closes out the recurring category: automated equipment can change your property and liability coverage, and your insurer will want to know about it.",
      ],
    },
    {
      heading: "Downtime, disposal, and the end of the story",
      paragraphs: [
        "Downtime is a cost even though no invoice arrives for it. When a robot that your process depends on stops, you pay in delayed orders, idle staff, expedited freight, or overtime to catch up — whichever form your operation converts lost hours into. The right way to handle this in a TCO model is to establish what an hour of unplanned stoppage costs your specific operation, and then let that figure discipline your decisions about spares, support contract levels, and redundancy. A cheaper robot with worse support can be the expensive choice once downtime enters the model.",
        "At the far end of the lifecycle sits disposal or resale. Industrial robots often retain meaningful residual value — there is an active secondary market, including certified pre-owned channels — but realizing that value takes de-installation labor, and some equipment is so customized to your process that its resale value is scrap. Either way, decommissioning is a cost or a credit that belongs in the model from the start.",
      ],
    },
    {
      heading: "What buyers most often forget",
      paragraphs: [
        "Four items come up again and again in post-project reviews. First, integration effort: buyers anchor on the hardware quote and treat integration as a rounding error, when in practice it is a project of comparable scale that determines whether the robot ever hits its promised rate. Second, safeguarding and the risk assessment behind it: the guarding, sensors, and safety engineering identified by a proper risk assessment are a genuine cost category, not an accessory, and skipping the assessment does not make the obligation disappear.",
        "Third, network infrastructure for mobile fleets: wireless coverage that was fine for handheld scanners is frequently inadequate for a fleet of vehicles that depend on continuous connectivity, and upgrading access points, coverage mapping, and roaming behavior across a large facility is a project in itself. Fourth, change management and re-programming: your products, packaging, and processes will change, and every change can mean re-programming, new fixtures, re-validation, and re-training. A robot is not a one-time purchase frozen at commissioning; it is an asset that must track a moving process, and the cost of keeping it current is the most persistently underestimated line in the whole model.",
        "Price every category for your own facility, put honest placeholders where you lack data, and let the total — not the sticker — drive the decision. That is the entire discipline of TCO, and it is the difference between an automation program that compounds and one that stalls after the first deployment.",
      ],
    },
  ],
  citations: [],
  glossaryLinks: [
    "tco",
    "roi",
    "payback-period",
    "systems-integrator",
    "amr",
    "cobot",
    "fleet-management",
    "service-level-agreement",
    "certified-pre-owned",
  ],
  nextStep: {
    label: "Browse the robot database",
    href: "/explore",
    blurb:
      "Compare robots with the full cost picture in mind — specs, support options, and ecosystem details that drive lifetime cost, not just the hardware.",
  },
};
