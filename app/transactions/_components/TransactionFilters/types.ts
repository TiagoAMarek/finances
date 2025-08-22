import {
  CalendarIcon,
  CreditCardIcon,
  BanknoteIcon,
  TagIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";

export interface TransactionFilters {
  search: string;
  type: "all" | "income" | "expense" | "transfer";
  category: string;
  accountId: string;
  creditCardId: string;
  dateFrom: string;
  dateTo: string;
}

export interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  categories: string[];
}

export type BadgeMeta =
  | {
      key: "type";
      label: string;
      icon: typeof TrendingUpIcon | typeof TrendingDownIcon;
      color: string;
    }
  | {
      key: "category" | "accountId" | "creditCardId";
      label: string;
      icon: typeof TagIcon | typeof BanknoteIcon | typeof CreditCardIcon;
      color: string;
    }
  | {
      key: "date";
      label: string;
      icon: typeof CalendarIcon;
      color: string;
    };
