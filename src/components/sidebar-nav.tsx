
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartPulse, LayoutDashboard, Sprout, BarChart3, ScrollText, Sun, User } from 'lucide-react';

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { useLanguage } from '@/lib/i18n';

export function SidebarNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const menuItems = [
    {
      href: '/dashboard',
      label: t('dashboard'),
      icon: LayoutDashboard,
    },
    {
      href: '/crop-suggestions',
      label: t('cropSuggestions'),
      icon: Sprout,
    },
    {
      href: '/agronomic-tips',
      label: t('plantDiagnosis'),
      icon: HeartPulse,
    },
    {
        href: '/weather',
        label: t('weather'),
        icon: Sun,
    },
    {
      href: '/data-visualization',
      label: t('dataVisualization'),
      icon: BarChart3,
    },
    {
      href: '/schemes',
      label: t('governmentSchemes'),
      icon: ScrollText,
    },
  ];

  return (
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/profile')} tooltip={t('profile')}>
                    <Link href="/profile">
                        <User />
                        <span>{t('profile')}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
