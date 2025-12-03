import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Image, Video, Trophy, Users } from "lucide-react";

export default function Admin() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMatch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const matchData = {
      date: new Date(formData.get('date') as string).toISOString(),
      opponent: formData.get('opponent'),
      location: formData.get('location'),
      venue: formData.get('venue'),
      status: formData.get('status'),
      category: formData.get('category'),
      scoreJokers: formData.get('scoreJokers') ? parseInt(formData.get('scoreJokers') as string) : null,
      scoreOpponent: formData.get('scoreOpponent') ? parseInt(formData.get('scoreOpponent') as string) : null,
    };

    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchData),
      });

      if (response.ok) {
        toast({ title: "Match ajouté !", description: "Le match a été ajouté avec succès." });
        (e.target as HTMLFormElement).reset();
      } else {
        toast({ title: "Erreur", description: "Impossible d'ajouter le match.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPhoto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const photoData = {
      title: formData.get('title'),
      description: formData.get('description'),
      imageUrl: formData.get('imageUrl'),
      category: formData.get('category'),
      matchId: formData.get('matchId') || null,
    };

    try {
      const response = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photoData),
      });

      if (response.ok) {
        toast({ title: "Photo ajoutée !", description: "La photo a été ajoutée avec succès." });
        (e.target as HTMLFormElement).reset();
      } else {
        toast({ title: "Erreur", description: "Impossible d'ajouter la photo.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVideo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const videoData = {
      title: formData.get('title'),
      description: formData.get('description'),
      youtubeId: formData.get('youtubeId'),
      category: formData.get('category'),
      matchId: formData.get('matchId') || null,
    };

    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoData),
      });

      if (response.ok) {
        toast({ title: "Vidéo ajoutée !", description: "La vidéo a été ajoutée avec succès." });
        (e.target as HTMLFormElement).reset();
      } else {
        toast({ title: "Erreur", description: "Impossible d'ajouter la vidéo.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Administration</h1>
          <p className="text-muted-foreground">Gérer le contenu du site Les Jokers d'Aubagne</p>
        </div>

        <Tabs defaultValue="matches" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="matches">
              <Trophy className="h-4 w-4 mr-2" />
              Matchs
            </TabsTrigger>
            <TabsTrigger value="photos">
              <Image className="h-4 w-4 mr-2" />
              Photos
            </TabsTrigger>
            <TabsTrigger value="videos">
              <Video className="h-4 w-4 mr-2" />
              Vidéos
            </TabsTrigger>
            <TabsTrigger value="staff">
              <Users className="h-4 w-4 mr-2" />
              Staff
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matches">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter un Match</CardTitle>
                <CardDescription>Ajoutez un nouveau match au calendrier</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddMatch} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date et heure</Label>
                      <Input type="datetime-local" name="date" id="date" required />
                    </div>
                    <div>
                      <Label htmlFor="opponent">Adversaire</Label>
                      <Input type="text" name="opponent" id="opponent" required placeholder="ex: Marseille" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Lieu</Label>
                      <Select name="location" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home">Domicile</SelectItem>
                          <SelectItem value="away">Extérieur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="venue">Salle</Label>
                      <Input type="text" name="venue" id="venue" placeholder="ex: Gymnase du Charrel" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="category">Catégorie</Label>
                      <Select name="category">
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="N1">N1</SelectItem>
                          <SelectItem value="N3">N3</SelectItem>
                          <SelectItem value="N4">N4</SelectItem>
                          <SelectItem value="U7">U7</SelectItem>
                          <SelectItem value="U11">U11</SelectItem>
                          <SelectItem value="U13">U13</SelectItem>
                          <SelectItem value="U15">U15</SelectItem>
                          <SelectItem value="U17">U17</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Statut</Label>
                      <Select name="status" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">À venir</SelectItem>
                          <SelectItem value="completed">Terminé</SelectItem>
                          <SelectItem value="cancelled">Annulé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="scoreJokers">Score Jokers (optionnel)</Label>
                      <Input type="number" name="scoreJokers" id="scoreJokers" min="0" />
                    </div>
                    <div>
                      <Label htmlFor="scoreOpponent">Score Adversaire (optionnel)</Label>
                      <Input type="number" name="scoreOpponent" id="scoreOpponent" min="0" />
                    </div>
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Ajout en cours..." : "Ajouter le Match"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter une Photo</CardTitle>
                <CardDescription>Ajoutez une photo à la galerie</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPhoto} className="space-y-4">
                  <div>
                    <Label htmlFor="photo-title">Titre</Label>
                    <Input type="text" name="title" id="photo-title" required placeholder="ex: Match contre Marseille" />
                  </div>

                  <div>
                    <Label htmlFor="photo-description">Description</Label>
                    <Textarea name="description" id="photo-description" placeholder="Description de la photo" />
                  </div>

                  <div>
                    <Label htmlFor="imageUrl">URL de l'image</Label>
                    <Input type="url" name="imageUrl" id="imageUrl" required placeholder="https://..." />
                    <p className="text-xs text-muted-foreground mt-1">
                      Hébergez l'image sur Imgur, Google Photos ou un autre service
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="photo-category">Catégorie</Label>
                    <Select name="category">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="match">Match</SelectItem>
                        <SelectItem value="training">Entraînement</SelectItem>
                        <SelectItem value="event">Événement</SelectItem>
                        <SelectItem value="team">Équipe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Ajout en cours..." : "Ajouter la Photo"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter une Vidéo</CardTitle>
                <CardDescription>Ajoutez une vidéo YouTube à la galerie</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddVideo} className="space-y-4">
                  <div>
                    <Label htmlFor="video-title">Titre</Label>
                    <Input type="text" name="title" id="video-title" required placeholder="ex: Highlights Match vs Marseille" />
                  </div>

                  <div>
                    <Label htmlFor="video-description">Description</Label>
                    <Textarea name="description" id="video-description" placeholder="Description de la vidéo" />
                  </div>

                  <div>
                    <Label htmlFor="youtubeId">ID YouTube</Label>
                    <Input type="text" name="youtubeId" id="youtubeId" required placeholder="ex: dQw4w9WgXcQ" />
                    <p className="text-xs text-muted-foreground mt-1">
                      L'ID se trouve dans l'URL YouTube: youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong>
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="video-category">Catégorie</Label>
                    <Select name="category">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="highlights">Highlights</SelectItem>
                        <SelectItem value="interviews">Interviews</SelectItem>
                        <SelectItem value="training">Entraînement</SelectItem>
                        <SelectItem value="event">Événement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Ajout en cours..." : "Ajouter la Vidéo"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Gestion du Staff</CardTitle>
                <CardDescription>Fonctionnalité à venir</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cette section permettra d'ajouter et gérer les membres de l'encadrement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
