//imports
import view from "./view";
import previewView from "./previewView.js";
import icons from "url:../../img/icons.svg";

class ResultsView extends view {
  _parentElement = document.querySelector(".results");
  _errorMessage = "No recipes found for your query! Please try again ;)";
  _message = "success message";

  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new ResultsView();
