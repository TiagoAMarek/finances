import { useGetAccounts } from "@/features/accounts/hooks/data";
import { useGetCategories } from "@/features/categories/hooks/data";
import { useGetCreditCards } from "@/features/credit-cards/hooks/data";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui";
import {
  CalendarIcon,
  DollarSignIcon,
  Loader2Icon,
  PlusIcon,
  Receipt,
  TagIcon,
} from "lucide-react";
import { useState } from "react";

interface CreateTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    description: string;
    amount: string;
    type: "income" | "expense" | "transfer";
    date: string;
    categoryId: number;
    accountId?: number;
    creditCardId?: number;
  }) => void;
  isLoading: boolean;
}

export function CreateTransactionModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateTransactionModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [sourceType, setSourceType] = useState<"account" | "creditCard">(
    "account",
  );
  const [selectedAccount, setSelectedAccount] = useState<number | undefined>(
    undefined,
  );
  const [selectedCreditCard, setSelectedCreditCard] = useState<
    number | undefined
  >(undefined);

  const { data: accounts = [] } = useGetAccounts();
  const { data: creditCards = [] } = useGetCreditCards();
  const { data: categories = [] } = useGetCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    onSubmit({
      description,
      amount: amount.toString(),
      type,
      date,
      categoryId,
      accountId: sourceType === "account" ? selectedAccount : undefined,
      creditCardId:
        sourceType === "creditCard" ? selectedCreditCard : undefined,
    });
    resetForm();
  };

  const resetForm = () => {
    setDescription("");
    setAmount(0);
    setType("expense");
    setDate(new Date().toISOString().split("T")[0]);
    setCategoryId(undefined);
    setSourceType("account");
    setSelectedAccount(undefined);
    setSelectedCreditCard(undefined);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  // Filter categories based on transaction type
  const filteredCategories = categories.filter((category) => {
    if (category.type === "both") return true;
    return category.type === type;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-3 pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Receipt className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-xl">Novo Lançamento</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Registre uma receita, despesa ou transferência
            </DialogDescription>
          </div>
        </DialogHeader>

        <Card className="border-dashed">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Receipt className="h-4 w-4" />
                    Descrição
                  </Label>
                  <Input
                    type="text"
                    id="description"
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
                    htmlFor="amount"
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
                      id="amount"
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
                  <Label htmlFor="type" className="text-sm font-medium">
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
                    htmlFor="date"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    Data
                  </Label>
                  <Input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="category"
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
                      setSelectedAccount(undefined);
                      setSelectedCreditCard(undefined);
                    }}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="account" id="account-radio" />
                      <Label htmlFor="account-radio" className="cursor-pointer">
                        🏦 Conta Bancária
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="creditCard"
                        id="creditCard-radio"
                      />
                      <Label
                        htmlFor="creditCard-radio"
                        className="cursor-pointer"
                      >
                        💳 Cartão de Crédito
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {sourceType === "account" && (
                  <div className="space-y-2">
                    <Label htmlFor="account" className="text-sm font-medium">
                      Selecione a Conta Bancária *
                    </Label>
                    <Select
                      value={selectedAccount?.toString() || ""}
                      onValueChange={(value) =>
                        setSelectedAccount(value ? parseInt(value) : undefined)
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
                    <Label htmlFor="creditCard" className="text-sm font-medium">
                      Selecione o Cartão de Crédito *
                    </Label>
                    <Select
                      value={selectedCreditCard?.toString() || ""}
                      onValueChange={(value) =>
                        setSelectedCreditCard(
                          value ? parseInt(value) : undefined,
                        )
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
                      Criando...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4" />
                      Criar Lançamento
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
