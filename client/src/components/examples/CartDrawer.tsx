import CartDrawer from '../CartDrawer';
import { CartProvider } from '@/contexts/CartContext';

export default function CartDrawerExample() {
  return (
    <CartProvider>
      <div className="p-4">
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
