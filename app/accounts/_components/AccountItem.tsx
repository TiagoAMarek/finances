import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditIcon, TrashIcon } from "lucide-react";
import { BankAccount } from "@/lib/schemas";

interface AccountItemProps {
  account: BankAccount;
  onEdit: (account: BankAccount) => void;
  onDelete: (accountId: number) => void;
  isDeleting: boolean;
}

export function AccountItem({
  account,
  onEdit,
  onDelete,
  isDeleting,
}: AccountItemProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete(account.id);
    setDeleteDialogOpen(false);
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-lg font-medium">{account.name}</p>
          <p className="text-sm text-muted-foreground">
            Saldo: R$ {parseFloat(account.balance).toFixed(2)}
          </p>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(account)}
            className="flex items-center gap-1"
          >
            <EditIcon className="h-3 w-3" />
            Editar
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-1"
              >
                <TrashIcon className="h-3 w-3" />
                Excluir
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar exclusão</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir a conta &quot;{account.name}&quot;? Esta
                  ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2"
                >
                  {isDeleting ? (
                    "Excluindo..."
                  ) : (
                    <>
                      <TrashIcon className="h-4 w-4" />
                      Excluir
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}