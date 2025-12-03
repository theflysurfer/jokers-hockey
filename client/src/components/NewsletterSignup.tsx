import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewsletterSignupProps {
  compact?: boolean;
}

export default function NewsletterSignup({ compact = false }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setEmail("");
        toast({
          title: "Inscription réussie !",
          description: "Vous êtes maintenant inscrit à notre newsletter.",
        });
      } else {
        const data = await response.json();
        toast({
          title: "Erreur",
          description: data.message || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de s'inscrire pour le moment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <Mail className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">Restez informé</h3>
            <p className="text-sm text-muted-foreground">
              Recevez nos actualités et résultats par email
            </p>
          </div>
        </div>
        {isSubscribed ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Inscription confirmée !</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "..." : "S'inscrire"}
            </Button>
          </form>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-6 w-6" />
          Newsletter
        </CardTitle>
        <CardDescription>
          Recevez nos dernières actualités, résultats de matchs et événements directement dans votre boîte mail
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSubscribed ? (
          <div className="flex items-center gap-2 text-green-600 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Merci pour votre inscription !</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading} size="lg">
              {isLoading ? "Inscription..." : "S'inscrire"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
