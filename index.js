import views from "./views.js";
import api from "./api.js";
import store from "./store.js";

const main = function() {
  let bookmarks = api.getBookmarks()
  .then(response => {
    // set expanded value of each bookmark to false by default
    response.forEach(bookmark => {
      bookmark.expanded = false;
      store.addBookmark(bookmark);
      views.render(views.generateMainView);
    });
    views.render(views.generateMainView);
    views.bindEventListeners();
  });
}

$(main);