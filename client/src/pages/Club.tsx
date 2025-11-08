import { Card } from "@/components/ui/card";
import { Trophy, Users, Heart, Target } from "lucide-react";

export default function Club() {
  const values = [
    {
      icon: Heart,
      title: "Passion",
      description: "Le roller hockey est plus qu'un sport, c'est une passion que nous partageons ensemble.",
    },
    {
      icon: Users,
      title: "Esprit d'équipe",
      description: "La solidarité et l'entraide sont au cœur de notre club depuis 1997.",
    },
    {
      icon: Trophy,
      title: "Performance",
      description: "Nous visons l'excellence tout en respectant nos valeurs de fair-play.",
    },
    {
      icon: Target,
      title: "Formation",
      description: "Un encadrement de qualité pour développer le potentiel de chaque joueur.",
    },
  ];

  return (
    <div>
      <section className="bg-card py-12 lg:py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="lg:w-1/3">
              <img
                src="/attached_assets/vignette_1762612341487.png"
                alt="Logo Les Jokers d'Aubagne"
                className="w-64 h-64 object-contain mx-auto"
              />
            </div>
            <div className="lg:w-2/3">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">Le Club</h1>
              <p className="text-lg text-muted-foreground mb-4">
                Fondé en 1997, Les Jokers d'Aubagne est un club de roller hockey passionné et engagé dans la promotion de ce sport dynamique et spectaculaire.
              </p>
              <p className="text-lg text-muted-foreground">
                Affilié à la Fédération Française de Roller Sports (FFRS), notre club accueille des joueurs de tous niveaux, des jeunes débutants de 6 ans aux adultes compétiteurs de 25 ans.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Notre Histoire</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Plus de 25 ans d'engagement pour le roller hockey
          </p>
        </div>

        <div className="grid gap-8 lg:gap-12">
          <Card className="p-6 lg:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-32 flex-shrink-0">
                <div className="text-4xl font-bold text-primary">1997</div>
                <div className="text-sm text-muted-foreground">Fondation</div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">La naissance des Jokers</h3>
                <p className="text-muted-foreground">
                  Création du club à Aubagne avec pour objectif de promouvoir le roller hockey et d'offrir un espace de pratique sportive accessible à tous.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 lg:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-32 flex-shrink-0">
                <div className="text-4xl font-bold text-primary">2024-25</div>
                <div className="text-sm text-muted-foreground">Saison actuelle</div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-3">Nationale 1 - Groupe 2</h3>
                <p className="text-muted-foreground mb-3">
                  Notre équipe senior évolue en Nationale 1, le plus haut niveau du championnat français de roller hockey. Actuellement 3ème place avec 19 points.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-sm text-muted-foreground">Matchs joués</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">6</div>
                    <div className="text-sm text-muted-foreground">Victoires</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">60</div>
                    <div className="text-sm text-muted-foreground">Buts marqués</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">19</div>
                    <div className="text-sm text-muted-foreground">Points</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="bg-card py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Nos Valeurs</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Les principes qui guident notre club au quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 lg:p-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-20">
        <div className="text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Rejoignez l'aventure !</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Le club des Jokers d'Aubagne recherche toujours de nouveaux joueurs passionnés, des bénévoles et des partenaires pour continuer à grandir ensemble.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/contact">
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover-elevate active-elevate-2">
                Nous Contacter
              </button>
            </a>
            <a href="/boutique">
              <button className="px-8 py-3 border-2 border-primary text-primary rounded-full font-semibold hover-elevate active-elevate-2">
                Boutique Officielle
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
