import ContactForm from "@/components/ContactForm";
import ContactInfo from "@/components/ContactInfo";

export default function Contact() {
  return (
    <div>
      <section className="bg-card py-12 lg:py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une question ? Un projet d'inscription ? N'hésitez pas à nous contacter
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ContactForm />
          <ContactInfo />
        </div>
      </section>

      <section className="bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="aspect-video rounded-md overflow-hidden bg-muted">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2900.8!2d5.5689!3d43.2928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDE3JzM0LjEiTiA1wrAzNCcwOC4wIkU!5e0!3m2!1sfr!2sfr!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Carte de localisation du club"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
