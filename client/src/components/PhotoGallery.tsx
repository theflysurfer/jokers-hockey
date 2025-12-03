import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { type Photo } from "@shared/schema";
import { usePhotos } from "@/hooks/use-photos";

interface PhotoGalleryProps {
  category?: string;
  title?: string;
}

export default function PhotoGallery({ category, title = "Galerie Photos" }: PhotoGalleryProps) {
  const { data: photos, isLoading } = usePhotos(category);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const goToPrevious = () => {
    if (selectedPhotoIndex !== null && photos) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
    }
  };

  const goToNext = () => {
    if (selectedPhotoIndex !== null && photos) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Chargement des photos...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-6 w-6" />
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Aucune photo disponible pour le moment
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedPhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-6 w-6" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-end p-3">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="font-semibold text-sm">{photo.title}</p>
                    {photo.category && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {photo.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedPhoto && (
        <Dialog open={selectedPhotoIndex !== null} onOpenChange={closeLightbox}>
          <DialogContent className="max-w-7xl p-0 overflow-hidden">
            <div className="relative bg-black">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={closeLightbox}
              >
                <X className="h-6 w-6" />
              </Button>

              {photos.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                    onClick={goToNext}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}

              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full h-auto max-h-[90vh] object-contain"
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{selectedPhoto.title}</h3>
                {selectedPhoto.description && (
                  <p className="text-sm text-gray-300">{selectedPhoto.description}</p>
                )}
                <div className="flex items-center gap-2 mt-3">
                  {selectedPhoto.category && (
                    <Badge variant="secondary">{selectedPhoto.category}</Badge>
                  )}
                  <span className="text-xs text-gray-400">
                    {selectedPhotoIndex !== null && `${selectedPhotoIndex + 1} / ${photos.length}`}
                  </span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
