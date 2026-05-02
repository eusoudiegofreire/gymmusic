type SubscriptionStatus = "ativa" | "trial" | "inadimplente" | "cancelada";

const config: Record<SubscriptionStatus, { label: string; bg: string }> = {
  ativa:        { label: "Ativa",        bg: "#F97316" },
  trial:        { label: "Trial",        bg: "#EAB308" },
  inadimplente: { label: "Inadimplente", bg: "#EF4444" },
  cancelada:    { label: "Cancelada",    bg: "#666666" },
};

interface StatusBadgeProps {
  status: SubscriptionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, bg } = config[status];
  return (
    <span
      className="inline-flex items-center rounded px-2.5 py-0.5 text-xs font-semibold text-white"
      style={{ backgroundColor: bg }}
    >
      {label}
    </span>
  );
}
