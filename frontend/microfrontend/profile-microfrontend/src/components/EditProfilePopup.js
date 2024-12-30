import React, { useEffect } from 'react';
import api from "../utils/api";

//fixme есть проблема со стилями, микрофронтенд определяет стили, которые находятся в другом модуле, надо задать этот вопрос наверное в пачке
//fixme другая проблема в том, что сюда передеается юзер через пропы, что сильно увеличивает связанность с хостом, надо подумать как это развязать
function EditProfilePopup({ user }) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  const currentUser = user;

  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setDescription(currentUser.about);
    }
  }, [currentUser]);

  function handleSubmit(e) {
    e.preventDefault();

    api
    .setUserInfo({ name, about:description })
    .then(({data}) => {
      dispatchEvent(new CustomEvent("on-profile-updated", {
        detail: data}));
    })
    .catch((err) => console.log(err));
  }

  useEffect(()=>{
    addEventListener("on-submit-profile", handleSubmit);
    return () => removeEventListener("on-submit-profile", handleSubmit);
  });

  return (
      <>
      <label className="popup__label">
        <input type="text" name="userName" id="owner-name"
               className="popup__input popup__input_type_name" placeholder="Имя"
               required minLength="2" maxLength="40" pattern="[a-zA-Zа-яА-Я -]{1,}"
               value={name || ''} onChange={handleNameChange} />
        <span className="popup__error" id="owner-name-error"></span>
      </label>
      <label className="popup__label">
        <input type="text" name="userDescription" id="owner-description"
               className="popup__input popup__input_type_description" placeholder="Занятие"
               required minLength="2" maxLength="200"
               value={description || ''} onChange={handleDescriptionChange} />
        <span className="popup__error" id="owner-description-error"></span>
      </label>
      </>
  );
}

export default EditProfilePopup;
