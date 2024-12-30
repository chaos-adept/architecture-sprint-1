import React, { lazy, Suspense, useState, useEffect }  from "react";
import { Route, useHistory, Switch } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import AddPlacePopup from "./AddPlacePopup";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/auth.js";


const Login = lazy(() => import('auth_microfrontend/Login').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
}));

const Register = lazy(() => import('auth_microfrontend/Register').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
}));

const EditProfilePopup = lazy(() => import('profile_microfrontend/EditProfilePopup').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
}));

const EditAvatarPopup = lazy(() => import('profile_microfrontend/EditAvatarPopup').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
}));

const ProfileInlineBlock = lazy(() => import('profile_microfrontend/ProfileInlineBlock').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
}));

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cards, setCards] = React.useState([]);

  // В корневом компоненте App создана стейт-переменная currentUser. Она используется в качестве значения для провайдера контекста.
  const [currentUser, setCurrentUser] = React.useState({});

  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
  const [tooltipStatus, setTooltipStatus] = React.useState("");

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  //В компоненты добавлены новые стейт-переменные: email — в компонент App
  const [email, setEmail] = React.useState("");

  const [jwt, setJwt] = useState('');

  const history = useHistory();

  // Запрос к API за информацией о пользователе и массиве карточек выполняется единожды, при монтировании.
  React.useEffect(() => {
    api
      .getAppInfo()
      .then(([cardData, userData]) => {
        console.log(userData.data);
        setCurrentUser(userData.data);
        setCards(cardData.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // при монтировании App описан эффект, проверяющий наличие токена и его валидности
  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          setEmail(res.data.email);
          setIsLoggedIn(true);
          history.push("/");
        })
        .catch((err) => {
          localStorage.removeItem("jwt");
          console.log(err);
        });
    }
  }, [history, jwt]);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleSubmitProfileClick(e) {
    e.preventDefault();
    dispatchEvent(new CustomEvent("on-submit-profile"));
  }

  function handleSubmitAvatarClick(e) {
    e.preventDefault();
    dispatchEvent(new CustomEvent("on-submit-avatar"));
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsInfoToolTipOpen(false);
    setSelectedCard(null);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser({ detail }) {
    setCurrentUser(detail);
    closeAllPopups();
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .removeCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .addCard(newCard)
      .then((newCardFull) => {
        setCards([newCardFull, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function onHandleRegister() {
    setTooltipStatus("success");
    setIsInfoToolTipOpen(true);
    history.push("/signin");
  }

  function onSignOut() {
    // при вызове обработчика onSignOut происходит удаление jwt
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    // После успешного вызова обработчика onSignOut происходит редирект на /signin
    history.push("/signin");
  }

  const handleJwtChange = ({detail}) => { // Эта функция получает нотификации о событиях изменения jwt
    console.log("handleJwtChange", detail);
    setJwt(detail.token);
    localStorage.setItem("jwt", detail.token);
  }

  useEffect(() => {
    addEventListener("jwt-change", handleJwtChange); // Этот код добавляет подписку на нотификации о событиях изменения localStorage
    return () => removeEventListener("jwt-change", handleJwtChange) // Этот код удаляет подписку на нотификации о событиях изменения localStorage, когда в ней пропадает необходимость
  }, []);

  function handleOnLogin({ email }) {
    setIsLoggedIn(true);
    setEmail(email);
    history.push("/");
  }

  function handleFailedOperation({}) {
    setTooltipStatus("fail");
    setIsInfoToolTipOpen(true);
  }

  //todo подумать над тем что бы убрать event, и перевести на калббеки как более простые решения
  useEffect(() => {
    addEventListener("on-login", handleOnLogin);
    return () => removeEventListener("on-login", handleOnLogin)
  }, []);

  useEffect(() => {
    addEventListener("on-error-login", handleFailedOperation); 
    return () => removeEventListener("on-error-login", handleFailedOperation)
  }, []);
  
  useEffect(() => {
    addEventListener("on-register", onHandleRegister);
    return () => removeEventListener("on-register", onHandleRegister) 
  }, []);

  useEffect(() => {
    addEventListener("on-error-register", handleFailedOperation); 
    return () => removeEventListener("on-error-register", handleFailedOperation)
  }, []);

  useEffect(() => {
    addEventListener("on-profile-updated", handleUpdateUser);
    return () => removeEventListener("on-profile-updated", handleUpdateUser) 
  }, []);

  return (
    // В компонент App внедрён контекст через CurrentUserContext.Provider
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__content">
        <Header email={email} onSignOut={onSignOut} />
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            component={Main}
            ProfileInlineBlock={(props) => <Suspense> <ProfileInlineBlock currentUser={currentUser} {...props} /> </Suspense>}
            cards={cards}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            loggedIn={isLoggedIn}
          />
          <Route path="/signup">
            <Suspense>
              <Register />
            </Suspense>
          </Route>
          <Route path="/signin">
            <Suspense>
              <Login />
            </Suspense>
          </Route>
        </Switch>
        <Footer />
        <PopupWithForm
          isOpen={isEditProfilePopupOpen} 
          title="Редактировать профиль" name="edit"
          onSubmit={handleSubmitProfileClick}
          onClose={closeAllPopups}
        >
            <Suspense>
              <EditProfilePopup currentUser={currentUser} />
            </Suspense>
        </PopupWithForm>
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onAddPlace={handleAddPlaceSubmit}
          onClose={closeAllPopups}
        />
        <PopupWithForm title="Вы уверены?" name="remove-card" buttonText="Да" />
        <PopupWithForm
          isOpen={isEditAvatarPopupOpen}
          onSubmit={handleSubmitAvatarClick}
          onClose={closeAllPopups}
          title="Обновить аватар"
          name="edit-avatar"
        >
          <Suspense>
            <EditAvatarPopup
                      isOpen={isEditAvatarPopupOpen}
                      onClose={closeAllPopups}
                    />
          </Suspense>
        </PopupWithForm>
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoTooltip
          isOpen={isInfoToolTipOpen}
          onClose={closeAllPopups}
          status={tooltipStatus}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
