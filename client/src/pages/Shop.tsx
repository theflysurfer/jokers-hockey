import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
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

  return (
    <div>
      <section className="bg-card py-12 lg:py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Boutique Officielle</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Soutenez les Jokers d'Aubagne avec nos goodies officiels
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-20">
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
