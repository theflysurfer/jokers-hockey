import ProductCard from '../ProductCard';
import productImage from '@assets/generated_images/Team_t-shirt_purple_yellow_03a46c86.png';

export default function ProductCardExample() {
  const product = {
    id: '1',
    name: 'T-shirt Les Jokers',
    price: 25.00,
    description: 'T-shirt officiel aux couleurs du club, violet et jaune',
    imageSrc: productImage,
    category: 'Vêtements',
  };

  return (
    <div className="max-w-sm">
      <ProductCard
        product={product}
        onAddToCart={(product) => console.log('Added to cart:', product)}
      />
    </div>
  );
}
