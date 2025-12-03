import { Link } from "wouter";
import Hero from "@/components/Hero";
import NewsCard from "@/components/NewsCard";
import TeamCategory from "@/components/TeamCategory";
import NextMatchWidget from "@/components/NextMatchWidget";
import RecentResults from "@/components/RecentResults";
import InstagramFeed from "@/components/InstagramFeed";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { Users, Star, Trophy, Target } from "lucide-react";
import { useUpcomingMatches, useRecentResults } from "@/hooks/use-matches";
import heroImage from "@assets/generated_images/Roller_hockey_action_shot_419972d5.png";
import newsImage1 from "@assets/generated_images/Team_celebration_moment_8986afec.png";
import newsImage2 from "@assets/generated_images/Youth_team_photo_5677652d.png";
import newsImage3 from "@assets/generated_images/Training_session_photo_930d89f8.png";

export default function Home() {
  const { data: upcomingMatches } = useUpcomingMatches(1);
  const { data: recentResults } = useRecentResults(3);
  const news = [
    {
      title: "Victoire éclatante contre Marseille !",
      excerpt: "Les Jokers ont remporté un match palpitant samedi dernier avec un score de 5-3. Une performance exceptionnelle de toute l'équipe.",
      date: "15 novembre 2025",
      category: "Match",
      imageSrc: newsImage1,
    },
    {
      title: "Journée portes ouvertes réussie",
      excerpt: "Plus de 50 familles sont venues découvrir notre club lors de la journée portes ouvertes. Merci à tous les participants !",
      date: "10 novembre 2025",
      category: "Événement",
      imageSrc: newsImage2,
    },
    {
      title: "Nouveau programme d'entraînement",
      excerpt: "Découvrez notre nouveau programme d'entraînement spécialement conçu pour les jeunes de 6 à 10 ans.",
      date: "5 novembre 2025",
      category: "Formation",
      imageSrc: newsImage3,
    },
  ];

  const teams = [
    {
      icon: Star,
      title: "Jeunes Débutants",
      ageRange: "6-10 ans",
      description: "Initiation au roller hockey dans une ambiance ludique et éducative.",
    },
    {
      icon: Users,
      title: "Jeunes Confirmés",
      ageRange: "11-14 ans",
      description: "Perfectionnement des techniques et développement de l'esprit d'équipe.",
    },
    {
      icon: Target,
      title: "Adolescents",
      ageRange: "15-18 ans",
      description: "Préparation à la compétition avec un encadrement adapté.",
    },
    {
      icon: Trophy,
      title: "Adultes",
      ageRange: "19-25 ans",
      description: "Équipe compétitive en Nationale 1, passion et performance au rendez-vous.",
    },
  ];

  return (
    <div>
      <Hero
        title="Les Jokers d'Aubagne"
        subtitle="Club de roller hockey passionné depuis 1997. De 6 à 25 ans, venez rejoindre notre équipe !"
        imageSrc={heroImage}
        onPrimaryClick={() => console.log('Navigate to news')}
        onSecondaryClick={() => console.log('Navigate to contact')}
      />

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NextMatchWidget match={upcomingMatches?.[0]} />
          <NewsletterSignup />
        </div>
      </section>

      {recentResults && recentResults.length > 0 && (
        <RecentResults matches={recentResults} />
      )}

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Dernières Actualités</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Restez informés des derniers matchs, événements et nouvelles du club
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {news.map((item, index) => (
            <NewsCard
              key={index}
              {...item}
              onClick={() => console.log(`News ${index} clicked`)}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/actualites">
            <Button variant="outline" size="lg" data-testid="button-all-news">
              Voir toutes les actualités
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-card py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Nos Équipes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Un encadrement adapté pour chaque catégorie d'âge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {teams.map((team, index) => (
              <TeamCategory key={index} {...team} />
            ))}
          </div>
        </div>
      </section>

      <InstagramFeed instagramUsername="lesjokersdaubagne" />

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-20">
        <div className="text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Rejoignez-nous !</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Que vous soyez débutant ou confirmé, les Jokers d'Aubagne vous accueillent avec passion
          </p>
          <Link href="/contact">
            <Button size="lg" className="rounded-full" data-testid="button-join-cta">
              Nous Contacter
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
