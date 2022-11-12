import view from "./view";
import icons from "url:../../img/icons.svg";

class PaginationView extends view {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );

    const next =
      // prettier-ignore
      `
        <button data-goto = ${curPage + 1} class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>`;

    const back =
      // prettier-ignore
      `
        <button data-goto = ${curPage - 1} class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
        `;

    //first page & others
    if (curPage === 1 && numPages > 1) {
      return next;
    }

    //last page
    if (curPage === numPages && numPages > 1) {
      return back;
    }

    //other page
    if (curPage < numPages) {
      return `
        ${back}
        ${next}
      `;
    }

    //only one page
    return "";
  }
}

export default new PaginationView();
