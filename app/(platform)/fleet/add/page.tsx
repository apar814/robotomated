import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/auth-server";
import { AddRobotForm } from "@/components/fleet/add-robot-form";

export const metadata: Metadata = {
  title: "Add Robot to Fleet | Robotomated",
  description: "Add a new robot to your fleet management dashboard.",
};

export default async function AddRobotPage() {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-white/40">
        <Link href="/fleet" className="hover:text-white/70 transition-colors">
          Fleet
        </Link>
        <span>/</span>
        <span className="text-white/60">Add Robot</span>
      </nav>

      <h1 className="mb-8 text-2xl font-bold text-white">Add Robot to Fleet</h1>

      <AddRobotForm />
    </div>
  );
}
