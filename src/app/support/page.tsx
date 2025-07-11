
"use client";

import { useLanguage } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SupportPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">{t('support')}</h1>
        <p className="text-muted-foreground">{t('supportDescription')}</p>
      </div>
      <Card className="shadow-lg border-white/40">
        <CardHeader>
            <CardTitle className="font-headline">{t('contactSupport')}</CardTitle>
            <CardDescription>{t('contactSupportDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
            <form className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input id="email" type="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="subject">{t('subject')}</Label>
                    <Input id="subject" placeholder={t('subjectPlaceholder')} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="message">{t('message')}</Label>
                    <Textarea id="message" rows={6} placeholder={t('messagePlaceholder')} />
                </div>
                <Button type="submit" className="w-full sm:w-auto">{t('sendMessage')}</Button>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
