export default class Formator {
  constructor() {}

  setDateFormat(date) {
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
  }
}