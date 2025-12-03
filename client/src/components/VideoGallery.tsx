import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video as VideoIcon, Play } from "lucide-react";
import { type Video } from "@shared/schema";
import { useVideos } from "@/hooks/use-videos";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface VideoGalleryProps {
  category?: string;
  title?: string;
}

export default function VideoGallery({ category, title = "Vidéos" }: VideoGalleryProps) {
  const { data: videos, isLoading } = useVideos(category);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Chargement des vidéos...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <VideoIcon className="h-6 w-6" />
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <VideoIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Aucune vidéo disponible pour le moment
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <VideoIcon className="h-6 w-6" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative overflow-hidden rounded-lg aspect-video bg-muted">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                    <div className="bg-primary rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                      <Play className="h-8 w-8 text-primary-foreground" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  {video.category && (
                    <Badge variant="secondary" className="mt-2">
                      {video.category}
                    </Badge>
                  )}
                  {video.createdAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(video.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedVideo && (
        <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedVideo.title}</DialogTitle>
            </DialogHeader>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
            {selectedVideo.description && (
              <p className="text-sm text-muted-foreground mt-4">
                {selectedVideo.description}
              </p>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
