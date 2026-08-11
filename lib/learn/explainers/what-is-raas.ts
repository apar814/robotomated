import type { Explainer } from "../explainer-types";

export const explainer: Explainer = {
  slug: "what-is-raas",
  title: "What is Robotics-as-a-Service and how does pricing work?",
  description:
    "How the RaaS subscription model works: what's bundled, common contract structures, capex vs. opex, and what to scrutinize before signing.",
  readTime: 7,
  publishedAt: "2026-08-10",
  sections: [
    {
      paragraphs: [
        "Robotics-as-a-Service, usually shortened to RaaS, is a commercial model in which you subscribe to robot capacity rather than buying robots outright. Instead of writing a large check for hardware and then owning everything that follows — integration, maintenance, software updates, spare parts, the inevitable surprises — you pay a recurring fee, and the vendor delivers a working capability. The robots typically remain the vendor's property. What you are buying is an outcome: pallets moved, floors cleaned, totes picked, inventory scanned.",
        "The model borrowed its logic from software-as-a-service, but the physical component changes the economics and the risks in important ways. A SaaS vendor can push a fix overnight; a RaaS vendor has hardware sitting on your floor that wears, breaks, and occasionally needs a technician with a toolbox. Understanding what a RaaS subscription actually bundles — and what it quietly excludes — is the difference between a contract that de-risks your automation program and one that locks you into someone else's roadmap.",
      ],
    },
    {
      heading: "What a RaaS subscription typically bundles",
      paragraphs: [
        "A well-constructed RaaS agreement wraps four things into one recurring fee: the hardware itself, the software that runs it, ongoing maintenance, and support. The hardware portion covers the robots and usually their charging or docking infrastructure. The software portion covers the fleet management platform, task orchestration, updates, and often the integrations with your warehouse management or facility systems. Maintenance covers preventive service visits, corrective repairs, and replacement of wear parts. Support covers the help desk, remote monitoring, and escalation to on-site technicians when remote fixes fail.",
        "The bundling is the point. When one vendor owns the whole stack, there is no finger-pointing between a hardware manufacturer, a software provider, and a maintenance contractor. If a robot is down, it is unambiguously the vendor's problem, and the contract's uptime commitments give them a direct financial reason to fix it quickly.",
        "What is typically excluded matters just as much. Facility preparation — power drops, network coverage, floor repairs, safety fencing or zone marking — usually stays on your side of the line. So does the labor to receive the robots' work: someone still has to load induct stations or clear exceptions. Integration with your existing systems is sometimes included, sometimes a separately scoped project. Consumables can go either way. Read the exclusions list before you read anything else.",
      ],
    },
    {
      heading: "Common contract structures",
      paragraphs: [
        "RaaS pricing comes in a handful of recurring structures, and vendors often blend them. The simplest is per-robot-per-month: a flat subscription for each unit deployed, regardless of how hard it works. This is easy to budget and easy to compare across vendors, but it means you carry the utilization risk — a robot idling through a slow month costs the same as one running flat out.",
        "The second family is consumption-based: per-pick, per-task, per-pallet-moved, or per-area-cleaned. Here the vendor carries more of the utilization risk, and your cost scales with your actual throughput. The trade-off is that consumption pricing almost always arrives with a volume floor — a minimum monthly commitment you pay whether or not you hit it. That floor is where the real negotiation happens, because it converts a variable cost back into a partially fixed one.",
        "Layered over either structure are term commitments. Vendors need minimum contract lengths to recover their hardware investment, so expect a multi-year initial term, sometimes with early-termination charges that step down over time. Shorter terms are possible but usually carry a premium, and pilot arrangements often run on separate short-term paper before converting to a standard agreement. Onboarding, deployment, and integration are frequently charged as a one-time setup fee alongside the recurring subscription.",
      ],
    },
    {
      heading: "Capex becomes opex — and why that matters",
      paragraphs: [
        "The most cited financial argument for RaaS is that it converts a capital expenditure into an operating expense. Buying robots means a large upfront outlay that sits on your balance sheet and depreciates; subscribing means a predictable recurring charge that flows through the operating budget. For many organizations, opex approval is a materially easier internal process than a capital request, which competes against every other project in the annual budgeting cycle.",
        "There is a second, less discussed effect: RaaS shifts technology risk. Robotics is evolving quickly, and a robot you buy today is a robot you own when a meaningfully better generation ships. Under RaaS, hardware refresh is usually the vendor's obligation, and software improvements arrive continuously as part of the subscription. You are paying, in effect, for the option to not be stuck.",
        "The mirror image is total cost. A subscription that runs for many years on a stable, predictable workload will generally cost more over its life than owning the same capability, because the vendor's margin, risk buffer, and capital cost are all baked into the recurring fee. Opex convenience is not free.",
      ],
    },
    {
      heading: "Where RaaS fits — and where ownership wins",
      paragraphs: [
        "RaaS is strongest where uncertainty is highest. Seasonal operations that need extra capacity for peak periods can scale a fleet up and back down without owning idle machines the rest of the year. Businesses with genuinely uncertain volumes — new facilities, new product lines, contract logistics with shifting client mixes — can match robot capacity to demand rather than betting capital on a forecast. And organizations with no in-house robotics or controls staff get the vendor's engineers as part of the deal, which for a first deployment is often worth more than the hardware.",
        "Ownership tends to win when the workload is stable, well understood, and expected to run for a long horizon. If a robot cell will do the same job in the same cell for years, the subscription premium buys you flexibility you will never use. Ownership also wins when the robot must be deeply customized to your process, when your data governance rules make vendor-operated equipment awkward, or when you already employ the maintenance and engineering talent the subscription would otherwise supply. Many mature operations land on a mix: owned equipment for the stable core, RaaS for the variable edge.",
      ],
    },
    {
      heading: "What to scrutinize in a RaaS contract",
      paragraphs: [
        "Exit terms first. Understand exactly what happens at the end of the term and in an early exit: notice periods, removal logistics, who pays for de-installation, whether there is a purchase option for the equipment, and what happens to any integration work you funded. A contract that is easy to enter and hard to leave is not a subscription; it is a lock-in.",
        "Data ownership second. RaaS platforms generate detailed operational data — travel paths, throughput, exception rates, facility maps. Establish who owns that data, whether you can export it in a usable format, whether the vendor can use it to train models or benchmark other customers, and what survives contract termination. Your operational data is an asset; do not sign it away by default.",
        "SLA definitions third. An uptime percentage means nothing until you know how it is measured. Pin down what counts as downtime, whether scheduled maintenance is excluded, how response time differs from resolution time, what remedies apply when the vendor misses — service credits are common, but check whether chronic failure gives you a termination right — and how uptime is calculated across a fleet versus a single robot. A fleet-level average can look healthy while your busiest station sits dark.",
        "Finally, volume floors and growth terms. If your pricing is consumption-based, model the minimum commitment against your realistic low season, not your average. And check what happens when you want to grow: whether added units come in at the original rate, how quickly the vendor can deploy them, and whether the term resets when you expand.",
      ],
    },
  ],
  faq: [
    {
      q: "Who owns the robots in a RaaS contract?",
      a: "In a standard RaaS arrangement, the vendor retains ownership of the hardware for the life of the contract. You are paying for access to the capability, not for the asset. Some agreements include an end-of-term purchase option, but unless the contract says otherwise, the robots leave when the subscription ends.",
    },
    {
      q: "What happens when the contract ends?",
      a: "Typically the vendor removes its equipment and decommissions the deployment, which is why exit terms deserve close reading before you sign. Key questions: who pays for removal, how much notice is required, whether there is a purchase or renewal option, and what happens to integrations and operational data you relied on. Plan the exit on the day you sign, not the day you leave.",
    },
    {
      q: "Is maintenance really included, or are there hidden costs?",
      a: "Preventive and corrective maintenance on the robots themselves is normally bundled, since the vendor owns the hardware and has every incentive to keep it running. Watch the edges: damage caused by your staff or facility conditions, consumable parts, facility infrastructure the robots depend on, and anything the contract labels as outside normal use may be billed separately.",
    },
    {
      q: "Can I switch vendors mid-contract if the robots underperform?",
      a: "Only if the contract lets you. Look for performance-based termination rights tied to the SLA — for example, the right to exit without penalty after repeated or sustained failures to meet uptime or throughput commitments. Without such a clause, your remedies are usually limited to service credits, and you remain bound for the full term.",
    },
  ],
  citations: [],
  glossaryLinks: [
    "raas",
    "service-level-agreement",
    "uptime",
    "fleet-management",
    "amr",
    "tco",
    "pilot-program",
    "systems-integrator",
  ],
  nextStep: {
    label: "Browse the robot database",
    href: "/explore",
    blurb:
      "See which robot categories and vendors offer subscription deployment, and compare them against ownership options for your workload.",
  },
};
