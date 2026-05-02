import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata = {
  title: "Admin — Gym Music IA",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#0A0A0A] lg:flex-row">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
