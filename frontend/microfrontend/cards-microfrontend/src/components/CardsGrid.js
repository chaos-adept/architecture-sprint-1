import React, { lazy, Suspense, useState, useEffect }  from "react";
import Card from './Card';
import api from '../utils/api';
import '../blocks/places/places.css';
import '../blocks/card/card.css';
import ImagePopup from "./ImagePopup";

function CardsGrid({ currentUser, onCardClick }) {

    const [cards, setCards] = React.useState([]);

    React.useEffect(() => {
        api
          .getCardList()
          .then((cardData) => {
            setCards(cardData.data);
          })
          .catch((err) => console.log(err));
      }, []);

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

    function onAddNewPlace({detail}) {
      
      setCards([detail, ...cards]);
    }

    const [selectedCard, setSelectedCard] = React.useState(null);

    function handleCardClick(card) {
      setSelectedCard(card);
      onCardClick(card)
    }

    React.useEffect(() => {
      addEventListener("on-new-place-added", onAddNewPlace);
      return () => removeEventListener("on-new-place-added", onAddNewPlace);
    });


    return (
        <section className="places page__section">
        <ul className="places__list">
          {cards.map((card) => (
            <Card
              currentUser={currentUser}
              key={card._id}
              card={card}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
          ))}
        </ul>
        <ImagePopup card={selectedCard} onClose={() => setSelectedCard(null)} />
      </section>
    );
}

export default CardsGrid;