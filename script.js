// Array to hold all books
const books = [];

// Target DOM elements
const bookForm = document.getElementById("bookForm");
const bookTable = document.getElementById("bookTable");
const colorPicker = document.getElementById("colorPicker");
const appBody = document.getElementById("appBody");

// Load books from local storage if available
const savedBooks = localStorage.getItem("libraryBooks");
if (savedBooks) {
  const parsedBooks = JSON.parse(savedBooks);
  books.push(...parsedBooks); // Restore into books array
  renderBooks();
}

// Render books to the table
function renderBooks() {
  // Save current books to localStorage
  localStorage.setItem("libraryBooks", JSON.stringify(books));

  bookTable.innerHTML = ""; // Clear old table content
  books.forEach((book, index) => {
    console.log(`Book "${book.title}" is available: ${book.available}`);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border px-4 py-2">${book.title}</td>
      <td class="border px-4 py-2">${book.author}</td>
      <td class="border px-4 py-2">${book.date}</td>
      <td class="border px-4 py-2">${book.available ? "Available" : "Borrowed"}</td>
      <td class="border px-4 py-2">
        <button onclick="toggleStatus(${index})" class="bg-pink-500 text-white px-2 py-1 rounded hover:bg-pink-600">
          ${book.available ? "Borrow" : "Return"}
        </button>
      </td>
    `;
    bookTable.appendChild(row);
  });
}

// Handle form submission
bookForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const date = document.getElementById("date").value;

  // Add new book with available = true
  books.push({ title, author, date, available: true });
  renderBooks(); // Update the table and save
  bookForm.reset(); // Clear form inputs
});

// Toggle book status (borrow/return)
function toggleStatus(index) {
  books[index].available = !books[index].available;
  renderBooks();
}

// Change background color with color picker
colorPicker.addEventListener("input", (e) => {
  appBody.style.backgroundColor = e.target.value;
});
