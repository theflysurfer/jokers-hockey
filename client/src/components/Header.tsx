import { Menu } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export default function Header() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Accueil", path: "/" },
    { name: "Le Club", path: "/club" },
    { name: "Équipes", path: "/equipes" },
    { name: "Actualités", path: "/actualites" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl lg:text-2xl">J</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base lg:text-lg leading-tight">Les Jokers</span>
                <span className="text-xs lg:text-sm text-muted-foreground leading-tight">Aubagne</span>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} data-testid={`link-${item.name.toLowerCase()}`}>
                <Button
                  variant={location === item.path ? "secondary" : "ghost"}
                  className="hover-elevate active-elevate-2"
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button variant="default" data-testid="button-join">
              Nous Rejoindre
            </Button>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={location === item.path ? "secondary" : "ghost"}
                      className="w-full justify-start hover-elevate active-elevate-2"
                      onClick={() => setOpen(false)}
                      data-testid={`mobile-link-${item.name.toLowerCase()}`}
                    >
                      {item.name}
                    </Button>
                  </Link>
                ))}
                <Button variant="default" className="mt-4" data-testid="mobile-button-join">
                  Nous Rejoindre
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
