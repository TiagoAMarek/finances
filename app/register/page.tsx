"use client";

import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { FormField } from "@/components/ui/form-field";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RegisterSchema, type RegisterInput } from "@/lib/schemas";
import { useRegister } from "@/features/auth/hooks/data";

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {registerMutation.error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {registerMutation.error.message}
                </AlertDescription>
              </Alert>
            )}

            <FormField
              label="Nome completo"
              error={errors.name?.message}
              isValid={touchedFields.name && !errors.name && !!watchedName}
              required
            >
              <Input
                type="text"
                placeholder="Digite seu nome completo"
                autoComplete="name"
                {...register("name")}
              />
            </FormField>

            <FormField
              label="E-mail"
              error={errors.email?.message}
              isValid={touchedFields.email && !errors.email && !!watchedEmail}
              required
            >
              <Input
                type="email"
                placeholder="seuemail@exemplo.com"
                autoComplete="email"
                {...register("email")}
              />
            </FormField>

            <FormField
              label="Senha"
              error={errors.password?.message}
              isValid={
                touchedFields.password && !errors.password && !!watchedPassword
              }
              required
            >
              <PasswordInput
                placeholder="Crie uma senha forte"
                autoComplete="new-password"
                {...register("password")}
              />
            </FormField>

            {watchedPassword && (
              <PasswordStrengthIndicator password={watchedPassword} />
            )}

            <FormField
              label="Confirmar senha"
              error={errors.confirmPassword?.message}
              isValid={
                touchedFields.confirmPassword &&
                !errors.confirmPassword &&
                !!watchedConfirmPassword
              }
              required
            >
              <PasswordInput
                placeholder="Digite a senha novamente"
                autoComplete="new-password"
                showVisibilityToggle={false}
                {...register("confirmPassword")}
              />
            </FormField>

            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending || !isValid}
            >
              {registerMutation.isPending ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <a href="/login" className="text-sm text-primary hover:underline">
              Já tem uma conta? Entrar
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
