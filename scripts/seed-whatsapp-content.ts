import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";
import { photos, announcements } from "../shared/schema";

dotenv.config();

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function seedWhatsAppContent() {
  console.log("🚀 Importing WhatsApp content...\n");

  try {
    // 1. Import photos from Garlaban hike (Jan 3, 2026)
    console.log("📸 Importing Garlaban hiking photos...");
    const garlabanPhotos = [
      { file: "3EB0661F1CC32E6B97724D.jpg", description: "Photo principale de la randonnée" },
      { file: "3EB0089ACD85AFBCC0255C.jpg", description: "Groupe en randonnée" },
      { file: "3EB0F7A68E1FC20C57593E.jpg", description: "Vue sur le Garlaban" },
      { file: "3EB0F68FD0604F392104EB.jpg", description: "Participants en marche" },
      { file: "3EB029B0309AD35E211D17.jpg", description: "Pause au sommet" },
      { file: "3EB0B627B937969BBB16B6.jpg", description: "Photo de groupe" },
      { file: "3EB04E7D9FB656E34245E7.jpg", description: "Retour de randonnée" },
    ];

    for (const photo of garlabanPhotos) {
      await db.insert(photos).values({
        title: "Randonnée familiale au Garlaban",
        description: photo.description,
        imageUrl: `/assets/whatsapp/${photo.file}`,
        category: "event",
      });
    }
    console.log(`  ✅ ${garlabanPhotos.length} photos imported\n`);

    // 2. Import outdoor training photos (Jan 10, 2026)
    console.log("📸 Importing outdoor training photos...");
    const trainingPhotos = [
      { file: "AC6328A99189D6101AA166A78CBC0772.jpg", description: "Jeunes Jokers à l'entraînement" },
      { file: "ACCF5DFC99953C3EAB822D525935D271.jpg", description: "Entraînement dans le froid" },
      { file: "ACA24E1154180673E1FB08A8848321AC.jpg", description: "Exercices en extérieur" },
      { file: "AC12769B219D45E5F81BFC184F0A7D7A.jpg", description: "Jokers à l'entraînement" },
    ];

    for (const photo of trainingPhotos) {
      await db.insert(photos).values({
        title: "Entraînement extérieur",
        description: photo.description,
        imageUrl: `/assets/whatsapp/${photo.file}`,
        category: "training",
      });
    }
    console.log(`  ✅ ${trainingPhotos.length} photos imported\n`);

    // 3. Import gym renovation photos (Jan 21, 2026)
    console.log("📸 Importing gym renovation photos...");
    const gymPhotos = [
      { file: "3A3EBBE38273641D30D5.jpg", description: "Travaux de réfection du sol" },
      { file: "3AA6CA0BF7579976EB9F.jpg", description: "Nouveau sol du gymnase" },
    ];

    for (const photo of gymPhotos) {
      await db.insert(photos).values({
        title: "Travaux gymnase du Charrel",
        description: photo.description,
        imageUrl: `/assets/whatsapp/${photo.file}`,
        category: "club",
      });
    }
    console.log(`  ✅ ${gymPhotos.length} photos imported\n`);

    // 4. Import BF1 diploma photos (Jan 29, 2026)
    console.log("📸 Importing BF1 diploma photos...");
    const bf1Photos = [
      { file: "3ABD2FE360F002B521B3.jpg", description: "Lilou - Diplôme BF1" },
      { file: "3ACCE4A8A4C6EA83235D.jpg", description: "Chab - Diplôme BF1" },
    ];

    for (const photo of bf1Photos) {
      await db.insert(photos).values({
        title: "Diplômes BF1 - Lilou & Chab",
        description: photo.description,
        imageUrl: `/assets/whatsapp/${photo.file}`,
        category: "club",
      });
    }
    console.log(`  ✅ ${bf1Photos.length} photos imported\n`);

    // 5. Create announcements
    console.log("📢 Creating announcements...");

    // Garlaban announcement
    await db.insert(announcements).values({
      title: "Randonnée familiale au Garlaban",
      content: `**Merci pour ce beau moment entre Jokers!**

Un grand merci à toutes les familles et participants qui étaient présents pour cette randonnée. Ce fut un moment convivial, simple et chaleureux, exactement dans l'esprit que l'on souhaite faire vivre au club.

📸 Retrouvez les photos dans la galerie!`,
      category: "General",
      isPublished: true,
      publishedAt: new Date("2026-01-03T12:00:00Z"),
    });

    // BF1 announcement
    await db.insert(announcements).values({
      title: "💜💛 Fierté du club : Lilou et Chab diplômés BF1 ! 💛💜",
      content: `Nous sommes très fiers d'annoncer que **Lilou et Chab** sont désormais diplômés du **Brevet Fédéral 1 – option roller** 🎓🛼

👉 Ce diplôme leur permet officiellement de :

💜 Encadrer et animer des séances de roller et de roller hockey
💜 Intervenir auprès des jeunes et des débutants
💜 Participer activement au développement et à la structuration sportive du club
💜 Transmettre les valeurs du roller : plaisir, sécurité, progression et esprit d'équipe

C'est une vraie reconnaissance de leur engagement, de leur sérieux et de leur investissement au service des Jokers 💪

👏 **Bravo à Lilou et Chab**, et merci pour ce que vous apportez déjà… et pour tout ce qui arrive !`,
      category: "General",
      isPublished: true,
      publishedAt: new Date("2026-01-29T10:00:00Z"),
    });

    // Gym renovation announcement
    await db.insert(announcements).values({
      title: "Reprise des entraînements au gymnase du Charrel",
      content: `**Bonne nouvelle !** 🎉

Les travaux de réfection du sol du gymnase du Charrel sont terminés. Nous avons repris les entraînements dans notre salle habituelle.

Les entraînements reprennent normalement selon les horaires habituels.

À très vite sur les terrains ! 💜💛`,
      category: "General",
      isPublished: true,
      publishedAt: new Date("2026-01-27T18:00:00Z"),
    });

    console.log("  ✅ 3 announcements created\n");

    console.log("✅ WhatsApp content import completed!");
    console.log("\n📊 Summary:");
    console.log(`  - ${garlabanPhotos.length + trainingPhotos.length + gymPhotos.length + bf1Photos.length} photos imported`);
    console.log("  - 3 announcements created");
    console.log("\n🌐 Next steps:");
    console.log("  1. Copy attached_assets/whatsapp/ to server: /var/www/jokers/dist/public/assets/whatsapp/");
    console.log("  2. Verify photos display correctly on the site");
    console.log("  3. Publish announcements on /actualites page");

  } catch (error) {
    console.error("❌ Error importing WhatsApp content:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

seedWhatsAppContent();
