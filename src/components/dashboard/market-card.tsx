// src/components/dashboard/market-card.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n';
import { DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import { getMarketCardData, MarketCardDataItem } from '@/app/dashboard/actions';
import { Skeleton } from '../ui/skeleton';

export function MarketCard() {
  const { t } = useLanguage();
  const [marketData, setMarketData] = useState<MarketCardDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMarketCardData();
        setMarketData(data);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred");
        }
        console.error("Failed to fetch market data for card:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      );
    }
    
    if (error) {
        return <p className="text-sm text-destructive">{t('errorDescription')}</p>
    }

    if (marketData.length === 0) {
        return <p className="text-sm text-muted-foreground">No recent market data available.</p>
    }

    return (
      <ul className="space-y-3">
        {marketData.map(item => (
          <li key={item.crop} className="flex items-center justify-between">
            <span className="font-medium">{item.crop}</span>
            <div className={`flex items-center gap-1 font-semibold ${item.status === 'up' ? 'text-green-600' : item.status === 'down' ? 'text-red-600' : 'text-muted-foreground'}`}>
              {item.status === 'up' && <ArrowUp size={16} />}
              {item.status === 'down' && <ArrowDown size={16} />}
              {item.change.toFixed(2)}%
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <DollarSign className="text-accent" />
          {t('marketFactors')}
        </CardTitle>
        <CardDescription>Today's price changes (Demo)</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        {renderContent()}
        <div className="flex-grow" />
      </CardContent>
    </Card>
  );
}
