import { Link } from "wouter";
import { Facebook, Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Footer() {
  const quickLinks = [
    { name: "Accueil", path: "/" },
    { name: "Le Club", path: "/club" },
    { name: "Équipes", path: "/equipes" },
    { name: "Actualités", path: "/actualites" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer className="bg-card border-t mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-2xl">J</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">Les Jokers</span>
                <span className="text-sm text-muted-foreground leading-tight">Aubagne</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Club de roller hockey passionné depuis 1997
            </p>
            <Badge variant="secondary" className="mb-4">
              Depuis 1997
            </Badge>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link href={link.path}>
                    <a className="text-muted-foreground hover:text-primary transition-colors" data-testid={`footer-link-${link.name.toLowerCase()}`}>
                      {link.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-3 text-muted-foreground">
              <p>13bis Avenue Fallen<br />13400 Aubagne</p>
              <a
                href="mailto:dirjokersrha@outlook.fr"
                className="flex items-center gap-2 hover:text-primary transition-colors"
                data-testid="footer-link-email"
              >
                <Mail className="h-4 w-4" />
                dirjokersrha@outlook.fr
              </a>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="hover-elevate active-elevate-2"
                  onClick={() => window.open('https://www.facebook.com/RollerHockeyAubagne', '_blank')}
                  data-testid="footer-button-facebook"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover-elevate active-elevate-2"
                  onClick={() => window.open('https://www.instagram.com/jokersaubagne', '_blank')}
                  data-testid="footer-button-instagram"
                >
                  <Instagram className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} Les Jokers d'Aubagne. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
