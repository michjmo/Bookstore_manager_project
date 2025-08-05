// DOM Elements
const form = document.getElementById('submit-book');
const table = document.getElementById('books-table');
const toggle = document.getElementById('theme-toggle');

// Toast Notifications
const notifySuccess = (msg) => {
  Toastify({
    text: msg,
    className: 'toastify success',
    gravity: 'top',
    position: 'right',
  }).showToast();
};

const notifyError = (msg) => {
  Toastify({
    text: msg,
    className: 'toastify error',
    gravity: 'top',
    position: 'right',
  }).showToast();
};

// LocalStorage
const getBooks = () => JSON.parse(localStorage.getItem('books') || '[]');
const saveBooks = (books) => localStorage.setItem('books', JSON.stringify(books));

// Theme Setup
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const useDark = saved === 'dark' || (!saved && prefersDark);

  document.body.classList.toggle('dark', useDark);
  toggle.checked = useDark;

  renderBooks();
});

// Toggle
toggle.addEventListener('change', () => {
  const isDark = toggle.checked;
  document.body.classList.toggle('dark', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Display Book
const displayBook = (book, index) => {
  const row = document.createElement('section');
  row.className = 'table-row flex gap-4 items-center py-2 border-b';
  row.dataset.index = index;

  row.innerHTML = `
    <div class="table-item flex-1">${book.title}</div>
    <div class="table-item flex-1">${book.author}</div>
    <div class="table-item flex-1">${book.publisher}</div>
    <button class="delete-button bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
      Delete
    </button>
  `;

  table.appendChild(row);
};

// Render Books List
const renderBooks = () => {
  table.querySelectorAll('.table-row:not(.table-header)').forEach(el => el.remove());
  getBooks().forEach((book, i) => displayBook(book, i));
};

// Submit Book Form
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('book-title').value.trim();
  const author = document.getElementById('book-author').value.trim();
  const publisher = document.getElementById('book-publisher').value.trim();

  if (!title || !author || !publisher) {
    notifyError('Please fill in all fields.');
    return;
  }

  const books = getBooks();
  const newBook = { title, author, publisher };
  books.push(newBook);
  saveBooks(books);

  form.reset();
  renderBooks();
  notifySuccess('Book added!');
});

// Delete Book
table.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-button')) {
    const row = e.target.closest('.table-row');
    const index = parseInt(row.dataset.index);

    const books = getBooks();
    books.splice(index, 1);
    saveBooks(books);
    renderBooks();

    notifySuccess('Book deleted!');
  }
});
