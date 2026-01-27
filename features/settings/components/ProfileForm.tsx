import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useEffect, useMemo } from "react";
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
import { UpdateProfileSchema } from "@/lib/schemas/users";

type UpdateProfileFormData = z.infer<typeof UpdateProfileSchema>;

interface ProfileFormProps {
  defaultValues?: UpdateProfileFormData;
  onSubmit: (data: UpdateProfileFormData) => void;
  isLoading?: boolean;
}

export function ProfileForm({
  defaultValues,
  onSubmit,
  isLoading,
}: ProfileFormProps) {
  const resolver = useMemo(() => zodResolver(UpdateProfileSchema), []);

  const form = useForm<UpdateProfileFormData>({
    resolver,
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  const isDirty = form.formState.isDirty;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <CardTitle>Informações do Perfil</CardTitle>
        </div>
        <CardDescription>
          Atualize suas informações pessoais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormModalFormWithHook form={form} onSubmit={onSubmit}>
          <FormModalField form={form} label="Nome" name="name" required>
            <Input
              disabled={isLoading}
              placeholder="Seu nome completo"
              {...form.register("name")}
            />
          </FormModalField>

          <FormModalField form={form} label="Email" name="email" required>
            <Input
              disabled={isLoading}
              placeholder="seu@email.com"
              type="email"
              {...form.register("email")}
            />
          </FormModalField>

          <div className="flex justify-end">
            <Button disabled={isLoading || !isDirty} type="submit">
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </FormModalFormWithHook>
      </CardContent>
    </Card>
  );
}
