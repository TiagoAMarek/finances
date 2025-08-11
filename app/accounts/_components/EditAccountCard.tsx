import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditIcon } from "lucide-react";
import { BankAccount } from "@/lib/schemas";

interface EditAccountCardProps {
  account: BankAccount;
  onSave: (account: BankAccount) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function EditAccountCard({
  account,
  onSave,
  onCancel,
  isLoading,
}: EditAccountCardProps) {
  const [name, setName] = useState(account.name);
  const [balance, setBalance] = useState(parseFloat(account.balance));

  useEffect(() => {
    setName(account.name);
    setBalance(parseFloat(account.balance));
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...account,
      name,
      balance: balance.toString(),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <EditIcon className="h-5 w-5" />
          Editar Conta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="editedName">Nome da Conta</Label>
            <Input
              type="text"
              id="editedName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editedBalance">Saldo (R$)</Label>
            <Input
              type="number"
              id="editedBalance"
              value={balance}
              onChange={(e) => setBalance(parseFloat(e.target.value))}
              step="0.01"
              required
            />
          </div>
          <div className="flex space-x-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}