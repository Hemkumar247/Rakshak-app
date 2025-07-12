// src/components/dashboard/government-schemes-card.tsx
"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n';
import { ScrollText, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

const schemesData = [
    { name: 'PM Kisan Samman Nidhi', details: 'Financial support' },
    { name: 'Pradhan Mantri Fasal Bima Yojana', details: 'Crop insurance' },
];

export function GovernmentSchemesCard() {
  const { t } = useLanguage();

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <ScrollText className="text-accent" />
          {t('governmentSchemes')}
        </CardTitle>
        <CardDescription>{t('schemesDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <ul className="space-y-3">
            {schemesData.map(item => (
                <li key={item.name} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">{item.details}</span>
                </li>
            ))}
        </ul>
        <div className="flex-grow" />
        <Button asChild variant="ghost" className="mt-4 self-end text-sm text-primary hover:text-primary/90">
          <Link href="/schemes">
            {t('learnMore')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
