import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  EditIcon,
  Receipt,
  DollarSignIcon,
  Loader2Icon,
  SaveIcon,
  CalendarIcon,
  TagIcon,
} from "lucide-react";
import { Transaction } from "@/lib/schemas";
import { useGetAccounts } from "@/features/accounts/hooks/data";
import { useGetCreditCards } from "@/features/credit-cards/hooks/data";
import { useGetCategories } from "@/features/categories";

interface EditTransactionModalProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (transaction: Transaction) => void;
  isLoading: boolean;
}

export function EditTransactionModal({
  transaction,
  open,
  onOpenChange,
  onSave,
  isLoading,
}: EditTransactionModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [date, setDate] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [sourceType, setSourceType] = useState<"account" | "creditCard">(
    "account",
  );
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [selectedCreditCard, setSelectedCreditCard] = useState<number | null>(
    null,
  );

  const { data: accounts = [] } = useGetAccounts();
  const { data: creditCards = [] } = useGetCreditCards();
  const { data: categories = [] } = useGetCategories();

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setAmount(parseFloat(transaction.amount));
      setType(transaction.type as "income" | "expense");
      setDate(transaction.date);
      setCategoryId(transaction.categoryId || undefined);
      setSelectedAccount(transaction.accountId);
      setSelectedCreditCard(transaction.creditCardId);

      // Determinar o tipo de origem baseado na transação existente
      if (transaction.accountId) {
        setSourceType("account");
      } else if (transaction.creditCardId) {
        setSourceType("creditCard");
      } else {
        setSourceType("account"); // default
      }
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction) return;

    // Validação: deve ter uma conta OU um cartão, nunca ambos ou nenhum
    if (sourceType === "account" && !selectedAccount) {
      alert("Selecione uma conta bancária");
      return;
    }

    if (sourceType === "creditCard" && !selectedCreditCard) {
      alert("Selecione um cartão de crédito");
      return;
    }

    if (!categoryId) {
      alert("Selecione uma categoria");
      return;
    }

    onSave({
      ...transaction,
      description,
      amount: amount.toString(),
      type: type as "income" | "expense" | "transfer",
      date,
      categoryId,
      accountId: sourceType === "account" ? selectedAccount : null,
      creditCardId: sourceType === "creditCard" ? selectedCreditCard : null,
    });
  };

  const resetForm = () => {
    if (transaction) {
      setDescription(transaction.description);
      setAmount(parseFloat(transaction.amount));
      setType(transaction.type as "income" | "expense");
      setDate(transaction.date);
      setCategoryId(transaction.categoryId || undefined);
      setSelectedAccount(transaction.accountId);
      setSelectedCreditCard(transaction.creditCardId);

      // Resetar o tipo de origem também
      if (transaction.accountId) {
        setSourceType("account");
      } else if (transaction.creditCardId) {
        setSourceType("creditCard");
      } else {
        setSourceType("account");
      }
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (!transaction) return null;

  // Filter categories based on transaction type
  const filteredCategories = categories.filter((category) => {
    if (category.type === "both") return true;
    return category.type === type;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-3 pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
            <EditIcon className="h-6 w-6 text-orange-500" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-xl">Editar Lançamento</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Atualize os dados do lançamento
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Preview do lançamento atual */}
        <div className="bg-muted/30 rounded-lg p-4 border border-dashed mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                transaction.type === "income"
                  ? "bg-green-500/10"
                  : "bg-red-500/10"
              }`}
            >
              <Receipt
                className={`h-5 w-5 ${
                  transaction.type === "income"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">
                {transaction.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge
                  variant={
                    transaction.type === "income" ? "default" : "destructive"
                  }
                  className="text-xs"
                >
                  {transaction.type === "income" ? "Receita" : "Despesa"}
                </Badge>
                <span>•</span>
                <span>{formatCurrency(parseFloat(transaction.amount))}</span>
                <span>•</span>
                <span>{transaction.category}</span>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-dashed">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="editDescription"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Receipt className="h-4 w-4" />
                    Descrição
                  </Label>
                  <Input
                    type="text"
                    id="editDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Compra no supermercado"
                    className="h-11"
                    autoFocus
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="editAmount"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <DollarSignIcon className="h-4 w-4" />
                    Valor
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      R$
                    </span>
                    <Input
                      type="number"
                      id="editAmount"
                      value={amount || ""}
                      onChange={(e) =>
                        setAmount(parseFloat(e.target.value) || 0)
                      }
                      placeholder="0,00"
                      className="h-11 pl-10"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editType" className="text-sm font-medium">
                    Tipo
                  </Label>
                  <Select
                    value={type}
                    onValueChange={(value) =>
                      setType(value as "income" | "expense")
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">
                        <div className="flex items-center gap-2">
                          <span className="text-red-500">📤</span>
                          Despesa
                        </div>
                      </SelectItem>
                      <SelectItem value="income">
                        <div className="flex items-center gap-2">
                          <span className="text-green-500">📥</span>
                          Receita
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="editDate"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    Data
                  </Label>
                  <Input
                    type="date"
                    id="editDate"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="editCategory"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <TagIcon className="h-4 w-4" />
                  Categoria
                </Label>
                <Select
                  value={categoryId?.toString() || ""}
                  onValueChange={(value) =>
                    setCategoryId(value ? parseInt(value) : undefined)
                  }
                  required
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: category.color || "#64748b",
                            }}
                          />
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filteredCategories.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Nenhuma categoria disponível para este tipo de transação.
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Origem do Lançamento *
                  </Label>
                  <RadioGroup
                    value={sourceType}
                    onValueChange={(value: "account" | "creditCard") => {
                      setSourceType(value);
                      // Limpar seleções quando mudar o tipo
                      setSelectedAccount(null);
                      setSelectedCreditCard(null);
                    }}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="account" id="edit-account-radio" />
                      <Label
                        htmlFor="edit-account-radio"
                        className="cursor-pointer"
                      >
                        🏦 Conta Bancária
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="creditCard"
                        id="edit-creditCard-radio"
                      />
                      <Label
                        htmlFor="edit-creditCard-radio"
                        className="cursor-pointer"
                      >
                        💳 Cartão de Crédito
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {sourceType === "account" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="editAccount"
                      className="text-sm font-medium"
                    >
                      Selecione a Conta Bancária *
                    </Label>
                    <Select
                      value={selectedAccount?.toString() || ""}
                      onValueChange={(value) =>
                        setSelectedAccount(value ? parseInt(value) : null)
                      }
                      required
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Escolha uma conta bancária" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem
                            key={account.id}
                            value={account.id.toString()}
                          >
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {sourceType === "creditCard" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="editCreditCard"
                      className="text-sm font-medium"
                    >
                      Selecione o Cartão de Crédito *
                    </Label>
                    <Select
                      value={selectedCreditCard?.toString() || ""}
                      onValueChange={(value) =>
                        setSelectedCreditCard(value ? parseInt(value) : null)
                      }
                      required
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Escolha um cartão de crédito" />
                      </SelectTrigger>
                      <SelectContent>
                        {creditCards.map((card) => (
                          <SelectItem key={card.id} value={card.id.toString()}>
                            {card.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !description.trim() || !categoryId}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
