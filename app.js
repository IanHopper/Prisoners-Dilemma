// This is NOT DRY code yet, but it gets the job done; refine later
// Pointers
let bobPoints = 0
let larryPoints = 0

// Iteration variables
let firstIteration = true; // Allows checking for opening move
let iterCheck = true; // If false this stops the iterate function if strats are incorrect

// Last choice variables
let bobLast = "";
let larryLast = "";

// Loyalty trackers
let bobAlwaysLoyal = true;
let larryAlwaysLoyal = true;
let larryLoyaltyBalance = 0; // Included for future stategy options based on overall play of opponent
let bobLoyaltyBalance = 0; // Included for future stategy options based on overall play of opponent

// Radio button groups for custom opening variables
let bobOpen = document.getElementsByName('bob-open');
let larryOpen = document.getElementsByName('larry-open');

// Custom strategy percentage variables
let bobBothStonewalled = document.getElementById('bob-both-stonewalled')
let bobBothRatted = document.getElementById('bob-both-ratted')
let bobBobRatted = document.getElementById('bob-bob-ratted')
let bobLarryRatted = document.getElementById('bob-larry-ratted')
let larryBothStonewalled = document.getElementById('larry-both-stonewalled')
let larryBothRatted = document.getElementById('larry-both-ratted')
let larryBobRatted = document.getElementById('larry-bob-ratted')
let larryLarryRatted = document.getElementById('larry-larry-ratted')

// Calculate button variable
let calculate = document.getElementById('submit');

// Event listener for calculate button
calculate.addEventListener('click', iterate);

// Event listener for reset button
document.getElementById('reset').addEventListener('click', reset)

// Event listener for custom strategy
const larryStrat = document.getElementById('larry-strategy');
const bobStrat = document.getElementById('bob-strategy');
larryStrat.addEventListener('change', revealCustomStrat)
bobStrat.addEventListener('change', revealCustomStrat)

// Reveal Custom Strategies
function revealCustomStrat() {
  let customStrats = document.getElementById('custom-strats');
  let customBob = document.getElementById('bob-custom-strat');
  let customLarry = document.getElementById('larry-custom-strat');
  let bv = bobStrat.value;
  let lv = larryStrat.value;
  if (bv == 5 || lv == 5){
    customStrats.style.display = "";
  } else {
    customStrats.style.display = "none";
  }
  if (bv == 5){
    customBob.style.visibility = "";
  } else {
    customBob.style.visibility = "hidden";
    bobOpen.forEach(x => x.checked = false)

  }
  if (lv == 5){
    customLarry.style.visibility = "";
  } else {
    customLarry.style.visibility = "hidden";
    larryOpen.forEach(x => x.checked = false)
  }
}

// Reset function for page data; does not reload page
function reset() {
  console.log("Values reset")

  // Reset point counters
  bobPoints = 0
  larryPoints = 0

  // Iteration variables
  firstIteration = true;
  iterCheck = true;

  // Reset loyalty rackers
  bobLast = "";
  larryLast = "";
  bobAlwaysLoyal = true;
  larryAlwaysLoyal = true;
  larryLoyaltyBalance = 0;
  bobLoyaltyBalance = 0;

  // Reset strategies
  larryStrat.value = 1;
  bobStrat.value = 1;
  revealCustomStrat();

  // Clear innerHTML data
  let results = document.getElementById('results')
  let bWins = document.getElementById('bob-wins')
  let lWins = document.getElementById('larry-wins')
  results.innerHTML = '';
  bWins.innerHTML = '';
  lWins.innerHTML = '';
}

// Run calculation indicated number of times
function iterate() {
  let x = document.getElementById('iterations').value;
  console.log(`This is x: ${x}`)
  while (x> 0 && iterCheck) {
    getResults()
    x -= 1
  }
  iterCheck = true; // Resets iterCheck so that iterate will run the next time it is called
}

// Calculate outcome of strategy choices and display results
function getResults() {
 // Determine actual strategy based on loyalty
  let stratValues = determineStrat();
  // Set strategy variables
  let b = stratValues['b']
  let l = stratValues['l']
  console.log(`Calculation values:${b} ${l}`);
  let result = ''
  if (b == 1 && l == 1) {
    result = 'Bob and Larry stonewalled the cops and got light prison terms'
    bobPoints += 3;
    larryPoints += 3;
    bobLast = 1;
    larryLast = 1;
    firstIteration = false;
  } else if (b == 2 && l == 2) {
    result = 'Bob and Larry both ratted on each other and got long prison terms'
    bobPoints += 1;
    larryPoints += 1;
    bobAlwaysLoyal = false;
    larryAlwaysLoyal = false;
    bobLast = 2;
    larryLast = 2;
    firstIteration = false;
  } else if (b == 2 && l == 1) {
    result = 'Bob ratted and Larry got a long stretch'
    bobPoints += 5;
    bobAlwaysLoyal = false;
    bobLast = 2;
    larryLast = 1;
    firstIteration = false;
  } else if (b == 1 && l == 2){
    result = 'Larry ratted and Bob got a long stretch'
    larryPoints += 5;
    larryAlwaysLoyal = false;
    larryLast = 1;
    bobLast = 2;
    firstIteration = false;
  } else {
    result = 'Bob and Larry haven\'t properly selected choices.'
    let alertDiv = document.createElement('div');
    alertDiv.id = 'alert'
    let alertText = document.createTextNode('Bob and Larry haven\'t properly selected choices.');
    alertDiv.appendChild(alertText);
    document.getElementById('intro').appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(),7000)
    iterCheck = false;
  }
  // Output results in innerHTML
  let results = document.getElementById('results')
  let bWins = document.getElementById('bob-wins')
  let lWins = document.getElementById('larry-wins')
  results.innerHTML = `
    <p>${result}</p>
  `
  bWins.innerHTML = `&nbsp;&nbsp; ${bobPoints} pts`
  lWins.innerHTML = `&nbsp;&nbsp; ${larryPoints} pts`
};

// Function to calculate actual strategy based on loyalty
function determineStrat () {
  // Get selected strategy
  let b = document.getElementById('bob-strategy').value;
  let l = document.getElementById('larry-strategy').value;
  console.log(`Initial values: ${b} ${l}`)
  // Check if the first iteration
  if (firstIteration) {
    if (b == 3 | b == 4) {
      b = 1
    }
    if (l == 3 | l == 4) {
      l = 1
    }
    if (b == 5){
      if (document.getElementById('bob-open-stonewall').checked){
        b = 1
      }
      if (document.getElementById('bob-open-rat').checked){
        b = 2
      }
    }
    if (l == 5){
      if (document.getElementById('larry-open-stonewall').checked){
        l = 1
      }
      if (document.getElementById('larry-open-rat').checked){
        l = 2
      }
    }
    console.log(`First Iteration Change: ${b} ${l}`)
  }
  
  // Determine actual strat value for tit for tat
  if (b == 3){
    b = larryLast
  }
  if (l == 3) {
    l = bobLast
  }
  // Determine actual strategy for eternal grudge
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
  
  // Custom strategies
  let bobRandom = Math.ceil(Math.random()*100)
  let larryRandom = Math.ceil(Math.random()*100)
  console.log(`Bob random: ${bobRandom} Larry Random: ${larryRandom}`);
  if(bobLast == 1 && larryLast == 1){
    if (b == 5){
      if (bobRandom <= bobBothStonewalled.value){
        b = 1
      } else {
        b = 2
      }
    }
    if (l == 5){
      if (larryRandom <= larryBothStonewalled.value){
        l = 1
      } else {
        l = 2
      }
    }
  }
  if(bobLast == 2 && larryLast == 2){
    if (b == 5){
      if (bobRandom <= bobBothRatted.value){
        b = 1
      } else {
        b = 2
      }
    }
    if (l == 5){
      if (larryRandom <= larryBothRatted.value){
        l = 1
      } else {
        l = 2
      }
    }
  }
  if(bobLast == 2 && larryLast == 1){
    if (b == 5){
      if (bobRandom<= bobBobRatted.value){
        b = 1
      } else {
        b = 2
      }
    }
    if (l == 5){
      if (larryRandom <= larryBobRatted.value){
        l = 1
      } else {
        l = 2
      }
    }
  }
  if(bobLast == 1 && larryLast == 2){
    if (b == 5){
      if (bobRandom <= bobLarryRatted.value){
        b = 1
      } else {
        b = 2
      }
    }
    if (l == 5){
      if (larryRandom <= larryLarryRatted.value){
        l = 1
      } else {
        l = 2
      }
    }
  }
  
  console.log(`Reaction values: ${b} ${l}`)
  return {'b': b, 'l': l}

}

