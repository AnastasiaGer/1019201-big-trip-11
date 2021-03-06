import AbstractComponent from "./abstract-component.js";
import moment from "moment";

const createCardTemplate = (date, index) => {

  let dayInfo = ``;

  if (date && index) {
    const fullDate = moment(date).format(`YYYY-MM-DDThh:mm`);
    const month = moment(date).format(`MMM`);
    const day = moment(date).format(`DD`);

    dayInfo = `<span class="day__counter">${index}</span>
    <time class="day__date" datetime="${fullDate}">${month} ${day}</time>`;
  }

  return (
    `<li class="trip-days__item  day">
       <div class="day__info">${dayInfo}</div>
      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class DayNumber extends AbstractComponent {
  constructor(date, index) {
    super();

    this._date = date;
    this._index = index;
  }

  getTemplate() {
    return createCardTemplate(this._date, this._index);
  }
}
