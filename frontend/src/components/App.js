import React, { lazy, Suspense, useState, useEffect }  from "react";
import { Route, useHistory, Switch } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import InfoTooltip from "./InfoTooltip";
import Main from "./Main";
import * as auth from "../utils/auth.js";
import ProtectedRoute from "./ProtectedRoute.js";


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

const AddPlacePopup = lazy(() => import('cards_microfrontend/AddPlacePopup').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
}));

export function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);

  // В корневом компоненте App создана стейт-переменная currentUser. Она используется в качестве значения для провайдера контекста.
  const [currentUser, setCurrentUser] = React.useState({});

  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
  const [tooltipStatus, setTooltipStatus] = React.useState("");

  const [jwt, setJwt] = useState(localStorage.getItem("jwt"));
  const isLoggedIn = !!jwt;

  const history = useHistory();


  // при монтировании App описан эффект, проверяющий наличие токена и его валидности
  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          setCurrentUser(res.data);
          history.push("/");
        })
        .catch((err) => {
          localStorage.removeItem("jwt");
          history.push("/signin");
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
  }

  function handleUpdateUser({ detail }) {
    setCurrentUser(detail);
    closeAllPopups();
  }

  function handleAddPlaceSubmit(e) {
    e.preventDefault();
    dispatchEvent(new CustomEvent("on-submit-new-place"));
  }

  function onHandleRegister() {
    setTooltipStatus("success");
    setIsInfoToolTipOpen(true);
    history.push("/signin");
  }

  function onSignOut() {
    // при вызове обработчика onSignOut происходит удаление jwt
    localStorage.removeItem("jwt");
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

  function handleFailedOperation({}) {
    setTooltipStatus("fail");
    setIsInfoToolTipOpen(true);
  }

  //todo подумать над тем что бы убрать event, и перевести на калббеки как более простые решения
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


  return (<>
      <div className="page__content">
        <Header email={currentUser.email} onSignOut={onSignOut} />
        <Switch>
        <ProtectedRoute 
            exact loggedIn={isLoggedIn} path="/" component={() => 
              <Main
                  currentUser={currentUser}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
              />}>
          </ProtectedRoute>
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
        <PopupWithForm
          isOpen={isAddPlacePopupOpen} 
          onSubmit={handleAddPlaceSubmit} 
          onClose={closeAllPopups} 
          title="Новое место" 
          name="new-card"
        >   
          <Suspense>
            <AddPlacePopup onPlaceAdded={closeAllPopups} />
          </Suspense>
        </PopupWithForm>
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
        <InfoTooltip
          isOpen={isInfoToolTipOpen}
          onClose={closeAllPopups}
          status={tooltipStatus}
        />
      </div>
      </>
  );
}

export default App;
