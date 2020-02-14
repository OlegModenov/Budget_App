'use strict';

const count = document.getElementById('start');
const cancel = document.getElementById('cancel');
const addExtraIncome = document.getElementsByTagName('button')[0];
const addExpenses = document.getElementsByTagName('button')[1];
const deposit = document.querySelector('#deposit-check');
const additionalIncomeItems = document.querySelectorAll('.additional_income-item');
const result = document.querySelectorAll('.result-total');
const resultBudgetMonth = result[0];
const resultBudgetDay = result[1];
const resultExpensesMonth = result[2];
const resultAdditionalIncome = result[3];
const resultAdditionalExpenses = result[4];
const resultPeriodAccumulation = result[5];
const resultTargetAmount = result[6];
const monthIncome = document.querySelector('.salary-amount');
const additionalEspensesItem = document.querySelector('.additional_expenses-item');
const targetAmount = document.querySelector('.target-amount');
const periodSelect = document.querySelector('.period-select');
const periodAmount = document.querySelector('.period-amount');

let extraIncomeItems = document.querySelectorAll('.income-items');
let expensesItems = document.querySelectorAll('.expenses-items');
let placeholderNumber = document.querySelectorAll('[placeholder="Сумма"]');
let placeholderText = document.querySelectorAll('[placeholder="Наименование"]');

const isNumber = function (number) {
  return !isNaN(parseFloat(number)) && isFinite(number);
};

const consistNotRussianLetter = function (str) {
  const notRussianLetters = /[^А-Я, ^а-я]/;
  if (str.match(notRussianLetters) !== null) {
    return true;
  }
  return false;
};

// Функция не дает вводить пользователю в поле ничего, кроме русских букв
const validateInputText = function () {
  placeholderText.forEach((item) => {
    item.addEventListener('input', () => {
      if (consistNotRussianLetter(item.value)) {
        item.value = item.value.slice(0, item.value.length - 1);
      }
    });
  });
};


// Функция не дает вводить пользователю в поле ничего, кроме цифр
const validateInputNumber = function () {
  placeholderNumber.forEach((item) => {
    item.addEventListener('input', () => {
      if (!isNumber(item.value)) {
        item.value = item.value.slice(0, item.value.length - 1);
      }
    });
  });
};

validateInputText();
validateInputNumber();

class AppData {
  constructor() {
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
  }

  // Функция запускает функции расчета и вывода
  start() {
    this.budget = Number(monthIncome.value);
    this.getExpenses();
    this.getExtraIncome();
    this.getExpensesMonth();
    this.getIncomeMonth();
    this.getAddExpenses();
    this.getAddIncome();

    this.getBudgetMonth();
    this.budgetDay = Math.floor(this.budgetMonth / 30);

    this.showResult();
  }

  // Функция выводит на страницу результаты расчета
  showResult() {
    resultBudgetMonth.value = this.budgetMonth;
    resultBudgetDay.value = this.budgetDay;
    resultExpensesMonth.value = this.expensesMonth;
    resultAdditionalIncome.value = this.addIncome.join(', ');
    resultAdditionalExpenses.value = this.addExpenses.join(', ');
    resultPeriodAccumulation.value = this.calcSavedMoney();
    resultTargetAmount.value = this.getTargetMonth();

    periodSelect.addEventListener('input', this.changeResultPeriodAccumulation);
  }

  // Функция добавляет дополнительный блок расходов при клике на +
  addExpensesBlock() {

    let cloneExpensesItem = expensesItems[0].cloneNode(true);
    cloneExpensesItem.childNodes.forEach((item) => {
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
  }

  // Функция записывает в объект expenses название и сумму расходов
  getExpenses() {
    expensesItems.forEach((item) => {
      let itemExpenses = item.querySelector('.expenses-title').value;
      let cashExpenses = item.querySelector('.expenses-amount').value;
      if (itemExpenses !== '' && cashExpenses !== '') {
        this.expenses[itemExpenses] = cashExpenses;
      }
    });
  }

  // Функция суммирует расходы и записывает их в appData.expensesMonth
  getExpensesMonth() {
    for (let key in this.expenses) {
      this.expensesMonth += +this.expenses[key];
    }
    return Number(this.expensesMonth);
  }

  // Функция записывает в массив addExpenses возможные расходы
  getAddExpenses() {
    let additionalExpenses = additionalEspensesItem.value.split(',');
    additionalExpenses.forEach((item) => {
      item = item.trim();
      if (item !== '') {
        this.addExpenses.push(item);
      }
    });

  }

  // Функция добавляет дополнительный блок доходов при клике на +
  addExtraIncomeBlock() {

    let cloneIncome = extraIncomeItems[0].cloneNode(true);
    extraIncomeItems[0].parentNode.insertBefore(cloneIncome, addExtraIncome);
    extraIncomeItems = document.querySelectorAll('.income-items');
    cloneIncome.childNodes.forEach((item) => {
      item.value = '';
    });

    if (extraIncomeItems.length === 3) {
      addExtraIncome.style.display = 'none';
    }

    placeholderNumber = document.querySelectorAll('[placeholder="Сумма"]');
    placeholderText = document.querySelectorAll('[placeholder="Наименование"]');
    validateInputText();
    validateInputNumber();

  }

  // Функция записывает в объект income название и сумму дополнительных доходов
  getExtraIncome() {
    extraIncomeItems.forEach((item) => {
      let itemExtraIncome = item.querySelector('.income-title').value;
      let cashExtraIncome = item.querySelector('.income-amount').value;

      if (itemExtraIncome !== '' && cashExtraIncome !== '') {
        this.income[itemExtraIncome] = cashExtraIncome;
      }
    });
  }

  // Функция записывает в массив addIncome возможные доходы
  getAddIncome() {
    additionalIncomeItems.forEach((item) => {
      let itemValue = item.value.trim();
      if (itemValue !== '') {
        this.addIncome.push(itemValue);
      }
    });
  }

  // Функция суммирует возможные доходы и записывает их в appData.incomeMonth
  getIncomeMonth() {
    for (let key in this.income) {
      this.incomeMonth += Number(this.income[key]);
    }
    return Number(this.incomeMonth);
  }

  // Функция считает значение appData.budgetMonth
  getBudgetMonth() {
    return this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
  }

  // Функция считает значение appData.budgetMonth
  getTargetMonth() {
    return Math.ceil(targetAmount.value / this.budgetMonth);
  }

  getStatusIncome() {
    if (this.budgetDay > 1200) {
      return ('У вас высокий уровень дохода');
    } else if (this.budgetDay > 600) {
      return ('У вас средний уровень дохода');
    } else if (this.budgetDay >= 0) {
      return ('К сожалению, у вас уровень дохода ниже среднего');
    } else {
      return ('Что-то пошло не так');
    }
  }

  getInfoDeposit() {
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
  }

  // Функция выводит на страницу накопленные средства за период
  calcSavedMoney() {
    return this.budgetMonth * periodSelect.value;
  }

  // Функция выводит на страницу период расчета в соответствии с range
  setPeriod() {
    periodAmount.innerHTML = periodSelect.value;
    resultPeriodAccumulation.value = this.calcSavedMoney();
  }

  // Функция блокирует или снимает с блокировки кнопку в зависимости от заполненности поля input 
  checkMonthIncome() {
    if (monthIncome.value !== '') {
      count.removeAttribute('disabled');
    }
  }

  // Функция блокирует инпуты и меняет кнопку рассчитать на сбросить
  block() {
    let textInputs = document.querySelectorAll('[type="text"]');
    textInputs.forEach((item) => {
      item.disabled = true;
    });
    count.style.display = 'none';
    cancel.style.display = 'block';
  }

  reset() {
    let textInputs = document.querySelectorAll('[type="text"]');
    textInputs.forEach((item) => {
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
    count.disabled = 'true';
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
  }

  eventListeners() {

    count.addEventListener('click', (event) => {
      appData.start.call(appData);
    });
    count.addEventListener('click', appData.block);

    cancel.addEventListener('click', (event) => {
      appData.reset.call(appData);
    });

    addExpenses.addEventListener('click', appData.addExpensesBlock);
    addExtraIncome.addEventListener('click', appData.addExtraIncomeBlock);

    periodSelect.addEventListener('input', (event) => {
      appData.setPeriod.call(appData);
    });

    monthIncome.addEventListener('input', appData.checkMonthIncome);
  }

}

const appData = new AppData();

count.disabled = true;
appData.eventListeners();