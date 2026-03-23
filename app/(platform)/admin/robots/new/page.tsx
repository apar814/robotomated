import { RobotForm } from "@/components/admin/robot-form";

export default function AdminNewRobotPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Add New Robot</h1>
      <RobotForm mode="create" />
    </div>
  );
}
