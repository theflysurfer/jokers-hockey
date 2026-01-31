import pkg from 'pg';
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

async function seedWhatsAppPhotos() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  console.log("🚀 Importing WhatsApp photos...\n");

  try {
    // 1. Photos randonnée Garlaban (7 photos)
    console.log("📸 Randonnée Garlaban...");
    const garlabanPhotos = [
      { file: "3EB0661F1CC32E6B97724D.jpg", desc: "Photo principale" },
      { file: "3EB0089ACD85AFBCC0255C.jpg", desc: "Groupe en marche" },
      { file: "3EB0F7A68E1FC20C57593E.jpg", desc: "Vue panoramique" },
      { file: "3EB0F68FD0604F392104EB.jpg", desc: "Participants" },
      { file: "3EB029B0309AD35E211D17.jpg", desc: "Pause au sommet" },
      { file: "3EB0B627B937969BBB16B6.jpg", desc: "Photo de groupe" },
      { file: "3EB04E7D9FB656E34245E7.jpg", desc: "Retour" },
    ];

    const garlabanPhotoIds: string[] = [];
    for (const photo of garlabanPhotos) {
      const result = await pool.query(
        `INSERT INTO photos (title, description, image_url, category)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        ["Randonnée Garlaban", photo.desc, `/assets/whatsapp/${photo.file}`, "event"]
      );
      garlabanPhotoIds.push(result.rows[0].id);
    }

    // Créer annonce randonnée
    const garlabanResult = await pool.query(
      `INSERT INTO announcements (title, content, category, is_published, published_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        "Randonnée familiale au Garlaban",
        `**Merci pour ce beau moment entre Jokers!**

Un grand merci à toutes les familles et participants qui étaient présents pour cette randonnée. Ce fut un moment convivial, simple et chaleureux, exactement dans l'esprit que l'on souhaite faire vivre au club.`,
        "General",
        true,
        new Date("2026-01-03T12:00:00Z"),
      ]
    );

    const garlabanAnnouncementId = garlabanResult.rows[0].id;

    // Lier photos à l'annonce
    for (let i = 0; i < garlabanPhotoIds.length; i++) {
      await pool.query(
        `INSERT INTO announcement_photos (announcement_id, photo_id, display_order)
         VALUES ($1, $2, $3)`,
        [garlabanAnnouncementId, garlabanPhotoIds[i], i]
      );
    }
    console.log(`  ✅ ${garlabanPhotos.length} photos + 1 annonce\n`);

    // 2. Photos entraînement extérieur (4 photos)
    console.log("📸 Entraînement extérieur...");
    const trainingPhotos = [
      { file: "AC6328A99189D6101AA166A78CBC0772.jpg", desc: "Jeunes à l'entraînement" },
      { file: "ACCF5DFC99953C3EAB822D525935D271.jpg", desc: "Dans le froid" },
      { file: "ACA24E1154180673E1FB08A8848321AC.jpg", desc: "Exercices" },
      { file: "AC12769B219D45E5F81BFC184F0A7D7A.jpg", desc: "Session complète" },
    ];

    const trainingPhotoIds: string[] = [];
    for (const photo of trainingPhotos) {
      const result = await pool.query(
        `INSERT INTO photos (title, description, image_url, category)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        ["Entraînement extérieur", photo.desc, `/assets/whatsapp/${photo.file}`, "training"]
      );
      trainingPhotoIds.push(result.rows[0].id);
    }

    // Créer annonce entraînement
    const trainingResult = await pool.query(
      `INSERT INTO announcements (title, content, category, is_published, published_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        "Courage à nos jeunes Jokers!",
        `Même dans le froid, nos jeunes s'entraînent avec détermination. Bravo pour votre motivation! 💪❄️`,
        "General",
        true,
        new Date("2026-01-10T18:00:00Z"),
      ]
    );

    const trainingAnnouncementId = trainingResult.rows[0].id;

    for (let i = 0; i < trainingPhotoIds.length; i++) {
      await pool.query(
        `INSERT INTO announcement_photos (announcement_id, photo_id, display_order)
         VALUES ($1, $2, $3)`,
        [trainingAnnouncementId, trainingPhotoIds[i], i]
      );
    }
    console.log(`  ✅ ${trainingPhotos.length} photos + 1 annonce\n`);

    // 3. Photos travaux gymnase (2 photos)
    console.log("📸 Travaux gymnase...");
    const gymPhotos = [
      { file: "3A3EBBE38273641D30D5.jpg", desc: "Réfection en cours" },
      { file: "3AA6CA0BF7579976EB9F.jpg", desc: "Nouveau sol" },
    ];

    const gymPhotoIds: string[] = [];
    for (const photo of gymPhotos) {
      const result = await pool.query(
        `INSERT INTO photos (title, description, image_url, category)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        ["Travaux gymnase", photo.desc, `/assets/whatsapp/${photo.file}`, "team"]
      );
      gymPhotoIds.push(result.rows[0].id);
    }

    // Créer annonce travaux
    const gymResult = await pool.query(
      `INSERT INTO announcements (title, content, category, is_published, published_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        "Reprise des entraînements au gymnase du Charrel",
        `**Bonne nouvelle!** 🎉

Les travaux de réfection du sol du gymnase du Charrel sont terminés. Nous avons repris les entraînements dans notre salle habituelle.

À très vite sur les terrains! 💜💛`,
        "General",
        true,
        new Date("2026-01-27T18:00:00Z"),
      ]
    );

    const gymAnnouncementId = gymResult.rows[0].id;

    for (let i = 0; i < gymPhotoIds.length; i++) {
      await pool.query(
        `INSERT INTO announcement_photos (announcement_id, photo_id, display_order)
         VALUES ($1, $2, $3)`,
        [gymAnnouncementId, gymPhotoIds[i], i]
      );
    }
    console.log(`  ✅ ${gymPhotos.length} photos + 1 annonce\n`);

    // 4. Photos diplômes BF1 (2 photos)
    console.log("📸 Diplômes BF1...");
    const bf1Photos = [
      { file: "3ABD2FE360F002B521B3.jpg", desc: "Lilou - Diplôme BF1" },
      { file: "3ACCE4A8A4C6EA83235D.jpg", desc: "Chab - Diplôme BF1" },
    ];

    const bf1PhotoIds: string[] = [];
    for (const photo of bf1Photos) {
      const result = await pool.query(
        `INSERT INTO photos (title, description, image_url, category)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        ["Diplôme BF1", photo.desc, `/assets/whatsapp/${photo.file}`, "team"]
      );
      bf1PhotoIds.push(result.rows[0].id);
    }

    // Créer annonce BF1
    const bf1Result = await pool.query(
      `INSERT INTO announcements (title, content, category, is_published, published_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        "💜💛 Fierté du club : Lilou et Chab diplômés BF1 ! 💛💜",
        `Nous sommes très fiers d'annoncer que **Lilou et Chab** sont désormais diplômés du **Brevet Fédéral 1 – option roller** 🎓🛼

👉 Ce diplôme leur permet officiellement de :

💜 Encadrer et animer des séances de roller et de roller hockey
💜 Intervenir auprès des jeunes et des débutants
💜 Participer activement au développement et à la structuration sportive du club
💜 Transmettre les valeurs du roller : plaisir, sécurité, progression et esprit d'équipe

C'est une vraie reconnaissance de leur engagement, de leur sérieux et de leur investissement au service des Jokers 💪

👏 **Bravo à Lilou et Chab**, et merci pour ce que vous apportez déjà… et pour tout ce qui arrive !`,
        "General",
        true,
        new Date("2026-01-29T10:00:00Z"),
      ]
    );

    const bf1AnnouncementId = bf1Result.rows[0].id;

    for (let i = 0; i < bf1PhotoIds.length; i++) {
      await pool.query(
        `INSERT INTO announcement_photos (announcement_id, photo_id, display_order)
         VALUES ($1, $2, $3)`,
        [bf1AnnouncementId, bf1PhotoIds[i], i]
      );
    }
    console.log(`  ✅ ${bf1Photos.length} photos + 1 annonce\n`);

    console.log("✅ Import terminé!");
    console.log("\n📊 Résumé:");
    console.log("  - 15 photos importées");
    console.log("  - 4 annonces créées");
    console.log("  - Photos liées aux annonces via announcement_photos");

  } catch (error) {
    console.error("❌ Erreur:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

seedWhatsAppPhotos();
