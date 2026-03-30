import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Upload, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Analyze", icon: Upload },
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background dark">
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="font-semibold text-foreground tracking-tight text-lg">Smart Log</span>
                <span className="text-primary font-semibold text-lg ml-1">Analyzer</span>
              </div>
            </Link>

            <div className="flex items-center gap-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    location.pathname === path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}