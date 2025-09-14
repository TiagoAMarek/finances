import { FilterState } from "@/features";
import { BankAccount, CreditCard } from "@/lib/schemas";

export interface FilterContentProps {
  accounts: BankAccount[];
  creditCards: CreditCard[];
  filters: FilterState;
  isMobile?: boolean;
  // Actions
  onToggleAccount: (id: number) => void;
  onToggleCreditCard: (id: number) => void;
  onToggleAllAccounts: () => void;
  onToggleAllCreditCards: () => void;
  // State
  allAccountsSelected: boolean;
  allCreditCardsSelected: boolean;
}

export interface FilterTriggerButtonProps {
  activeFiltersCount: number;
  totalFiltersCount: number;
  hasActiveFilters: boolean;
  isMobile?: boolean;
  className?: string;
}

export interface QuickActionsProps {
  onSelectAll: () => void;
  onClearAll: () => void;
}

export interface AccountSectionProps {
  accounts: BankAccount[];
  selectedAccountIds: number[];
  allAccountsSelected: boolean;
  isMobile?: boolean;
  onToggleAccount: (id: number) => void;
  onToggleAllAccounts: () => void;
}

export interface CreditCardSectionProps {
  creditCards: CreditCard[];
  selectedCreditCardIds: number[];
  allCreditCardsSelected: boolean;
  isMobile?: boolean;
  onToggleCreditCard: (id: number) => void;
  onToggleAllCreditCards: () => void;
}

export interface FilterContainerProps {
  children: React.ReactNode;
  triggerButton: React.ReactNode;
  isMobile: boolean;
  title: string;
  description: string;
}

export interface AccountCardFilterProps {
  accounts: BankAccount[];
  creditCards: CreditCard[];
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

export interface UseFilterActionsProps {
  accounts: BankAccount[];
  creditCards: CreditCard[];
  filters: FilterState;
  toggleAccount: (id: number) => void;
  toggleCreditCard: (id: number) => void;
}