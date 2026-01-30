import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { storage } from './storage';

const users = [
  // Admin
  { email: 'marc.durand@jokers.fr', username: 'marc.durand', password: 'Admin123!', fullName: 'Marc Durand', role: 'admin', phone: '06 12 34 56 78' },

  // Director
  { email: 'sophie.martin@jokers.fr', username: 'sophie.martin', password: 'Director123!', fullName: 'Sophie Martin', role: 'director', phone: '06 23 45 67 89' },

  // Secretary
  { email: 'julie.bernard@jokers.fr', username: 'julie.bernard', password: 'Secretary123!', fullName: 'Julie Bernard', role: 'secretary', phone: '06 34 56 78 90' },

  // Treasurer
  { email: 'pierre.lefebvre@jokers.fr', username: 'pierre.lefebvre', password: 'Treasurer123!', fullName: 'Pierre Lefebvre', role: 'treasurer', phone: '06 45 67 89 01' },

  // Coaches
  { email: 'thomas.rousseau@jokers.fr', username: 'thomas.rousseau', password: 'Coach123!', fullName: 'Thomas Rousseau', role: 'coach', phone: '06 56 78 90 12' },
  { email: 'marie.petit@jokers.fr', username: 'marie.petit', password: 'Coach123!', fullName: 'Marie Petit', role: 'coach', phone: '06 67 89 01 23' },
  { email: 'lucas.moreau@jokers.fr', username: 'lucas.moreau', password: 'Coach123!', fullName: 'Lucas Moreau', role: 'coach', phone: '06 78 90 12 34' },

  // Photographer
  { email: 'camille.simon@jokers.fr', username: 'camille.simon', password: 'Photo123!', fullName: 'Camille Simon', role: 'photographer', phone: '06 89 01 23 45' },

  // Parents
  { email: 'laurent.garcia@gmail.com', username: 'laurent.garcia', password: 'Parent123!', fullName: 'Laurent Garcia', role: 'parent', phone: '06 90 12 34 56' },
  { email: 'nathalie.lopez@gmail.com', username: 'nathalie.lopez', password: 'Parent123!', fullName: 'Nathalie Lopez', role: 'parent', phone: '06 01 23 45 67' },
  { email: 'francois.blanc@gmail.com', username: 'francois.blanc', password: 'Parent123!', fullName: 'François Blanc', role: 'parent', phone: '06 12 34 56 78' },
  { email: 'isabelle.faure@gmail.com', username: 'isabelle.faure', password: 'Parent123!', fullName: 'Isabelle Faure', role: 'parent', phone: '06 23 45 67 89' },
  { email: 'olivier.dumont@gmail.com', username: 'olivier.dumont', password: 'Parent123!', fullName: 'Olivier Dumont', role: 'parent', phone: '06 34 56 78 90' },
  { email: 'sandrine.bonnet@gmail.com', username: 'sandrine.bonnet', password: 'Parent123!', fullName: 'Sandrine Bonnet', role: 'parent', phone: '06 45 67 89 01' },
];

async function seedUsers() {
  console.log('🌱 Seeding users...\n');

  for (const userData of users) {
    try {
      // Check if user already exists
      const existing = await storage.getUserByEmail(userData.email);
      if (existing) {
        console.log(`⏭️  Skip: ${userData.fullName} (${userData.email}) - already exists`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = await storage.createUser({
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        fullName: userData.fullName,
        role: userData.role,
        phone: userData.phone,
        active: true,
      });

      console.log(`✅ Created: ${user.fullName} (${user.role}) - ${user.email}`);
    } catch (error: any) {
      console.error(`❌ Error creating ${userData.email}:`, error.message);
    }
  }

  console.log('\n✨ User seeding complete!');
  process.exit(0);
}

seedUsers().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
