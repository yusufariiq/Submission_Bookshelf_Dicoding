const UNCOMPLETED_BOOK_ID = "unread";
const COMPLETED_BOOK_ID ="read";
const BOOK_ITEM_ID = "itemId";

const addBook = () => {
    const uncompletedBook = document.getElementById(UNCOMPLETED_BOOK_ID);
    const inputTitle = document.getElementById('title').value;
    const inputAuthor = document.getElementById('author').value;
    const inputYear = document.getElementById('year').value;
    
    const book = makeBook(inputTitle, inputAuthor, inputYear, false)
    const bookObject = composeBookObject(inputTitle, inputAuthor, inputYear, false)
    
    book[BOOK_ITEM_ID] = bookObject.id;
    books.push(bookObject);
    
    uncompletedBook.append(book)
    updateDataToStorage();
}

const makeBook = (title, author, year, isCompleted) => {
    const bookTitle = document.createElement("h3");
    bookTitle.classList.add("title");
    bookTitle.innerText = title;

    const bookAuthor = document.createElement("p");
    bookAuthor.classList.add("author");
    bookAuthor.innerText = author;

    const bookYear = document.createElement("p");
    bookYear.classList.add("year")
    bookYear.innerText = year;

    const bookContainer = document.createElement("div");
    bookContainer.classList.add("book_item")
    bookContainer.append(bookTitle,bookAuthor,bookYear);

    if(isCompleted === true){
        bookContainer.append(undoButton());
        bookContainer.append(removeButton());
    } else {
        bookContainer.append(checkButton());
        bookContainer.append(removeButton());
    }
    return bookContainer;
};

function createButton(type, text, eventListener){
    const button = document.createElement("button");
    button.innerText = text;
    button.classList.add(type);
    button.addEventListener("click", function(event){
        eventListener(event);
    });
    return button;
}

function checkButton(){
    return createButton("green", "Complete", function(event){
        addBookToCompleted(event.target.parentElement);
    });
}

function addBookToCompleted(taskElement) {
    const bookCompleted = document.getElementById(COMPLETED_BOOK_ID);
    
    const bookTitle = taskElement.querySelector(".book_item > .title").innerText;
    const bookAuthor = taskElement.querySelector(".book_item > .author").innerText;
    const bookYear = taskElement.querySelector(".book_item > .year").innerText;
   
    const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);
    const book = findBook(taskElement[BOOK_ITEM_ID]);
    book.isCompleted = true;
    newBook[BOOK_ITEM_ID] = book.id;
    
    bookCompleted.append(newBook);
    taskElement.remove();
    updateDataToStorage();
} 

function removeBook(taskElement){
    Swal.fire({
        title: 'Apakah kamu yakin untuk menghapus?',
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Yes',}).then((result) => {
            if(result.isConfirmed){
            const bookPosition = findBookIndex(taskElement[BOOK_ITEM_ID]);
            books.splice(bookPosition, 1);
            taskElement.remove();
            updateDataToStorage();
            Swal.fire('Deleted!','Your file has been deleted.','success')
            }
        })
}

function removeButton(){
    return createButton("red", "Remove", function(event){
        removeBook(event.target.parentElement);
    });
}

function undoBookFromCompleted(taskElement){
    const uncompletedBook = document.getElementById(UNCOMPLETED_BOOK_ID);
    
    const bookTitle = taskElement.querySelector(".book_item > .title").innerText;
    const bookAuthor = taskElement.querySelector(".book_item > .author").innerText;
    const bookYear = taskElement.querySelector(".book_item > .year").innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);
    const book = findBook(taskElement[BOOK_ITEM_ID]);
    book.isCompleted = false;
    newBook[BOOK_ITEM_ID] = book.id

    uncompletedBook.append(newBook);

    taskElement.remove();
    updateDataToStorage();
}

function undoButton(){
    return createButton("undo", "Bookmark", function(event){
        undoBookFromCompleted(event.target.parentElement);
    })
}

function searchBook(keyword) {
    const bookList = document.querySelectorAll('.book_item');
    for(let book of bookList){
        const titleSearch = book.childNodes[0];
        if(!titleSearch.innerText.toLowerCase().includes(keyword)){
            titleSearch.parentElement.style.display = 'none';
        } else {
            titleSearch.parentElement.style.display = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    });
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', function(event){
        const keyword = document.getElementById('searchBookTitle').value;
        event.preventDefault();
        searchBook(keyword.toLowerCase());
    });
    if(isStorageExist()){
        loadDataFromStorage() } 
});

document.addEventListener("ondatasaved", () => {
    console.log("Data successfully saved.");
});
document.addEventListener("ondataloaded", () => {
    loadDataFromBooks();
});