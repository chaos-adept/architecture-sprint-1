import React, { lazy, Suspense, useState, useEffect }  from "react";
import Card from './Card';

function Main({ cards, onEditProfile, onAddPlace, onEditAvatar, onCardClick, onCardLike, onCardDelete, ProfileInlineBlock, currentUser }) {

  return (
    <main className="content">
      <ProfileInlineBlock onEditProfile={onEditProfile} onAddPlace={onAddPlace} onEditAvatar={onEditAvatar} />
      <section className="places page__section">
        <ul className="places__list">
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;
