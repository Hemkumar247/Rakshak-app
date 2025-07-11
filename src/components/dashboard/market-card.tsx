// src/components/dashboard/market-card.tsx
"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n';
import { DollarSign, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

const marketData = [
    { crop: 'Corn', change: 2.5, status: 'up' as const },
    { crop: 'Soybeans', change: -1.2, status: 'down' as const },
    { crop: 'Wheat', change: 0.8, status: 'up' as const },
    { crop: 'Cotton', change: -0.5, status: 'down' as const },
];


export function MarketCard() {
  const { t } = useLanguage();

  return (
    <Card className="shadow-lg border-white/40 hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <DollarSign className="text-accent" />
          {t('marketFactors')}
        </CardTitle>
        <CardDescription>Today's commodity price changes</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <ul className="space-y-3">
            {marketData.map(item => (
                <li key={item.crop} className="flex items-center justify-between">
                    <span className="font-medium">{item.crop}</span>
                    <div className={`flex items-center gap-1 font-semibold ${item.status === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {item.status === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        {item.change}%
                    </div>
                </li>
            ))}
        </ul>
        <div className="flex-grow" />
        <Button asChild variant="ghost" className="mt-4 self-end text-sm text-primary hover:text-primary/90">
          <Link href="/data-visualization">
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}