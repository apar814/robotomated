import type { Explainer } from "../explainer-types";

export const explainer: Explainer = {
  slug: "sim-to-real-gap",
  title: "Sim-to-real: why robots that work in simulation fail on site",
  description:
    "What robot simulation is good for, where the sim-to-real gap comes from, how practitioners close it, and why buyers should treat sim results as evidence, not proof.",
  readTime: 8,
  publishedAt: "2026-08-10",
  sections: [
    {
      paragraphs: [
        "Somewhere in almost every robotics sales cycle, you will be shown a simulation. A rendered version of your warehouse with tidy aisles and gliding robots, a virtual robot arm cycling flawlessly through your part mix, a throughput model showing the system comfortably absorbing your peak day. The demonstration is usually honest work — simulation is a legitimate and important engineering tool — but it is a fundamentally different thing from a robot running in your building. The distance between the two has a name in the field: the sim-to-real gap. It describes the reliable observation that systems which perform well in simulation degrade, sometimes dramatically, when they meet physical reality.",
        "This is not a scandal and not a reason to distrust vendors who simulate. It is a property of the tools. Understanding what simulation can and cannot tell you is one of the most useful pieces of literacy a robotics buyer can have, because it changes what you ask for as evidence and how you structure acceptance of a system.",
      ],
    },
    {
      heading: "What simulation is actually used for",
      paragraphs: [
        "Simulation earns its place in several distinct roles. The first is motion planning validation: before a robot arm or mobile platform ever moves, engineers verify in a virtual model that planned trajectories avoid collisions, respect joint limits, and reach the required poses. This catches whole categories of design error cheaply, when fixing them is a matter of editing a file rather than repositioning installed equipment.",
        "The second role is cell and facility layout. For a robotic work cell, simulation answers whether the reach envelope covers the fixtures, where conveyors and infeed stations should sit, and whether an operator can safely access the space. For a mobile fleet, it tests aisle widths, charging station placement, and traffic patterns before anyone paints a line on the floor.",
        "The third is throughput modeling: discrete-event simulations that estimate how many picks, pallets, or cycles a proposed system can sustain under different demand profiles. These models drive sizing decisions — how many robots, how many stations — and they are the source of most of the capacity numbers you see in proposals.",
        "The fourth, increasingly prominent, is training learned policies. Modern manipulation and locomotion systems are often trained in simulation because a virtual robot can attempt a task millions of times overnight without breaking anything. Finally, there are digital twins: simulations kept synchronized with a live deployed fleet, used to test software changes, replay incidents, and evaluate what-if scenarios against a model that mirrors current operations. Each of these uses is valuable. None of them is a guarantee of field performance.",
      ],
    },
    {
      heading: "Where the gap comes from",
      paragraphs: [
        "The gap begins with physics that simulators handle poorly. Contact dynamics — what happens in the instant a gripper closes on a deformable package, or a wheel crosses a floor joint — involve friction, compliance, and micro-slip that are extremely difficult to model accurately. Simulators approximate these interactions, and the approximations are often exactly wrong in the situations that matter most: the marginal grasp, the slightly wet floor, the box that shifted in transit.",
        "Sensing is idealized in similar ways. A simulated camera sees a scene with clean geometry and consistent lighting; a real camera contends with glare from skylights at four in the afternoon, dust on the lens, motion blur, and reflective shrink wrap. Simulated lidar returns tidy point clouds; real lidar picks up rain, fog, and the occasional reflection off polished concrete. Machine-vision systems that classify perfectly on rendered images can stumble on the visual noise of an ordinary facility.",
        "Then there is the facility itself. Real buildings have dust that accumulates on sensors and charging contacts, vibration from adjacent equipment, Wi-Fi dead zones behind racking that interrupt fleet coordination, and floors with slopes, cracks, and expansion joints that no CAD model records. Real products vary beyond the modeled distribution: the SKU file says one carton size, but the actual inbound freight includes crushed corners, overstuffed polybags, and a packaging change the supplier made last month without telling anyone.",
        "The least modelable element is people. Simulations script human behavior or omit it; real facilities contain forklift drivers cutting through robot lanes, temporary staff who stack pallets in unexpected places, and pedestrians who behave in the unplanned ways pedestrians do. A navigation policy that performed perfectly against simulated agents meets its real test the first time someone steps backward off a ladder into its path.",
      ],
    },
    {
      heading: "How practitioners close the gap",
      paragraphs: [
        "The field has developed working answers, and their presence in a vendor's methodology is a meaningful quality signal. The best known is domain randomization: instead of training or validating in one carefully tuned simulation, engineers deliberately vary the simulated world — friction coefficients, lighting, object sizes, sensor noise, textures — across thousands of permutations. A policy that succeeds across all that variation has learned something robust rather than something specific to one idealized scene, and it transfers to reality far better. The concept matters more than the mechanics: good practitioners assume their simulator is wrong in unknown ways and train for a distribution of worlds rather than a single one.",
        "Hardware-in-the-loop testing puts real components inside the simulated loop: an actual robot controller, an actual sensor, an actual gripper driven by simulated scenarios. This exposes timing behavior, sensor quirks, and firmware issues that pure software simulation cannot reveal, at a fraction of the cost of a full physical build.",
        "Staged commissioning is the discipline of treating deployment itself as the final experiment. Rather than switching a system on at full speed, experienced integrators run real trials at reduced speed and reduced scope — one robot before ten, one aisle before the whole floor, supervised runs before autonomous ones — and expand only as observed performance supports it. This is where simulation predictions meet measurement, and where the inevitable surprises surface while they are still cheap.",
        "Finally, mature operators keep their simulations calibrated. A throughput model or digital twin is only as good as its correspondence to reality, so field data — actual cycle times, actual failure rates, actual travel speeds — flows back into the model, and the model's predictions are checked against what the fleet actually did. A simulation that has been validated against months of production data is a very different instrument from one built entirely from assumptions.",
      ],
    },
    {
      heading: "What this means for a buyer",
      paragraphs: [
        "The practical conclusion is a shift in how you weigh evidence. Simulation results are legitimate evidence for design decisions: they justify a layout, size a fleet, and demonstrate that a vendor has done serious engineering. They are not proof of production readiness, and a proposal that treats a simulated throughput figure as a committed performance number deserves scrutiny. The honest framing, which good vendors volunteer, is that the simulation defines what the system should do and the commissioning process establishes what it actually does.",
        "That distinction should be written into your contract. Insist on on-site acceptance testing: defined performance criteria, measured on your floor, with your products, your people, and your network, over a long enough period to catch the slow-appearing failure modes — the dust, the seasonal lighting change, the Friday-afternoon congestion. Structure payment and go-live decisions around those measurements rather than around the model. A pilot phase at reduced scope is the buyer's version of staged commissioning, and it is the single most effective protection against inheriting someone else's sim-to-real gap.",
        "Ask vendors directly how their simulations are validated. How does the model's predicted throughput compare with measured throughput at existing deployments? What surprised them at their last commissioning, and how did the model change afterward? Vendors with real field history answer these questions easily and specifically. Vendors whose confidence lives entirely inside the simulator tend to answer them in generalities — and that difference tells you most of what you need to know.",
      ],
    },
  ],
  faq: [
    {
      q: "Does a large sim-to-real gap mean the vendor's engineering is bad?",
      a: "Not necessarily. Some gap is inherent to simulation, because contact physics, sensing conditions, and human behavior cannot be fully modeled. The quality signal is not the absence of a gap but how the vendor manages it: whether they use techniques like domain randomization, validate models against field data, and commission in stages rather than promising simulated numbers as guaranteed outcomes.",
    },
    {
      q: "Should I ask to see a simulation of my facility before buying?",
      a: "It is often worthwhile, especially for layout and fleet-sizing decisions, because it forces both sides to work through your actual constraints. Just treat the output as a design hypothesis. The questions that matter are which assumptions the model makes about your products, floors, network, and people, and how those assumptions will be verified during on-site trials.",
    },
    {
      q: "What should on-site acceptance testing include?",
      a: "Defined, measurable criteria agreed before installation: throughput or cycle-time targets, error and intervention rates, and behavior in realistic conditions including peak periods and normal human traffic. Run it long enough to expose slow-appearing issues, and tie go-live and payment milestones to measured results rather than to simulated projections.",
    },
  ],
  citations: [],
  glossaryLinks: [
    "sim-to-real",
    "digital-twin",
    "machine-vision",
    "fleet-management",
    "throughput",
    "pilot-program",
    "systems-integrator",
  ],
  nextStep: {
    label: "Browse the robot database",
    href: "/explore",
    blurb:
      "Compare real, verified robots by category and spec — then ask every shortlisted vendor how their simulation claims held up in the field.",
  },
};
