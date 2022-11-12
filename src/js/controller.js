// import
import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import bookmarksView from "./views/bookmarksView.js";
import paginationView from "./views/paginationView.js";
import addRecipeView from "./views/addRecipeView.js";
import { async } from "regenerator-runtime";
import bookmarksView from "./views/bookmarksView.js";

if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    //get id from hash for fetch and stop function if no ID fond
    const id = window.location.hash.slice(1);
    ///////////////////////////// Test IDs ///////////////////////////////////////////
    //5ed6604691c37cdc054bd016 - 5ed6604591c37cdc054bcae1 - 5ed6604591c37cdc054bcd09//
    //////////////////////////////////////////////////////////////////////////////////
    if (!id) return;
    //loading spinner
    recipeView.renderSpinner();
    //update bookmarks style
    bookmarksView.update(model.state.bookmarks);
    //1)load recipe
    await model.loadRecipe(id);
    //2)render recipe
    recipeView.render(model.state.recipe);
    //update results style
    resultsView.update(model.getSearchResultsPage());
  } catch (err) {
    // alert(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    //render spinner
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlAddBookmark = function () {
  //add and delete bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //add book marks in the list
  bookmarksView.render(model.state.bookmarks);
  recipeView.update(model.state.recipe);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlUpload = async function (newRecipe) {
  try {
    //RENDER SPINNER
    addRecipeView.renderSpinner();
    await model.uploadRcipe(newRecipe);
    //render new recipe
    recipeView.render(model.state.recipe);
    //show success message
    addRecipeView.renderMessage();
    //render bookmars
    bookmarksView.render(model.state.bookmarks);
    //update page URL with new ID
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    //close window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

//publisher subscriber pattern to handle event in view module through controller
const init = function () {
  bookmarksView.addHandlerBookmarks(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlUpload);
};

init();
