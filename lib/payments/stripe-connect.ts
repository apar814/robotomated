import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CreateSellerAccountResult {
  accountId: string;
  onboardingUrl: string;
}

interface SellerAccountDetails {
  accountId: string;
  email: string | null;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  balance: {
    available: Stripe.Balance.Available[];
    pending: Stripe.Balance.Pending[];
  };
}

interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  sellerId: string;
  buyerId: string;
  platformFeePercent: number;
  description: string;
  metadata?: Record<string, string>;
}

interface CreatePaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
}

interface ReleaseEscrowResult {
  paymentIntentId: string;
  status: string;
}

interface RefundResult {
  refundId: string;
  status: string;
  amount: number;
}

interface FeeCalculation {
  platformFee: number;
  sellerAmount: number;
  feePercent: number;
}

// ---------------------------------------------------------------------------
// Fee schedule (mirrors DB seed from migration 027)
// ---------------------------------------------------------------------------

const FEE_SCHEDULE: Record<string, { feePercent: number; feeFixed: number }> = {
  robowork_job: { feePercent: 12.0, feeFixed: 0 },
  cpo_sale: { feePercent: 10.0, feeFixed: 0 },
  parts_sale: { feePercent: 15.0, feeFixed: 0 },
  service_booking: { feePercent: 12.0, feeFixed: 0 },
  timeshare_booking: { feePercent: 15.0, feeFixed: 0 },
  lease_transfer: { feePercent: 3.0, feeFixed: 0 },
  cert_purchase: { feePercent: 100.0, feeFixed: 0 },
  insurance_referral: { feePercent: 8.0, feeFixed: 0 },
  lease_referral: { feePercent: 2.0, feeFixed: 0 },
};

// ---------------------------------------------------------------------------
// Seller account management
// ---------------------------------------------------------------------------

export async function createSellerAccount(
  userId: string,
  email: string,
  accountType: string
): Promise<CreateSellerAccountResult> {
  try {
    const account = await stripe.accounts.create({
      type: "express",
      email,
      metadata: { userId, accountType },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payments?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payments?onboarded=true`,
      type: "account_onboarding",
    });

    return {
      accountId: account.id,
      onboardingUrl: accountLink.url,
    };
  } catch (error) {
    const message =
      error instanceof Stripe.errors.StripeError
        ? error.message
        : "Failed to create seller account";
    throw new Error(message);
  }
}

// ---------------------------------------------------------------------------
// Retrieve seller account details
// ---------------------------------------------------------------------------

export async function getSellerAccount(
  stripeAccountId: string
): Promise<SellerAccountDetails> {
  try {
    const [account, balance] = await Promise.all([
      stripe.accounts.retrieve(stripeAccountId),
      stripe.balance.retrieve({ stripeAccount: stripeAccountId }),
    ]);

    return {
      accountId: account.id,
      email: account.email ?? null,
      chargesEnabled: account.charges_enabled ?? false,
      payoutsEnabled: account.payouts_enabled ?? false,
      detailsSubmitted: account.details_submitted ?? false,
      balance: {
        available: balance.available,
        pending: balance.pending,
      },
    };
  } catch (error) {
    const message =
      error instanceof Stripe.errors.StripeError
        ? error.message
        : "Failed to retrieve seller account";
    throw new Error(message);
  }
}

// ---------------------------------------------------------------------------
// Payment intent creation (with platform fee + Connect transfer)
// ---------------------------------------------------------------------------

export async function createPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<CreatePaymentIntentResult> {
  const {
    amount,
    currency,
    sellerId,
    buyerId,
    platformFeePercent,
    description,
    metadata = {},
  } = params;

  try {
    const applicationFeeAmount = Math.round(
      (amount * platformFeePercent) / 100
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      application_fee_amount: applicationFeeAmount,
      transfer_data: {
        destination: sellerId,
      },
      capture_method: "manual",
      description,
      metadata: {
        ...metadata,
        buyerId,
        sellerId,
        platformFeePercent: String(platformFeePercent),
      },
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    const message =
      error instanceof Stripe.errors.StripeError
        ? error.message
        : "Failed to create payment intent";
    throw new Error(message);
  }
}

// ---------------------------------------------------------------------------
// Escrow release (capture a held payment intent)
// ---------------------------------------------------------------------------

export async function releaseEscrow(
  paymentIntentId: string
): Promise<ReleaseEscrowResult> {
  try {
    const captured = await stripe.paymentIntents.capture(paymentIntentId);

    return {
      paymentIntentId: captured.id,
      status: captured.status,
    };
  } catch (error) {
    const message =
      error instanceof Stripe.errors.StripeError
        ? error.message
        : "Failed to release escrow";
    throw new Error(message);
  }
}

// ---------------------------------------------------------------------------
// Refunds (full or partial)
// ---------------------------------------------------------------------------

export async function createRefund(
  paymentIntentId: string,
  amount?: number
): Promise<RefundResult> {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      ...(amount !== undefined && { amount }),
    });

    return {
      refundId: refund.id,
      status: refund.status ?? "unknown",
      amount: refund.amount,
    };
  } catch (error) {
    const message =
      error instanceof Stripe.errors.StripeError
        ? error.message
        : "Failed to create refund";
    throw new Error(message);
  }
}

// ---------------------------------------------------------------------------
// Fee calculation
// ---------------------------------------------------------------------------

export function calculateFee(
  type: string,
  amount: number
): FeeCalculation {
  const schedule = FEE_SCHEDULE[type];

  if (!schedule) {
    throw new Error(`Unknown transaction type: ${type}`);
  }

  const { feePercent, feeFixed } = schedule;
  const platformFee = Math.round((amount * feePercent) / 100) + feeFixed;
  const sellerAmount = amount - platformFee;

  return {
    platformFee,
    sellerAmount,
    feePercent,
  };
}
