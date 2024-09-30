import React, { useState,useRef, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendrier.css';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export default function Calendrier() {
  const [date, setDate] = useState(new Date());
  const [heurEvenement, setheurEvenement] = useState(''); // Heure de l'événement
  const [events, setEvents] = useState([]);
  const [voirPopup, setvoirPopup] = useState(false);
  const [popupTypeExcelWord, setpopupTypeExcelWord] = useState(''); // 'excel' or 'word'
  const [descriptionEvenement, setdescriptionEvenement] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [chercheEvenement, setchercheEvenement] = useState('');
  const [checkboxSelectionEventSupp, setcheckboxSelectionEventSupp] = useState([]);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [popupSuppEvenements, setpopupSuppEvenements] = useState(''); // 'supprimerToutEvenement' or 'supprimerEvenementSelectionn'

  const textareaRef = useRef(null); // Référence pour le textarea
  const heurInputRef = useRef(null); // Référence pour l'input de l'heure

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleAjouterEvenement = () => {
    setEditIndex(null);
    setdescriptionEvenement('');
    setvoirPopup(true);
    setTimeout(() => textareaRef.current.focus(), 0); // Placer le curseur dans le textarea
  };

  const handleModifierEvenement = (index) => {
    setEditIndex(index);
    setdescriptionEvenement(events[index].description); // Mettre à jour la description de l'évènement
    setheurEvenement(events[index].date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); // Mettre à jour l'heure
    setvoirPopup(true);
    setTimeout(() => textareaRef.current.focus(), 0); // Placer le curseur dans le textarea pour modifier
  };  

  const handleSupprimerEvenement2 = (index) => {
    setEventToDelete(index); // Définir l'événement à supprimer
    setvoirPopup(true); // Afficher le popup de confirmation
  };  

  const confirmSuppressionEvenement = () => {
    const updatedEvents = events.filter((_, i) => i !== eventToDelete);
    setEvents(updatedEvents);
    setEventToDelete(null); // Réinitialiser l'événement à supprimer
    setvoirPopup(false); // Fermer le popup
  }; 

  const cancelSuppressionEvenement = () => {
    setEventToDelete(null); // Réinitialiser l'événement à supprimer
    setvoirPopup(false); // Fermer le popup
  };  

  const handleValiderEvenement = () => {
        if (!descriptionEvenement) {
      textareaRef.current.focus(); // Placer le curseur dans le textarea si la description est vide
      return;
    }
    if (!heurEvenement) {
      heurInputRef.current.focus(); // Placer le curseur dans l'input de l'heure si l'heure n'est pas renseignée
      return;
    }

        if (descriptionEvenement && heurEvenement) {
      const eventDateTime = new Date(date);
      const [hours, minutes] = heurEvenement.split(':');
      eventDateTime.setHours(parseInt(hours, 10));
      eventDateTime.setMinutes(parseInt(minutes, 10));

      if (editIndex !== null) {
        const modifierEvenement = events.map((event, i) =>
          i === editIndex ? { ...event, description: descriptionEvenement, date: eventDateTime } : event
        );
        setEvents(modifierEvenement);
      } else {
        setEvents([...events, { date: eventDateTime, description: descriptionEvenement }]);
      }
      setdescriptionEvenement('');
      setheurEvenement(''); // Réinitialiser l'heure après la soumission
      setvoirPopup(false);
    }
  };  

  const handleAnnulerEvenement = () => {
    setdescriptionEvenement('');
    setvoirPopup(false);
    setpopupSuppEvenements(''); // Réinitialiser l'état lorsque le popup est fermé
  };

  const handleSupprimerEvenement = (index) => {
    const modifierEvenement = events.filter((_, i) => i !== index);
    setEvents(modifierEvenement);
  };

  const handleSelectionCheckboxPourLaSuppression = (index) => {
    setcheckboxSelectionEventSupp(prevSelected =>
      prevSelected.includes(index)
        ? prevSelected.filter(i => i !== index)
        : [...prevSelected, index]
    );
  };

  const handleDeletecheckboxSelectionEventSupp = () => {
    const modifierEvenement = events.filter((_, i) => !checkboxSelectionEventSupp.includes(i));
    setEvents(modifierEvenement);
    setcheckboxSelectionEventSupp([]);
  };

  const handlesupprimerToutEvenements = () => {
    const modifierEvenement = events.filter(event => new Date(event.date).toDateString() !== date.toDateString());
    setEvents(modifierEvenement);
  };

  const handleActionChange = (event) => {
    const value = event.target.value;
    if (value === 'supprimerToutEvenement' || value === 'supprimerEvenementSelectionn') {
      setpopupSuppEvenements(value);
      setvoirPopup(true);
    } else {
      setpopupSuppEvenements(''); // Réinitialiser l'état si l'option par défaut est sélectionnée
    }
  };

  const handleConfirmActionSuppression = () => {
    if (popupSuppEvenements === 'supprimerToutEvenement') {
      handlesupprimerToutEvenements();
    } else if (popupSuppEvenements === 'supprimerEvenementSelectionn') {
      handleDeletecheckboxSelectionEventSupp();
    }
    setpopupSuppEvenements(''); // Réinitialiser l'état après confirmation
    setvoirPopup(false);
  };

  const getEventsForDate = (date) => {
    return events.filter(event => new Date(event.date).toDateString() === date.toDateString());
  };

  const filtrerEvenement = getEventsForDate(date).filter(event =>
    event.description.toLowerCase().includes(chercheEvenement.toLowerCase())
  );

  const highlightDates = () => {
    return events.map(event => new Date(event.date).toDateString());
  };

  // Export to Excel
  const exporterEvenementEnExcel = () => {
    const dateSelectionner = events.filter(event => 
      new Date(event.date).toDateString() === date.toDateString()
    );

    const ws = XLSX.utils.json_to_sheet(dateSelectionner.map(e => ({
      Date: e.date.toDateString(),
      Description: e.description
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Events');
    XLSX.writeFile(wb, 'events.xlsx');
  };

  // Export to Word
  const exporterEvenementEnWord = () => {
    const dateSelectionner = events.filter(event => 
      new Date(event.date).toDateString() === date.toDateString()
    );

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: `Events for ${date.toDateString()}`,
              heading: HeadingLevel.HEADING_1,
            }),
            ...dateSelectionner.map(event =>
              new Paragraph({
                children: [
                  new TextRun(`Date: ${event.date.toDateString()}`),
                  new TextRun({
                    text: ` - Description: ${event.description}`,
                    bold: true,
                  }),
                ],
              })
            ),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'events.docx';
      link.click();
    }).catch(error => {
      console.error('Erreur d\'exportation en Word:', error);
    });
  };

  const handleExportSelection = (event) => {
    const value = event.target.value;
    if (value === 'excel' || value === 'word') {
      setpopupTypeExcelWord(value);
      setvoirPopup(true);
    }
  };

  const handleConfirmExportation = () => {
    if (popupTypeExcelWord === 'excel') {
      exporterEvenementEnExcel();
    } else if (popupTypeExcelWord === 'word') {
      exporterEvenementEnWord();
    }
    setpopupTypeExcelWord(''); // Réinitialiser le type de popup après l'exportation
    setvoirPopup(false);
  }; 

  return (
    <div className='conteneurCalendrier'>
      <div className='calendarContainer'>
        <Calendar
          onChange={handleDateChange}
          value={date}
          tileClassName={({ date }) =>
            highlightDates().includes(date.toDateString()) ? 'highlight' : null
          }
        />
        <div className="calendarbottom-btn">
            <button onClick={handleAjouterEvenement} className='cal-btm-btn'>Ajouter un événement</button>
            <select onChange={handleExportSelection} className='cal-btm-btn exportSelect'>
              <option value=''>Exportation</option>
              <option value='excel'>Exporter en Excel</option>
              <option value='word'>Exporter en Word</option>
            </select>
        </div>
      </div>

      <div className='listeEvenement'>
        <div className='lesEvenements'>
          <h3>Événements pour {date.toDateString()}</h3>
          <div className="searchevent-wrapper">
                <input
                  type='text'
                  placeholder='Rechercher des événements...'
                  value={chercheEvenement}
                  onChange={(e) => setchercheEvenement(e.target.value)}
                  className='chercherEvenement'
                />
          </div>
          <div className='divSuppTousSelection'>
            <select onChange={handleActionChange} className='actionSelectionne' value={popupSuppEvenements}>
              <option value=''>Actions</option>
              <option value='supprimerToutEvenement'>Supprimer tous</option>
              <option value='supprimerEvenementSelectionn'>Supprimer les sélectionnés</option>
            </select>
          </div>
        </div>
        {filtrerEvenement.length > 0 ? (
          <ul>
            {filtrerEvenement.map((event, index) => (
              <li key={index} className='eventItem'>
                <input
                  type='checkbox'
                  checked={checkboxSelectionEventSupp.includes(index)}
                  onChange={() => handleSelectionCheckboxPourLaSuppression(index)}
                  className='checkboxSelectionEventSupp'
                />
                <span className='descriptionEvenement'>{`${event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${event.description}`}</span>
                <div className='eventActions'>
                  <button onClick={() => handleModifierEvenement(index)} className='btnModifierUnEvenement'>Modifie</button>
                  <button onClick={() => handleSupprimerEvenement2(index)} className='btnSupprimerUnEvenement'>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun événement pour cette date.</p>
        )}
      </div>

      {voirPopup && (
  <div className='popupConteneurExportationmere'>
    <div className='popupConteneurfille'>
      {popupTypeExcelWord ? (
        <>
          <h3>Confirmation</h3>
          <p>Valider l'exportation en {popupTypeExcelWord === 'excel' ? 'Excel' : 'Word'} ?</p>
          <button onClick={handleConfirmExportation} className='btnPopupValider'>Valider</button>
          <button onClick={handleAnnulerEvenement} className='btnPopupAnnuler'>Annuler</button>
        </>
      ) : popupSuppEvenements ? (
        <>
          <h3>Confirmation</h3>
          <p>Êtes-vous sûr de vouloir {popupSuppEvenements === 'supprimerToutEvenement' ? 'supprimer tous les événements pour cette date ?' : 'supprimer les événements sélectionnés ?'}</p>
          <button onClick={handleConfirmActionSuppression} className='btnPopupValider'>Oui</button>
          <button onClick={handleAnnulerEvenement} className='btnPopupAnnuler'>Non</button>
        </>
      ) : eventToDelete !== null ? (
        <>
          <h3>Confirmation</h3>
          <p>Voulez-vous supprimer cet événement ?</p>
          <button onClick={confirmSuppressionEvenement} className='btnPopupValider'>Oui</button>
          <button onClick={cancelSuppressionEvenement} className='btnPopupAnnuler'>Non</button>
        </>
      ) : (
        <>
          <h3>{editIndex !== null ? 'Modifier l\'événement' : 'Ajouter un événement'}</h3>
          <textarea
            type='text'
            ref={textareaRef}
            value={descriptionEvenement}
            onChange={(e) => setdescriptionEvenement(e.target.value)}
            placeholder="Description de l'événement"
            className='textareaPourAjouterEvenement'
          />
          <input
            type='time'
            ref={heurInputRef}
            value={heurEvenement}
            onChange={(e) => setheurEvenement(e.target.value)}
            className='heurEvenementInput'
          />
          <button onClick={handleValiderEvenement} className='btnPopupValider'>Valider</button>
          <button onClick={handleAnnulerEvenement} className='btnPopupAnnuler'>Annuler</button>
        </>
      )}
    </div>
  </div>
)}
    </div>
  );
}
