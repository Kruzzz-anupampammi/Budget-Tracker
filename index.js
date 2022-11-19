const currencyHolder = document.getElementById("currency");
const balanceHolder = document.getElementById("balance");
const transactionNameHolder = document.getElementById("name");
const transactionAmountHolder = document.getElementById("amount");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const saveButton = document.getElementById("submit");
const cancelButton = document.getElementById("cancel");
const displayList = document.getElementById("list_of_transactions");

let symbol = "£";
let listOfTransactions = [];
let currentBalance = 0;

let editIndex = -1;
//Edit Function
function edit(i) {
  editIndex = i;
  transactionNameHolder.value = listOfTransactions[i].name;
  transactionAmountHolder.value = listOfTransactions[i].amount;
  if (listOfTransactions[i].type == "income") {
    income.checked = true;
  } else {
    expense.checked = true;
  }
  cancelButton.style.display = "block";
}

//Delete Function
function del(i) {
  listOfTransactions = listOfTransactions.filter((e, index) => i !== index);
  render();
}

//Cancel Function
cancelButton.addEventListener("click", () => {
  editIndex = -1;
  transactionNameHolder.value = "";
  transactionAmountHolder.value = "";
  cancelButton.style.display = "none";
});

//Save Function
function saveData() {
  localStorage.setItem("symbol", symbol);
  localStorage.setItem("balance", currentBalance);
  localStorage.setItem("list", JSON.stringify(listOfTransactions));
}

//Load Data from Local Storage
function loadData() {
  symbol = localStorage.getItem("symbol");
  listOfTransactions = JSON.parse(localStorage.getItem("list"));
  currentBalance = Number(localStorage.getItem("balance"));
}

//Save Function - Onsubmit
saveButton.addEventListener("click", () => {
  if (
    transactionNameHolder.value == "" ||
    Number(transactionAmountHolder.value) <= 0
  ) {
    alert("Sorry, input fields can't be empty or negative");
    return;
  }

  let transaction = {
    name: transactionNameHolder.value,
    amount: Number(transactionAmountHolder.value),
    type: income.checked ? "income" : "expense",
  };

  if (editIndex == -1) listOfTransactions.push(transaction);
  else listOfTransactions[editIndex] = transaction;

  editIndex = -1;
  transactionNameHolder.value = "";
  transactionAmountHolder.value = "";
  render();
  cancelButton.style.display = "none";
});

//Main Function
function render() {
  currentBalance = listOfTransactions.reduce((total, value) => {
    return value.type == "expense"
      ? total - value.amount
      : total + value.amount;
  }, 0);

  displayList.innerHTML = "";

  if (listOfTransactions == 0) {
    displayList.innerHTML += "No transactions found!";
  } else {
    listOfTransactions.forEach((e, i) => {
      displayList.innerHTML += `
      <li class="transaction ${e.type}">
              <p>${e.name}</p>
              <div class="right">
                <p class="amount_display">${symbol} ${e.amount}</p>
                <i onclick="edit(${i})" class="fa-solid fa-pen-to-square fa-lg"></i>
                <i onclick="del(${i})" class="fa-solid fa-trash fa-lg"></i>
              </div>
            </li>
      `;
    });
  }

  currencyHolder.innerHTML = symbol;
  balanceHolder.innerHTML = currentBalance;
  saveData();
}

loadData();

render();
