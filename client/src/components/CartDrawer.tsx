import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

export default function CartDrawer() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative" data-testid="button-cart">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Panier ({totalItems} articles)</SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-col h-[calc(100vh-200px)]">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <p data-testid="text-empty-cart">Votre panier est vide</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 border rounded-md"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <img
                      src={item.imageSrc}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1" data-testid="text-item-name">{item.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.price.toFixed(2)} €
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          data-testid="button-decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center" data-testid="text-quantity">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          data-testid="button-increase"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-auto"
                          onClick={() => removeItem(item.id)}
                          data-testid="button-remove"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 mt-4 space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary" data-testid="text-total-price">
                    {totalPrice.toFixed(2)} €
                  </span>
                </div>
                <Button className="w-full" size="lg" data-testid="button-checkout">
                  Passer la commande
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
