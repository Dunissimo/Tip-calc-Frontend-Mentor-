const inputs = document.querySelectorAll(".inputs"),
  _tips = document.querySelectorAll(".tip-container__tip:not(:last-child)"),
  tipsTabs = Array.from(_tips),
  perPersonElem = document.querySelector(".perPerson"),
  totalElem = document.querySelector(".total"),
  resetBtn = document.querySelector(".tip-container__button"),
  regEx = /^\d+$/;

let tipCount = getTipValue();

//#region reset

resetBtn.addEventListener("click", () => resetValue());

function resetValue() {
  inputs.forEach((input) => (input.value = ""));

  clearActiveTab(tipsTabs, "tip-container__tip_active");
  addActiveClass(tipsTabs, 2, "tip-container__tip_active");

  clearResult();
  tipCount = getTipValue();
}

//#endregion

//#region tabs

tipsTabs.forEach((tab, id) => {
  tab.addEventListener("click", () => {
    clearActiveTab(tipsTabs, "tip-container__tip_active");
    addActiveClass(tipsTabs, id, "tip-container__tip_active");
    tipCount = getTipValue();
    printResult();
  });
});

inputs[1].addEventListener("click", () =>
  clearActiveTab(tipsTabs, "tip-container__tip_active")
);

function clearActiveTab(arr, activeClass) {
  arr.forEach((tab) => {
    tab.classList.remove(activeClass);
  });
}
function addActiveClass(arr, id, activeClass) {
  arr[id].classList.add(activeClass);
}

//#endregion

//#region validate

inputs.forEach((input, id) => {
  input.addEventListener("input", () => {
    validateInputs(input);
  });
});

function validateInputs(input) {
  if (input.id == "countOfPeople") {
    input.value = input.value.replace(/[^\d]/g, "");

    if (input.value < 0) input.value = 1;
    if (input.value > 15 || input.value.length > 2) input.value = 15;

    return;
  }

  input.value = input.value.replace(/[^\d]/g, "");

  if (input.value >= 999999 || input.value.length > 6) input.value = 999999;
}

//#endregion

//#region calc tips

inputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (checkInputsForEmpty()) {
      clearResult();
      return;
    }

    if (input.classList.contains("custom-input")) {
      tipCount = getTipValue();
      printResult();
      return;
    }

    printResult();
  });
});

function printResult() {
  if (checkInputsForEmpty()) return;

  const money = +inputs[0].value;
  const people = +inputs[2].value;

  perPersonElem.textContent = `$${calcTipPerPerson(money, tipCount, people)}`;
  totalElem.textContent = `$${calcTotalTip(money, tipCount)}`;
}

function clearResult() {
  perPersonElem.textContent = `$0.00`;
  totalElem.textContent = `$0.00`;
}

function checkInputsForEmpty() {
  let isEmpty = false;

  inputs.forEach((input, id) => {
    if (id == 1) {
      return;
    }
    if (input.value == "") {
      isEmpty = true;
    }
  });

  return isEmpty;
}

function getTipValue() {
  const selected = tipsTabs.filter((tab) =>
    tab.classList.contains("tip-container__tip_active")
  );

  if (selected.length <= 0) {
    if (inputs[1].value) {
      return +inputs[1].value;
    }
  }

  try {
    return +selected[0].dataset.tipCount;
  } catch (error) {
    return 1;
  }
}

function calcTipPerPerson(sum, percent, numOfPeople) {
  let res = (sum * percent) / 100;
  res /= numOfPeople;
  return res.toFixed(2);
}

function calcTotalTip(sum, percent) {
  const res = (sum * percent) / 100;

  return res.toFixed(2);
}

//#endregion
