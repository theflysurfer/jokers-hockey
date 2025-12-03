import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";
import { type Match } from "@shared/schema";

interface NextMatchWidgetProps {
  match?: Match;
}

export default function NextMatchWidget({ match }: NextMatchWidgetProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    if (!match) return;

    const calculateTimeLeft = () => {
      const difference = new Date(match.date).getTime() - new Date().getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return null;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [match]);

  if (!match) {
    return (
      <Card className="w-full bg-gradient-to-br from-primary/10 to-background">
        <CardHeader>
          <CardTitle className="text-2xl">Prochain Match</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Aucun match à venir pour le moment</p>
        </CardContent>
      </Card>
    );
  }

  const matchDate = new Date(match.date);
  const isHome = match.location === "home";

  return (
    <Card className="w-full bg-gradient-to-br from-primary/10 to-background border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Prochain Match</CardTitle>
          <Badge variant={isHome ? "default" : "secondary"}>
            {isHome ? "Domicile" : "Extérieur"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-4">
          <h3 className="text-3xl font-bold mb-2">
            Les Jokers vs {match.opponent}
          </h3>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{matchDate.toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground mt-1">
            <Clock className="h-4 w-4" />
            <span>{matchDate.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
          {match.venue && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span>{match.venue}</span>
            </div>
          )}
        </div>

        {timeLeft && (
          <div className="bg-background/50 rounded-lg p-4">
            <p className="text-center text-sm text-muted-foreground mb-2">
              Compte à rebours
            </p>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{timeLeft.days}</div>
                <div className="text-xs text-muted-foreground">Jours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{timeLeft.hours}</div>
                <div className="text-xs text-muted-foreground">Heures</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{timeLeft.minutes}</div>
                <div className="text-xs text-muted-foreground">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{timeLeft.seconds}</div>
                <div className="text-xs text-muted-foreground">Secondes</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button className="flex-1" size="lg">
            Voir les détails
          </Button>
          {isHome && (
            <Button variant="outline" size="lg">
              Billets
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
