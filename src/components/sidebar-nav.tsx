"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrainCircuit, LayoutDashboard, Sprout, BarChart3 } from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
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
      label: t('agronomicTips'),
      icon: BrainCircuit,
    },
    {
      href: '/data-visualization',
      label: t('dataVisualization'),
      icon: BarChart3,
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
    </>
  );
}
