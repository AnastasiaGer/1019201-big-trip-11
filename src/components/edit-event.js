import 'flatpickr/dist/flatpickr.min.css';
import {EmptyEvent} from '../controllers/point-controller.js';
import {getUpperCaseFirstLetter, clearString} from '../utils/common.js';
import {TRAVEL_TRANSPORT, TRAVEL_ACTIVITY, Placeholder} from '../const.js';
import AbstractSmartComponent from "./abstract-smart-component.js";
import flatpickr from "flatpickr";
import moment from "moment";
import Stock from '../models/stock.js';

const OFFER_NAME_PREFIX = `event-offer-`;

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

const createEventsChooserMurkup = (choosers) => {
  return choosers.map((typeTransport) => {
    return (`<div class="event__type-item">
      <input id="event-type-${typeTransport}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeTransport}"
      >
      <label class="event__type-label  event__type-label--${typeTransport}" for="event-type-${typeTransport}-1">${getUpperCaseFirstLetter(typeTransport)}</label>
    </div>`);
  }).join(`\n`);
};

const getOffers = (selectedOffers, offers) => {
  return offers.map((offer) => {
    const {title, price} = offer;
    const type = title.replace(/\s+/g, ``);
    const status = selectedOffers.findIndex((it) => it.title === title) !== -1 ? `checked` : ``;
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-1" type="checkbox" name="${OFFER_NAME_PREFIX}${type}" ${status}>
        <label class="event__offer-label" for="event-offer-${type}-1">
          <span class="event__offer-title">${title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  })
  .join(`\n`);
};

const getPhotosList = (photos) => {
  return photos.map((photo) => {
    return (`<img class="event__photo" src="${photo.src}" alt="${photo.description}">`);
  }).join(``);
};

const getCities = (citiesName, elem) => {
  return citiesName.map((cityName) => {
    return (`<option value="${cityName}" ${cityName === elem ? `selected` : ``}>${cityName}</option>`);
  }).join(``);
};

const createEditEventTemplate = (point, options) => {
  const {start, end, price, isFavorite, index} = point;
  const {type, city, description, photos, offers, externalData} = options;

  let creatingPoint = false;

  if (point === EmptyEvent) {
    creatingPoint = true;
  }

  const cities = Stock.getDestinations().map((destination) => destination.name);
  const offersOfCurrentType = [].concat(...Stock.getOffers().filter((offer) => offer.type === type).map((offer) => offer.offers));

  const startDate = moment(start).format(`DD/MM/YY HH:mm`);
  const endDate = moment(end).format(`DD/MM/YY HH:mm`);
  const offersList = getOffers(offers, offersOfCurrentType);
  const photosList = getPhotosList(photos);
  const citiesList = getCities(cities, city);
  const isFavourite = isFavorite ? `checked` : ``;
  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;

  return (
    `<form class="event  event--edit" action="#" method="post">
      <header class="event__header">
      <input class="visually-hidden" name="event-current-type" id="event-current-type-name" value="${type}">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
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
        <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
        <button class="event__reset-btn" type="reset">${creatingPoint ? `Cancel` : deleteButtonText}</button>
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
      ${offers.length > 0 || description.length > 0 ?
      `<section class="event__details">
        ${offers.length >= 0 ?
      `<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${offersList}
          </div>
        </section>` : ``}
        ${description.length > 0 ?
      `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>
          ${photos.length > 0 ?
      `<div class="event__photos-container">
            <div class="event__photos-tape">
            ${photosList}
            </div>
          </div>` : ``}
        </section>` : ``}
      </section>` : ``}
    </form>`
  );
};
export default class EventEdit extends AbstractSmartComponent {
  constructor(point, mode) {
    super();
    this._mode = mode;
    this._point = point;
    this._type = point.type;
    this._city = point.city;
    this._price = point.price;
    this._description = point.description;
    this._photos = point.photos;
    this._externalData = DefaultData;
    this._allOffers = Stock.getOffers();
    this._offers = point.offers;
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
    return createEditEventTemplate(this._point, {
      type: this._type,
      city: this._city,
      description: this._description,
      photos: this._photos,
      offers: this._offers,
      externalData: this._externalData
    },
    this._mode
    );
  }

  getData() {
    const form = this.getElement();
    return new FormData(form);
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
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

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setFavoritesButtonClickHandler(this._favoritesClickHandler);
    this.setClickHandler(this._clickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  reset() {
    const point = this._point;
    this._type = point.type;
    this._offers = point.offers;
    this._city = point.city;
  }

  setClickHandler(handler) {
    const element = this.getElement().querySelector(`.event__rollup-btn`);
    if (element) {
      element.addEventListener(`click`, handler);
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

  disableForm() {
    const form = this.getElement();
    const elements = Array.from(form.elements);
    elements.forEach((elm) => {
      elm.readOnly = true;
    });
  }

  activeForm() {
    const form = this.getElement();
    const elements = Array.from(form.elements);
    elements.forEach((elm) => {
      elm.readOnly = false;
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    element.querySelector(`.event__type-list`).addEventListener(`change`, (evt) => {
      this._type = evt.target.value;
      this._offers = Stock.getOffers();

      this.rerender();
    });

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      this._city = evt.target.value;
      this._photos = Stock.getDestinations().find((destination) => destination.name === this._city).pictures;
      this._description = Stock.getDestinations().find((destination) => destination.name === this._city).description;

      this.rerender();
    });

    element.querySelector(`.event__input--price`).addEventListener(`input`, (evt) => {
      evt.target.value = clearString(evt.target.value);
    });

    element.querySelector(`#event-start-time-1`).addEventListener(`change`, (evt) => {
      const endDateInput = element.querySelector(`#event-end-time-1`);
      endDateInput.value = evt.target.value;
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
      minDate: this._point.start,
      enableTime: true
    };

    this._flatpickrStartDate = flatpickr(element.querySelector(`#event-start-time-1`), Object.assign({}, options, {defaultDate: this._point.start}));

    this._flatpickrEndDate = flatpickr(element.querySelector(`#event-end-time-1`), Object.assign({}, options, {defaultDate: this._point.end}));
  }
}
