// Éléments
const billInput = document.querySelector(".bill-input");
const peopleInput = document.querySelector(".people-input");
const tipBtns = [...document.querySelectorAll(".tip-button")];
const customInput = document.querySelector(".custom-tip-input");

const tipAmountEl = document.querySelector(".tip-amount");
const totalEl = document.querySelector(".total-amount");
const resetBtn = document.querySelector(".reset");

// État
let bill = 0;
let people = 0;
let tipPercent = null; // aucun tip sélectionné au départ

// Helpers
const money = (n) => (Number.isFinite(n) ? n.toFixed(2) : "0.00");

function updateOutputs(tipPP = 0, totalPP = 0) {
  tipAmountEl.value = money(tipPP);
  totalEl.value = money(totalPP);
}

function canCompute() {
  return bill > 0 && people > 0 && tipPercent !== null && tipPercent >= 0;
}

function calc() {
  if (!canCompute()) {
    updateOutputs(0, 0);
    syncResetState();
    return;
  }

  const tip = bill * (tipPercent / 100);
  const perPersonTip = tip / people;
  const perPersonTotal = (bill + tip) / people;
  updateOutputs(perPersonTip, perPersonTotal);
  syncResetState();
}

function syncResetState() {
  const dirty =
    bill !== 0 ||
    people !== 0 ||
    tipPercent !== null ||
    (customInput.value && customInput.value !== "");
  resetBtn.disabled = !dirty;
}

function setActive(btn) {
  tipBtns.forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
}

// Events: bill / people
billInput.addEventListener("input", (e) => {
  bill = parseFloat(e.target.value) || 0;
  calc();
});

peopleInput.addEventListener("input", (e) => {
  const v = parseInt(e.target.value, 10);
  people = Number.isFinite(v) ? Math.max(0, v) : 0;
  calc();
});

// Events: tip buttons
tipBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    tipPercent = parseFloat(btn.dataset.tip); // 5,10,15,25,50
    setActive(btn);
    customInput.value = "";
    calc();
  });
});

// Event: custom tip
customInput.addEventListener("input", (e) => {
  const v = parseFloat(e.target.value);
  tipPercent = Number.isFinite(v) ? Math.max(0, v) : null;
  setActive(null);
  calc();
});

// Reset
resetBtn.addEventListener("click", () => {
  bill = 0;
  people = 0;
  tipPercent = null;
  billInput.value = "0";
  peopleInput.value = "0";
  customInput.value = "";
  setActive(null);
  updateOutputs(0, 0);
  syncResetState();
});

// Initial UI
billInput.value = "0";
peopleInput.value = "0";
updateOutputs(0, 0);
resetBtn.disabled = true;
