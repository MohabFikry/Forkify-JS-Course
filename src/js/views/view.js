//imports
import icons from "url:../../img/icons.svg";

export default class View {
  _data;

  //DOM updating algorithm
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    //get new DOM and current DOM to compare
    const newDOM = document.createRange().createContextualFragment(newMarkup); //get fragments of DOM to be
    const newElements = Array.from(newDOM.querySelectorAll("*")); //extract elements from fragments
    const curElements = Array.from(this._parentElement.querySelectorAll("*")); //extract elements from current parent to compare
    //Compare and replate textcontent
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //check changes -- if contains text
      if (
        !newEl.isEqualNode(curEl) &&
        curEl.firstChild?.nodeValue.trim() !== "" //nodeValue checks for text
      )
        //replace textcontent
        curEl.textContent = newEl.textContent;
      //change attributes to control style
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }
  /**
   *
   * @param {object} data
   * @param {object[]} render
   * @returns markup
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  //render spinner
  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }
}
