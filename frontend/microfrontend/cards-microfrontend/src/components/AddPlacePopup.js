import React from 'react';
import api from '../utils/api';

function AddPlacePopup({onPlaceAdded}) {
  const [name, setName] = React.useState('');
  const [link, setLink] = React.useState('');

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleLinkChange(e) {
    setLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    api.addCard({
      name,
      link
    })
    .then((newCardFull) => {
      onPlaceAdded(newCardFull.data);
      dispatchEvent(new CustomEvent("on-new-place-added", { detail: newCardFull.data }));
    })
    .catch((err) => console.log(err));
  }

  React.useEffect(() => {
    addEventListener("on-submit-new-place", handleSubmit);
    return () => removeEventListener("on-submit-new-place", handleSubmit);
  });

  return (<>
      <label className="popup__label">
        <input type="text" name="name" id="place-name"
               className="popup__input popup__input_type_card-name" placeholder="Название"
               required minLength="1" maxLength="30" value={name} onChange={handleNameChange} />
        <span className="popup__error" id="place-name-error"></span>
      </label>
      <label className="popup__label">
        <input type="url" name="link" id="place-link"
               className="popup__input popup__input_type_url" placeholder="Ссылка на картинку"
               required value={link} onChange={handleLinkChange} />
        <span className="popup__error" id="place-link-error"></span>
      </label>
      </>
  );
}

export default AddPlacePopup;
