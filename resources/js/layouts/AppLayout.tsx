import { Link, usePage } from "@inertiajs/react";
import { Clapperboard, LayoutDashboard, LogOut, Video } from "lucide-react";
import type { ReactNode } from "react";

import LocaleSwitcher from "@/components/LocaleSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
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
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useT } from "@/lib/i18n";
import type { SharedProps } from "@/types";

const navigation = [
  { href: "/", label: "ui.nav.dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "ui.nav.videos", icon: Clapperboard },
] as const;

export default function AppLayout({ children }: { children: ReactNode }) {
  const t = useT();
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
        <div className="fixed top-4 right-4 z-10 flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
        {children}
      </TooltipProvider>
    );
  }

  const current = navigation.find((n) => (n.href === "/" ? path === "/" || path === "/dashboard" : path.startsWith(n.href)));

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={page.props.sidebarOpen !== false}>
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="lg" tooltip={page.props.appName}>
                  <Link href="/">
                    <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                      <Video aria-hidden="true" className="size-4" />
                    </span>
                    <span className="text-lg font-semibold tracking-tight">{page.props.appName}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <nav aria-label={t("ui.nav.label")}>
                <SidebarMenu>
                  {navigation.map(({ href, label, icon: Icon }) => (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton asChild isActive={current?.href === href} tooltip={t(label)}>
                        <Link href={href}>
                          <Icon aria-hidden="true" />
                          <span>{t(label)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </nav>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center gap-3 overflow-hidden px-1 py-1.5 group-data-[collapsible=icon]:px-0">
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium"
                  >
                    {user.name?.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t("ui.nav.logout")}>
                  <Link href="/logout" method="post" as="button">
                    <LogOut aria-hidden="true" />
                    <span>{t("ui.nav.logout")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b px-4 md:px-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarTrigger aria-label={t("ui.nav.toggleSidebar")} />
              </TooltipTrigger>
              <TooltipContent>{t("ui.nav.toggleSidebar")} (Ctrl+B)</TooltipContent>
            </Tooltip>
            <span aria-hidden="true" className="text-muted-foreground">
              /
            </span>
            <span className="text-sm">{current ? t(current.label) : page.props.appName}</span>
            <div className="ml-auto flex items-center gap-2">
              <LocaleSwitcher />
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
