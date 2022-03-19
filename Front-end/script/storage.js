const STORAGE_KEY = "BOOKSHELF_APP";
let books = [];

function isStorageExist() {
   if(typeof(Storage) === undefined){
       alert("Your browser does not support local storage");
       return false;
   }
   return true;
}
 
function saveData() {
   const parsed = JSON.stringify(books);
   localStorage.setItem(STORAGE_KEY, parsed);
   document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
   const serializedData = localStorage.getItem(STORAGE_KEY);
   
   let data = JSON.parse(serializedData);
   
   if(data !== null)
       books = data;
 
    document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
   if(isStorageExist())
       saveData();
}

function composeBookObject(title, author, year, isCompleted) {
   return {
       id: +new Date(),
       title,
       author,
       year,
       isCompleted
   };
}

function findBook(bookId) {
   for(book of books){
       if(book.id === bookId)
           return book;
   }
   return null;
}
function findBookIndex(bookId) {
   let index = 0;
   for (book of books) {
       if(book.id === bookId)
           return index;
           index++;
        }
   return -1;
}

function loadDataFromBooks() {
    const listUncompleted = document.getElementById(UNCOMPLETED_BOOK_ID);
    const listCompleted = document.getElementById(COMPLETED_BOOK_ID);
  
    for(book of books){
        const newBook = makeBook(book.title, book.author, book.year, book.isCompleted);
        newBook[BOOK_ITEM_ID] = book.id;
  
        if(book.isCompleted){ 
            listCompleted.append(newBook);
        } else { 
            listUncompleted.append(newBook);
        }
    }
 }