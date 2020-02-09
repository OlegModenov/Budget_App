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

let appData = {
  income: {},
  addIncome: [],
  expenses: {},
  addExpenses: [],
  deposit: false,
  percentDeposit: 0,
  moneyDeposit: 0,
  budget: 0,
  budgetDay: 0,
  budgetMonth: 0,
  expensesMonth: 0,
  incomeMonth: 0,

  // Функция запускает функции расчета и вывода
  start: function () {

    appData.budget = Number(monthIncome.value);
    appData.getExpenses();
    appData.getExtraIncome();
    appData.getExpensesMonth();
    appData.getIncomeMonth();
    appData.getAddExpenses();
    appData.getAddIncome();

    appData.getBudgetMonth();
    appData.budgetDay = Math.floor(appData.budgetMonth / 30);

    // appData.getInfoDeposit();
    appData.showResult();
  },

  // Функция выводит на страницу результаты расчета
  showResult: function () {
    resultBudgetMonth.value = this.budgetMonth;
    resultBudgetDay.value = this.budgetDay;
    resultExpensesMonth.value = this.expensesMonth;
    resultAdditionalIncome.value = this.addIncome.join(', ');
    resultAdditionalExpenses.value = this.addExpenses.join(', ');
    resultPeriodAccumulation.value = this.calcSavedMoney();
    resultTargetAmount.value = this.getTargetMonth();

    periodSelect.addEventListener('input', this.changeResultPeriodAccumulation);
  },

  // Функция добавляет дополнительный блок расходов при клике на +
  addExpensesBlock: function () {

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
  },

  // Функция записывает в объект expenses название и сумму расходов
  getExpenses: function () {

    expensesItems.forEach(function (item) {
      let itemExpenses = item.querySelector('.expenses-title').value;
      let cashExpenses = item.querySelector('.expenses-amount').value;
      if (itemExpenses !== '' && cashExpenses !== '') {
        appData.expenses[itemExpenses] = cashExpenses;
      }
    })
  },

  // Функция суммирует расходы и записывает их в appData.expensesMonth
  getExpensesMonth: function () {
    for (let key in this.expenses) {
      this.expensesMonth += +this.expenses[key];
    }
    return Number(this.expensesMonth);
  },

  // Функция записывает в массив addExpenses возможные расходы
  getAddExpenses: function () {
    let additionalExpenses = additionalEspensesItem.value.split(',');
    additionalExpenses.forEach(function (item) {
      item = item.trim();
      if (item !== '') {
        appData.addExpenses.push(item);
      }
    });

  },

  // Функция добавляет дополнительный блок доходов при клике на +
  addExtraIncomeBlock: function () {

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

  },

  // Функция записывает в объект income название и сумму дополнительных доходов
  getExtraIncome: function () {

    extraIncomeItems.forEach(function (item) {
      let itemExtraIncome = item.querySelector('.income-title').value;
      let cashExtraIncome = item.querySelector('.income-amount').value;

      if (itemExtraIncome !== '' && cashExtraIncome !== '') {
        appData.income[itemExtraIncome] = cashExtraIncome;
      }
    })
  },

  // Функция записывает в массив addIncome возможные доходы
  getAddIncome: function () {
    additionalIncomeItem.forEach(function (item) {
      let itemValue = item.value.trim();
      if (itemValue !== '') {
        appData.addIncome.push(itemValue);
      }
    })
  },

  // Функция суммирует возможные доходы и записывает их в appData.incomeMonth
  getIncomeMonth: function () {
    for (let key in this.income) {
      this.incomeMonth += Number(this.income[key]);
    }
    return Number(this.incomeMonth);
  },

  // Функция считает значение appData.budgetMonth
  getBudgetMonth: function () {
    return this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth;
  },

  // Функция считает значение appData.budgetMonth
  getTargetMonth: function () {
    return Math.ceil(targetAmount.value / this.budgetMonth);
  },

  getStatusIncome: function () {
    if (this.budgetDay > 1200) {
      return ('У вас высокий уровень дохода');
    } else if (this.budgetDay > 600) {
      return ('У вас средний уровень дохода');
    } else if (this.budgetDay >= 0) {
      return ('К сожалению, у вас уровень дохода ниже среднего');
    } else {
      return ('Что-то пошло не так');
    }
  },

  getInfoDeposit: function () {
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
  },

  // Функция выводит на страницу накопленные средства за период
  calcSavedMoney: function () {
    return this.budgetMonth * periodSelect.value;
  },

  // Функция выводит на страницу период расчета в соответствии с range
  setPeriod: function () {
    periodAmount.innerHTML = periodSelect.value;
  },

  // Функция для замены на странице значение в поле "Накопления за период" 
  changeResultPeriodAccumulation: function () {
    resultPeriodAccumulation.value = appData.calcSavedMoney();
  },

  // Функция блокирует или снимает с блокировки кнопку в зависимости от заполненности поля input 
  checkMonthIncome: function () {
    if (monthIncome.value === '') {
      count.disabled = true;
      count.style.backgroundColor = 'red';
      monthIncome = document.querySelector('.salary-amount');
    } else {
      count.disabled = false;
      count.style.backgroundColor = 'green';
      monthIncome = document.querySelector('.salary-amount');
    }
  },

  // Функция блокирует инпуты и меняет кнопку рассчитать на сбросить
  block: function () {
    let textInputs = document.querySelectorAll('[type="text"]');
    textInputs.forEach(function (item) {
      item.disabled = true;
    });
    count.style.display = 'none';
    cancel.style.display = 'block';
  },

  reset: function () {

    textInputs.forEach(function (item) {
      item.disabled = false;
      item.value = '';
    });

    if (expensesItems.length > 1) {
      addExpenses.style.display = 'block';
      // expensesItems.removeChild(expensesItems[0]);
    }

    if (extraIncomeItems.length > 1) {
      addExtraIncome.style.display = 'block';
    }

    count.style.display = 'block';
    cancel.style.display = 'none';
    deposit.checked = false;
    periodSelect.value = '1';
    periodAmount.value = '1';

    appData.addIncome = [];
    appData.expenses = {};
    appData.addExpenses = [];
    appData.deposit = false;
    appData.income = {};
    appData.percentDeposit = 0;
    appData.moneyDeposit = 0;
    appData.budget = 0;
    appData.budgetDay = 0;
    appData.budgetMonth = 0;
    appData.expensesMonth = 0;
    appData.incomeMonth = 0;

    appData.showResult();
  },
};

appData.start.call(appData);

count.addEventListener('click', appData.start);
count.addEventListener('click', appData.block);
cancel.addEventListener('click', appData.reset);

addExpenses.addEventListener('click', appData.addExpensesBlock);
addExtraIncome.addEventListener('click', appData.addExtraIncomeBlock);
periodSelect.addEventListener('input', appData.setPeriod);

count.disabled = true;
count.style.backgroundColor = 'red';
monthIncome.addEventListener('input', appData.checkMonthIncome);