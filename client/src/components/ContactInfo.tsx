import { Card } from "@/components/ui/card";
import { MapPin, Mail, Clock, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactInfo() {
  const schedules = [
    { day: "Lundi", time: "18h00 - 20h00", category: "Jeunes 6-10 ans" },
    { day: "Mercredi", time: "14h00 - 16h00", category: "Jeunes 11-14 ans" },
    { day: "Mercredi", time: "16h00 - 18h00", category: "Ados 15-18 ans" },
    { day: "Vendredi", time: "20h00 - 22h00", category: "Adultes 19-25 ans" },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 lg:p-8">
        <h3 className="text-2xl font-semibold mb-6" data-testid="text-info-title">
          Informations pratiques
        </h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium">Adresse</p>
              <p className="text-muted-foreground" data-testid="text-address">
                13bis Avenue Fallen<br />
                Immeuble "Lou Galoubet"<br />
                13400 Aubagne, France
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium">Email</p>
              <a
                href="mailto:dirjokersrha@outlook.fr"
                className="text-primary hover:underline"
                data-testid="link-email"
              >
                dirjokersrha@outlook.fr
              </a>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-2xl font-semibold" data-testid="text-schedule-title">
            Horaires d'entraînement
          </h3>
        </div>
        <div className="space-y-3">
          {schedules.map((schedule, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-md bg-muted/50"
              data-testid={`schedule-${index}`}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium min-w-20">{schedule.day}</span>
                <span className="text-muted-foreground">{schedule.time}</span>
              </div>
              <span className="text-sm text-primary font-medium">
                {schedule.category}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 lg:p-8">
        <h3 className="text-2xl font-semibold mb-6">Suivez-nous</h3>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="icon"
            className="hover-elevate active-elevate-2"
            onClick={() => window.open('https://www.facebook.com/RollerHockeyAubagne', '_blank')}
            data-testid="button-facebook"
          >
            <Facebook className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hover-elevate active-elevate-2"
            onClick={() => window.open('https://www.instagram.com/jokersaubagne', '_blank')}
            data-testid="button-instagram"
          >
            <Instagram className="h-5 w-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
