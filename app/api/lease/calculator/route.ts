import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const priceParam = searchParams.get("price");
  const termParam = searchParams.get("term");

  if (!priceParam || !termParam) {
    return NextResponse.json(
      { error: "Missing required parameters: price, term" },
      { status: 400 }
    );
  }

  const price = parseFloat(priceParam);
  const term = parseInt(termParam, 10);

  if (isNaN(price) || price <= 0) {
    return NextResponse.json(
      { error: "Price must be a positive number" },
      { status: 400 }
    );
  }

  if (isNaN(term) || term < 12 || term > 60) {
    return NextResponse.json(
      { error: "Term must be between 12 and 60 months" },
      { status: 400 }
    );
  }

  // Simple formula: monthly = (price * 1.15) / term
  // 1.15 includes 15% finance cost over the lease term
  const totalCost = price * 1.15;
  const monthly = Math.round(totalCost / term);

  return NextResponse.json({
    price,
    term,
    monthly,
    total_cost: Math.round(totalCost),
    finance_cost: Math.round(totalCost - price),
  });
}
