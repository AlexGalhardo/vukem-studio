import { Link, usePage } from "@inertiajs/react";
import { Clapperboard, LayoutDashboard, LogOut, Video } from "lucide-react";
import type { ReactNode } from "react";

import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { SharedProps } from "@/types";

const navigation = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Videos", icon: Clapperboard },
] as const;

export default function AppLayout({ children }: { children: ReactNode }) {
  const page = usePage<SharedProps>();
  const user = page.props.auth?.user;
  const path = page.url.split("?")[0];
  const message = page.flash?.success ?? page.flash?.status;
  const notice =
    typeof message === "string" ? (
      <p role="status" className="mb-4 rounded-lg border bg-muted px-4 py-3 text-sm">
        {message}
      </p>
    ) : null;

  if (!user) {
    return (
      <TooltipProvider>
        <ThemeToggle className="fixed top-4 right-4 z-10" />
        {children}
      </TooltipProvider>
    );
  }

  const current = navigation.find((n) => (n.href === "/" ? path === "/" || path === "/dashboard" : path.startsWith(n.href)));

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="p-4">
            <Link href="/" className="flex items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
              <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Video aria-hidden="true" className="size-5" />
              </span>
              <span className="text-lg font-semibold tracking-tight">{page.props.appName}</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <nav aria-label="Dashboard">
                <SidebarMenu>
                  {navigation.map(({ href, label, icon: Icon }) => (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton asChild isActive={current?.href === href} tooltip={label}>
                        <Link href={href}>
                          <Icon aria-hidden="true" />
                          <span>{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </nav>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <div className="flex items-center gap-3 border-t pt-4">
              <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                {user.name?.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button asChild variant="ghost" className="justify-start">
              <Link href="/logout" method="post" as="button">
                <LogOut aria-hidden="true" />
                Log out
              </Link>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b px-4 md:px-6">
            <SidebarTrigger />
            <span aria-hidden="true" className="text-muted-foreground">/</span>
            <span className="text-sm">{current?.label ?? page.props.appName}</span>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">
            {notice}
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
