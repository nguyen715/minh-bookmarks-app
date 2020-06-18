// array of bookmark objects
let bookmarks = [];

// state variables to decide if we need to render view for creating or editing bookmarks
let state = {
    creating : false,
    editing : false,
    filter : 0,
    error : null
};

// pass in id of bookmark object being searched for, return that bookmark object
const findById = function (id) {
    return this.bookmarks.find(currentBookmark => currentBookmark.id === id);
  }

// pass in bookmark object, add it to bookmarks array
const addBookmark = function (bookmark) {
  this.bookmarks.push(bookmark);
}

// find bookmark object with a given id, update it's information according to newData
const findAndUpdate = function (id, newData) {
  let myBookmark = this.findById(id);
  Object.assign(myBookmark, newData);
}

// remove bookmark object with specified id from bookmarks array
const findAndDelete = function (id) {
  this.bookmarks = this.bookmarks.filter(currentBookmark => currentBookmark.id.toString() !== id.toString());
}

export default {
    bookmarks,
    state,
    findById,
    addBookmark,
    findAndUpdate,
    findAndDelete
};