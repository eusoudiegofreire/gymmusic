import { createServerClient, createAdminClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/layout/dashboard-header";

export const metadata = {
  title: "Painel — Gym Music IA",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let razaoSocial = "Minha Academia";
  if (user) {
    const admin = createAdminClient();
    const { data } = await admin
      .from("clientes_academias")
      .select("razao_social")
      .eq("user_id", user.id)
      .single();
    if (data?.razao_social) razaoSocial = data.razao_social as string;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#0A0A0A]">
      <DashboardHeader razaoSocial={razaoSocial} />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
