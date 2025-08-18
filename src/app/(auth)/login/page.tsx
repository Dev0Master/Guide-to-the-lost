"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth/authStore";
import { useLanguageStore } from "@/store/language/languageStore";
import { loginTranslations, getFeatureTranslations } from "@/localization";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import { useApiData } from "@/hooks/useApi";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      role: 'lost_person' | 'searcher' | 'main_center_staff';
      phone?: string;
      created_at: string;
      updated_at: string;
    };
    accessToken: string;
  };
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  
  
  const { setAuth } = useAuthStore();
  const { currentLanguage } = useLanguageStore();
  const { post, loading } = useApiData('/auth/login');
  const router = useRouter();
  const t = getFeatureTranslations(loginTranslations, currentLanguage);
  const dir = getDirectionalClasses(currentLanguage);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    await post({
      data: formData,
      onSuccess: (response) => {
        const loginResponse = response as LoginResponse;
        const { accessToken, user: apiUser } = loginResponse.data;
        // Map API user structure to Auth store User structure
        const user = {
          id: apiUser.id.toString(),
          displayName: apiUser.name,
          email: apiUser.email,
          role: apiUser.role,
          disabled: false
        };
        setAuth(user, accessToken);
        router.push('/');
      },
      onError: (error) => {
        console.error("Login error:", error);
        if (error.response?.status === 401) {
          setError(t.invalidCredentials);
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          setError(t.connectionError);
        } else {
          const message =
            error.response?.data && typeof error.response.data === "object" && "message" in error.response.data
              ? (error.response.data as { message?: string }).message
              : undefined;
          setError(message || t.connectionError);
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="absolute top-4 left-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {t.appTitle}
          </h1>
          <p className="text-gray-600">
            {t.loginTitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t.emailLabel}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t.emailPlaceholder}
              required
              className={dir.textAlign}
              dir={dir.direction}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t.passwordLabel}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={t.passwordPlaceholder}
              required
              className={dir.textAlign}
              dir={dir.direction}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading.post}
          >
            {loading.post ? t.loggingInButton : t.loginButton}
          </Button>
        </form>

      </Card>
    </div>
  );
}
