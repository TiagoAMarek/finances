import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { FormModalField, FormModalFormWithHook } from "@/features/shared/components";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Button,
} from "@/features/shared/components/ui";
import { ChangePasswordSchema } from "@/lib/schemas/users";

type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordFormData) => void;
  isLoading?: boolean;
}

export function ChangePasswordForm({
  onSubmit,
  isLoading,
}: ChangePasswordFormProps) {
  const resolver = useMemo(() => zodResolver(ChangePasswordSchema), []);

  const form = useForm<ChangePasswordFormData>({
    resolver,
    mode: "onTouched",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (data: ChangePasswordFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary" />
          <CardTitle>Alterar Senha</CardTitle>
        </div>
        <CardDescription>
          Altere sua senha de acesso à plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormModalFormWithHook form={form} onSubmit={handleSubmit}>
          <FormModalField
            form={form}
            label="Senha Atual"
            name="currentPassword"
            required
          >
            <Input
              disabled={isLoading}
              placeholder="Digite sua senha atual"
              type="password"
              {...form.register("currentPassword")}
            />
          </FormModalField>

          <FormModalField
            form={form}
            label="Nova Senha"
            name="newPassword"
            required
          >
            <Input
              disabled={isLoading}
              placeholder="Digite sua nova senha"
              type="password"
              {...form.register("newPassword")}
            />
          </FormModalField>

          <FormModalField
            form={form}
            label="Confirmar Nova Senha"
            name="confirmPassword"
            required
          >
            <Input
              disabled={isLoading}
              placeholder="Confirme sua nova senha"
              type="password"
              {...form.register("confirmPassword")}
            />
          </FormModalField>

          <div className="flex justify-end">
            <Button disabled={isLoading} type="submit">
              {isLoading ? "Alterando..." : "Alterar Senha"}
            </Button>
          </div>
        </FormModalFormWithHook>
      </CardContent>
    </Card>
  );
}
