import React, { useState, useRef, useEffect } from 'react';
import './Messagerie.css';

export default function Messagerie() {
  const [messages, setMessages] = useState({});
  const [messageAEnvoye, setmessageAEnvoye] = useState('');
  const [lesContacts, setlesContacts] = useState(null);
  const [rechercherContact, setrechercherContact] = useState('');
  const [contacts] = useState([
    'Moussa Soumah', 'Fanta Sylla', 'Alya Kourouma', 'Marie Guilavogui',
    'Boutouraby Kouyaté', 'Fatoumata Binta Bialo', 'Youssouf Keita', 
    'Eladj Mamadou Saliou Bella Baldé'
  ]);
  const [selectionnerMessage, setselectionnerMessage] = useState(null);
  const [messageEstModifier, setmessageEstModifier] = useState(false);
  const [editMessageValue, setEditMessageValue] = useState('');
  const [contextMenuPosition, setContextMenuPosition] = useState(null);

  const messageRefs = useRef([]);
  const contextMenuRef = useRef(null);
  const containerRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target) &&
          containerRef.current && !containerRef.current.contains(event.target) &&
          messagesRef.current && !messagesRef.current.contains(event.target)) {
        setContextMenuPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (event) => {
    setmessageAEnvoye(event.target.value);
  };

  const formatDate = (date) => {
    const annees = date.getFullYear();
    const mois = String(date.getMonth() + 1).padStart(2, '0');
    const jours = String(date.getDate()).padStart(2, '0');
    const heurs = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${annees}-${mois}-${jours} ${heurs}:${minutes}`;
  };

  const handleSendMessage = () => {
    if (messageAEnvoye.trim() && lesContacts) {
      const nouveauMessage = {
        ...messages,
        [lesContacts]: [
          ...(messages[lesContacts] || []),
          { text: messageAEnvoye, sender: 'user', date: formatDate(new Date()) }
        ]
      };
      setMessages(nouveauMessage);
      setmessageAEnvoye('');
  
      setTimeout(() => {
        const messageDeReponse = {
          text: 'Merci pour votre message, nous reviendrons vers vous rapidement.',
          sender: 'other',
          date: formatDate(new Date())
        };
  
        const modifierMessage = {
          ...nouveauMessage,
          [lesContacts]: [...nouveauMessage[lesContacts], messageDeReponse]
        };
        setMessages(modifierMessage);
      }, 1000);
    }
  };
  
  

  const handleSelectContact = (contact) => {
    setlesContacts(contact);
    setselectionnerMessage(null);
    setmessageEstModifier(false);
  };

  const handleSelectMessage = (index) => {
    if (selectionnerMessage === index) {
      setselectionnerMessage(null);
      setmessageEstModifier(false);
      setContextMenuPosition(null);
    } else {
      setselectionnerMessage(index);
      setmessageEstModifier(false);

      const messageElement = messageRefs.current[index];
      const rect = messageElement.getBoundingClientRect();
      setContextMenuPosition({
        top: rect.bottom + window.scrollY + 5,
      });
    }
  };

  const handleDeleteMessage = () => {
    const modifierMessage = messages[lesContacts].filter((_, i) => i !== selectionnerMessage);
    setMessages({ ...messages, [lesContacts]: modifierMessage });
    setselectionnerMessage(null);
    setContextMenuPosition(null);
  };

  const handleEditMessage = () => {
    setmessageEstModifier(true);
    setEditMessageValue(messages[lesContacts][selectionnerMessage].text);
  };  

  const handleSaveEdit = () => {
    const modifierMessage = messages[lesContacts].map((msg, index) => 
      index === selectionnerMessage ? { ...msg, text: editMessageValue } : msg
    );
    setMessages({ ...messages, [lesContacts]: modifierMessage });
    setmessageEstModifier(false);
    setselectionnerMessage(null);
    setContextMenuPosition(null);
  };

  const handleEditChange = (event) => {
    setEditMessageValue(event.target.value);
  };  

  const handleSearchChange = (event) => {
    setrechercherContact(event.target.value);
  };

  const filtrerLesContacts = contacts.filter((contact) =>
    contact.toLowerCase().includes(rechercherContact.toLowerCase())
  );

  return (
    <div className='messagerieContainer' ref={containerRef}>
      <div className='contactsList'>
        <div className='divRechercheContact'>
          <h3>Messages</h3>
          <form action="#">
            <input
              type="text"
              placeholder='Rechercher...'
              className='rechercheContact'
              value={rechercherContact}
              onChange={handleSearchChange}
            />
          </form>
        </div>
        <div className='divContact'>
          {filtrerLesContacts.map((contact, index) => (
            <div
              key={index}
              className={`contact ${lesContacts === contact ? 'contact2' : ''}`}
              onClick={() => handleSelectContact(contact)}
            >
              {contact}
            </div>
          ))}
        </div>
      </div>
      <div className='conteneurMessagerie'>
        <div className='messages' ref={messagesRef}>
          {lesContacts && messages[lesContacts] ? (
            messages[lesContacts].map((message, index) => (
              <div
                key={index}
                className={`messageContainer ${message.sender}`}
                ref={(el) => (messageRefs.current[index] = el)}
              >
                <div
                  className={`message ${message.sender}`}
                  onClick={() => handleSelectMessage(index)}
                >
                  <div className='divMessage'>
                    <p>{message.text}</p>
                    <span className='messageDate'>{message.date}</span>
                  </div>
                  <div className='divMenuContextuel'>
                    {selectionnerMessage === index && contextMenuPosition && (
                      <div
                        className='messageOptions'
                        style={{ top: contextMenuPosition.top }}
                        ref={contextMenuRef}
                      >
                        <button onClick={handleDeleteMessage} className='msgObtn'>Supprimer</button>
                        <button onClick={handleEditMessage} className='msgObtn'>Modifier</button>
                        <button onClick={() => alert('Informations du message')} className='msgObtn'>Informations</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className='pasMassage'>Sélectionnez un contact pour voir la conversation.</p>
          )}
        </div>
        {lesContacts && (
          <div className='inputArea'>
            {messageEstModifier ? (
              <div className='editArea'>
                <input
                  type='text'
                  value={editMessageValue}
                  onChange={handleEditChange}
                  placeholder='Modifier le message...'
                  className='taperMessage'
                />
                <button onClick={handleSaveEdit} className='msgBtn'>Sauvegarder</button>
              </div>
            ) : (
              <>
                <input
                  className='taperMessage' 
                  type='text'
                  value={messageAEnvoye}
                  onChange={handleChange}
                  placeholder='Tapez votre message...'
                />
                <button onClick={handleSendMessage} className='msgBtn'>Envoyer</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}  