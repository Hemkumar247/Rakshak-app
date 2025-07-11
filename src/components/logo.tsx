import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';

export function Logo({ className }: { className?: string }) {
  const { t, isMounted } = useLanguage();
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Leaf className="h-6 w-6 text-primary" />
      <span className="font-headline text-lg font-bold text-primary-foreground-dark">
        {isMounted ? t('appName') : 'Rakshak'}
      </span>
    </div>
  );
}
