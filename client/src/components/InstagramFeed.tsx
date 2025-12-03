import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink } from "lucide-react";

interface InstagramFeedProps {
  instagramUsername?: string;
}

export default function InstagramFeed({ instagramUsername = "lesjokersdaubagne" }: InstagramFeedProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Instagram className="h-6 w-6" />
              Suivez-nous sur Instagram
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a
                href={`https://instagram.com/${instagramUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Instagram className="h-4 w-4" />
                @{instagramUsername}
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <Instagram className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              Intégration Instagram à venir. En attendant, suivez-nous directement sur Instagram pour voir nos dernières photos et vidéos !
            </p>
            <Button asChild>
              <a
                href={`https://instagram.com/${instagramUsername}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Voir sur Instagram
              </a>
            </Button>
          </div>
          <div className="mt-4 text-xs text-muted-foreground text-center">
            <p>
              Note: L'intégration complète du feed Instagram nécessite une configuration avec l'API Instagram.
              Pour l'instant, cliquez sur le bouton ci-dessus pour accéder à notre profil Instagram.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
