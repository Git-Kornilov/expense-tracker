"use strict";

const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const amount = document.getElementById("amount");
const text = document.getElementById("text");

const localStorageTransaction = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransaction : [];

// Add transaction to DOM list
const addTransactionDOM = function (transaction) {
  // Get sign (+ / - money)
  const sign = transaction.amount < 0 ? "-" : "+";

  const item = document.createElement("li");

  //   Add class 'minus' or 'plus'
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>`;

  list.appendChild(item);
};

// Update balance, income, expense
const updateValues = function () {
  const amounts = transactions.map((transaction) => transaction.amount);

  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);

  const expense = amounts
    .filter((item) => item < 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);

  //   To DOM
  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${Math.abs(expense)}`;
};

// Generate random ID for transaction
const generateID = function () {
  return Math.floor(Math.random() * 100_000_000);
};

// Add new transaction
const addTransaction = function (e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add the transaction (a text and +/- amount) ");
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = "";
    amount.value = "";
  }
};

// Update localStorage transaction
const updateLocalStorage = function () {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

// Init app
const init = function () {
  list.innerHTML = "";

  transactions.forEach(addTransactionDOM);
  updateValues();
};
init();

// Remove transaction by ID
const removeTransaction = function (id) {
  transactions = transactions.filter((item) => item.id !== id);

  updateLocalStorage();
  init();
};

// addEventListener
form.addEventListener("submit", addTransaction);
