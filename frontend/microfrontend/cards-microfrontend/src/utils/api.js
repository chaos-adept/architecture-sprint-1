class Api {

  get _token() {
    return localStorage.getItem("jwt");
  }

  constructor({ address }) {
    this._address = address;
  }

  getAppInfo() {
    return Promise.all([this.getCardList(), this.getUserInfo()]);
  }

  getCardList() {
    return fetch(`${this._address}/cards`, {
      headers: {
        'Authorization': `Bearer ${this._token}`,
      },
    })
      .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`));
  }

  addCard({ name, link }) {
    return fetch(`${this._address}/cards`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this._token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        link,
      }),
    })
      .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`));
  }

  removeCard(cardID) {
    return fetch(`${this._address}/cards/${cardID}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this._token}`,
      },
    })
      .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`));
  }

  getUserInfo() {
    return fetch(`${this._address}/users/me`, {
      headers: {
        'Authorization': `Bearer ${this._token}`,
      },
    })
      .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`));
  }

  setUserInfo({ name, about }) {
    return fetch(`${this._address}/users/me`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this._token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        about,
      }),
    })
      .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`));
  }

  setUserAvatar({ avatar }) {
    return fetch(`${this._address}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this._token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        avatar,
      }),
    })
      .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`));
  }

  changeLikeCardStatus(cardID, like) {
    // Обычная реализация: 2 разных метода для удаления и постановки лайка.
    return fetch(`${this._address}/cards/like/${cardID}`, {
      method: like ? 'PUT' : 'DELETE',
      headers: {
        'Authorization': `Bearer ${this._token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`));
  }
}

const api = new Api({
  address: 'http://localhost:3100'
});

export default api;
