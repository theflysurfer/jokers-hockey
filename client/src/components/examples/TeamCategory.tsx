import TeamCategory from '../TeamCategory';
import { Users } from 'lucide-react';

export default function TeamCategoryExample() {
  return (
    <div className="max-w-sm">
      <TeamCategory
        icon={Users}
        title="Jeunes Débutants"
        ageRange="6-10 ans"
        description="Initiation au roller hockey dans une ambiance ludique et éducative."
      />
    </div>
  );
}
