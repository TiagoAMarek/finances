"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useRegister } from "@/features/auth/hooks/data";
import {
  Button,
  FormField,
  Input,
  PasswordInput,
  PasswordStrengthIndicator,
} from "@/features/shared/components/ui";
import { Alert, AlertDescription } from "@/features/shared/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import { RegisterSchema, type RegisterInput } from "@/lib/schemas";

const RegisterPage: NextPage = () => {
  const router = useRouter();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchedName = watch("name");
  const watchedEmail = watch("email");
  const watchedPassword = watch("password");
  const watchedConfirmPassword = watch("confirmPassword");

  const onSubmit = (data: RegisterInput) => {
    // Extract only the fields needed by the API
    const { name, email, password } = data;
    registerMutation.mutate(
      { name, email, password },
      {
        onSuccess: () => {
          router.push("/login");
        },
      },
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Criar sua conta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {registerMutation.error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {registerMutation.error.message}
                </AlertDescription>
              </Alert>
            )}

            <FormField
              error={errors.name?.message}
              isValid={touchedFields.name && !errors.name && !!watchedName}
              label="Nome completo"
              required
            >
              <Input
                autoComplete="name"
                placeholder="Digite seu nome completo"
                type="text"
                {...register("name")}
              />
            </FormField>

            <FormField
              error={errors.email?.message}
              isValid={touchedFields.email && !errors.email && !!watchedEmail}
              label="E-mail"
              required
            >
              <Input
                autoComplete="email"
                placeholder="seuemail@exemplo.com"
                type="email"
                {...register("email")}
              />
            </FormField>

            <FormField
              error={errors.password?.message}
              isValid={
                touchedFields.password && !errors.password && !!watchedPassword
              }
              label="Senha"
              required
            >
              <PasswordInput
                autoComplete="new-password"
                placeholder="Crie uma senha forte"
                {...register("password")}
              />
            </FormField>

            {watchedPassword && (
              <PasswordStrengthIndicator password={watchedPassword} />
            )}

            <FormField
              error={errors.confirmPassword?.message}
              isValid={
                touchedFields.confirmPassword &&
                !errors.confirmPassword &&
                !!watchedConfirmPassword
              }
              label="Confirmar senha"
              required
            >
              <PasswordInput
                autoComplete="new-password"
                placeholder="Digite a senha novamente"
                showVisibilityToggle={false}
                {...register("confirmPassword")}
              />
            </FormField>

            <Button
              className="w-full"
              disabled={registerMutation.isPending || !isValid}
              type="submit"
            >
              {registerMutation.isPending ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <a className="text-sm text-primary hover:underline" href="/login">
              Já tem uma conta? Entrar
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
