"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n';
import { DollarSign, ArrowUp, ArrowDown } from 'lucide-react';

const marketData = [
    { crop: 'Corn', change: 2.5, status: 'up' as const },
    { crop: 'Soybeans', change: -1.2, status: 'down' as const },
    { crop: 'Wheat', change: 0.8, status: 'up' as const },
    { crop: 'Cotton', change: -0.5, status: 'down' as const },
];


export function MarketCard() {
  const { t } = useLanguage();

  return (
    <Card className="shadow-lg border-white/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <DollarSign className="text-accent" />
          {t('marketFactors')}
        </CardTitle>
        <CardDescription>Today's commodity price changes</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
