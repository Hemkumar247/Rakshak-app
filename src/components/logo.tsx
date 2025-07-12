import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';

export function Logo({ className }: { className?: string }) {
  const { t, isMounted } = useLanguage();
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="bg-primary rounded-full p-1.5">
        <Leaf className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="font-headline text-lg font-bold text-primary">
        {isMounted ? t('appName') : 'Rakshak'}
      </span>
    </div>
  );
}
