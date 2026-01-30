import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, MapPin, Clock } from "lucide-react";

export default function Equipes() {
  const teams = [
    {
      id: "1",
      category: "École de patinage",
      ageRange: "4-8 ans",
      level: "Initiation",
      players: "15 joueurs",
      coach: "Marie Petit",
      schedule: "Mercredi 14h-15h30, Samedi 10h-11h30",
      description: "Découverte du roller hockey dans une ambiance ludique et conviviale. Apprentissage des bases : patinage, maniement de la crosse et esprit d'équipe. Pour les plus jeunes débutants.",
    },
    {
      id: "2",
      category: "U7-U11",
      ageRange: "6-10 ans",
      level: "Départemental",
      players: "12 joueurs",
      coach: "Thomas Rousseau",
      schedule: "Mardi 17h-18h30, Jeudi 17h-18h30, Samedi 14h-16h",
      description: "Perfectionnement technique et tactique. Introduction aux compétitions départementales. Développement de l'autonomie et de la cohésion d'équipe.",
    },
    {
      id: "3",
      category: "U13",
      ageRange: "11-12 ans",
      level: "Régional",
      players: "10 joueurs",
      coach: "Thomas Rousseau",
      schedule: "Lundi 18h-19h30, Mercredi 18h-19h30, Samedi 16h-18h",
      description: "Engagement dans le championnat régional. Travail sur les stratégies de jeu et la condition physique. Formation de jeunes talents compétitifs.",
    },
    {
      id: "4",
      category: "U15",
      ageRange: "13-14 ans",
      level: "Régional",
      players: "10 joueurs",
      coach: "Lucas Moreau",
      schedule: "Lundi 18h-20h, Mercredi 18h-20h, Samedi 14h-16h",
      description: "Perfectionnement des stratégies de jeu et renforcement de la condition physique. Compétition régionale avec objectif de progression constante.",
    },
    {
      id: "5",
      category: "U17",
      ageRange: "15-16 ans",
      level: "Interrégional",
      players: "10 joueurs",
      coach: "Lucas Moreau",
      schedule: "Mardi 19h-21h, Jeudi 19h-21h, Dimanche 10h-12h",
      description: "Préparation au haut niveau. Participation aux championnats interrégionaux. Développement des qualités athlétiques et mentales.",
    },
    {
      id: "6",
      category: "U20",
      ageRange: "17-19 ans",
      level: "Interrégional",
      players: "8 joueurs",
      coach: "Marie Petit",
      schedule: "Mardi 19h-21h, Vendredi 19h-21h, Dimanche 14h-16h",
      description: "Transition vers le niveau senior. Championnat interrégional avec formation tactique avancée et développement de l'autonomie sportive.",
    },
    {
      id: "7",
      category: "Adultes",
      ageRange: "20-45 ans",
      level: "Départemental",
      players: "12 joueurs",
      coach: "Thomas Rousseau",
      schedule: "Lundi 20h-22h, Mercredi 20h-22h, Vendredi 20h-22h",
      description: "Équipe senior évoluant en championnat départemental. Ambiance conviviale et compétitive, ouverte aux joueurs de tous niveaux souhaitant pratiquer le roller hockey en loisir ou en compétition.",
    },
  ];

  const achievements = [
    {
      title: "Champion Régional Benjamins",
      year: "2023",
    },
    {
      title: "Vice-Champion Interrégional Cadets",
      year: "2023",
    },
    {
      title: "3ème place Nationale 1 Seniors",
      year: "2024",
    },
    {
      title: "Coupe de Provence Poussins",
      year: "2024",
    },
  ];

  return (
    <div>
      <section className="bg-card py-12 lg:py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Nos Équipes</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            De 4 à 45 ans, découvrez toutes nos équipes et rejoignez la famille des Jokers
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-20">
        <div className="space-y-8">
          {teams.map((team) => (
            <Card key={team.id} className="p-6 lg:p-8" data-testid={`team-${team.id}`}>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold" data-testid="text-category">{team.category}</h3>
                      <p className="text-muted-foreground" data-testid="text-age-range">{team.ageRange}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" data-testid="badge-level">{team.level}</Badge>
                    <Badge variant="outline" data-testid="badge-players">{team.players}</Badge>
                  </div>
                </div>
                <div className="lg:w-2/3">
                  <p className="text-muted-foreground mb-4" data-testid="text-description">{team.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <Clock className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-sm" data-testid="text-schedule">{team.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm">Entraîneur : <span className="font-semibold" data-testid="text-coach">{team.coach}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm">Gymnase Municipal d'Aubagne</span>
                    </div>
                  </div>
                  <Button variant="outline" data-testid="button-join-team">
                    Rejoindre cette équipe
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-card py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Nos Succès</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Les performances de nos équipes témoignent de l'excellence de notre formation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="p-6 text-center" data-testid={`achievement-${index}`}>
                <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2" data-testid="text-achievement-title">{achievement.title}</h3>
                <p className="text-2xl font-bold text-primary" data-testid="text-achievement-year">{achievement.year}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-20">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Vous souhaitez nous rejoindre ?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Que vous soyez débutant ou joueur confirmé, nous avons une équipe pour vous. Contactez-nous pour plus d'informations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/contact">
              <Button data-testid="button-contact">
                Nous Contacter
              </Button>
            </a>
            <a href="/actualites">
              <Button variant="outline" data-testid="button-news">
                Voir les Actualités
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
