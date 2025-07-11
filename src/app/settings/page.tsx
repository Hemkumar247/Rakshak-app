
"use client";

import { useLanguage, LanguageProvider } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">{t('settings')}</h1>
        <p className="text-muted-foreground">{t('settingsDescription')}</p>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-lg border-white/40">
          <CardHeader>
            <CardTitle className="font-headline">{t('languageSettings')}</CardTitle>
            <CardDescription>{t('languageSettingsDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Label htmlFor="language" className="font-medium">{t('selectLanguage')}</Label>
            <LanguageSwitcher />
          </CardContent>
        </Card>

        <Card className="shadow-lg border-white/40">
          <CardHeader>
            <CardTitle className="font-headline">{t('notificationSettings')}</CardTitle>
            <CardDescription>{t('notificationSettingsDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="font-medium">{t('emailNotifications')}</Label>
                <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications" className="font-medium">{t('pushNotifications')}</Label>
                <Switch id="push-notifications" />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
                <div className="space-y-1">
                    <Label htmlFor="early-warning" className="font-medium flex items-center gap-2">
                        <AlertTriangle className="text-amber-500"/>
                        {t('earlyWarningSystem')}
                    </Label>
                    <p className="text-xs text-muted-foreground">{t('earlyWarningSystemDescription')}</p>
                </div>
                <Switch id="early-warning" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
