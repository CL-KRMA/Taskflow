import Image from "next/image";
import "./contact.css";

// Import des logos (tu peux les placer dans /assets ou utiliser les RefIds téléchargés)
import whatsappLogo from "../app/assets/logos/whatsapp.png";
import telegramLogo from "../app/assets/logos/telegram.png";
import githubLogo from "../app/assets/logos/github.png";

export default function Contact() {
  return (
    <section className="contact-section">
      <h2 className="contact-title">📩 Me contacter</h2>
      <p className="contact-subtitle">
        Vous avez un projet ou une idée? Choisissez le moyen de contact qui vous convient.
      </p>

      <div className="contact-options">
        <a href="https://wa.me/224XXXXXXXX" target="_blank" rel="noopener noreferrer" className="contact-link">
          <Image src={whatsappLogo} alt="WhatsApp" className="contact-icon" />
          WhatsApp
        </a>
        <a href="https://t.me/Cl_devz" target="_blank" rel="noopener noreferrer" className="contact-link">
          <Image src={telegramLogo} alt="Telegram" className="contact-icon" />
          Telegram
        </a>
        <a href="https://github.com/CL-KRMA" target="_blank" rel="noopener noreferrer" className="contact-link">
          <Image src={githubLogo} alt="GitHub" className="contact-icon" />
          GitHub
        </a>
      </div>
    </section>
  );
}
