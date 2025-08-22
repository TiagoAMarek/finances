# TransactionFilters module

This folder contains a split version of the Transaction Filters UI:
- TransactionFilters.tsx — container: state, data hooks, collapsible logic.
- ActiveFiltersBadges.tsx — presentational badges with remove actions.
- AdvancedFiltersForm.tsx — category, account, credit card, and date inputs.
- types.ts — shared types.
- index.tsx — barrel exports.

Behavioral notes:
- Uses shadcn/ui Collapsible for accessible show/hide.
- "Limpar" keeps the panel open.
- Auto-expands when any advanced filter (category/account/creditCard/date*) is set.

Testing: see tests/unit/components/transactions/transaction-filters.test.tsx.
