import NewsCard from '../NewsCard';
import newsImage from '@assets/generated_images/Team_celebration_moment_8986afec.png';

export default function NewsCardExample() {
  return (
    <div className="max-w-sm">
      <NewsCard
        title="Victoire éclatante contre Marseille !"
        excerpt="Les Jokers ont remporté un match palpitant samedi dernier avec un score de 5-3. Une performance exceptionnelle de toute l'équipe."
        date="15 novembre 2025"
        category="Match"
        imageSrc={newsImage}
        onClick={() => console.log('News card clicked')}
      />
    </div>
  );
}
