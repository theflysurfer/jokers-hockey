import { Button } from "@/components/ui/button";

interface HeroProps {
  title: string;
  subtitle: string;
  primaryCta?: string;
  secondaryCta?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  imageSrc: string;
}

export default function Hero({
  title,
  subtitle,
  primaryCta = "Voir les Actualités",
  secondaryCta = "Nous Contacter",
  onPrimaryClick,
  onSecondaryClick,
  imageSrc,
}: HeroProps) {
  return (
    <section className="relative h-[70vh] min-h-96 max-h-[600px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageSrc})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      
      <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-lg lg:text-xl mb-8 text-white/90">
            {subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              variant="default"
              className="rounded-full"
              onClick={onPrimaryClick}
              data-testid="button-hero-primary"
            >
              {primaryCta}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full backdrop-blur-sm bg-white/20 border-white/30 text-white hover:bg-white/30"
              onClick={onSecondaryClick}
              data-testid="button-hero-secondary"
            >
              {secondaryCta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
