import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface TeamCategoryProps {
  icon: LucideIcon;
  title: string;
  ageRange: string;
  description: string;
}

export default function TeamCategory({
  icon: Icon,
  title,
  ageRange,
  description,
}: TeamCategoryProps) {
  return (
    <Card className="p-6 lg:p-8 hover-elevate active-elevate-2 cursor-pointer transition-transform" data-testid="card-team-category">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 bg-primary/10 rounded-md flex items-center justify-center">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-1" data-testid="text-category-title">{title}</h3>
          <p className="text-sm text-muted-foreground font-medium mb-3" data-testid="text-age-range">{ageRange}</p>
          <p className="text-muted-foreground" data-testid="text-description">{description}</p>
        </div>
      </div>
    </Card>
  );
}
