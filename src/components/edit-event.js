import moment from "moment";
import flatpickr from "flatpickr";
import 'flatpickr/dist/flatpickr.min.css';
import AbstractSmartComponent from "./abstract-smart-component.js";
import {EmptyEvent} from '../controllers/point-controller.js';
import {getUpperCaseFirstLetter} from '../utils/common.js';
import {CITIES, getRandomCities, getRandomDescription, getRandomPhotos, getRandomServices} from "../mock/event.js";

import {TRAVEL_TRANSPORT, TRAVEL_ACTIVITY, Placeholder} from '../const.js';

const createEventsChooserMurkup = (choosers) => {
  return choosers.map((typeTransport) => {
    return (`<div class="event__type-item">
      <input id="event-type-${typeTransport}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeTransport}"
      >
      <label class="event__type-label  event__type-label--${typeTransport}" for="event-type-${typeTransport}-1">${getUpperCaseFirstLetter(typeTransport)}</label>
    </div>`);
  }).join(`\n`);
};

const getServices = (services) => {
  return services.map((service) => {
    return (`
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-${service.title}" type="checkbox" name="event-${service.title}"  ${service.isChecked ? `checked` : ``}>
        <label class="event__offer-label" for="event-${service.title}">
        <span class="event__offer-title">${service.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${service.price}</span>
        </label>
      </div>`
    );
  }).join(``);
};

const getPhotosList = (photos) => {
  return photos.map((photo) => {
    return (`<img class="event__photo" src="${photo}" alt="Event photo">`);
  }).join(``);
};

const getCities = (cities, elem) => {
  return cities.map((cityName) => {
    return (`<option value=${cityName} ${cityName === elem ? `selected` : ``}>${cityName}</option>`);
  }).join(``);
};

const createEditEventTemplate = (cardData, option) => {

  let creatingPoint = false;

  if (cardData === EmptyEvent) {
    creatingPoint = true;
  }
  const {start, end, price, isFavorite, index} = cardData;
  const {type, city, description, photos, services} = option;
  const startDate = moment(start).format(`DD/MM/YY HH:mm`);
  const endDate = moment(end).format(`DD/MM/YY HH:mm`);
  const servicesList = getServices(services);
  const photosList = getPhotosList(photos);
  const citiesList = getCities(CITIES, city);
  const isFavourite = isFavorite ? `checked` : ``;

  return (
    `<form class="event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${createEventsChooserMurkup(TRAVEL_TRANSPORT)}
              </fieldset>
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${createEventsChooserMurkup(TRAVEL_ACTIVITY)}
              </fieldset>
            </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
              ${getUpperCaseFirstLetter(type)} ${TRAVEL_TRANSPORT.includes(type) ? Placeholder.TRANSPORT : Placeholder.ACTION}
            </label>
          <select class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
          <datalist id="destination-list-1">
          ${citiesList}
          </datalist>
          </select>
        </div>
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDate}">
        </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${index}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${index}"  type="text" name="event-price" maxlength="5" value="${price}">
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${creatingPoint ? `Cancel` : `Delete`}</button>
        <input id="event-favorite-${index}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavourite}>
        <label class="event__favorite-btn ${creatingPoint ? `visually-hidden` : ``}" for="event-favorite-${index}">
          <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>
        ${creatingPoint ? `` : `
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`}
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${servicesList}
          </div>
        </section>
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>
          <div class="event__photos-container">
            <div class="event__photos-tape">
            ${photosList}
            </div>
          </div>
        </section>
      </section>
    </form>`
  );
};

const isDestinationInCitiesList = (citiesList, destination) => {
  return citiesList.some((city) => city === destination);
};

export default class EditEvent extends AbstractSmartComponent {
  constructor(cardData) {
    super();

    this._cardData = cardData;
    this._type = cardData.type;
    this._city = cardData.city;
    this._description = cardData.description;
    this._photos = cardData.photos;
    this._services = cardData.services;

    this._element = null;
    this._flatpickrStartDate = null;
    this._flatpickrEndDate = null;

    this._favoritesClickHandler = null;
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditEventTemplate(this._cardData, {
      type: this._type,
      city: this._city,
      description: this._description,
      services: this._services,
      photos: this._photos
    });
  }

  getData() {
    const form = this.getElement();
    return new FormData(form);
  }

  removeElement() {
    if (this._flatpickrStartDate || this._flatpickrEndDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrEndDate.destroy();
      this._flatpickrStartDate = null;
      this._flatpickrEndDate = null;
      this._clickHandler = null;
    }

    super.removeElement();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setFavoritesButtonClickHandler(this._favoritesClickHandler);
    this.setClickHandler(this._clickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  reset() {
    const cardData = this._cardData;

    this._type = cardData.type;
    this._city = cardData.city;
    this._description = cardData.description;
    this._photos = cardData.photos;
    this._services = cardData.services;

    this.rerender();
  }

  setClickHandler(handler) {
    const editEventButton = this.getElement().querySelector(`.event__rollup-btn`);
    if (editEventButton) {
      editEventButton.addEventListener(`click`, handler);
      this._clickHandler = handler;
    }
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }


  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, handler);
    this._favoritesClickHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const eventTypeButtons = element.querySelectorAll(`.event__type-input`);
    const destinationInputs = element.querySelectorAll(`.event__input--destination`);
    const submitButton = element.querySelector(`.event__save-btn`);

    eventTypeButtons.forEach((button) => {
      button.addEventListener(`click`, (evt) => {
        const type = evt.target.value;

        this._type = type[0].toUpperCase() + type.slice(1);
        this._offers = getRandomServices();
        this._city = getRandomCities();
        this._description = getRandomDescription();
        this._photos = getRandomPhotos();

        this.rerender();
      });
    });


    destinationInputs.forEach((input) => {
      input.addEventListener(`change`, () => {
        if (!isDestinationInCitiesList(CITIES, input.value)) {
          submitButton.disabled = true;
        } else {
          submitButton.disabled = false;
        }
      });
    });
  }

  _applyFlatpickr() {
    if (this._flatpickrStartDate || this._flatpickrEndDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrEndDate.destroy();
      this._flatpickrStartDate = null;
      this._flatpickrEndDate = null;
    }

    const element = this.getElement();
    const options = {
      allowInput: true,
      dateFormat: `d/m/y H:i`,
      minDate: this._cardData.start,
      enableTime: true
    };

    this._flatpickrStartDate = flatpickr(element.querySelector(`#event-start-time-1`), Object.assign({}, options, {defaultDate: this._cardData.start}));

    this._flatpickrEndDate = flatpickr(element.querySelector(`#event-end-time-1`), Object.assign({}, options, {defaultDate: this._cardData.end}));
  }
}
