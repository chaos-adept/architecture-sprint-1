import { Suspense, lazy } from 'react';

const ProfileInlineBlock = lazy(() => import('profile_microfrontend/ProfileInlineBlock').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
}));

const CardsGrid = lazy(() => import('cards_microfrontend/CardsGrid').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
}));

const Main = ({ currentUser, onEditProfile, onAddPlace, onEditAvatar }) => {
  return (
    <main className="content">
      <Suspense>
        <ProfileInlineBlock 
          currentUser={currentUser}
          onEditProfile={onEditProfile}
          onAddPlace={onAddPlace} 
          onEditAvatar={onEditAvatar} />
      </Suspense>
      <Suspense>
        <CardsGrid currentUser={currentUser} />
      </Suspense>
    </main>
  );
};

export default Main;