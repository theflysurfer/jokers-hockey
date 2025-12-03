import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalendarView from "@/components/CalendarView";
import PhotoGallery from "@/components/PhotoGallery";
import VideoGallery from "@/components/VideoGallery";
import matchActionImage from "@assets/generated_images/Roller_hockey_match_action_45dae761.png";
import teamPhotoImage from "@assets/generated_images/Team_group_photo_purple_96cb5224.png";
import youthTrainingImage from "@assets/generated_images/Youth_training_session_9bba8072.png";
import goalieSaveImage from "@assets/generated_images/Goalie_save_purple_uniform_358ee7b8.png";
import victoryCelebrationImage from "@assets/generated_images/Team_victory_celebration_a21a9d47.png";
import practiceDrillsImage from "@assets/generated_images/Team_practice_drills_76b28bbc.png";

export default function Actualites() {

  const newsArticles = [
    {
      id: "1",
      title: "Victoire éclatante face à Marseille !",
      date: "8 Novembre 2024",
      category: "Match",
      image: victoryCelebrationImage,
      excerpt: "Les Jokers ont dominé Marseille avec un score de 7-3. Une performance exceptionnelle de l'équipe.",
      content: "Une soirée mémorable pour les Jokers d'Aubagne qui ont décroché une victoire convaincante face à leurs rivaux marseillais. L'équipe a montré une cohésion remarquable et une détermination sans faille. Les attaquants ont été particulièrement efficaces avec 7 buts marqués.",
    },
    {
      id: "2",
      title: "Nouveau partenariat avec Sport 2000",
      date: "5 Novembre 2024",
      category: "Club",
      image: teamPhotoImage,
      excerpt: "Le club annonce un partenariat stratégique avec Sport 2000 pour l'équipement de toutes nos équipes.",
      content: "Nous sommes fiers d'annoncer notre nouveau partenariat avec Sport 2000. Cette collaboration permettra à nos joueurs de bénéficier d'équipements de qualité professionnelle. Un grand merci à Sport 2000 pour leur confiance.",
    },
    {
      id: "3",
      title: "Stage d'initiation vacances de la Toussaint",
      date: "28 Octobre 2024",
      category: "Événement",
      image: youthTrainingImage,
      excerpt: "Plus de 30 jeunes ont participé à notre stage d'initiation. Un succès total !",
      content: "Le stage d'initiation organisé pendant les vacances de la Toussaint a rencontré un vif succès. 32 enfants de 6 à 14 ans ont découvert le roller hockey dans une ambiance conviviale et ludique. Rendez-vous aux prochaines vacances !",
    },
    {
      id: "4",
      title: "Notre gardien élu MVP du mois",
      date: "25 Octobre 2024",
      category: "Joueur",
      image: goalieSaveImage,
      excerpt: "Thomas Durand a été désigné meilleur joueur du mois d'octobre en Nationale 1.",
      content: "Félicitations à Thomas Durand, notre gardien, qui a été élu MVP du mois d'octobre ! Avec 89% d'arrêts réussis et plusieurs matchs décisifs, Thomas a largement mérité cette reconnaissance. Bravo champion !",
    },
    {
      id: "5",
      title: "Entraînement spécial avec un joueur pro",
      date: "20 Octobre 2024",
      category: "Entraînement",
      image: practiceDrillsImage,
      excerpt: "Les jeunes ont eu la chance de s'entraîner avec Marc Leblanc, ancien joueur de l'équipe de France.",
      content: "Moment exceptionnel pour nos jeunes joueurs qui ont bénéficié d'une session d'entraînement avec Marc Leblanc. L'ancien international français a partagé ses conseils techniques et son expérience. Une journée inoubliable !",
    },
    {
      id: "6",
      title: "Nouveau terrain indoor inauguré",
      date: "15 Octobre 2024",
      category: "Infrastructure",
      image: matchActionImage,
      excerpt: "Inauguration de notre nouveau terrain indoor aux normes internationales.",
      content: "Le club dispose désormais d'un terrain indoor dernière génération, conforme aux normes internationales. Cette infrastructure permettra à nos équipes de s'entraîner dans les meilleures conditions toute l'année.",
    },
  ];

  const galleryImages = [
    { id: "1", src: matchActionImage, alt: "Match action" },
    { id: "2", src: teamPhotoImage, alt: "Photo d'équipe" },
    { id: "3", src: youthTrainingImage, alt: "Entraînement jeunes" },
    { id: "4", src: goalieSaveImage, alt: "Arrêt du gardien" },
    { id: "5", src: victoryCelebrationImage, alt: "Célébration victoire" },
    { id: "6", src: practiceDrillsImage, alt: "Exercices d'entraînement" },
  ];

  return (
    <div>
      <section className="bg-card py-12 lg:py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Actualités</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Suivez toute l'actualité des Jokers d'Aubagne : matchs, événements et vie du club
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-20">
        <div className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">Dernières nouvelles</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {newsArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden hover-elevate active-elevate-2" data-testid={`news-${article.id}`}>
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" data-testid="badge-category">{article.category}</Badge>
                    <span className="text-sm text-muted-foreground" data-testid="text-date">{article.date}</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3" data-testid="text-title">{article.title}</h3>
                  <p className="text-muted-foreground mb-4" data-testid="text-content">{article.content}</p>
                  <Button variant="outline" data-testid="button-read-more">Lire la suite</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-20">
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="calendar">Calendrier</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="videos">Vidéos</TabsTrigger>
          </TabsList>
          <TabsContent value="calendar">
            <CalendarView />
          </TabsContent>
          <TabsContent value="photos">
            <PhotoGallery title="Galerie Photos" />
          </TabsContent>
          <TabsContent value="videos">
            <VideoGallery title="Vidéos du Club" />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
