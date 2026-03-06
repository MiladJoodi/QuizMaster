"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  Grid3X3,
  Database,
  ClipboardCheck,
  Trophy,
  Medal,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Github,
  Linkedin,
  LucideIcon,
} from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
    label: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Browse Quizzes", href: "/quizzes", icon: BookOpen },
      { label: "My Quizzes", href: "/my-quizzes", icon: FileQuestion },
    ],
  },
  {
    label: "Learn",
    items: [
      { label: "Categories", href: "/categories", icon: Grid3X3 },
      { label: "Question Bank", href: "/question-bank", icon: Database },
    ],
  },
  {
    label: "Progress",
    items: [
      { label: "Results", href: "/results", icon: ClipboardCheck },
      { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
      { label: "Achievements", href: "/achievements", icon: Medal },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: User },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

const SIDEBAR_EXPANDED_WIDTH = 264;
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
      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {isMobile && sidebarMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" as const }}
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? SIDEBAR_EXPANDED_WIDTH : sidebarWidth,
          x: isMobile && !sidebarMobileOpen ? -SIDEBAR_EXPANDED_WIDTH : 0,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-card",
          isMobile && "shadow-2xl"
        )}
      >
        {/* Logo area */}
        <div className="flex h-16 items-center gap-3 px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" as const }}
                className="overflow-hidden text-xl font-bold tracking-tight"
              >
                Quez
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <Separator />

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-6">
            {navGroups.map((group) => (
              <div key={group.label} className="flex flex-col gap-1">
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15, ease: "easeInOut" as const }}
                      className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {group.label}
                    </motion.p>
                  )}
                </AnimatePresence>

                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");

                  const linkContent = (
                    <Link
                      href={item.href}
                      onClick={isMobile ? closeMobile : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0",
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <AnimatePresence mode="wait">
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" as const }}
                            className="overflow-hidden whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active-indicator"
                          className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                          transition={{ duration: 0.2, ease: "easeInOut" as const }}
                        />
                      )}
                    </Link>
                  );

                  if (isCollapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>
                          {linkContent}
                        </TooltipTrigger>
                        <TooltipContent side="right" sideOffset={8}>
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return (
                    <div key={item.href}>
                      {linkContent}
                    </div>
                  );
                })}
              </div>
            ))}
          </nav>
        </ScrollArea>

        <Separator />

        {/* Bottom area */}
        <div className="flex flex-col gap-2 p-3">
          {/* Social links */}
          <div className={cn("flex items-center", isCollapsed ? "flex-col gap-2" : "gap-1")}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  asChild
                >
                  <a
                    href="https://github.com/MiladJoodi/QuizMaster"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side={isCollapsed ? "right" : "top"}>
                GitHub
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  asChild
                >
                  <a
                    href="https://www.linkedin.com/in/joodi/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side={isCollapsed ? "right" : "top"}>
                LinkedIn
              </TooltipContent>
            </Tooltip>

            {!isMobile && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-9 w-9 shrink-0", !isCollapsed && "ml-auto")}
                    onClick={toggleSidebar}
                  >
                    {isCollapsed ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={isCollapsed ? "right" : "top"}>
                  {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
