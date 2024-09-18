import './footer.css'

const Footer = () => {

  return (
    <div className='foot'>
      <div className='foot-container'>
        <div className='foot1'>
          <section>
            <h2>Contacts</h2>
            <p>Adresse: lorem</p>
            <p>Téléphone: lorem</p>
            <a href="mail: mail@gmail.com" className='mailien'>E-mail: lorem@gmail.com</a>
          </section>
        </div>

        <div className='foot2'>
          <section className='cmtSection'>
            <h2>Des sugestions??</h2>
            <input type="email" name="" id="" className='cmtMail' placeholder='E-mail' required />
            <textarea name="" id="" className='cmtFoot' placeholder='Commentaire...' required></textarea>
            <button type="submit" className='btnCmtFoot'>Envoyer</button>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Footer;
