// ============================================================================
// Fleet Management — Demo Data
// Realistic fleet data for unauthenticated or empty-fleet users
// ============================================================================

export interface DemoAsset {
  id: string;
  custom_name: string;
  robot_name: string;
  serial_number: string;
  purchase_date: string;
  purchase_price: number;
  site_location: string;
  department: string;
  status: "active" | "maintenance" | "offline" | "decommissioned";
  notes: string | null;
  created_at: string;
}

export interface DemoMaintenanceLog {
  id: string;
  asset_id: string;
  log_date: string;
  maintenance_type: "routine" | "repair" | "emergency" | "upgrade";
  description: string;
  technician: string;
  cost: number;
  downtime_hours: number;
  parts_replaced: string[];
  next_service_date: string | null;
}

export interface DemoSchedule {
  id: string;
  asset_id: string;
  schedule_name: string;
  interval_type: "daily" | "weekly" | "monthly" | "quarterly" | "annual" | "hours-based";
  interval_value: number;
  task_description: string;
  estimated_hours: number;
  estimated_cost: number;
  requires_professional: boolean;
  last_completed: string | null;
  next_due: string | null;
  alert_days_before: number;
  is_active: boolean;
}

export const DEMO_ASSETS: DemoAsset[] = [
  {
    id: "demo-asset-1",
    custom_name: "Picker Alpha",
    robot_name: "Locus Robotics Origin",
    serial_number: "LR-2024-00847",
    purchase_date: "2024-06-15",
    purchase_price: 35000,
    site_location: "Warehouse A — Dallas, TX",
    department: "Fulfillment",
    status: "active",
    notes: "Primary picker for Zone 3",
    created_at: "2024-06-15T10:00:00Z",
  },
  {
    id: "demo-asset-2",
    custom_name: "Weldy McWeldface",
    robot_name: "Universal Robots UR10e",
    serial_number: "UR-10E-2024-11293",
    purchase_date: "2024-03-01",
    purchase_price: 52000,
    site_location: "Plant Floor — Detroit, MI",
    department: "Manufacturing",
    status: "active",
    notes: "Welding cell B — running 2-shift schedule",
    created_at: "2024-03-01T08:00:00Z",
  },
  {
    id: "demo-asset-3",
    custom_name: "Floor Rover",
    robot_name: "Avidbots Neo 2",
    serial_number: "AV-NEO2-8824",
    purchase_date: "2025-01-10",
    purchase_price: 42000,
    site_location: "HQ Office — Austin, TX",
    department: "Facilities",
    status: "maintenance",
    notes: "Squeegee replacement in progress",
    created_at: "2025-01-10T14:00:00Z",
  },
  {
    id: "demo-asset-4",
    custom_name: "Pallet Mover 1",
    robot_name: "Boston Dynamics Stretch",
    serial_number: "BD-STR-2025-0042",
    purchase_date: "2025-02-20",
    purchase_price: 85000,
    site_location: "Warehouse A — Dallas, TX",
    department: "Fulfillment",
    status: "active",
    notes: "Dock door 7 — unloading trailers",
    created_at: "2025-02-20T09:00:00Z",
  },
  {
    id: "demo-asset-5",
    custom_name: "Security Bot 3",
    robot_name: "Knightscope K5",
    serial_number: "KS-K5-2024-3391",
    purchase_date: "2024-09-01",
    purchase_price: 28000,
    site_location: "HQ Office — Austin, TX",
    department: "Security",
    status: "offline",
    notes: "Firmware update pending — offline until March 31",
    created_at: "2024-09-01T12:00:00Z",
  },
  {
    id: "demo-asset-6",
    custom_name: "Sorter Beta",
    robot_name: "Berkshire Grey Robotic Pick Station",
    serial_number: "BG-RPS-2023-5510",
    purchase_date: "2023-11-15",
    purchase_price: 120000,
    site_location: "Warehouse B — Phoenix, AZ",
    department: "Fulfillment",
    status: "active",
    notes: null,
    created_at: "2023-11-15T11:00:00Z",
  },
];

export const DEMO_MAINTENANCE_LOGS: DemoMaintenanceLog[] = [
  {
    id: "demo-log-1",
    asset_id: "demo-asset-1",
    log_date: "2026-03-15",
    maintenance_type: "routine",
    description: "Quarterly sensor calibration and wheel inspection",
    technician: "Maria Gonzalez",
    cost: 450,
    downtime_hours: 2,
    parts_replaced: [],
    next_service_date: "2026-06-15",
  },
  {
    id: "demo-log-2",
    asset_id: "demo-asset-2",
    log_date: "2026-03-10",
    maintenance_type: "repair",
    description: "Replaced worn welding tip holder and recalibrated TCP",
    technician: "Jake Torres",
    cost: 1200,
    downtime_hours: 4,
    parts_replaced: ["Welding tip holder", "TCP calibration tool"],
    next_service_date: "2026-04-10",
  },
  {
    id: "demo-log-3",
    asset_id: "demo-asset-3",
    log_date: "2026-03-25",
    maintenance_type: "repair",
    description: "Squeegee blade replacement — excessive wear detected",
    technician: "Alex Chen",
    cost: 320,
    downtime_hours: 1.5,
    parts_replaced: ["Squeegee blade assembly"],
    next_service_date: "2026-06-25",
  },
  {
    id: "demo-log-4",
    asset_id: "demo-asset-4",
    log_date: "2026-02-28",
    maintenance_type: "routine",
    description: "Monthly safety inspection and gripper check",
    technician: "Maria Gonzalez",
    cost: 600,
    downtime_hours: 3,
    parts_replaced: [],
    next_service_date: "2026-03-31",
  },
  {
    id: "demo-log-5",
    asset_id: "demo-asset-6",
    log_date: "2026-01-20",
    maintenance_type: "upgrade",
    description: "Vision system firmware upgrade v4.2 — improved pick accuracy by 12%",
    technician: "Berkshire Grey Support",
    cost: 2500,
    downtime_hours: 6,
    parts_replaced: ["Vision module firmware"],
    next_service_date: "2026-07-20",
  },
  {
    id: "demo-log-6",
    asset_id: "demo-asset-1",
    log_date: "2025-12-15",
    maintenance_type: "routine",
    description: "Annual preventive maintenance — full system check",
    technician: "Maria Gonzalez",
    cost: 800,
    downtime_hours: 4,
    parts_replaced: ["Drive belt", "Air filter"],
    next_service_date: "2026-03-15",
  },
  {
    id: "demo-log-7",
    asset_id: "demo-asset-5",
    log_date: "2026-03-20",
    maintenance_type: "emergency",
    description: "Navigation sensor failure — unit grounded pending firmware fix",
    technician: "Knightscope Remote Support",
    cost: 0,
    downtime_hours: 48,
    parts_replaced: [],
    next_service_date: null,
  },
];

export const DEMO_SCHEDULES: DemoSchedule[] = [
  {
    id: "demo-sched-1",
    asset_id: "demo-asset-1",
    schedule_name: "Sensor Calibration",
    interval_type: "quarterly",
    interval_value: 1,
    task_description: "Calibrate all navigation and obstacle-detection sensors",
    estimated_hours: 2,
    estimated_cost: 450,
    requires_professional: false,
    last_completed: "2026-03-15",
    next_due: "2026-06-15",
    alert_days_before: 14,
    is_active: true,
  },
  {
    id: "demo-sched-2",
    asset_id: "demo-asset-1",
    schedule_name: "Wheel & Drive Belt Inspection",
    interval_type: "monthly",
    interval_value: 1,
    task_description: "Inspect wheels for wear, check drive belt tension",
    estimated_hours: 1,
    estimated_cost: 150,
    requires_professional: false,
    last_completed: "2026-03-01",
    next_due: "2026-04-01",
    alert_days_before: 7,
    is_active: true,
  },
  {
    id: "demo-sched-3",
    asset_id: "demo-asset-2",
    schedule_name: "TCP Recalibration",
    interval_type: "monthly",
    interval_value: 1,
    task_description: "Recalibrate Tool Center Point for welding accuracy",
    estimated_hours: 1.5,
    estimated_cost: 300,
    requires_professional: true,
    last_completed: "2026-03-10",
    next_due: "2026-04-10",
    alert_days_before: 7,
    is_active: true,
  },
  {
    id: "demo-sched-4",
    asset_id: "demo-asset-2",
    schedule_name: "Annual Safety Audit",
    interval_type: "annual",
    interval_value: 1,
    task_description: "Full safety audit per ISO 10218 — emergency stop, force limits, workspace barriers",
    estimated_hours: 8,
    estimated_cost: 2000,
    requires_professional: true,
    last_completed: "2025-09-01",
    next_due: "2026-09-01",
    alert_days_before: 30,
    is_active: true,
  },
  {
    id: "demo-sched-5",
    asset_id: "demo-asset-3",
    schedule_name: "Squeegee & Brush Check",
    interval_type: "weekly",
    interval_value: 1,
    task_description: "Inspect squeegee blades and brushes for wear, clean debris",
    estimated_hours: 0.5,
    estimated_cost: 50,
    requires_professional: false,
    last_completed: "2026-03-22",
    next_due: "2026-03-29",
    alert_days_before: 2,
    is_active: true,
  },
  {
    id: "demo-sched-6",
    asset_id: "demo-asset-4",
    schedule_name: "Gripper Inspection",
    interval_type: "monthly",
    interval_value: 1,
    task_description: "Inspect suction cups, check vacuum pressure, test grip force",
    estimated_hours: 2,
    estimated_cost: 400,
    requires_professional: false,
    last_completed: "2026-02-28",
    next_due: "2026-03-31",
    alert_days_before: 7,
    is_active: true,
  },
  {
    id: "demo-sched-7",
    asset_id: "demo-asset-6",
    schedule_name: "Vision System Calibration",
    interval_type: "quarterly",
    interval_value: 1,
    task_description: "Calibrate all cameras and depth sensors, run pick accuracy test",
    estimated_hours: 3,
    estimated_cost: 800,
    requires_professional: true,
    last_completed: "2026-01-20",
    next_due: "2026-04-20",
    alert_days_before: 14,
    is_active: true,
  },
];

// Helper to compute summary stats from demo data
export function computeFleetStats(
  assets: DemoAsset[],
  logs: DemoMaintenanceLog[],
  schedules: DemoSchedule[]
) {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  const totalAssets = assets.length;
  const activeRobots = assets.filter((a) => a.status === "active").length;
  const totalFleetValue = assets.reduce((sum, a) => sum + a.purchase_price, 0);

  const ytdLogs = logs.filter((l) => new Date(l.log_date) >= startOfYear);
  const ytdMaintenanceSpend = ytdLogs.reduce((sum, l) => sum + l.cost, 0);

  const dueSoon = schedules.filter((s) => {
    if (!s.next_due || !s.is_active) return false;
    const due = new Date(s.next_due);
    const daysUntil = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return daysUntil <= 7 && daysUntil >= 0;
  });

  const overdue = schedules.filter((s) => {
    if (!s.next_due || !s.is_active) return false;
    return new Date(s.next_due) < today;
  });

  return {
    totalAssets,
    activeRobots,
    maintenanceDue: dueSoon.length,
    overdue: overdue.length,
    totalFleetValue,
    ytdMaintenanceSpend,
    dueSoonSchedules: dueSoon,
    overdueSchedules: overdue,
  };
}
