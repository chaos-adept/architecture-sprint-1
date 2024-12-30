import React, { lazy, Suspense, useState, useEffect }  from "react";
import Card from './Card';
import api from '../utils/api';
import '../blocks/places/places.css';
import '../blocks/card/card.css';

function CardsGrid({ currentUser, onCardClick }) {

    const [cards, setCards] = React.useState([]);

    console.log("cards grid");

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


    return (
        <section className="places page__section">
        <ul className="places__list">
          {cards.map((card) => (
            <Card
              currentUser={currentUser}
              key={card._id}
              card={card}
              onCardClick={onCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
          ))}
        </ul>
      </section>
    );
}

export default CardsGrid;