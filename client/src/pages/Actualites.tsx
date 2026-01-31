import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CalendarView from "@/components/CalendarView";
import PhotoGallery from "@/components/PhotoGallery";
import VideoGallery from "@/components/VideoGallery";
import { Megaphone } from "lucide-react";

interface AnnouncementPhoto {
  id: number;
  title: string;
  imageUrl: string;
  description: string | null;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string | null;
  author_id: number | null;
  is_published: boolean;
  created_at: string;
  published_at: string | null;
  photos?: AnnouncementPhoto[];
}

export default function Actualites() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: announcements = [], isLoading, error } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements", selectedCategory],
    queryFn: async () => {
      const categoryParam = selectedCategory === "all" ? "" : `?category=${selectedCategory}`;
      const response = await fetch(`/api/announcements${categoryParam}`);
      if (!response.ok) throw new Error("Failed to fetch announcements");
      return response.json();
    },
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return "";
    }
  };

  const getCategoryBadgeColor = (category: string | null) => {
    if (!category) return "secondary";
    if (category === "General") return "default";
    if (category.startsWith("U")) return "outline";
    return "secondary";
  };

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold">Annonces du club</h2>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Toutes les équipes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les équipes</SelectItem>
                <SelectItem value="General">Général</SelectItem>
                <SelectItem value="U7">U7</SelectItem>
                <SelectItem value="U9">U9</SelectItem>
                <SelectItem value="U11">U11</SelectItem>
                <SelectItem value="U13">U13</SelectItem>
                <SelectItem value="U15">U15</SelectItem>
                <SelectItem value="U17">U17</SelectItem>
                <SelectItem value="U20">U20</SelectItem>
                <SelectItem value="Adultes">Adultes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chargement des annonces...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive">Erreur lors du chargement des annonces</p>
            </div>
          )}

          {!isLoading && !error && announcements.length === 0 && (
            <div className="text-center py-12">
              <Megaphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Aucune annonce pour le moment</p>
            </div>
          )}

          {!isLoading && !error && announcements.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className="overflow-hidden hover-elevate active-elevate-2" data-testid={`news-${announcement.id}`}>
                  {/* Photo gallery */}
                  {announcement.photos && announcement.photos.length > 0 && (
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {announcement.photos.slice(0, 4).map((photo) => (
                        <img
                          key={photo.id}
                          src={photo.imageUrl}
                          alt={photo.description || photo.title}
                          className="w-full h-40 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={getCategoryBadgeColor(announcement.category)} data-testid="badge-category">
                        {announcement.category || "Général"}
                      </Badge>
                      <span className="text-sm text-muted-foreground" data-testid="text-date">
                        {formatDate(announcement.published_at)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-3" data-testid="text-title">{announcement.title}</h3>
                    <div className="text-muted-foreground mb-4 whitespace-pre-wrap" data-testid="text-content">
                      {announcement.content.substring(0, 200)}
                      {announcement.content.length > 200 && "..."}
                    </div>
                    {announcement.photos && announcement.photos.length > 4 && (
                      <p className="text-sm text-muted-foreground mb-4">
                        +{announcement.photos.length - 4} photos
                      </p>
                    )}
                    <Button variant="outline" data-testid="button-read-more">Lire la suite</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
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
