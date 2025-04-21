const books = []; // This will hold all the books added.
let mode = "add"; // Can switch to "edit" or "borrow" depending on user action.
let editIndex = null; // Used to track the index of the book being edited or borrowed.

const bookForm = document.getElementById("bookForm");
const bookTable = document.getElementById("bookTable");
const colorPicker = document.getElementById("colorPicker");
const appBody = document.getElementById("appBody");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn"); // Ensure this ID exists on the button
const borrowerSection = document.getElementById("borrowerSection");

// Load from localStorage
const savedBooks = JSON.parse(localStorage.getItem("libraryBooks")) || [];
books.push(...savedBooks);

// Load background color and set color picker value
const savedColor = localStorage.getItem("backgroundColor");
if (savedColor) {
  appBody.style.backgroundColor = savedColor;
  colorPicker.value = savedColor; // Sync the picker with stored color
}

renderBooks();

// Save data to localStorage
function saveData() {
  localStorage.setItem("libraryBooks", JSON.stringify(books));
}

// Handle form submission
bookForm.addEventListener("submit", function (e) {
  e.preventDefault();
  
  // This grabs the input values from the form fields.
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const date = document.getElementById("date").value;
  const borrower = document.getElementById("borrower").value;
  const borrowTime = document.getElementById("borrowTime").value;

  if (mode === "add") {
    books.push({ title, author, date, available: true, borrower: "", borrowTime: "" });
  } else if (mode === "edit" && editIndex !== null) {
    books[editIndex] = { ...books[editIndex], title, author, date };
  } else if (mode === "borrow" && editIndex !== null) {
    books[editIndex].available = false;
    books[editIndex].borrower = borrower;
    books[editIndex].borrowTime = borrowTime;
  }

  saveData();
  renderBooks();
  resetForm();
});

// Toggle availability status and log it
function toggleStatus(index) {
  books[index].available = !books[index].available;
  console.log(`Book "${books[index].title}" is available: ${books[index].available}`);
  saveData();
  renderBooks();
}

// Render the table with books
function renderBooks() {
  bookTable.innerHTML = "";
  books.forEach((book, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border px-4 py-2">${book.title}</td>
      <td class="border px-4 py-2">${book.author}</td>
      <td class="border px-4 py-2">${book.date}</td>
      <td class="border px-4 py-2">${book.available ? "Available" : "Borrowed"}</td>
      <td class="border px-4 py-2">${book.available ? "-" : book.borrower + " @ " + book.borrowTime}</td>
      <td class="border px-4 py-2">
        <div class="flex flex-col space-y-2">
          <button onclick="startEdit(${index})" class="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">Edit</button>
          <button onclick="handleBorrow(${index})" class="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600">
            ${book.available ? "Borrow" : "Return"}
          </button>
          <button onclick="deleteBook(${index})" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
        </div>
      </td>
    `;
    bookTable.appendChild(row);
  });
}

// Handle edit
function startEdit(index) {
  const book = books[index];
  mode = "edit";
  editIndex = index;
  formTitle.textContent = "Edit Book";
  submitBtn.textContent = "Edit"; // Button now shows 'Edit'
  borrowerSection.classList.add("hidden");
  document.getElementById("title").value = book.title;
  document.getElementById("author").value = book.author;
  document.getElementById("date").value = book.date;
}

// Handle borrow/return
function handleBorrow(index) {
  const book = books[index];
  if (book.available) {
    mode = "borrow";
    editIndex = index;
    formTitle.textContent = "Borrow Book";
    submitBtn.textContent = "Borrow";
    borrowerSection.classList.remove("hidden");
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("date").value = book.date;
  } else {
    book.available = true;
    book.borrower = "";
    book.borrowTime = "";
    saveData();
    renderBooks();
  }
}

// Delete with confirmation
function deleteBook(index) {
  if (confirm("Are you sure you want to delete this book?")) {
    books.splice(index, 1);
    saveData();
    renderBooks();
  }
}

// Reset the form to default
function resetForm() {
  bookForm.reset();
  borrowerSection.classList.add("hidden");
  formTitle.textContent = "Add a Book";
  submitBtn.textContent = "Submit";
  mode = "add";
  editIndex = null;
}

// Update background color and save it
colorPicker.addEventListener("input", (e) => {
  const color = e.target.value;
  appBody.style.backgroundColor = color;
  localStorage.setItem("backgroundColor", color);
});
