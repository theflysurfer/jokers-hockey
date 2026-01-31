import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart } from "lucide-react";
import tshirtImage from "@assets/generated_images/Team_t-shirt_purple_yellow_03a46c86.png";
import capImage from "@assets/generated_images/Purple_baseball_cap_c910535c.png";
import hoodieImage from "@assets/generated_images/Purple_team_hoodie_ba785e0e.png";
import bottleImage from "@assets/generated_images/Team_water_bottle_6f8c1823.png";

export default function Shop() {
  const { addItem } = useCart();
  const { toast } = useToast();

  const products = [
    {
      id: "1",
      name: "T-shirt Les Jokers",
      price: 25.0,
      description: "T-shirt officiel aux couleurs du club, violet et jaune. 100% coton.",
      imageSrc: tshirtImage,
      category: "Vêtements",
    },
    {
      id: "2",
      name: "Casquette Les Jokers",
      price: 18.0,
      description: "Casquette baseball violette avec logo brodé du club.",
      imageSrc: capImage,
      category: "Accessoires",
    },
    {
      id: "3",
      name: "Sweat à capuche",
      price: 45.0,
      description: "Sweat confortable aux couleurs du club, parfait pour les entraînements.",
      imageSrc: hoodieImage,
      category: "Vêtements",
    },
    {
      id: "4",
      name: "Gourde Les Jokers",
      price: 12.0,
      description: "Gourde réutilisable 750ml aux couleurs violet et jaune.",
      imageSrc: bottleImage,
      category: "Accessoires",
    },
    {
      id: "5",
      name: "T-shirt Entraînement",
      price: 28.0,
      description: "T-shirt technique respirant pour les entraînements intensifs.",
      imageSrc: tshirtImage,
      category: "Vêtements",
    },
    {
      id: "6",
      name: "Pack Supporter",
      price: 35.0,
      description: "Pack comprenant t-shirt + casquette aux couleurs du club.",
      imageSrc: capImage,
      category: "Packs",
    },
  ];

  const handleAddToCart = (product: typeof products[0]) => {
    addItem(product);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier`,
    });
  };

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

      {/* Goodies et merchandising */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Goodies et Merchandising</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Soutenez les Jokers d'Aubagne avec nos produits dérivés
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
