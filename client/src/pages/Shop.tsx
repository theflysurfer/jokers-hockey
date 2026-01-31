import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart } from "lucide-react";

export default function Shop() {
  const officialProducts = [
    {
      name: "Maillot de Match officiel gris",
      price: 45,
      description: "Maillot de compétition officiel RHA",
    },
    {
      name: "Maillot de Match officiel noir",
      price: 45,
      description: "Maillot de compétition officiel RHA",
    },
    {
      name: "Pantalon de match officiel RHA jeunesse",
      price: 65,
      description: "Pantalon de compétition pour les jeunes",
    },
    {
      name: "Pantalon de match officiel RHA Séniors",
      price: 65,
      description: "Pantalon de compétition réservé à l'équipe Nationale 1",
    },
  ];

  return (
    <div>
      <section className="bg-card py-12 lg:py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Boutique Officielle</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Équipements de compétition et goodies du club
          </p>
        </div>
      </section>

      {/* Équipement officiel de compétition */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-20 border-b">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Équipement de Compétition Officiel</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Maillots et pantalons officiels pour les matchs et compétitions
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {officialProducts.map((product, idx) => (
            <Card key={idx} className="overflow-hidden hover-elevate">
              <div className="p-6">
                <div className="flex items-center justify-center h-48 bg-muted rounded-lg mb-4">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                <p className="text-2xl font-bold text-primary">{product.price}€</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="inline-block p-8 bg-primary/5 border-primary/20">
            <h3 className="text-2xl font-bold mb-4">Commander sur HelloAsso</h3>
            <p className="text-muted-foreground mb-6 max-w-lg">
              Les commandes sont regroupées pour réduire les coûts de livraison et les émissions de CO2.
              Vous serez notifié quand votre commande sera prête à récupérer.
            </p>
            <Button
              size="lg"
              className="gap-2"
              onClick={() => window.open('https://www.helloasso.com/associations/roller-hockey-aubagne/boutiques/joueurs-rha', '_blank')}
            >
              <ExternalLink className="h-5 w-5" />
              Accéder à la boutique officielle
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Personnalisation prénom/numéro: +5€
            </p>
          </Card>
        </div>
      </section>

      {/* Boutique BlagaPro */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-20 border-b bg-muted/20">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Boutique Club - BlagaPro</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Sweats, polos, doudounes, sacs et accessoires aux couleurs du club
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-card p-4 rounded-lg">
              <p className="text-3xl font-bold text-primary">22</p>
              <p className="text-sm text-muted-foreground">Produits disponibles</p>
            </div>
            <div className="bg-card p-4 rounded-lg">
              <p className="text-3xl font-bold text-primary">19,99€</p>
              <p className="text-sm text-muted-foreground">À partir de</p>
            </div>
            <div className="bg-card p-4 rounded-lg">
              <p className="text-3xl font-bold text-primary">H/F/E</p>
              <p className="text-sm text-muted-foreground">Toutes tailles</p>
            </div>
            <div className="bg-card p-4 rounded-lg">
              <p className="text-3xl font-bold text-primary">24h</p>
              <p className="text-sm text-muted-foreground">Livraison rapide</p>
            </div>
          </div>

          <Card className="inline-block p-8 bg-card">
            <h3 className="text-2xl font-bold mb-4">Commander sur BlagaPro</h3>
            <p className="text-muted-foreground mb-2 max-w-lg">
              Sweats à capuche, polos, doudounes sans manches, pantalons de survêtement, sacs à dos et plus encore!
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Contact commandes: <strong>commandes_RHA@rollerhockeyaubagne.net</strong>
            </p>
            <Button
              size="lg"
              className="gap-2"
              onClick={() => window.open('https://blagapro.com/categorie-produit/boutiques-autres-sports-collectifs/club-roller-hockey-aubagne-13400/', '_blank')}
            >
              <ExternalLink className="h-5 w-5" />
              Découvrir la boutique BlagaPro
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
}
