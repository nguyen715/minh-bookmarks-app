import store from './store.js';
import api from './api.js';

const render = function (generatingFunction) {
  $('main').html(generatingFunction);
}

const generateStarRatingElement = function (bookmark) {
  let ratingImageString = `<div class="star-rating flex-item">`;

  for(let i=0; i<bookmark.rating; i++) {
    ratingImageString += `<img class="star filled-star" src="./images/star.png">`;
  }

  for(let i=0; i<5-bookmark.rating; i++) {
    ratingImageString += `<img class="star unfilled-star" src="./images/no-star.png">`;
  }

  ratingImageString += `</div>`;
return ratingImageString;
}

// helper function only meant to be used in generateBookmarkListString function
const generateBookmarkElement = function (bookmark) {
  let bookmarkElementString = `
    <div class="bookmark-element" data-id="${bookmark.id}" tabindex="0">
      <div class="bookmark-section">
        <div>Title:</div>
        <div>${bookmark.title}</div>
      </div>  
      <div class="bookmark-rating bookmark-section">
        <div class="flex-item">Rating:</div>
        ${generateStarRatingElement(bookmark)}
      </div>
  `;

  if(bookmark.expanded) {
    bookmarkElementString += `
      <div class="bookmark-section">
          <div>Description:</div>
          <div>${bookmark.desc}</div>
        </div>
        <div class="bookmark-section">
          <div class="bookmark-link" onclick="event.stopPropagation()"><a href="${bookmark.url}">Visit Site</a></div>
        </div>
        <div class="bookmark-buttons bookmark-section" onclick="event.stopPropagation()">
          <!-- disable edit button for now
          <img class="flex-item edit-button" src="./images/edit-button.png" alt="Edit Button">
          -->
          <button class="flex-item delete-button"><img src="./images/delete-button.png" alt="Delete Button"></button>
        </div>    
    `;
  }

  else {
    bookmarkElementString += `
      <span class="expand-prompt">(Click to expand)</span>
    `;
  }

  bookmarkElementString += `
    </div>
  `;

  return bookmarkElementString;
};

const generateBookmarkListString = function (bookmarkList) {

  // filter list of bookmarks to the ones with rating >= user's rating filter selection
  let list = bookmarkList.filter(bookmark => bookmark.rating >= store.state.filter);
  
  // change list to array of html strings
  list = list.map(bookmark => generateBookmarkElement(bookmark));

  // smush list together into a single html string
  return list.join('');
};

const generateMainView = function () {
  return `
  <div id="main-wrapper">
    <div>
      <button id="create-button" alt="Create New Bookmark"><img src="./images/create-button2.png"></button>
    </div>

    <div>
      <select name="filter-results" id="filter-results">
        <option value="0">Filter results</option>
        <option value="1">1-star +</option>
        <option value="2">2-stars +</option>
        <option value="3">3-stars +</option>
        <option value="4">4-stars +</option>
        <option value="5">5 stars</option>
      </select>
    </div>

    ${generateBookmarkListString(store.bookmarks)}
  </div>
  `;
}

const generateCreateView = function () {
  return `
    <div id="create-view">
      <h2>Create a new bookmark</h2>
      <form id="create-form" action="" method="post">
        <div class="form-field">
          <label for="title">Title:</label>
          <input type="text" name="title" id="title" required>
        </div>      
        <div class="form-field">
          <label for="url">URL:</label>
          <input type="url" name="url" id="url" required>
        </div>
        <div class="form-field">
          <label for="description">Description:</label>
          <textarea name="description" id="description" placeholder="(optional)"></textarea>
        </div>
        <div class="form-field">
          <label for="rating">Rating:</label>
          <select name="rating" id="rating" required>      
            <option value="">Select one</option>
            <option value="1">1-star</option>
            <option value="2">2-stars</option>
            <option value="3">3-stars</option>
            <option value="4">4-stars</option>
            <option value="5">5-stars</option>
          </select>
        </div>
        <div class="form-field button-section">
          <input type="image" id="cancel-button" src="./images/cancel-button.png" alt="Cancel Button" formnovalidate>
          <input type="image" id="save-button" src="./images/save-button.png" alt="Save Button">
        </div>
      </form>
    </div>
  `;
}

const generateEditView = function (bookmark) {
  return `
    <div id="edit-view" class="bookmark-element" data-id="${bookmark.id}">
      <h2>Create a new bookmark</h2>
      <form id="edit-form" action="" method="post">
        <div class="form-field">
          <label for="title">Title:</label>
          <input type="text" name="title" id="title" value="${bookmark.title}" required>
        </div>      
        <div class="form-field">
          <label for="url">URL:</label>
          <input type="url" name="url" id="url" value="${bookmark.url}" required>
        </div>
        <div class="form-field">
          <label for="description">Description:</label>
          <textarea name="description" id="description" value="${bookmark.desc}"></textarea>
        </div>
        <div class="form-field">
          <label for="rating">Rating:</label>
          <select name="rating" id="rating" value="${bookmark.rating}" required>      
            <option value="">Select one</option>
            <option value="1">1-star</option>
            <option value="2">2-stars</option>
            <option value="3">3-stars</option>
            <option value="4">4-stars</option>
            <option value="5">5-stars</option>
          </select>
        </div>
        <div class="form-field button-section">
          <input type="image" id="cancel-button" src="./images/cancel-button.png" alt="Cancel Button" formnovalidate>
          <input type="image" id="save-button" src="./images/save-button.png" alt="Save Button">
        </div>
      </form>
    </div>
  `;
}

const getBookmarkIdFromElement = function (element) {
  return $(element)
    .closest('.bookmark-element')
    .data('id');
};

const handleRatingFilterChange = function () {
  $('main').on('change', '#filter-results', event => {
    let filterSelection = parseInt($(event.target).val());
    store.state.filter = filterSelection;
    render(generateMainView);
  });
}

const handleExpandToggleClick = function () {
  $('main').on('click', '.bookmark-element', event => {
    let id = getBookmarkIdFromElement($(event.currentTarget));
    let currentBookmark = store.bookmarks.find(bookmark => bookmark.id === id);
    currentBookmark.expanded = !currentBookmark.expanded;
    render(generateMainView);
  });

  //for keyboard accessibility
  $('main').on('keypress', '.bookmark-element', event => {
    let id = getBookmarkIdFromElement($(event.currentTarget));
    let currentBookmark = store.bookmarks.find(bookmark => bookmark.id === id);
    currentBookmark.expanded = !currentBookmark.expanded;
    render(generateMainView);
  });
}

const handleEditButtonClick = function () {
  $('.bookmark-element').on("click", '.edit-button', event => {
    store.state.editing = true;
    // const id = getBookmarkIdFromElement(event.currentTarget);
    const id = $(event.currentTarget).closest('.bookmark-element').data('id');
    // let currentBookmarkId = $(event.currentTarget).data('id');
    // let newData = {

    // }    

    // get the current bookmark attached to this edit button click

    render(generateEditView);
  });
}

const handleDeleteButtonClick = function () {
  $('main').on('click', '.delete-button', event => {
    const id = getBookmarkIdFromElement(event.target);
    api.deleteBookmark(id)
    .then( () => {
      store.findAndDelete(id);
    })
    .then( () => {
      render(generateMainView);
    });
  });
  
  // keyboard accessibility
  $('main').on('keypress', '.delete-button', event => {
    const id = getBookmarkIdFromElement(event.target);
    api.deleteBookmark(id)
    .then( () => {
      store.findAndDelete(id);
    })
    .then( () => {
      render(generateMainView);
    });
  });
}

const handleCancelButtonClick = function () {
  $('main').on('click', '#cancel-button', event => {
    store.state.creating = false;
    store.state.editing = false;
    render(generateMainView);
  });
}

const handleSaveButtonClick = function () {
  // user clicked on create button
  // if(store.state.creating) {
    $('main').on('submit', '#create-form', event => {
      event.preventDefault();
      let title = $('#title').val();
      let url = $('#url').val();
      let desc = $('#description').val();
      let rating = parseInt($('#rating').val());
      let expanded = false;

      let newBookmark = {title,url,desc,rating,expanded};

      api.createBookmark(newBookmark)
      .then( (data) => {
        store.addBookmark(data);
        render(generateMainView);
      });
    });
  // }

  // user clicked on edit button
  // else if(store.state.editing) {
  //   $('#edit-form').submit(event => {
  //     event.preventDefault();

  //     // const id = $(event.currentTarget).closest('.bookmark-data').data('id');
  //     const id = getBookmarkIdFromElement(event.target);
  //     console.log('store.state.editing is true, and bookmark id is:' + id);

  //     // let title = $('#title').val();
  //     // let url = $('#url').val();
  //     // let desc = $('#description').val();
  //     // let rating = parseInt($('#rating').val());

  //     // let newBookmark = {title,url,desc,rating};

  //     let newData = {
  //       title : $('#title').val(),
  //       url : $('#url').val(),
  //       desc : $('#description').val(),
  //       rating : parseInt($('#rating').val())
  //     }

  //     store.findAndUpdate(id, newData);
  //     store.addBookmark(newBookmark);
  //     api.createBookmark(newBookmark)
  //     .then(() => render(generateMainView));
  //   });
  // };
}

const handleCreateButtonClick = function () {
  $('main').on('click', '#create-button', event => {
    store.state.creating = true;
    render(generateCreateView);
  });
}

const bindEventListeners = function () {
  handleRatingFilterChange();
  handleExpandToggleClick();
  handleCreateButtonClick();
  handleEditButtonClick();
  handleDeleteButtonClick();
  handleCancelButtonClick();
  handleSaveButtonClick();
}

export default{
    generateMainView,
    bindEventListeners,
    render
};