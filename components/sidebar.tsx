"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Grid3X3,
  Database,
  ClipboardCheck,
  Trophy,
  Medal,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Zap,
  LucideIcon,
} from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Play",
    items: [
      { label: "Lobby", href: "/dashboard", icon: LayoutDashboard },
      { label: "Quizzes", href: "/quizzes", icon: BookOpen },
      { label: "Create", href: "/quizzes/create", icon: PlusCircle },
      { label: "Categories", href: "/categories", icon: Grid3X3 },
      { label: "Bank", href: "/questions", icon: Database },
    ],
  },
  {
    label: "Compete",
    items: [
      { label: "Results", href: "/results", icon: ClipboardCheck },
      { label: "Board", href: "/leaderboard", icon: Trophy },
      { label: "Trophies", href: "/achievements", icon: Medal },
    ],
  },
  {
    label: "You",
    items: [
      { label: "Profile", href: "/profile", icon: User },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

const SIDEBAR_EXPANDED_WIDTH = 252;
const SIDEBAR_COLLAPSED_WIDTH = 72;

export function Sidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const sidebarMobileOpen = useUIStore((state) => state.sidebarMobileOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const setMobileSidebarOpen = useUIStore((state) => state.setMobileSidebarOpen);

  const isCollapsed = isMobile ? false : sidebarCollapsed;
  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  const closeMobile = () => setMobileSidebarOpen(false);

  return (
    <TooltipProvider delayDuration={0}>
      <AnimatePresence>
        {isMobile && sidebarMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/70 lg:hidden"
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? SIDEBAR_EXPANDED_WIDTH : sidebarWidth,
          x: isMobile && !sidebarMobileOpen ? -SIDEBAR_EXPANDED_WIDTH : 0,
        }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r-[3px] border-sidebar-border bg-sidebar-background"
      >
        <div className="flex h-16 items-center gap-2.5 border-b-[3px] border-sidebar-border px-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary font-display text-sm text-primary-foreground shadow-[3px_3px_0_0_var(--acid)]">
            Q
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="block font-display text-lg leading-none text-primary">
                QUEZ
              </span>
              <span className="mt-0.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em] text-acid">
                <Zap className="h-2.5 w-2.5" /> Neon
              </span>
            </div>
          )}
        </div>

        <ScrollArea className="flex-1 px-2.5 py-3">
          <nav className="flex flex-col gap-6">
            {navGroups.map((group) => (
              <div key={group.label} className="flex flex-col gap-1">
                {!isCollapsed && (
                  <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-acid/70">
                    {group.label}
                  </p>
                )}

                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/quizzes" &&
                      pathname.startsWith(item.href + "/")) ||
                    (item.href === "/quizzes" && pathname === "/quizzes");

                  const linkContent = (
                    <Link
                      href={item.href}
                      onClick={isMobile ? closeMobile : undefined}
                      className={cn(
                        "group relative flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold uppercase tracking-wide transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-[3px_3px_0_0_var(--acid),0_0_18px_color-mix(in_srgb,var(--primary)_40%,transparent)]"
                          : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-acid"
                      )}
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );

                  if (isCollapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                        <TooltipContent side="right" sideOffset={8}>
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return <div key={item.href}>{linkContent}</div>;
                })}
              </div>
            ))}
          </nav>
        </ScrollArea>

        {!isMobile && (
          <div className="border-t-[3px] border-sidebar-border p-2.5">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-11 w-11 text-sidebar-foreground/70 hover:text-acid",
                !isCollapsed && "ml-auto flex"
              )}
              onClick={toggleSidebar}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </motion.aside>
    </TooltipProvider>
  );
}
