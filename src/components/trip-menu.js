import {createElement} from "../utils.js";

const createTripMenuTemplate = (names) => {
  return (`
    <h2 class="visually-hidden">Switch trip view</h2>
    <nav class="trip-controls__trip-tabs  trip-tabs">
    ${names.map((name) => {
      return (`
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">${name}</a>
    `);
    }).join(``)}
    </nav>
  `);
};

export default class Menu {
  constructor(names) {
    this._names = names;
    this._element = null;
  }

  getTemplate() {
    return createTripMenuTemplate(this._names);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
