import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface NewsCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageSrc: string;
  onClick?: () => void;
}

export default function NewsCard({
  title,
  excerpt,
  date,
  category,
  imageSrc,
  onClick,
}: NewsCardProps) {
  return (
    <Card
      className="overflow-hidden cursor-pointer hover-elevate active-elevate-2 transition-transform"
      onClick={onClick}
      data-testid="card-news"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
            {category}
          </Badge>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Calendar className="h-4 w-4" />
          <span data-testid="text-date">{date}</span>
        </div>
        <h3 className="text-xl font-semibold mb-2 line-clamp-2" data-testid="text-title">
          {title}
        </h3>
        <p className="text-muted-foreground line-clamp-3 mb-4" data-testid="text-excerpt">
          {excerpt}
        </p>
        <span className="text-primary font-medium hover:underline" data-testid="link-read-more">
          Lire plus →
        </span>
      </div>
    </Card>
  );
}
