import type { Explainer } from "../explainer-types";
import { explainer as whatIsRaas } from "./what-is-raas";
import { explainer as amrVsAgv } from "./amr-vs-agv";
import { explainer as whatIsACobot } from "./what-is-a-cobot";
import { explainer as specSheet } from "./how-to-read-a-robot-spec-sheet";
import { explainer as tco } from "./robot-total-cost-of-ownership";
import { explainer as buyLeaseRaas } from "./buy-lease-or-raas";
import { explainer as integrator } from "./what-does-a-systems-integrator-do";
import { explainer as safetyStandards } from "./robot-safety-standards-explained";
import { explainer as deployment } from "./robot-deployment-week-by-week";
import { explainer as maintenance } from "./robot-maintenance-guide";
import { explainer as certifications } from "./robot-operator-certifications";
import { explainer as pilot } from "./how-to-run-a-robotics-pilot";
import { explainer as simToReal } from "./sim-to-real-gap";
import { explainer as warehousePath } from "./warehouse-automation-path";
import { explainer as construction } from "./construction-robotics-today";

export const EXPLAINERS: Explainer[] = [
  whatIsRaas,
  amrVsAgv,
  whatIsACobot,
  specSheet,
  tco,
  buyLeaseRaas,
  integrator,
  safetyStandards,
  deployment,
  maintenance,
  certifications,
  pilot,
  simToReal,
  warehousePath,
  construction,
];

const bySlug = new Map(EXPLAINERS.map((e) => [e.slug, e]));

export function getExplainer(slug: string): Explainer | undefined {
  return bySlug.get(slug);
}

export function isExplainerSlug(slug: string): boolean {
  return bySlug.has(slug);
}
