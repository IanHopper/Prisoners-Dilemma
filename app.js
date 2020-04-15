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
let bothCooperate = 0;
let bothDefect = 0;
let youDefect = 0;
let accompliceDefects = 0;

// Radio button groups for custom opening variables
let youOpen = document.getElementsByName('you-open');
let accompliceOpen = document.getElementsByName('accomplice-open');

// Custom strategy percentage variables
let youBothCooperated = document.getElementById('you-both-cooperated')
let youBothDefected = document.getElementById('you-both-defected')
let youYouDefected = document.getElementById('you-you-defected')
let youAccompliceDefected = document.getElementById('you-accomplice-defected')
let accompliceBothCooperated = document.getElementById('accomplice-both-cooperated')
let accompliceBothDefected = document.getElementById('accomplice-both-defected')
let accompliceYouDefected = document.getElementById('accomplice-you-defected')
let accompliceAccompliceDefected = document.getElementById('accomplice-accomplice-defected')

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
  bothCooperate = 0;
  bothDefect = 0;
  youDefect = 0;
  accompliceDefects = 0;

  // Reset strategies
  accompliceStrat.value = 1;
  youStrat.value = 1;
  revealCustomStrat();

  // Rest custom strategy defaults
  youBothCooperated.value = 50;
  youBothDefected.value = 50;
  youYouDefected.value = 50;
  youAccompliceDefected.value = 50;
  accompliceBothCooperated.value = 50;
  accompliceBothDefected.value = 50;
  accompliceYouDefected.value = 50;
  accompliceAccompliceDefected.value = 50;
  slider();

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
  if (x > 1000) {
    x = 1000;
    document.getElementById('iterations').value = 1000;
  }
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
    bothCooperate += 1;
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
    result = 'You defected and got 5 points. Your accomplice cooperated and got no points.'
    youPoints += 5;
    youAlwaysLoyal = false;
    youLast = 2;
    accompliceLast = 1;
    firstIteration = false;
    youDefect += 1;
  } else if (b == 1 && l == 2){
    result = 'Your accomplice defected and got 5 points. You cooperated and got no points.'
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
  let totalIterations = bothCooperate + bothDefect + youDefect + accompliceDefects
  results.innerHTML = `
    <table id="results-matrix" class="table">
      <tbody>
        <thead>
          <th></th>
          <th><span class="accomplice">Accomplice</span><br>Cooperates</th>
          <th><span class="accomplice">Accomplice</span><br>Defects</th>
        </thead>
        <tr>
          <td><span class="you">You</span><br>Cooperate</td>
          <td>Mutual Cooperation<br><span class="percentage">${((bothCooperate/totalIterations)*100).toFixed(2)}% of outcomes</span><br><span class="you">You ${bothCooperate * 3}pts</span><br><span class="accomplice">Accomplice ${bothCooperate * 3}pts</span></td>
          <td>Solo Defection (Accomplice)<br><span class="percentage">${((accompliceDefects/totalIterations)*100).toFixed(2)}% of outcomes</span><br><span class="you">You 0pts</span><br><span class="accomplice">Accomplice ${accompliceDefects *5}pts</span></td>
        </tr>
        <tr>
          <td><span class="you">You</span><br>Defect</td>
          <td>Solo Defection (You)<br><span class="percentage">${((youDefect/totalIterations)*100).toFixed(2)}% of outcomes</span><br><span class="you">You ${youDefect * 5}pts</span><br><span class="accomplice">Accomplice 0pts</span></td>
          <td>Mutual Defection<br><span class="percentage">${((bothDefect/totalIterations)*100).toFixed(2)}% of outcomes</span><br><span class="you">You ${bothDefect}pts</span><br><span class="accomplice">Accomplice ${bothDefect}pts</span></td>
        </tr>
      </tbody>
    </table>
    <p class="text-center">Most recent result: ${result}</p>
  `
  document.getElementById('matrix').style.display = "none"
  bWins.innerHTML = `&nbsp;&nbsp; ${youPoints} pts`
  lWins.innerHTML = `&nbsp;&nbsp; ${accomplicePoints} pts`
  document.getElementById('scoring').scrollIntoView();

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
      if (document.getElementById('you-open-defect').checked){
        b = 2
      }
    }
    if (l == 5){
      if (document.getElementById('accomplice-open-cooperate').checked){
        l = 1
      }
      if (document.getElementById('accomplice-open-defect').checked){
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
      if (youRandom <= youBothCooperated.value){
        b = 1
      } else {
        b = 2
      }
    }
    if (l == 5){
      if (accompliceRandom <= accompliceBothCooperated.value){
        l = 1
      } else {
        l = 2
      }
    }
  }
  if(youLast == 2 && accompliceLast == 2){
    if (b == 5){
      if (youRandom <= youBothDefected.value){
        b = 1
      } else {
        b = 2
      }
    }
    if (l == 5){
      if (accompliceRandom <= accompliceBothDefected.value){
        l = 1
      } else {
        l = 2
      }
    }
  }
  if(youLast == 2 && accompliceLast == 1){
    if (b == 5){
      if (youRandom<= youYouDefected.value){
        b = 1
      } else {
        b = 2
      }
    }
    if (l == 5){
      if (accompliceRandom <= accompliceYouDefected.value){
        l = 1
      } else {
        l = 2
      }
    }
  }
  if(youLast == 1 && accompliceLast == 2){
    if (b == 5){
      if (youRandom <= youAccompliceDefected.value){
        b = 1
      } else {
        b = 2
      }
    }
    if (l == 5){
      if (accompliceRandom <= accompliceAccompliceDefected.value){
        l = 1
      } else {
        l = 2
      }
    }
  }
  
  console.log(`Reaction values: ${b} ${l}`)
  return {'b': b, 'l': l}

}

// Slider variables
let ranges = document.querySelectorAll('.range'),
    values = document.querySelectorAll('.range-value');

// Slider function
function slider (){ 
    // Loops through percentages and updates based on the slider location
    for (let val of values){
      val.innerHTML = `${val.previousSibling.previousSibling.value}%`;
      console.log(val.previousSibling.previousSibling.value)
    }
    // Listens for slider input and updates percentages based on slider location
    for (let r of ranges){
      r.addEventListener('input', ()=>{
        r.nextSibling.nextSibling.innerHTML = `${r.value}%`
      })
    }
};

slider();
