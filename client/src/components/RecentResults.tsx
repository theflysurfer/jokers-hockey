import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar } from "lucide-react";
import { Link } from "wouter";
import { type Match } from "@shared/schema";

interface RecentResultsProps {
  matches: Match[];
}

export default function RecentResults({ matches }: RecentResultsProps) {
  if (matches.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              Résultats Récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Aucun résultat récent disponible</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const getResult = (match: Match) => {
    if (match.scoreJokers === null || match.scoreOpponent === null) return null;
    if (match.scoreJokers > match.scoreOpponent) return "victory";
    if (match.scoreJokers < match.scoreOpponent) return "defeat";
    return "draw";
  };

  const getResultBadge = (result: string | null) => {
    if (result === "victory")
      return <Badge className="bg-green-500">Victoire</Badge>;
    if (result === "defeat")
      return <Badge variant="destructive">Défaite</Badge>;
    if (result === "draw")
      return <Badge variant="secondary">Match Nul</Badge>;
    return null;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              Résultats Récents
            </CardTitle>
            <Link href="/actualites">
              <Button variant="ghost" size="sm">
                Voir tout
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {matches.map((match) => {
              const result = getResult(match);
              const matchDate = new Date(match.date);
              const isHome = match.location === "home";

              return (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {matchDate.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {isHome ? "Domicile" : "Extérieur"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">Les Jokers</span>
                      <span className="text-2xl font-bold text-primary">
                        {match.scoreJokers}
                      </span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-2xl font-bold text-primary">
                        {match.scoreOpponent}
                      </span>
                      <span className="font-semibold">{match.opponent}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getResultBadge(result)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
