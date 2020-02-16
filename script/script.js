'use strict';

const count = document.getElementById('start');
const cancel = document.getElementById('cancel');
const addExtraIncome = document.getElementsByTagName('button')[0];
const addExpenses = document.getElementsByTagName('button')[1];

const depositCheck = document.querySelector('#deposit-check');
const depositBank = document.querySelector('.deposit-bank');
const depositAmountInput = document.querySelector('.deposit-amount');
const depositPercentInput = document.querySelector('.deposit-percent');

const result = document.querySelectorAll('.result-total');
const resultBudgetMonth = result[0];
const resultBudgetDay = result[1];
const resultExpensesMonth = result[2];
const resultAdditionalIncome = result[3];
const resultAdditionalExpenses = result[4];
const resultPeriodAccumulation = result[5];
const resultTargetAmount = result[6];

const monthIncome = document.querySelector('.salary-amount');
const additionalIncomeItems = document.querySelectorAll('.additional_income-item');
const additionalEspensesItem = document.querySelector('.additional_expenses-item');
const targetAmount = document.querySelector('.target-amount');
const periodSelect = document.querySelector('.period-select');
const periodAmount = document.querySelector('.period-amount');

let extraIncomeItems = document.querySelectorAll('.income-items');
let expensesItems = document.querySelectorAll('.expenses-items');
let placeholderNumber = document.querySelectorAll('[placeholder="Сумма"]');
let placeholderText = document.querySelectorAll('[placeholder="Наименование"]');

count.disabled = true;

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
    this.getExpensesIncome();
    this.getAddExpenses();
    this.getAddIncome();
    this.getInfoDeposit();
    this.getBudget();

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

  // Функция добавляет дополнительный блок доходов или расходов при клике на +
  addExpensesIncomeBlock(type) {

    const addBlock = function (items) {
      const blockClassTitle = items[0].className.split('-')[0]; // Первая часть названия класса
      let blockItems = document.querySelectorAll(`.${blockClassTitle}-items`);
      const plusButton = document.querySelector(`.${blockClassTitle}_add`);
      const cloneBlock = blockItems[0].cloneNode(true);
      blockItems[0].parentNode.insertBefore(cloneBlock, plusButton);
      blockItems = document.querySelectorAll(`.${blockClassTitle}-items`);
      cloneBlock.childNodes.forEach((item) => {
        item.value = '';
      });

      if (blockItems.length === 3) {
        plusButton.style.display = 'none';
      }
    }

    if (type === 'income') addBlock(extraIncomeItems);
    if (type === 'expenses') addBlock(expensesItems);

    placeholderNumber = document.querySelectorAll('[placeholder="Сумма"]');
    placeholderText = document.querySelectorAll('[placeholder="Наименование"]');
    validateInputText();
    validateInputNumber();
  }

  // Метод заполняет объекты income и expenses полученными от пользователя данными
  getExpensesIncome() {

    const count = item => {
      const itemClassTitle = item.className.split('-')[0]; // Первая часть названия класса
      const itemTitle = item.querySelector(`.${itemClassTitle}-title`).value;
      const itemAmount = item.querySelector(`.${itemClassTitle}-amount`).value;
      if (itemTitle !== '' && itemAmount !== '') {
        this[itemClassTitle][itemTitle] = itemAmount; // this.income[itemTitle], this.expenses[itemTitle]
      }
    };

    expensesItems.forEach(count);
    extraIncomeItems.forEach(count);

    // Расчет доходов и расходов за месяц
    for (const key in this.income) {
      this.incomeMonth += +this.income[key];
    }

    for (const key in this.expenses) {
      this.expensesMonth += +this.expenses[key];
    }
  }

  // Функция записывает в массив addExpenses возможные расходы
  getAddExpenses() {
    const additionalExpenses = additionalEspensesItem.value.split(',');
    additionalExpenses.forEach((item) => {
      item = item.trim();
      if (item !== '') {
        this.addExpenses.push(item);
      }
    });
  }

  // Функция записывает в массив addIncome возможные доходы
  getAddIncome() {
    additionalIncomeItems.forEach((item) => {
      const itemValue = item.value.trim();
      if (itemValue !== '') {
        this.addIncome.push(itemValue);
      }
    });
  }

  getInfoDeposit() {
    if (this.deposit) {
      this.percentDeposit = depositPercentInput.value;
      this.moneyDeposit = depositAmountInput.value;
    }
  }

  changeDepositPercent() {
    const selectValue = this.value;
    if (selectValue === 'other') {
      depositPercentInput.style.display = 'inline-block';
      depositPercentInput.disabled = false;
      depositPercentInput.value = '';
    } else {
      depositPercentInput.style.display = 'none';
      depositPercentInput.value = selectValue;
    }

    depositPercentInput.addEventListener('input', () => {
      if (!isNumber(depositPercentInput.value) || depositPercentInput.value > 100) {
        depositPercentInput.value = depositPercentInput.value.slice(0, depositPercentInput.value.length - 1);
      }
    });
  }

  depositHandler() {
    if (depositCheck.checked) {
      depositBank.style.display = 'inline-block';
      depositAmountInput.style.display = 'inline-block';
      this.deposit = true;
      depositBank.addEventListener('change', this.changeDepositPercent);
    } else {
      depositBank.style.display = 'none';
      depositAmountInput.style.display = 'none';
      depositPercentInput.style.display = 'none';
      depositBank.value = '0';
      depositAmountInput.value = '';
      this.deposit = false;
      depositBank.removeEventListener('change', this.changeDepositPercent);
    }
  }

  getBudget() {
    const depositMonth = this.moneyDeposit * this.percentDeposit / 100;
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + depositMonth;
    this.budgetDay = Math.floor(this.budgetMonth / 30);
  }

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
    depositPercentInput.style.display = 'none';
    depositCheck.checked = false;
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
      this.start.call(this);
      this.block();
    });

    cancel.addEventListener('click', (event) => {
      this.reset.call(this);
    });

    addExpenses.addEventListener('click', (event) => {
      this.addExpensesIncomeBlock('expenses');
    });

    addExtraIncome.addEventListener('click', (event) => {
      this.addExpensesIncomeBlock('income');
    });

    periodSelect.addEventListener('input', (event) => {
      this.setPeriod.call(this);
    });

    monthIncome.addEventListener('input', this.checkMonthIncome);

    depositCheck.addEventListener('change', this.depositHandler.bind(this));
  }
}

const appData = new AppData();
appData.eventListeners();