
"use client";

import { useLanguage } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">{t('profile')}</h1>
        <p className="text-muted-foreground">{t('profileDescription')}</p>
      </div>
      <Card className="shadow-lg border-white/40">
        <CardHeader>
            <CardTitle className="font-headline">{t('profileDetails')}</CardTitle>
            <CardDescription>{t('profileDetailsDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="avatar man" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold">John Doe</h2>
                    <p className="text-muted-foreground">j.doe@example.com</p>
                </div>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">{t('name')}</Label>
                    <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input id="email" type="email" defaultValue="j.doe@example.com" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="farmLocation">{t('farmLocation')}</Label>
                    <Input id="farmLocation" defaultValue="Nashik, Maharashtra, India" />
                </div>
                <div className="md:col-span-2 flex justify-end">
                    <Button>{t('saveChanges')}</Button>
                </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
