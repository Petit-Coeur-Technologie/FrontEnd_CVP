import { useState } from 'react';
import './footer.css';

const Footer = () => {
  const [formData, setFormData] = useState({ email: '', commentaire: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Simulation de l'envoi de formulaire
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ email: '', commentaire: '' });
    }, 3000); // réinitialisation après 3 secondes
  };

  return (
    <div className='foot'>
      <div className='foot-container'>
        {/* Section Contacts */}
        <div className='foot1'>
          <section className='ctcSection'>
            <h2>Contacts</h2>
            <p>Adresse: 123 Rue Lorem, Ipsum City</p>
            <p>Téléphone: +123 456 789</p>
            <a href="mailto:lorem@gmail.com" className='mailien'>E-mail: lorem@gmail.com</a>
          </section>

          <section className='socialSection'>
            <h2>Suivez-nous</h2>
            <div className='socialIcons'>
              <a href="#" className='socialIcon'>Facebook</a>
              <a href="#" className='socialIcon'>Twitter</a>
              <a href="#" className='socialIcon'>LinkedIn</a>
            </div>
          </section>

        </div>

      </div>

      <div className='foot2'>
        <section className='cmtSection'>
          <h3>Feedback</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className='cmtMail'
              placeholder='E-mail'
              required
            />
            <textarea
              name="commentaire"
              value={formData.commentaire}
              onChange={handleChange}
              className='cmtFoot'
              placeholder='Commentaire...'
              required
            />
            <button type="submit" className='btnCmtFoot' disabled={isSubmitted}>
              {isSubmitted ? 'Envoyé !' : 'Envoyer'}
            </button>
          </form>
        </section>

        {/* Liste de raccourcis */}
        <div className="shortcuts">
          <ul>
            <li><a href="#aide">Aide</a></li>
            <li><a href="#apropos">À propos</a></li>
            <li><a href="#services">Services</a></li>
          </ul>
        </div>

        {/* Section Copyright */}
        <div className="copyright">
          <p>&copy; 2024 Ville Propre. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;