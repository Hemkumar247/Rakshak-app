// src/app/community/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Globe } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Community Wall", href: "/community", icon: Globe },
    { name: "Direct Messages", href: "/community/dm", icon: Users },
  ];

  return (
    <div className="grid md:grid-cols-[250px_1fr] gap-8 h-[calc(100vh-120px)]">
      <aside className="hidden md:flex flex-col gap-4">
        <h2 className="text-xl font-bold font-headline">Community Hub</h2>
        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href) && (link.href !== '/community/dm' || pathname === '/community/dm');

            return (
              <Button
                key={link.name}
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className="justify-start"
              >
                <Link href={link.href}>
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.name}
                </Link>
              </Button>
            )
          })}
        </nav>
      </aside>
      <main className="flex flex-col h-full">{children}</main>
    </div>
  );
}
