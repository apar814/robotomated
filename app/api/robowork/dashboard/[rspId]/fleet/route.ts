import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ rspId: string }> }
) {
  const { rspId } = await params;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    }
  );

  // Verify the RSP exists
  const { data: rsp, error: rspError } = await supabase
    .from("robot_service_providers")
    .select("id")
    .eq("id", rspId)
    .single();

  if (rspError || !rsp) {
    return NextResponse.json(
      { error: "Robot Service Provider not found" },
      { status: 404 }
    );
  }

  // Fetch fleet robots with their status records
  const { data: robots, error: robotsError } = await supabase
    .from("rsp_robots")
    .select(
      "id, custom_name, custom_manufacturer, custom_category, description, available, daily_rate, weekly_rate, monthly_rate, city, state, operator_included, remote_capable, created_at"
    )
    .eq("rsp_id", rspId)
    .order("created_at", { ascending: false });

  if (robotsError) {
    return NextResponse.json(
      { error: "Failed to fetch fleet data" },
      { status: 500 }
    );
  }

  // Fetch fleet status for all robots belonging to this RSP
  const robotIds = (robots || []).map((r) => r.id);

  let fleetStatus: Record<
    string,
    {
      status: string;
      current_job_id: string | null;
      current_client_name: string | null;
      location: string | null;
      battery_level: number | null;
      last_maintenance_date: string | null;
      next_maintenance_date: string | null;
      hours_logged: number;
      alert_flags: string[];
    }
  > = {};

  if (robotIds.length > 0) {
    const { data: statusData } = await supabase
      .from("rsp_fleet_status")
      .select(
        "rsp_robot_id, status, current_job_id, current_client_name, location, battery_level, last_maintenance_date, next_maintenance_date, hours_logged, alert_flags"
      )
      .eq("rsp_id", rspId)
      .in("rsp_robot_id", robotIds);

    if (statusData) {
      for (const s of statusData) {
        fleetStatus[s.rsp_robot_id] = {
          status: s.status || "idle",
          current_job_id: s.current_job_id,
          current_client_name: s.current_client_name,
          location: s.location,
          battery_level: s.battery_level,
          last_maintenance_date: s.last_maintenance_date,
          next_maintenance_date: s.next_maintenance_date,
          hours_logged: parseFloat(String(s.hours_logged)) || 0,
          alert_flags: s.alert_flags || [],
        };
      }
    }
  }

  // Merge robot info with fleet status
  const fleet = (robots || []).map((robot) => {
    const status = fleetStatus[robot.id];
    return {
      id: robot.id,
      name: robot.custom_name || "Unnamed Robot",
      manufacturer: robot.custom_manufacturer || null,
      category: robot.custom_category || null,
      description: robot.description,
      available: robot.available,
      rates: {
        daily: robot.daily_rate ? parseFloat(String(robot.daily_rate)) : null,
        weekly: robot.weekly_rate ? parseFloat(String(robot.weekly_rate)) : null,
        monthly: robot.monthly_rate
          ? parseFloat(String(robot.monthly_rate))
          : null,
      },
      location:
        [robot.city, robot.state].filter(Boolean).join(", ") || null,
      operatorIncluded: robot.operator_included,
      remoteCapable: robot.remote_capable,
      status: status?.status || "idle",
      currentJobId: status?.current_job_id || null,
      currentClientName: status?.current_client_name || null,
      batteryLevel: status?.battery_level ?? null,
      lastMaintenanceDate: status?.last_maintenance_date || null,
      nextMaintenanceDate: status?.next_maintenance_date || null,
      hoursLogged: status?.hours_logged || 0,
      alertFlags: status?.alert_flags || [],
    };
  });

  return NextResponse.json({ fleet });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ rspId: string }> }
) {
  const { rspId } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const robotId = body.rsp_robot_id as string | undefined;
  const newStatus = body.status as string | undefined;

  if (!robotId) {
    return NextResponse.json(
      { error: "rsp_robot_id is required" },
      { status: 400 }
    );
  }

  const validStatuses = ["operational", "maintenance", "deployed", "idle"];
  if (newStatus && !validStatuses.includes(newStatus)) {
    return NextResponse.json(
      {
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      },
      { status: 400 }
    );
  }

  const supabaseResponse = NextResponse.json({ ok: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Verify RSP ownership
  const { data: rsp } = await supabase
    .from("robot_service_providers")
    .select("id, user_id")
    .eq("id", rspId)
    .single();

  if (!rsp) {
    return NextResponse.json(
      { error: "Robot Service Provider not found" },
      { status: 404 }
    );
  }

  if (rsp.user_id !== user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // Verify the robot belongs to this RSP
  const { data: robot } = await supabase
    .from("rsp_robots")
    .select("id")
    .eq("id", robotId)
    .eq("rsp_id", rspId)
    .single();

  if (!robot) {
    return NextResponse.json(
      { error: "Robot not found in your fleet" },
      { status: 404 }
    );
  }

  // Build update payload
  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (newStatus) updatePayload.status = newStatus;
  if (body.current_job_id !== undefined)
    updatePayload.current_job_id = body.current_job_id;
  if (body.current_client_name !== undefined)
    updatePayload.current_client_name = body.current_client_name;
  if (body.location !== undefined) updatePayload.location = body.location;
  if (body.battery_level !== undefined)
    updatePayload.battery_level = body.battery_level;
  if (body.alert_flags !== undefined)
    updatePayload.alert_flags = body.alert_flags;

  // Upsert: update if exists, insert if not
  const { data: existingStatus } = await supabase
    .from("rsp_fleet_status")
    .select("id")
    .eq("rsp_robot_id", robotId)
    .eq("rsp_id", rspId)
    .single();

  if (existingStatus) {
    const { error } = await supabase
      .from("rsp_fleet_status")
      .update(updatePayload)
      .eq("id", existingStatus.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to update robot status" },
        { status: 500 }
      );
    }
  } else {
    const { error } = await supabase.from("rsp_fleet_status").insert({
      rsp_id: rspId,
      rsp_robot_id: robotId,
      ...updatePayload,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to create robot status record" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ ok: true, robotId, status: newStatus });
}
