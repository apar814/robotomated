import { NextRequest, NextResponse } from "next/server";

interface ValuationRequest {
  manufacturer: string;
  model: string;
  year_purchased: number;
  purchase_price: number;
  operating_hours: number;
  condition: number;
  known_issues?: string;
  software_version?: string;
  location: string;
}

export async function POST(request: NextRequest) {
  let body: ValuationRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    manufacturer,
    model,
    year_purchased,
    purchase_price,
    operating_hours,
    condition,
    location,
  } = body;

  if (!manufacturer || !model || !year_purchased || !purchase_price || !location) {
    return NextResponse.json(
      { error: "Required fields: manufacturer, model, year_purchased, purchase_price, location" },
      { status: 400 }
    );
  }

  if (purchase_price <= 0) {
    return NextResponse.json(
      { error: "Purchase price must be greater than zero" },
      { status: 400 }
    );
  }

  if (condition < 1 || condition > 5) {
    return NextResponse.json(
      { error: "Condition must be between 1 and 5" },
      { status: 400 }
    );
  }

  const currentYear = new Date().getFullYear();
  const age = currentYear - year_purchased;

  const age_factor = Math.max(0.2, 1 - 0.18 * age);
  const condition_factor = condition / 5;
  const hours_factor = Math.max(0.3, 1 - operating_hours / 50000);

  const mid = Math.round(purchase_price * age_factor * condition_factor * hours_factor);
  const low = Math.round(mid * 0.8);
  const high = Math.round(mid * 1.2);

  let recommendation: string;
  if (mid / purchase_price > 0.6) {
    recommendation = "keep";
  } else if (mid / purchase_price > 0.3) {
    recommendation = "trade-in";
  } else {
    recommendation = "lease-transfer";
  }

  return NextResponse.json({
    low,
    mid,
    high,
    factors: {
      age_factor: Math.round(age_factor * 100) / 100,
      condition_factor: Math.round(condition_factor * 100) / 100,
      hours_factor: Math.round(hours_factor * 100) / 100,
    },
    recommendation,
  });
}
