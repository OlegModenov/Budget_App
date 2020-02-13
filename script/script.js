'use strict';

let count = document.getElementById('start');
let cancel = document.getElementById('cancel');
let addExtraIncome = document.getElementsByTagName('button')[0];
let addExpenses = document.getElementsByTagName('button')[1];
let deposit = document.querySelector('#deposit-check');
let additionalIncomeItem = document.querySelectorAll('.additional_income-item');
let result = document.querySelectorAll('.result-total');
let resultBudgetMonth = result[0];
let resultBudgetDay = result[1];
let resultExpensesMonth = result[2];
let resultAdditionalIncome = result[3];
let resultAdditionalExpenses = result[4];
let resultPeriodAccumulation = result[5];
let resultTargetAmount = result[6];
let monthIncome = document.querySelector('.salary-amount');
let extraIncomeTitle = document.querySelectorAll('.income-title')[1];
let extraIncomeItems = document.querySelectorAll('.income-items');
let espensesTitle = document.querySelectorAll('.expenses-title')[1];
let expensesItems = document.querySelectorAll('.expenses-items');
let additionalEspensesItem = document.querySelector('.additional_expenses-item');
let targetAmount = document.querySelector('.target-amount');
let periodSelect = document.querySelector('.period-select');
let periodAmount = document.querySelector('.period-amount');

let placeholderNumber = document.querySelectorAll('[placeholder="Сумма"]');
let placeholderText = document.querySelectorAll('[placeholder="Наименование"]');

let isNumber = function (number) {
  return !isNaN(parseFloat(number)) && isFinite(number);
};

let consistNotRussianLetter = function (str) {
  let notRussianLetters = /[^А-Я, ^а-я]/;
  if (str.match(notRussianLetters) !== null) return true;
  return false;
};

// Функция не дает вводить пользователю в поле ничего, кроме русских букв
let validateInputText = function () {

  placeholderText.forEach(function (item) {
    item.addEventListener('input', function () {
      if (consistNotRussianLetter(item.value)) {
        item.value = item.value.slice(0, item.value.length - 1);
      }
    })
  })
};


// Функция не дает вводить пользователю в поле ничего, кроме цифр
let validateInputNumber = function () {

  placeholderNumber.forEach(function (item) {
    item.addEventListener('input', function () {
      if (!isNumber(item.value)) {
        item.value = item.value.slice(0, item.value.length - 1);
      }
    })
  })
};

validateInputText();
validateInputNumber();

const AppData = function() {
  this.income = {};
  this.addIncome = [];
  this.expenses = {};
  this.addExpenses = [];
  this.deposit = false;
  this.percentDeposit = 0;
  this.moneyDeposit = 0;
  this.budget = 0;
  this.budgetDay = 0;
  this.budgetMonth = 0;
  this.expensesMonth = 0;
  this.incomeMonth = 0;
};

// Функция запускает функции расчета и вывода
AppData.prototype.start = function () {

  this.budget = Number(monthIncome.value);
  this.getExpenses();
  this.getExtraIncome();
  this.getExpensesMonth();
  this.getIncomeMonth();
  this.getAddExpenses();
  this.getAddIncome();

  this.getBudgetMonth();
  this.budgetDay = Math.floor(this.budgetMonth / 30);

  // this.getInfoDeposit();
  this.showResult();
};

// Функция выводит на страницу результаты расчета
AppData.prototype.showResult = function () {
  resultBudgetMonth.value = this.budgetMonth;
  resultBudgetDay.value = this.budgetDay;
  resultExpensesMonth.value = this.expensesMonth;
  resultAdditionalIncome.value = this.addIncome.join(', ');
  resultAdditionalExpenses.value = this.addExpenses.join(', ');
  resultPeriodAccumulation.value = this.calcSavedMoney();
  resultTargetAmount.value = this.getTargetMonth();

  periodSelect.addEventListener('input', this.changeResultPeriodAccumulation);
};

// Функция добавляет дополнительный блок расходов при клике на +
AppData.prototype.addExpensesBlock = function () {

  let cloneExpensesItem = expensesItems[0].cloneNode(true);
  cloneExpensesItem.childNodes.forEach(function (item) {
    item.value = '';
  });
  expensesItems[0].parentNode.insertBefore(cloneExpensesItem, addExpenses);
  expensesItems = document.querySelectorAll('.expenses-items');

  if (expensesItems.length === 3) {
    addExpenses.style.display = 'none';
  }

  placeholderNumber = document.querySelectorAll('[placeholder="Сумма"]');
  placeholderText = document.querySelectorAll('[placeholder="Наименование"]');
  validateInputText();
  validateInputNumber();
};

// Функция записывает в объект expenses название и сумму расходов
AppData.prototype.getExpenses = function () {
  const _this = this;

  expensesItems.forEach(function (item) {
    let itemExpenses = item.querySelector('.expenses-title').value;
    let cashExpenses = item.querySelector('.expenses-amount').value;
    if (itemExpenses !== '' && cashExpenses !== '') {
      _this.expenses[itemExpenses] = cashExpenses;
    }
  })
};

// Функция суммирует расходы и записывает их в appData.expensesMonth
AppData.prototype.getExpensesMonth = function () {
  for (let key in this.expenses) {
    this.expensesMonth += +this.expenses[key];
  }
  return Number(this.expensesMonth);
},

// Функция записывает в массив addExpenses возможные расходы
AppData.prototype.getAddExpenses = function () {
  const _this = this;
  let additionalExpenses = additionalEspensesItem.value.split(',');
  additionalExpenses.forEach(function (item) {
    item = item.trim();
    if (item !== '') {
      _this.addExpenses.push(item);
    }
  });

};

// Функция добавляет дополнительный блок доходов при клике на +
AppData.prototype.addExtraIncomeBlock = function () {

  let cloneIncome = extraIncomeItems[0].cloneNode(true);
  extraIncomeItems[0].parentNode.insertBefore(cloneIncome, addExtraIncome);
  extraIncomeItems = document.querySelectorAll('.income-items');
  cloneIncome.childNodes.forEach(function (item) {
    item.value = '';
  });

  if (extraIncomeItems.length === 3) {
    addExtraIncome.style.display = 'none';
  }

  placeholderNumber = document.querySelectorAll('[placeholder="Сумма"]');
  placeholderText = document.querySelectorAll('[placeholder="Наименование"]');
  validateInputText();
  validateInputNumber();

};

// Функция записывает в объект income название и сумму дополнительных доходов
AppData.prototype.getExtraIncome = function () {
  const _this = this;

  extraIncomeItems.forEach(function (item) {
    let itemExtraIncome = item.querySelector('.income-title').value;
    let cashExtraIncome = item.querySelector('.income-amount').value;

    if (itemExtraIncome !== '' && cashExtraIncome !== '') {
      _this.income[itemExtraIncome] = cashExtraIncome;
    }
  })
};

// Функция записывает в массив addIncome возможные доходы
AppData.prototype.getAddIncome = function () {
  const _this = this;
  
  additionalIncomeItem.forEach(function (item) {
    let itemValue = item.value.trim();
    if (itemValue !== '') {
      _this.addIncome.push(itemValue);
    }
  })
};

// Функция суммирует возможные доходы и записывает их в appData.incomeMonth
AppData.prototype.getIncomeMonth = function () {
  for (let key in this.income) {
    this.incomeMonth += Number(this.income[key]);
  }
  return Number(this.incomeMonth);
};

// Функция считает значение appData.budgetMonth
AppData.prototype.getBudgetMonth = function () {
  return this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
};

// Функция считает значение appData.budgetMonth
AppData.prototype.getTargetMonth = function () {
  return Math.ceil(targetAmount.value / this.budgetMonth);
};

AppData.prototype.getStatusIncome = function () {
  if (this.budgetDay > 1200) {
    return ('У вас высокий уровень дохода');
  } else if (this.budgetDay > 600) {
    return ('У вас средний уровень дохода');
  } else if (this.budgetDay >= 0) {
    return ('К сожалению, у вас уровень дохода ниже среднего');
  } else {
    return ('Что-то пошло не так');
  }
};

AppData.prototype.getInfoDeposit = function () {
  if (this.deposit) {
    do {
      this.percentDeposit = prompt('Какой годовой процент', 10);
    }
    while (!isNumber(this.percentDeposit));

    do {
      this.moneyDeposit = prompt('Какова сумма депозита', 15000);
    }
    while (!isNumber(this.moneyDeposit));
  }
};

// Функция выводит на страницу накопленные средства за период
AppData.prototype.calcSavedMoney = function () {
  return this.budgetMonth * periodSelect.value;
};

// Функция выводит на страницу период расчета в соответствии с range
AppData.prototype.setPeriod = function () {
  periodAmount.innerHTML = periodSelect.value;
  resultPeriodAccumulation.value = appData.calcSavedMoney();
  console.log(this);
};

// Функция блокирует или снимает с блокировки кнопку в зависимости от заполненности поля input 
AppData.prototype.checkMonthIncome = function () {
  if (monthIncome.value === '') {
    count.disabled = true;
    count.style.backgroundColor = 'red';
    monthIncome = document.querySelector('.salary-amount');
  } else {
    count.disabled = false;
    count.style.backgroundColor = 'green';
    monthIncome = document.querySelector('.salary-amount');
  }
};

// Функция блокирует инпуты и меняет кнопку рассчитать на сбросить
AppData.prototype.block = function () {
  let textInputs = document.querySelectorAll('[type="text"]');
  textInputs.forEach(function (item) {
    item.disabled = true;
  });
  count.style.display = 'none';
  cancel.style.display = 'block';
};

AppData.prototype.reset = function () {
  let textInputs = document.querySelectorAll('[type="text"]');
  textInputs.forEach(function (item) {
    item.disabled = false;
    item.value = '';
  });

  addExpenses.style.display = 'block';
  while (expensesItems.length > 1) {
    expensesItems[0].parentNode.removeChild(expensesItems[expensesItems.length - 1]);
    expensesItems = document.querySelectorAll('.expenses-items');
  }

  addExtraIncome.style.display = 'block';
  while (extraIncomeItems.length > 1) {
    extraIncomeItems[0].parentNode.removeChild(extraIncomeItems[extraIncomeItems.length - 1]);
    extraIncomeItems = document.querySelectorAll('.income-items');
  }

  count.style.display = 'block';
  cancel.style.display = 'none';
  deposit.checked = false;
  periodSelect.value = '1';
  periodAmount.innerHTML = '1';
  resultTargetAmount.value = '';

  this.addIncome = [];
  this.expenses = {};
  this.addExpenses = [];
  this.deposit = false;
  this.income = {};
  this.percentDeposit = 0;
  this.moneyDeposit = 0;
  this.budget = 0;
  this.budgetDay = 0;
  this.budgetMonth = 0;
  this.expensesMonth = 0;
  this.incomeMonth = 0;
};

AppData.prototype.eventListeners = function() {

  count.addEventListener('click', function (event) {
    appData.start.call(appData);
  });  
  count.addEventListener('click', appData.block);  
  cancel.addEventListener('click', function (event) {
    appData.reset.call(appData);
  });  
  addExpenses.addEventListener('click', appData.addExpensesBlock);
  addExtraIncome.addEventListener('click', appData.addExtraIncomeBlock);
  periodSelect.addEventListener('input', appData.setPeriod);  
  
  count.disabled = true;
  count.style.backgroundColor = 'red';
  monthIncome.addEventListener('input', appData.checkMonthIncome);
};

const appData = new AppData();
appData.eventListeners();
