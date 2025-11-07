import Hero from '../Hero';
import heroImage from '@assets/generated_images/Roller_hockey_action_shot_419972d5.png';

export default function HeroExample() {
  return (
    <Hero
      title="Les Jokers d'Aubagne"
      subtitle="Club de roller hockey passionné depuis 1997. De 6 à 25 ans, venez rejoindre notre équipe !"
      imageSrc={heroImage}
      onPrimaryClick={() => console.log('Primary CTA clicked')}
      onSecondaryClick={() => console.log('Secondary CTA clicked')}
    />
  );
}
