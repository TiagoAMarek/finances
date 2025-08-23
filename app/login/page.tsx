"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Check } from "lucide-react";
import { LoginSchema, type LoginInput } from "@/lib/schemas";
import { useLogin } from "@/features/auth/hooks/data";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const loginMutation = useLogin();
  const [loadingState, setLoadingState] = useState<
    "idle" | "authenticating" | "success" | "redirecting"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    setLoadingState("authenticating");

    loginMutation.mutate(data, {
      onSuccess: (response) => {
        setLoadingState("success");
        localStorage.setItem("access_token", response.access_token);

        // Show success state briefly before redirecting
        setTimeout(() => {
          setLoadingState("redirecting");
          router.push("/dashboard");
        }, 800);
      },
      onError: () => {
        setLoadingState("idle");
      },
    });
  };

  const getButtonContent = () => {
    switch (loadingState) {
      case "authenticating":
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verificando credenciais...
          </>
        );
      case "success":
        return (
          <>
            <Check className="h-4 w-4" />
            Login realizado!
          </>
        );
      case "redirecting":
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecionando...
          </>
        );
      default:
        return "Entrar";
    }
  };

  const isLoading = loadingState !== "idle";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background py-8">
      <Card
        className={`w-full max-w-md transition-all duration-300 ${
          isLoading ? "ring-2 ring-primary/20" : ""
        }`}
      >
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Entrar na sua conta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {loginMutation.error && loadingState === "idle" && (
              <Alert
                variant="destructive"
                className="animate-in fade-in-50 slide-in-from-top-1"
              >
                <AlertDescription>
                  {loginMutation.error.message}
                </AlertDescription>
              </Alert>
            )}

            <div
              className={`space-y-2 transition-all duration-300 ${
                isLoading ? "opacity-60" : "opacity-100"
              }`}
            >
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                autoComplete="email"
                autoFocus
                disabled={isLoading}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive animate-in fade-in-50 slide-in-from-left-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div
              className={`space-y-2 transition-all duration-300 ${
                isLoading ? "opacity-60" : "opacity-100"
              }`}
            >
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                autoComplete="current-password"
                disabled={isLoading}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive animate-in fade-in-50 slide-in-from-left-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className={`w-full transition-all duration-300 ${
                loadingState === "success"
                  ? "bg-green-600 hover:bg-green-600"
                  : ""
              }`}
              disabled={isLoading}
            >
              <span className="flex items-center justify-center gap-2 transition-all duration-200">
                {getButtonContent()}
              </span>
            </Button>
          </form>
          <div className="mt-4 flex items-center justify-between text-sm">
            <a href="#" className="text-primary hover:underline">
              Esqueceu a senha?
            </a>
            <a href="/register" className="text-primary hover:underline">
              Criar uma conta
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
