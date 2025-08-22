// Default categories for new users
export const DEFAULT_CATEGORIES = [
  // Income categories
  { name: "Salário", type: "income" as const, color: "#10b981", icon: "💰" },
  { name: "Freelance", type: "income" as const, color: "#3b82f6", icon: "💻" },
  {
    name: "Investimentos",
    type: "income" as const,
    color: "#8b5cf6",
    icon: "📈",
  },
  {
    name: "Outros Rendimentos",
    type: "income" as const,
    color: "#06b6d4",
    icon: "💸",
  },

  // Expense categories
  {
    name: "Alimentação",
    type: "expense" as const,
    color: "#f59e0b",
    icon: "🍽️",
  },
  {
    name: "Transporte",
    type: "expense" as const,
    color: "#ef4444",
    icon: "🚗",
  },
  { name: "Moradia", type: "expense" as const, color: "#84cc16", icon: "🏠" },
  { name: "Saúde", type: "expense" as const, color: "#ec4899", icon: "🏥" },
  { name: "Educação", type: "expense" as const, color: "#6366f1", icon: "📚" },
  {
    name: "Entretenimento",
    type: "expense" as const,
    color: "#f97316",
    icon: "🎬",
  },
  { name: "Roupas", type: "expense" as const, color: "#a855f7", icon: "👔" },
  {
    name: "Tecnologia",
    type: "expense" as const,
    color: "#0ea5e9",
    icon: "💻",
  },
  {
    name: "Outros Gastos",
    type: "expense" as const,
    color: "#64748b",
    icon: "💳",
  },

  // Both (can be used for income or expense)
  {
    name: "Transferências",
    type: "both" as const,
    color: "#6b7280",
    icon: "🔄",
  },
] as const;
