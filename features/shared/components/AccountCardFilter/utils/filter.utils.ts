export function getFilterAriaLabel(
  type: 'account' | 'creditCard',
  name: string,
  isSelected: boolean
): string {
  const action = isSelected ? 'Desmarcar' : 'Marcar';
  const itemType = type === 'account' ? 'conta' : 'cartão';
  return `${action} ${itemType} ${name}`;
}

export function getToggleAllAriaLabel(type: 'accounts' | 'creditCards'): string {
  const itemType = type === 'accounts' ? 'contas bancárias' : 'cartões de crédito';
  return `Alternar todas as ${itemType}`;
}

export function getTriggerAriaLabel(
  activeCount: number,
  totalCount: number
): string {
  return `Filtros - ${activeCount} de ${totalCount} selecionados`;
}