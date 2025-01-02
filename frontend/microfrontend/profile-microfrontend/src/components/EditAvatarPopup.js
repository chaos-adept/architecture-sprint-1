import React, { useEffect } from 'react';
import api from "../utils/api";

function EditAvatarPopup({}) {
  const inputRef = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();

    api
    .setUserAvatar({
      avatar: inputRef.current.value,
    })
    .then(({data}) => {
      dispatchEvent(new CustomEvent("on-profile-updated", {
        detail: data}));
    })
    .catch((err) => console.log(err));
  }

  useEffect(()=>{
    addEventListener("on-submit-avatar", handleSubmit);
    return () => removeEventListener("on-submit-avatar", handleSubmit);
  });

  return (
      <label className="popup__label">
        <input type="url" name="avatar" id="owner-avatar"
               className="popup__input popup__input_type_description" placeholder="Ссылка на изображение"
               required ref={inputRef} />
        <span className="popup__error" id="owner-avatar-error"></span>
      </label>
  );
}

export default EditAvatarPopup;
