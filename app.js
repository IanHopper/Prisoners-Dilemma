// This is NOT DRY code yet, but it gets the job done
// Point counters
let bobPoints = 0
let larryPoints = 0

// Loyalty trackers
let bobLoyal = true;
let larryLoyal = true;
let bobAlwaysLoyal = true;
let larryAlwaysLoyal = true;
let larryLoyaltyBalance = 0;
let bobLoyaltyBalance = 0;


// Submit button variable
let calculate = document.getElementById('submit');

// Event listener for submit button
calculate.addEventListener('click', iterate);

// Event listener for reset button
document.getElementById('reset').addEventListener('click', reset)

// Reset function for page data; does not reload page
function reset() {
  // Point counters
  let bobPoints = 0
  let larryPoints = 0

  // Trackers
  let bobLoyal = true;
  let larryLoyal = true;
  let bobAlwaysLoyal = true;
  let larryAlwaysLoyal = true;
  let larryLoyaltyBalance = 0;
  let bobLoyaltyBalance = 0;
  let results = document.getElementById('results')
  let bWins = document.getElementById('bob-wins')
  let lWins = document.getElementById('larry-wins')
  results.innerHTML = '';
  bWins.innerHTML = '';
  lWins.innerHTML = '';
}

function iterate() {
  let x = document.getElementById('iterations').value;
  while (x> 0) {
    getResults()
    x -= 1
    console.log(`X is: ${x}`)
  }
}

// Calculate outcome of strategy choices and display results
function getResults() {
  // let b = document.getElementById('bob-strategy').value;
  // let l = document.getElementById('larry-strategy').value;
  let stratValues = determineStrat();
  // console.log(stratValues)
  let b = stratValues['b']
  let l = stratValues['l']
  console.log(`Calculation values:${b} ${l}`);
  let result = ''
  if (b == 1 && l == 1) {
    result = 'Bob and Larry stonewalled the cops and got light prison terms'
    bobPoints += 3;
    larryPoints += 3;
    bobLoyal = true;
    larryLoyal = true;
  } else if (b == 2 && l == 2) {
    result = 'Bob and Larry both ratted on each other and got long prison terms'
    bobPoints += 1;
    larryPoints += 1;
    bobAlwaysLoyal = false;
    larryAlwaysLoyal = false;
    bobLoyal = false;
    larryLoyal = false;

  } else if (b > l) {
    result = 'Bob ratted and Larry got a long stretch'
    bobPoints += 5;
    bobAlwaysLoyal = false;
    bobLoyal = false;
    larryLoyal = true;
  } else {
    result = 'Larry ratted and Bob got a long stretch'
    larryPoints += 5;
    larryAlwaysLoyal = false;
    larryLoyal = false;
    bobLoyal = true;
  }
  let results = document.getElementById('results')
  let bWins = document.getElementById('bob-wins')
  let lWins = document.getElementById('larry-wins')
  results.innerHTML = `
    <p>${result}</p>
    Bob is always loyal: ${bobAlwaysLoyal} <br>
    Bob was loyal: ${bobLoyal} <br>
    Larry is always loyal: ${larryAlwaysLoyal} <br>
    Larry was loyal: ${larryLoyal} <br>
  `
  bWins.innerHTML = `&nbsp;&nbsp; ${bobPoints} pts`
  lWins.innerHTML = `&nbsp;&nbsp; ${larryPoints} pts`
};

function determineStrat () {
  // Check chosen strat
  let b = document.getElementById('bob-strategy').value;
  let l = document.getElementById('larry-strategy').value;
  console.log(`Initial values: ${b} ${l}`)
  // Determine strat value
  if (b == 3){
    if (larryLoyal == true) {
      b = 1
    } else {
      b = 2
    }
  }
  if (l == 3) {
    if (bobLoyal == true) {
      l = 1
    } else {
      l = 2
    }
  }
  if (b == 4){
    if (larryAlwaysLoyal == true) {
      b = 1
    } else {
      b = 2
    }
  }
  if (l == 4){
    if (bobAlwaysLoyal == true) {
      l = 1
    } else {
      l = 2
    }
  }
  console.log(`Reaction values: ${b} ${l}`)
  return {'b': b, 'l': l}

}


// console.log(determineStrat());
