import type { Explainer } from "../explainer-types";

export const explainer: Explainer = {
  slug: "how-to-run-a-robotics-pilot",
  title: "How to run a robotics pilot that produces a real decision",
  description:
    "Design a robotics pilot backwards from the go/no-go decision: metrics set up front, bounded scope, honest instrumentation, and a pre-committed decision meeting.",
  readTime: 8,
  publishedAt: "2026-08-10",
  sections: [
    {
      paragraphs: [
        "The characteristic failure of robotics pilots is not that the robot fails. It is that the pilot succeeds vaguely: the robot mostly works, the team is mostly positive, the vendor extends the trial, and six months later the organization has spent real money and attention and still cannot answer the only question the pilot existed to answer — are we deploying this at scale, or not? Pilots drift because nobody defined what evidence would settle the question, so no amount of evidence ever does.",
        "The fix is structural, not motivational. A pilot that produces a decision is designed backwards from that decision: the metrics that will drive the go/no-go call are written down before the first robot arrives, the scope is chosen to generate exactly that evidence, the instrumentation is honest about failure as well as success, and the meeting where the decision gets made is on the calendar from day one. Everything in this guide follows from that inversion.",
      ],
    },
    {
      heading: "Define the decision before the pilot",
      paragraphs: [
        "Start by writing the decision memo you intend to make at the end — with the numbers blank. It should say: we will proceed to a production deployment if the pilot demonstrates acceptable performance on the following dimensions, and we will stop if it does not. The dimensions that typically matter are throughput per labor hour in the piloted workflow, error and damage rates compared to the current process, uptime during scheduled operating hours, the count and character of human interventions required, and the real integration effort — how much engineering time it actually took to connect the robot to your systems and your process.",
        "The thresholds on each dimension are yours to set, and they should come from your own economics: what performance would actually justify the deployment cost and disruption at your volumes. Resist the temptation to leave thresholds fuzzy so the pilot cannot fail. A pilot that cannot fail also cannot conclude. Equally, agree in advance which dimensions are gating and which are informational, so a strong result on throughput does not quietly excuse an unacceptable intervention rate.",
        "This is also the moment to distinguish a pilot from a proof of concept. A proof of concept asks whether the robot can do the task at all, often in a demo cell or a corner of the floor. A pilot assumes technical feasibility and asks whether the operation works in your environment, with your people, at a performance level that justifies scaling. If feasibility is still in doubt, run the cheaper proof of concept first and do not dress it up as a pilot.",
      ],
    },
    {
      heading: "Scope it to be representative but bounded",
      paragraphs: [
        "The scope has to satisfy two competing demands. It must be representative — the workflow, product mix, and conditions inside the pilot must resemble what the production deployment will face, or the results will not transfer. And it must be bounded — small enough that the pilot has a defined edge, a start, and an end, or it will metastasize into a half-deployment that nobody can evaluate or unwind.",
        "In practice this means choosing one workflow or zone, defined product or task types, and a fixed duration, and being deliberate about which hard cases are in scope. Vendors will naturally steer pilots toward the friendly subset of your operation; your job is to make sure the pilot includes enough of the awkward reality — the odd-shaped items, the congested aisle, the workflow exception — that the results mean something. A pilot that only ever sees the easy work produces a number you cannot use.",
        "Duration follows from variation, not from the calendar. The pilot needs to run long enough to experience your operation's real texture: peak days and slow days, shift changes and the second shift's different habits, product mix swings, the end-of-quarter push. A trial that spans only quiet weeks measures a facility that does not exist. Map your known cycles of variation and make sure the pilot window crosses them.",
      ],
    },
    {
      heading: "Instrument honestly",
      paragraphs: [
        "The vendor's dashboard will report what the robot accomplished. Your instrumentation must also capture what it did not: every exception, every fault, every time a person stepped in to rescue a task, re-stage work the robot could not handle, or clean up after it. Interventions are the single most predictive measurement in a pilot, because at fleet scale each intervention becomes a staffing requirement. A robot that completes its tasks but needs frequent human rescue has not automated the work; it has reorganized it.",
        "Practically, this means a simple, disciplined log — kept by your team, not the vendor — of interventions, exceptions, downtime with causes, and near-misses, alongside the throughput and error data. Categorize interventions by cause when you log them, not months later from memory. And measure the baseline: instrument the current manual process with the same rigor for the same dimensions, ideally before the robots arrive, so the comparison at decision time is like-for-like rather than robot-data-versus-anecdote.",
      ],
    },
    {
      heading: "Staff it like you mean it",
      paragraphs: [
        "Pilots without a named owner drift by default. Assign one internal person who owns the pilot end to end — the metrics, the log, the vendor relationship, the schedule — and give them the authority to get facility and IT issues resolved. This is a real fraction of a real person's time, not a task appended to someone's full-time job, and the owner should be someone who will be involved in the production deployment if it happens.",
        "Involve the operators who work in the affected area from day one, not as a courtesy but as instrumentation. They will see failure modes management never will, they will develop the workarounds that reveal where the robot's design fights your process, and their judgment about whether the system helps or burdens them is data you need before scaling. A pilot run over the heads of the people in the workflow produces both worse information and a harder deployment later. Bring your maintenance and IT people in early for the same reason: integration effort and supportability are pilot findings too.",
      ],
    },
    {
      heading: "Get the contract right",
      paragraphs: [
        "Pilot agreements deserve more scrutiny than their size suggests, because they set the terms of the relationship you may be entering. Three areas matter most. First, pilot-to-production pricing: negotiate the shape of the production deal — pricing structure, how pilot fees credit toward it, what commitments scale-up would entail — before the pilot starts, while you still have leverage. After a successful pilot, your alternatives have narrowed and the vendor knows it.",
        "Second, data. The pilot will generate operational data about your facility — maps, throughput, exception patterns. Establish who owns it, that you can export it, and what the vendor may do with it, including whether they can reference your results. You will want the raw data for your own decision analysis regardless of the outcome.",
        "Third, exit. Define what happens if you stop: notice period, who removes the equipment and restores the space, what happens to integrations built during the pilot, and that ending the pilot carries no penalty beyond its stated cost. A clean exit clause is what keeps a pilot a pilot. While you are at it, confirm responsibilities for safety compliance, insurance, and damage during the trial — a risk assessment for the piloted workflow is required diligence even for temporary deployments.",
      ],
    },
    {
      heading: "Know what a pilot cannot tell you",
      paragraphs: [
        "Some questions are structurally beyond a pilot's reach, and pretending otherwise corrupts the decision. A weeks-long trial cannot reveal long-run maintenance burden: wear develops over years, and pilot units are often the vendor's best-maintained machines. It cannot reveal fleet-scale traffic effects: five robots in one zone tell you little about how fifty behave when their paths, charging schedules, and task queues start interacting across a whole facility. And it cannot fully test organizational absorption — training pipelines, support escalation, the second facility.",
        "De-risk those separately rather than extending the pilot in the hope they will appear. For maintenance burden, use the diligence channel: the vendor's published maintenance schedule and wear-parts intervals, service contract terms, and reference calls with customers who have operated the system for years. For fleet-scale behavior, ask for simulation studies against your facility layout and reference visits to sites running at the scale you intend. For organizational absorption, plan the production rollout in phases so the first phase functions as a scaled pilot. Then hold the decision meeting you scheduled at the start, with the memo you wrote at the start, and fill in the blanks. If the evidence clears the thresholds, proceed. If it does not, stop — a pilot that ends in a clear no has done its job, and has done it cheaply.",
      ],
    },
  ],
  faq: [
    {
      q: "How long should a robotics pilot run?",
      a: "Long enough to cross your operation's real cycles of variation — peak and slow periods, shift changes, product mix swings — rather than a fixed number of weeks. Map when those variations occur in your facility and set the pilot window to include them. A trial that only spans quiet, typical weeks measures conditions the production system will not face.",
    },
    {
      q: "What is the difference between a proof of concept and a pilot?",
      a: "A proof of concept tests whether the robot can perform the task at all, often in a controlled or demo setting. A pilot assumes technical feasibility and tests whether the operation works in your environment at a performance level that justifies scaling — with your people, your product mix, and your systems. If feasibility is still uncertain, run the cheaper proof of concept first.",
    },
    {
      q: "What should we measure besides throughput?",
      a: "Error and damage rates against your manual baseline, uptime during scheduled hours, integration effort actually expended, and — most predictive of all — human interventions: every time someone rescued a task, re-staged work, or cleaned up an exception. Interventions logged by cause translate directly into the staffing a fleet-scale deployment would require.",
    },
  ],
  citations: [],
  glossaryLinks: [
    "pilot-program",
    "proof-of-concept",
    "throughput",
    "uptime",
    "cycle-time",
    "fleet-management",
    "systems-integrator",
    "risk-assessment",
    "amr",
    "payback-period",
    "tco",
  ],
  nextStep: {
    label: "Browse the robot database",
    href: "/explore",
    blurb:
      "Compare robot categories and vendors to shortlist candidates worth piloting against your workflow.",
  },
};
