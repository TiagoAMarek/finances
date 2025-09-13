/** Modal size configuration */
export const MODAL_SIZE_CLASSES = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
} as const;

/** Loading text configuration */
export const LOADING_TEXT_MAP = {
  Criando: "Criando...",
  Salvando: "Salvando...",
  default: "Processando...",
} as const;

/** Default modal configuration */
export const DEFAULT_MODAL_CONFIG = {
  variant: "create" as const,
  size: "md" as const,
  cancelText: "Cancelar",
  iconColor: "text-primary",
  iconBgColor: "bg-primary/10",
} as const;

