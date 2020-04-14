// This is NOT DRY code yet, but it gets the job done; refine later
// Pointers
let youPoints = 0
let accomplicePoints = 0

// Iteration variables
let firstIteration = true; // Allows checking for opening move
let iterCheck = true; // If false this stops the iterate function if strats are incorrect

// Last choice variables
let youLast = "";
let accompliceLast = "";

// Loyalty trackers
let youAlwaysLoyal = true;
let accompliceAlwaysLoyal = true;
let accompliceLoyaltyBalance = 0; // Included for future stategy options based on overall play of accomplice
let youLoyaltyBalance = 0; // Included for future stategy options based on overall play of accomplice

//Outcome counters
let bothCoooperate = 0;
let bothDefect = 0;
let youDefect = 0;
let accompliceDefects = 0;

// Radio button groups for custom opening variables
let youOpen = document.getElementsByName('you-open');
let accompliceOpen = document.getElementsByName('accomplice-open');

// Custom strategy percentage variables
let youBothcooperateed = document.getElementById('you-both-cooperateed')
let youBothRatted = document.getElementById('you-both-ratted')
let youyouRatted = document.getElementById('you-you-ratted')
let youaccompliceRatted = document.getElementById('you-accomplice-ratted')
let accompliceBothcooperateed = document.getElementById('accomplice-both-cooperateed')
let accompliceBothRatted = document.getElementById('accomplice-both-ratted')
let accompliceyouRatted = document.getElementById('accomplice-you-ratted')
let accompliceaccompliceRatted = document.getElementById('accomplice-accomplice-ratted')

// Calculate button variable
let calculate = document.getElementById('submit');

// Event listener for calculate button
calculate.addEventListener('click', iterate);

// Event listener for reset button
document.getElementById('reset').addEventListener('click', reset)

// Event listener for custom strategy
const accompliceStrat = document.getElementById('accomplice-strategy');
const youStrat = document.getElementById('you-strategy');
accompliceStrat.addEventListener('change', revealCustomStrat)
youStrat.addEventListener('change', revealCustomStrat)

// Reveal Custom Strategies
function revealCustomStrat() {
  let customyou = document.getElementById('you-custom-strat');
  let customaccomplice = document.getElementById('accomplice-custom-strat');
  let bv = youStrat.value;
  let lv = accompliceStrat.value;
  if (bv == 5){
    customyou.style.display = "";
  } else {
    customyou.style.display = "none";
    youOpen.forEach(x => x.checked = false)
  }
  if (lv == 5){
    customaccomplice.style.display = "";
  } else {
    customaccomplice.style.display = "none";
    accompliceOpen.forEach(x => x.checked = false)
  }
}

// Reset function for page data; does not reload page
function reset() {
  console.log("Values reset")

  // Reset point counters
  youPoints = 0
  accomplicePoints = 0

  // Iteration variables
  firstIteration = true;
  iterCheck = true;

  // Reset loyalty rackers
  youLast = "";
  accompliceLast = "";
  youAlwaysLoyal = true;
  accompliceAlwaysLoyal = true;
  accompliceLoyaltyBalance = 0;
  youLoyaltyBalance = 0;

  //Outcome counters
  bothCoooperate = 0;
  bothDefect = 0;
  youDefect = 0;
  accompliceDefects = 0;

  // Reset strategies
  accompliceStrat.value = 1;
  youStrat.value = 1;
  revealCustomStrat();

  // Clear innerHTML data
  let results = document.getElementById('scoring')
  let bWins = document.getElementById('you-wins')
  let lWins = document.getElementById('accomplice-wins')
  results.innerHTML = '';
  bWins.innerHTML = '';
  lWins.innerHTML = '';
  document.getElementById('matrix').style.display = ""
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
    result = 'You both cooperated and got 3 points each.'
    youPoints += 3;
    accomplicePoints += 3;
    youLast = 1;
    accompliceLast = 1;
    firstIteration = false;
    bothCoooperate += 1;
  } else if (b == 2 && l == 2) {
    result = 'You both defected and got 1 point each'
    youPoints += 1;
    accomplicePoints += 1;
    youAlwaysLoyal = false;
    accompliceAlwaysLoyal = false;
    youLast = 2;
    accompliceLast = 2;
    firstIteration = false;
    bothDefect += 1;
  } else if (b == 2 && l == 1) {
    result = 'You defected and got 5 points. Your accomplice cooperated and got 1 point.'
    youPoints += 5;
    youAlwaysLoyal = false;
    youLast = 2;
    accompliceLast = 1;
    firstIteration = false;
    youDefect += 1;
  } else if (b == 1 && l == 2){
    result = 'Your accomplice defected and got 5 points. You cooperated and got 1 point.'
    accomplicePoints += 5;
    accompliceAlwaysLoyal = false;
    youLast = 1;
    accompliceLast = 2;
    firstIteration = false;
    accompliceDefects += 1;
  } else {
    result = `<h3 id="alert"> You and your accomplice haven\'t properly selected choices.</h3>`
    iterCheck = false;
  }
  // Output results in innerHTML
  let results = document.getElementById('scoring')
  let bWins = document.getElementById('you-wins')
  let lWins = document.getElementById('accomplice-wins')
  results.innerHTML = `
    <p>
    <h6>In total here have been:</h6>${bothCoooperate} mutual cooperations<br> ${bothDefect} mutual defections<br> ${youDefect} solo defections by you<br> ${accompliceDefects} solo defections by your accomplice.
    </p>
    <p class="text-center">Most recent result: ${result}</p>
  `
  document.getElementById('matrix').style.display = "none"
  bWins.innerHTML = `&nbsp;&nbsp; ${youPoints} pts`
  lWins.innerHTML = `&nbsp;&nbsp; ${accomplicePoints} pts`

  // Last values
  console.log(`you Last: ${youLast} accomplice Last: ${accompliceLast}`)
};

// Function to calculate actual strategy based on loyalty
function determineStrat () {
  // Get selected strategy
  let b = document.getElementById('you-strategy').value;
  let l = document.getElementById('accomplice-strategy').value;
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
      if (document.getElementById('you-open-cooperate').checked){
        b = 1
      }
      if (document.getElementById('you-open-rat').checked){
        b = 2
      }
    }
    if (l == 5){
      if (document.getElementById('accomplice-open-cooperate').checked){
        l = 1
      }
      if (document.getElementById('accomplice-open-rat').checked){
        l = 2
      }
    }
    console.log(`First Iteration Change: ${b} ${l}`)
  }
  
  // Determine actual strat value for tit for tat
  if (b == 3){
    b = accompliceLast
  }
  if (l == 3) {
    l = youLast
  }
  // Determine actual strategy for eternal grudge
  if (b == 4){
    if (accompliceAlwaysLoyal == true) {
      b = 1
    } else {
      b = 2
    }
  }
  if (l == 4){
    if (youAlwaysLoyal == true) {
      l = 1
    } else {
      l = 2
    }
  }
  
  // Custom strategies
  let youRandom = Math.ceil(Math.random()*100)
  let accompliceRandom = Math.ceil(Math.random()*100)
  console.log(`you random: ${youRandom} accomplice Random: ${accompliceRandom}`);
  if(youLast == 1 && accompliceLast == 1){
    if (b == 5){
      if (youRandom <= youBothcooperateed.value){
        b = 1
      } else {
        b = 2
      }
    }
    if (l == 5){
      if (accompliceRandom <= accompliceBothcooperateed.value){
        l = 1
      } else {
        l = 2
      }
    }
  }
  if(youLast == 2 && accompliceLast == 2){
    if (b == 5){
      if (youRandom <= youBothRatted.value){
        b = 1
      } else {
        b = 2
      }
    }
    if (l == 5){
      if (accompliceRandom <= accompliceBothRatted.value){
        l = 1
      } else {
        l = 2
      }
    }
  }
  if(youLast == 2 && accompliceLast == 1){
    if (b == 5){
      if (youRandom<= youyouRatted.value){
        b = 1
      } else {
        b = 2
      }
    }
    if (l == 5){
      if (accompliceRandom <= accompliceyouRatted.value){
        l = 1
      } else {
        l = 2
      }
    }
  }
  if(youLast == 1 && accompliceLast == 2){
    if (b == 5){
      if (youRandom <= youaccompliceRatted.value){
        b = 1
      } else {
        b = 2
      }
    }
    if (l == 5){
      if (accompliceRandom <= accompliceaccompliceRatted.value){
        l = 1
      } else {
        l = 2
      }
    }
  }
  
  console.log(`Reaction values: ${b} ${l}`)
  return {'b': b, 'l': l}

}

