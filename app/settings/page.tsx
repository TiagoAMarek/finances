"use client";

import { Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

import {
  ProfileForm,
  ChangePasswordForm,
  useGetUserProfile,
  useUpdateProfile,
  useChangePassword,
} from "@/features/settings";
import { PageHeader } from "@/features/shared/components";
import { Alert, AlertDescription, Skeleton } from "@/features/shared/components/ui";

export default function SettingsPage() {
  const { data: profile, isLoading, error } = useGetUserProfile();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const handleProfileUpdate = async (data: { name: string; email: string }) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar perfil. Tente novamente.",
      );
    }
  };

  const handlePasswordChange = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      await changePassword.mutateAsync(data);
      toast.success("Senha alterada com sucesso!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao alterar senha. Tente novamente.",
      );
    }
  };

  if (isLoading) {
    return (
      <>
        <PageHeader
          description="Gerencie suas preferências e informações pessoais"
          icon={SettingsIcon}
          iconColor="text-gray-500"
          title="Configurações"
        />
        <div className="space-y-6 px-4 lg:px-6 pb-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader
          description="Gerencie suas preferências e informações pessoais"
          icon={SettingsIcon}
          iconColor="text-gray-500"
          title="Configurações"
        />
        <div className="space-y-6 px-4 lg:px-6 pb-8">
          <Alert variant="destructive">
            <AlertDescription>
              Erro ao carregar configurações. Tente novamente mais tarde.
            </AlertDescription>
          </Alert>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        description="Gerencie suas preferências e informações pessoais"
        icon={SettingsIcon}
        iconColor="text-gray-500"
        title="Configurações"
      />
      <div className="space-y-6 px-4 lg:px-6 pb-8 max-w-3xl">
        <ProfileForm
          defaultValues={profile}
          isLoading={updateProfile.isPending}
          onSubmit={handleProfileUpdate}
        />

        <ChangePasswordForm
          isLoading={changePassword.isPending}
          onSubmit={handlePasswordChange}
        />
      </div>
    </>
  );
}
