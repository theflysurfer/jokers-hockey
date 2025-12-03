import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Trophy, Clock } from "lucide-react";
import { type Match } from "@shared/schema";
import { useAllMatches } from "@/hooks/use-matches";

export default function CalendarView() {
  const { data: matches, isLoading } = useAllMatches();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");

  const filteredMatches = useMemo(() => {
    if (!matches) return [];

    return matches.filter((match) => {
      const matchDate = new Date(match.date);
      const matchMonth = matchDate.getMonth();
      const matchYear = matchDate.getFullYear();

      const monthYearMatch = matchMonth === selectedMonth && matchYear === selectedYear;

      if (filter === "all") return monthYearMatch;
      if (filter === "upcoming") return monthYearMatch && match.status === "upcoming";
      if (filter === "completed") return monthYearMatch && match.status === "completed";

      return false;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [matches, selectedMonth, selectedYear, filter]);

  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const changeMonth = (direction: number) => {
    let newMonth = selectedMonth + direction;
    let newYear = selectedYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const getMatchResult = (match: Match) => {
    if (match.scoreJokers === null || match.scoreOpponent === null) return null;
    if (match.scoreJokers > match.scoreOpponent) return "victory";
    if (match.scoreJokers < match.scoreOpponent) return "defeat";
    return "draw";
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Chargement du calendrier...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl flex items-center gap-2">
              <Calendar className="h-8 w-8" />
              Calendrier des Matchs
            </CardTitle>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => changeMonth(-1)}>
                ←
              </Button>
              <span className="font-semibold text-lg min-w-[200px] text-center">
                {months[selectedMonth]} {selectedYear}
              </span>
              <Button variant="outline" onClick={() => changeMonth(1)}>
                →
              </Button>
            </div>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="upcoming">À venir</TabsTrigger>
                <TabsTrigger value="completed">Terminés</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMatches.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Aucun match pour cette période
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMatches.map((match) => {
                const matchDate = new Date(match.date);
                const isHome = match.location === "home";
                const result = getMatchResult(match);

                return (
                  <div
                    key={match.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-primary/10 rounded-lg p-2 text-center min-w-[60px]">
                          <div className="text-xs text-muted-foreground">
                            {matchDate.toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase()}
                          </div>
                          <div className="text-2xl font-bold">
                            {matchDate.getDate()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {matchDate.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {matchDate.toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <Badge variant={isHome ? "default" : "secondary"} className="text-xs">
                              {isHome ? "Domicile" : "Extérieur"}
                            </Badge>
                          </div>
                          <div className="font-semibold text-lg">
                            Les Jokers vs {match.opponent}
                          </div>
                          {match.venue && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3" />
                              {match.venue}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {match.status === "completed" && (
                        <>
                          <div className="text-center">
                            <div className="text-2xl font-bold">
                              {match.scoreJokers} - {match.scoreOpponent}
                            </div>
                            {result === "victory" && (
                              <Badge className="bg-green-500 mt-1">
                                <Trophy className="h-3 w-3 mr-1" />
                                Victoire
                              </Badge>
                            )}
                            {result === "defeat" && (
                              <Badge variant="destructive" className="mt-1">
                                Défaite
                              </Badge>
                            )}
                            {result === "draw" && (
                              <Badge variant="secondary" className="mt-1">
                                Match Nul
                              </Badge>
                            )}
                          </div>
                        </>
                      )}
                      {match.status === "upcoming" && (
                        <Badge variant="outline">
                          À venir
                        </Badge>
                      )}
                      {match.status === "cancelled" && (
                        <Badge variant="destructive">
                          Annulé
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
