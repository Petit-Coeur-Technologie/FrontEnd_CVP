import { useState } from 'react';
import './footer.css';
import "boxicons/css/boxicons.min.css";

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
        <div className='foot1'>
          {/* Section Contacts */}
          <section className='ctcSection'>
            <h2 className='titreContact'>Contacts</h2>
            <p className='localisation'>Adresse: 123 Rue Lorem, Ipsum City</p>
            <p className='tel'>Téléphone: +123 456 789</p>
            <a href="mailto:lorem@gmail.com" className='mailien'>E-mail: lorem@gmail.com</a>
          </section>

          <section className='socialSection'>
            <h2 className='titreSocial'>Suivez-nous</h2>
            <div className='socialIcons'>
              <a href="#" className='socialIcon'> <i className='bx bxl-facebook iconeFoot' style={{ color: '#fdb024' }} ></i></a>
              <a href="#" className='socialIcon'><i className='bx bxl-instagram iconeFoot' style={{ color: '#fdb024' }} ></i></a>
              <a href="#" className='socialIcon'><i className='bx bxl-linkedin iconeFoot' style={{ color: '#fdb024' }}  ></i></a>
              <a href="#" className='socialIcon'><i className='bx bxl-twitter iconeFoot' style={{ color: '#fdb024'}} ></i> </a>
            </div>
          </section>

          <section className='cmtSection'>
            <h2 className='feedback'>Feedback</h2>
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

        </div>

        {/* Liste de raccourcis */}
      <div className="foot2">
        <ul className='ulLinks'>
          <li className='liLinks'><a href="#aide" className='listeLinks'>Aide</a></li>
          <li className='liLinks'><a href="#apropos" className='listeLinks'>À propos</a></li>
          <li className='liLinks'><a href="#services" className='listeLinks'>Services</a></li>
          <li className='liLinks'><a href="#conditions" className='listeLinks'>Conditions et règles d'utilisation</a></li>
        </ul>
      </div>

      {/* Section Copyright */}
      <div className="foot3">
        <p className='copyright'>&copy; 2024 Ville Propre. Tous droits réservés.</p>
      </div>

      </div>
    </div>
  );
};

export default Footer;