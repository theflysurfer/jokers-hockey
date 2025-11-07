import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate active-elevate-2 transition-transform" data-testid="card-product">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.imageSrc}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
            {product.category}
          </Badge>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2" data-testid="text-product-name">
          {product.name}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-2" data-testid="text-product-description">
          {product.description}
        </p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-2xl font-bold text-primary" data-testid="text-product-price">
            {product.price.toFixed(2)} €
          </span>
          <Button
            onClick={() => onAddToCart(product)}
            data-testid="button-add-to-cart"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>
    </Card>
  );
}
