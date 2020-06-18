import views from "./views.js";
import api from "./api.js";
import store from "./store.js";

// const testBookmark = {
//     // id: "8sdfbvbs65sd",
//     title: "Nick & Minh's Quiz App",
//     url: "https://thinkful-ei-panda.github.io/quiz-app-minh-nick/",
//     desc: "An awesome Marvel trivia quiz",
//     rating: 5,
//     expanded: false
//   };

// store.bookmarks.push(testBookmark);

const main = function() {
  let bookmarks = api.getBookmarks()
  .then(response => {
    // set expanded value of each bookmark to false by default
    console.log(response);
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