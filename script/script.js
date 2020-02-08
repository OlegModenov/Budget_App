'use strict';

let count = document.getElementById('start');
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

let isNumber = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

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
  showResult: function() {
    resultBudgetMonth.value = appData.budgetMonth;
    resultBudgetDay.value = appData.budgetDay;
    resultExpensesMonth.value = appData.expensesMonth;
    resultAdditionalIncome.value = appData.addIncome.join(', ');
    resultAdditionalExpenses.value = appData.addExpenses.join(', ');
    resultPeriodAccumulation.value = appData.calcSavedMoney();
    resultTargetAmount.value = appData.getTargetMonth();

    periodSelect.addEventListener('input', appData.changeResultPeriodAccumulation);
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
    for (let key in appData.expenses) {
      appData.expensesMonth += +appData.expenses[key];
    }
    return Number(appData.expensesMonth);
  },

  // Функция записывает в массив addExpenses возможные расходы
  getAddExpenses: function() {
    let additionalExpenses = additionalEspensesItem.value.split(',');
    additionalExpenses.forEach(function(item) {
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
    additionalIncomeItem.forEach(function(item) {
      let itemValue = item.value.trim();
      if (itemValue !== '') {
        appData.addIncome.push(itemValue);
      }
    })
  },

  // Функция суммирует возможные доходы и записывает их в appData.incomeMonth
  getIncomeMonth: function () {
    for (let key in appData.income) {
      appData.incomeMonth += Number(appData.income[key]);
    }
    return Number(appData.incomeMonth);
  },

  // asking: function () {

  //   if (confirm('Есть ли у вас дополнительный источник заработка')) {

  //     let itemIncome = '';
  //     do {
  //       itemIncome = prompt('Какой у вас дополнительный заработок', 'программирование');
  //     }
  //     while (!isNaN(parseFloat(itemIncome)) || itemIncome === '' || itemIncome === null);

  //     let cashIncome = 0;
  //     do {
  //       cashIncome = prompt('Сколько в месяц вы на этом зарабатываете', 20000);
  //     }
  //     while (!isNumber(cashIncome));

  //     appData.income[itemIncome] = cashIncome;
  //   }

  //   let addExpences = prompt('Перечислите возможные расходы за рассчитываемый период через запятую', 'квартплата, транспорт');
  //   appData.addExpences = addExpences.toLowerCase().split(', ');

  //   let exp = 0;
  //   let keys = []; //массив для сохранения ключей объекта expenses   

  //   for (let i = 0; i < 2; i++) {
  //     keys.push(prompt('Введите обязательную статью расходов?', 'Статья расходов ' + (i + 1)));
  //     do {
  //       exp = prompt('Во сколько это обойдется?', 5000);
  //       if (isNumber(exp)) {
  //         appData.expenses[keys[i]] = +exp;
  //       }
  //     }
  //     while (!isNumber(exp));
  //   }

  //   appData.deposit = confirm('Есть ли у вас депозит в банке?');
  // },


  // Функция считает значение appData.budgetMonth
  getBudgetMonth: function () {
    return appData.budgetMonth = appData.budget + appData.incomeMonth - appData.expensesMonth;
  },

  // Функция считает значение appData.budgetMonth
  getTargetMonth: function () {
    return Math.ceil(targetAmount.value / appData.budgetMonth);
  },

  getStatusIncome: function () {
    if (appData.budgetDay > 1200) {
      return ('У вас высокий уровень дохода');
    } else if (appData.budgetDay > 600) {
      return ('У вас средний уровень дохода');
    } else if (appData.budgetDay >= 0) {
      return ('К сожалению, у вас уровень дохода ниже среднего');
    } else {
      return ('Что-то пошло не так');
    }
  },

  getInfoDeposit: function () {
    if (appData.deposit) {
      do {
        appData.percentDeposit = prompt('Какой годовой процент', 10);
      }
      while (!isNumber(appData.percentDeposit));

      do {
        appData.moneyDeposit = prompt('Какова сумма депозита', 15000);
      }
      while (!isNumber(appData.moneyDeposit));
    }
  },

  // Функция выводит на страницу накопленные средства за период
  calcSavedMoney: function () {
    return appData.budgetMonth * periodSelect.value;
  },

  // Функция выводит на страницу период расчета в соответствии с range
  setPeriod: function () {
    periodAmount.innerHTML = periodSelect.value;
  },

  // Функция для замены на странице значение в поле "Накопления за период" 
  changeResultPeriodAccumulation: function() {
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
};


count.addEventListener('click', appData.start);
addExpenses.addEventListener('click', appData.addExpensesBlock);
addExtraIncome.addEventListener('click', appData.addExtraIncomeBlock);
periodSelect.addEventListener('input', appData.setPeriod);

count.disabled = true;
count.style.backgroundColor = 'red';
monthIncome.addEventListener('change', appData.checkMonthIncome);

// let achieveTime = appData.getTargetMonth(appData.mission, appData.budgetMonth);
// if (achieveTime > 0) {
//   console.log('Цель будет достигнута за ' + achieveTime + ' месяцев');
// } else {
//   console.log('Цель не будет достигнута');
// }

// console.log('Наша программа включает в себя данные:');
// for (let key in appData) {
//   console.log(key + ': ' + appData[key]);
// }

// function changeFirstLetter(str) {
//   if (!str) return str;
//   return str[0].toUpperCase() + str.slice(1);
// }

// for (let i = 0; i < appData.addExpences.length; i++) {
//   appData.addExpences[i] = changeFirstLetter(appData.addExpences[i]);
// }
// console.log(appData.addExpences.join(', '));