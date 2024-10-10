let publicOrder = 50;
let democracy = 50;
let law = 50;
let rebelStrength = 50;
let militaryStrength = 50;
let personalSecurity = 50;
let funds = 500;
let gameDay = 1;
let timeOfDay = 1;

// text
const infoText = document.querySelector("#info-text");

// buttons
document.getElementById('start-button').onclick = startGame;
const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const button4 = document.querySelector('#button4');
const button5 = document.querySelector("#button5");
const button6 = document.querySelector("#button6");

// stats
const publicOrderText = document.querySelector("#publicOrderValueText");
const democracyValueText = document.querySelector("#democracyValueText");
const lawValueText = document.querySelector("#lawValueText");
const rebelStrengthValueText = document.querySelector("#rebelStrengthValueText");
const militaryStrengthValueText = document.querySelector("#militaryStrengthValueText");
const personalSecurityText = document.querySelector("#personalSecurityText");
const fundsValueText = document.querySelector("#fundsValueText");
const dayValueText = document.querySelector("#dayValueText");
const timeValueText = document.querySelector("#timeValueText");

var foreword = document.getElementById('foreword-box');
var gameBox = document.getElementById('game');

// image
var img = document.getElementById("game-image");

// locations
const locations = [
  {
    name: "meet public",
    "button text": ["Praise the people", "Give a donation to the people (-100)", "Purchase new infrustructure (-500)", "Root out rebels", "Demand reverence", "Back to Office"],
    "button functions": [greetPublic, giveDonation, newInfrastructure, rootOutRebels, warnPeople, office],
    text: "You greet the common people of your nation.",
  },
  {
    name: "meet generals",
    "button text": ["Order attack on rebels", "Invest in more weapons (-500)", "Re-allocate military spending (+100)", "Recruit personal guard (-100)", "Create Nationalist propaganda", "Back to Office"],
    "button functions": [attackRebels, investWeapons, milSpending, recruitMil, propaganda, office],
    text: "You arrive at the military HQ, and call a meeting with the General of the Armed Forces."
  },
  {
    name: "meet rebels",
    "button text": ["Pay Tribute (-1000)", "Order attack on rebels", "Offer civilian territory", "Allow some illegal activities", "Offer work in military (-100)", "Back to Office"],
    "button functions": [smallTribute, attackRebels, offerCivTerritory, allowIllegal, offerWork, office],
    text: "You arrive at the rebel compund, and meet with the rebel leader."
  },
  {
    name: "meet police",
    "button text": ["Arrest minor offenders", "Make propaganda speech", "Invest more in weapons (-100)", "Create community outreach programs", "Recruit personal guard", "Back to Office"],
    "button functions": [arrestMinor, makeSpeech, investMorePolice, communityOutreach, recruitPolice, office],
    text: "You arrive at the Police HQ, and speak with the Chief of Police."
  },
  {
    name: "meet bank",
    "button text": ["Print more money", "Take out a loan from a foreign country", "Lower interest rates", "Temporarily suspend all banking services", "Confiscate citizen's private bank funds", "Back to Office"],
    "button functions": [printMoney, foreignLoan, lowerRates, suspendBanks, confiscateMoney, office],
    text: "You arrive at the National Bank and speak with the Director of the National bank."
  },
  {
    name: "meet security",
    "button text": ["Convene with security team", "Assign a double (-1000)", "Enter Presidential shelter", "Convene with security team", "Assign a double (-1000)", "Back to Office"],
    "button functions": [securityMeeting, createDouble, enterShelter, securityMeeting, createDouble, office],
    text: "You call a meeting with your personal security team leader."
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?", "REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart, restart, restart, restart],
    text: "The nation mourns its lost leader. Perhaps the next president can do better."
  },
  { 
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?", "REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart, restart, restart, restart],
    text: "Congratulations! You have survived as president for 30 days." 
  },
  { 
   name: "office", 
   "button text": ["Meet with Public", "Meet with Generals", "Meet with Rebels", "Meet with Police Chief", "Meet with Bank", "Meet with Personal Security"],
   "button functions": [meetPublic, meetGenerals, meetRebels, meetPolice, meetBank, meetSecurity],
   text: "What is the next item on your itinary Mr. President?" 
  }
];

// initialize buttons
button1.onclick = meetPublic;
button2.onclick = meetGenerals;
button3.onclick = meetRebels;
button4.onclick = meetPolice;
button5.onclick = meetBank;
button6.onclick = meetSecurity;


// functions
function update(location) {
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button4.innerText = location["button text"][3];
  button5.innerText = location["button text"][4];
  button6.innerText = location["button text"][5];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  button4.onclick = location["button functions"][3];
  button5.onclick = location["button functions"][4];
  button6.onclick = location["button functions"][5];
  infoText.innerHTML = location.text;
}

function resetButtons() {
  button1.innerText = "back";
  button2.innerText = "back";
  button3.innerText = "back";
  button4.innerText = "back";
  button5.innerText = "back";
  button6.innerText = "back";
  button1.onclick = office;
  button2.onclick = office;
  button3.onclick = office;
  button4.onclick = office;
  button5.onclick = office;
  button6.onclick = office;
}

function nextButtons(func) {
  button1.innerText = "next";
  button2.innerText = "next";
  button3.innerText = "next";
  button4.innerText = "next";
  button5.innerText = "next";
  button6.innerText = "next";
  button1.onclick = func;
  button2.onclick = func;
  button3.onclick = func;
  button4.onclick = func;
  button5.onclick = func;
  button6.onclick = func;
}

function binaryButtons(respA, respB, funcA, funcB) {
  button1.innerText = respA;
  button2.innerText = respA;
  button3.innerText = respA;
  button4.innerText = respB;
  button5.innerText = respB;
  button6.innerText = respB;
  button1.onclick = funcA;
  button2.onclick = funcA;
  button3.onclick = funcA;
  button4.onclick = funcB;
  button5.onclick = funcB;
  button6.onclick = funcB;
}

function startGame() {
  foreword.style.display = 'none';
  gameBox.style.display = 'block';
  office();
  playBGM();
}

function updateTimeOfDay() {
  timeOfDay++;
  timeValueText.innerText = getTimeOfDay(timeOfDay);
}

function newDay() {
  gameDay++;
  img.src = '/static/ap/african president images/office.jpg';
  checkWinDay()
  dayValueText.innerHTML = gameDay;
  funds += democracy * 2;
  dailyStatDrip();
}

function checkWinDay() {
  if (gameDay == 31) {
    img.src = '/static/ap/african president images/africa.jpg';
    infoText.innerText = "Congratulations Mr. President! You have held our great nation together for 30 days!";
    nextButtons(winGame);
  }
}

function getTimeOfDay(time) {
  let timeOfDayString;
  if (time % 3 === 1) {
    timeOfDayString = "morning";
  } else if (time % 3 === 2) {
    timeOfDayString = "midday";
  } else if (time % 3 === 0) {
    timeOfDayString = "evening";
  }
  return timeOfDayString;
}

function keepWithinPercent() {
  if (publicOrder > 100) {
    publicOrder = 100;
  } else if (publicOrder < 0) {
    publicOrder = 0;
  }
  if (rebelStrength > 100) {
    rebelStrength = 100;
  } else if (rebelStrength < 0) {
    rebelStrength = 0;
  }  
  if (democracy > 100) {
    democracy = 100;
  } else if (democracy < 0) {
    democracy = 0;
  }  
  if (law > 100) {
    law = 100;
  } else if (law < 0) {
    law = 0;
  }  
  if (militaryStrength > 100) {
    militaryStrength = 100;
  } else if (militaryStrength < 0) {
    militaryStrength = 0;
  }  
  if (personalSecurity > 100) {
    personalSecurity = 100;
  } else if (personalSecurity < 0) {
    personalSecurity = 0;
  }
}

const soundEffects = {
  assassinFailSound: new Audio('/static/ap/african president sounds/assassinationfail.mp3'),
  assassinWinSound: new Audio('/static/ap/african president sounds/assassinwin.mp3'),
  attackSound: new Audio('/static/ap/african president sounds/attack.mp3'),
  loseSound: new Audio('/static/ap/african president sounds/lose.mp3'),
  officeSound: new Audio('/static/ap/african president sounds/office.mp3'),
  terrorSound: new Audio('/static/ap/african president sounds/terror.mp3'),
  weaponsSound: new Audio('/static/ap/african president sounds/weapons.mp3'),
  winSound: new Audio('/static/ap/african president sounds/win.mp3'),
  // Add more sound effects as needed
};

const bgmTracks = {
  bgm1: new Audio('/static/ap/african president music/bgm1.mp3'),
  bgm2: new Audio('/static/ap/african president music/bgm2.mp3'),
  bgm3: new Audio('/static/ap/african president music/bgm3.mp3'),
};

function playSoundEffect(effectName) {
  if (soundEffects[effectName]) {
      soundEffects[effectName].currentTime = 0; // Reset the playback time
      soundEffects[effectName].play();
  } else {
      console.error(`Sound effect ${effectName} not found!`);
  }
}

function stopWinMusic() {
  winSound.pause();
  winSound.currentTime = 0;
}


function playBGM() {
  let currentTrackIndex = 0;

  function playNextTrack() {
    if (currentTrackIndex >= Object.keys(bgmTracks).length) {
      currentTrackIndex = 0; // Reset to the first track
    }

    let currentTrackName = Object.keys(bgmTracks)[currentTrackIndex];
    let currentTrack = bgmTracks[currentTrackName];

    // Pause all tracks
    Object.values(bgmTracks).forEach(track => {
      if (!track.paused) {
        track.pause();
      }
    });

    // Play the current track
    currentTrack.currentTime = 0; // Reset track to beginning
    currentTrack.volume = 0.5; // Set volume (adjust as needed)
    currentTrack.loop = true; // Enable loop (adjust as needed)
    currentTrack.play().catch(error => {
      console.error(`Error playing ${currentTrackName}:`, error);
    });

    currentTrack.addEventListener('ended', () => {
      currentTrackIndex++;
      playNextTrack();
    });
  }

  playNextTrack(); // Start playing the first track
}

function stopBGM() {
  for (let track in bgmTracks) {
      bgmTracks[track].pause();
      bgmTracks[track].currentTime = 0;
  }
}

function checkIfCanAfford(price) {
  if (funds < price) {
    return false;
  } else {
    return true;
  }
}

function updateStats() {
  keepWithinPercent();
  publicOrderText.innerText = Math.floor(publicOrder);
  document.getElementById('publicOrderValue').style.width = publicOrder + "%";
  let publicOrderRemainder = 100 - publicOrder;
  document.getElementById('publicOrderValueRemainder').style.width = publicOrderRemainder + "%";

  rebelStrengthValueText.innerText = Math.floor(rebelStrength);
  document.getElementById('rebelStrengthValue').style.width = rebelStrength + "%";
  let rebelStrengthRemainder = 100 - rebelStrength;
  document.getElementById('rebelStrengthValueRemainder').style.width = rebelStrengthRemainder + "%";

  democracyValueText.innerText = Math.floor(democracy);
  document.getElementById('democracyValue').style.width = democracy + "%";
  let democracyValueRemainder = 100 - democracy;
  document.getElementById('democracyValueRemainder').style.width = democracyValueRemainder + "%";

  lawValueText.innerText = Math.floor(law);
  document.getElementById('democracyValue').style.width = democracy + "%";
  let lawValueRemainder = 100 - law;
  document.getElementById('lawValueRemainder').style.width = lawValueRemainder + "%";
  
  militaryStrengthValueText.innerText = Math.floor(militaryStrength);
  document.getElementById('militaryStrengthValue').style.width = democracy + "%";
  let militaryStrengthValueRemainder = 100 - militaryStrength;
  document.getElementById('militaryStrengthValueRemainder').style.width = militaryStrengthValueRemainder + "%";

  personalSecurityText.innerText = Math.floor(personalSecurity);
  document.getElementById('personalSecurityValue').style.width = personalSecurity + "%";
  let personalSecurityValueRemainder = 100 - personalSecurity;
  document.getElementById('personalSecurityValueRemainder').style.width = personalSecurityValueRemainder + "%";
  
  fundsValueText.innerHTML = Math.floor(funds);

}

// location functions
function meetPublic() {
  img.src = '/static/ap/african president images/meetPublic.jpg';
  update(locations[0]);
  assassinationWindow();
}

function greetPublic() {
  if (publicOrder >= 80) {
    infoText.innerText = "You praise your loyal and loving citizens. The large crowd errupts 'May the President live long!'";
    const randomBonus = (Math.floor(Math.random() * 20)) + 1;
    publicOrder += randomBonus;
    rebelStrength -= randomBonus;
    democracy += democracy * 0.1;
    infoText.innerText += `" Public order rises by ${randomBonus}%. Rebel strength decreases by ${randomBonus}%.`;
    updateStats();
    resetButtons();
  } else if (publicOrder >= 60) {
    infoText.innerText = "You praise the efforts your loyal and loving citizens. The crowd errupts 'God bless the president!'";
    const randomBonus = (Math.floor(Math.random() * 10)) + 1;
    publicOrder += randomBonus;
    rebelStrength -= randomBonus;
    democracy += democracy * 0.1;
    infoText.innerText += `" Public order rises by ${randomBonus}%. Rebel strength decreases by ${randomBonus}%.`;
    updateStats();
    resetButtons();
  } else {
    infoText.innerText = "You greet your citizens.";
    const randomBonus = (Math.floor(Math.random() * 5)) + 1;
    publicOrder += randomBonus;
    rebelStrength -= randomBonus;
    democracy += democracy * 0.1;
    infoText.innerText += `" Public order rises by ${randomBonus}%. Rebel strength decreases by ${randomBonus}%.`;
    updateStats();
    resetButtons();
  }
}

function giveDonation() {
  if (checkIfCanAfford(100)) {
      img.src = '/static/ap/african president images/giveDonation.jpg';
  infoText.innerText = "You publicly donate money to the local crowd. The crowd gratefully recieve your gifts";
  const randomBonus = (Math.floor(Math.random() * 20)) + 1;
  publicOrder += randomBonus + 1;
  rebelStrength -= (randomBonus + 1) / 2;
  democracy += (randomBonus + 1) / 2;
  funds -= 100;
  infoText.innerText += ` Public order rises by ${randomBonus}%. Rebel strength decreases by ${randomBonus / 2}%. Democracy decreases by ${randomBonus / 2}%. 100 funds deducted.`;
  updateStats();
  resetButtons();
  } else {
    infoText.innerText = "Insufficient funds.";
    resetButtons();
  }
}

function newInfrastructure() {
  if (checkIfCanAfford(500)) {
    infoText.innerText = "You spend funds to build new infrastructure that will help you citizens. The crowd errupts 'Praise the president!'";
    const randomBonus = (Math.floor(Math.random() * 20)) + 1;
    publicOrder += randomBonus + 1;
    rebelStrength -= (randomBonus + 1) / 2;
    democracy += (randomBonus + 1) / 2;
    funds -= 500;
    infoText.innerText += ` Public order rises by ${randomBonus}%. Rebel strength decreases by ${randomBonus / 2}%. Democracy increases by ${randomBonus / 2}%. 500 funds deducted.`;
    updateStats();
    resetButtons();
  } else {
    infoText.innerText = "Insufficient funds.";
    resetButtons();
  }
}

function rootOutRebels() {
  const chanceOfRebels = rebelStrength / 10 + Math.floor(Math.random() * 5);
  if (chanceOfRebels >= 5) {
    playSoundEffect('attackSound');
    img.src = '/static/ap/african president images/goodRootOut.jpg';
    infoText.innerText = "In a coordinated strike, you send special forces into the local area. It doesn't take long for the special forces to open fire on a rebel cell. When the dust settles, a dozen dead rebels lay in the street, and weapon caches are captured.";
    const randomBonus = Math.floor(Math.random() * 5 + 1);
    publicOrder += randomBonus;
    rebelStrength -= randomBonus;
    democracy += randomBonus;
    funds += randomBonus * 20;
    law += randomBonus * 2;
    infoText.innerText += `" Public order rises by ${randomBonus}%. Rebel strength decreases by ${randomBonus}%. Democracy decreases by ${randomBonus / 2}%. +${randomBonus * 20} funds confiscated`;
    updateStats();
    resetButtons();
  } else {
    playSoundEffect('attackSound');
    img.src = '/static/ap/african president images/badRootOut.jpg';
    infoText.innerText = "In a coordinated strike, you send special forces into the local area. It doesn't take long for the special forces to open fire. When the dust settles, a dozen dead civilians lay in the street.";
    const randomBonus = Math.floor(Math.random() * 20 + 1);
    publicOrder -= randomBonus;
    rebelStrength += randomBonus;
    democracy -= randomBonus;
    infoText.innerText += `" Public order drops by ${randomBonus}%. Rebel strength increases by ${randomBonus}%. Democracy decreases by ${randomBonus / 2}%.`;
    updateStats();
    resetButtons();
  }
}

function warnPeople() {
  const randomBonus = Math.floor(Math.random() * 15 + 1);
  if (publicOrder >= rebelStrength) {
    img.src = '/static/ap/african president images/poorCiv.jpg';
    infoText.innerText = "You take no time to demand the locals salute you, and offer their most prized produce with you";
    if (law >= rebelStrength) {
      publicOrder -= randomBonus;
      rebelStrength += randomBonus;
      democracy -= randomBonus;
      funds += randomBonus * 20;
      infoText.innerText += `" Public order lowers by ${randomBonus}%. Rebel strength increases by ${randomBonus}%. Democracy decreases by ${randomBonus / 2}%. +${randomBonus * 20} funds confiscated`;
      resetButtons();
      updateStats();
    }
  } else {
    assassinationAttempt();
  }
}

function meetGenerals() {
  img.src = '/static/ap/african president images/meetGen.jpg';
  update(locations[1]);
  assassinationWindow();
}

function attackRebels() {
  if (rebelStrength > militaryStrength) {
    playSoundEffect('weaponsSound');
    infoText.innerText = "Are you sure you want to attack? The rebels have the advantage.";
    binaryButtons("Attack", "Cancel", attackRebelsCont, meetGenerals);
  } else {
    attackRebelsCont()
  }
}

function attackRebelsCont() {
  const rebelLuck = Math.floor(Math.random() * 20 + 1);
  const militaryLuck = Math.floor(Math.random() * 20 + 1);
  if (militaryLuck + militaryStrength >= rebelLuck + rebelStrength) {
    playSoundEffect('attackSound');
    img.src = '/static/ap/african president images/goodRootOut.jpg';
    infoText.innerText = "Our forces smashed the enemy! The rebels scatter and run.";
    rebelStrength -= ((rebelStrength * 0.5) + militaryLuck);
    publicOrder += ((rebelStrength * 0.5) + militaryLuck);
    militaryStrength -= militaryStrength * 0.1;
    democracy -= democracy * 0.25;
    resetButtons();
    updateStats();
  } else {
    playSoundEffect('attackSound');
    img.src = '/static/ap/african president images/badAttack.jpg';
    infoText.innerText = "The rebel forces have overwhelmed our forces. Pull back!";
    militaryStrength -= ((militaryStrength * 0.5) + militaryLuck);
    publicOrder -= ((militaryStrength * 0.5) + militaryLuck);
    rebelStrength += ((rebelStrength * 0.5) + rebelLuck);
    democracy -= democracy * 0.5;
    resetButtons();
    updateStats();
  }
}

function investWeapons() {
  if (checkIfCanAfford(500)) {
    playSoundEffect('weaponsSound');
    infoText.innerText = "You see that a new stockpile of weapons and equipment reaches your military. -500 funds.";
    militaryStrength += militaryStrength * 0.15;
    funds -= 500;
    resetButtons();
    updateStats();
  } else {
    infoText.innerText = "Insufficient funds.";
    resetButtons();
  }
}

function milSpending() {
  infoText.innerText = "You decide that the military budget is too large. +500 funds.";
  militaryStrength -= militaryStrength * 0.15;
  funds += 500;
  resetButtons();
  updateStats();
}

function recruitMil() {
  if (checkIfCanAfford(100)) {
    playSoundEffect('weaponsSound');
    img.src = '/static/ap/african president images/recruit.jpg';
    infoText.innerText = "You choose some talented soldiers to join your personal security team. -100 funds.";
    militaryStrength -= militaryStrength * 0.15;
    funds -= 100;
    personalSecurity += militaryStrength * 0.15;
    resetButtons();
    updateStats();
  } else {
    infoText.innerText = "Insufficient funds.";
    resetButtons();
  }
}

function propaganda() {
  if (checkIfCanAfford(100)) {
    img.src = '/static/ap/african president images/enlist.jpg';
    infoText.innerText = "You lend your charasmatic face to some National military enlistment billboards. -100 funds.";
    militaryStrength += militaryStrength * 0.15
    funds -= 100;
    resetButtons();
    updateStats();
  } else {
    infoText.innerText = "Insufficient funds.";
    resetButtons();
  }
}

function meetRebels() {
  img.src = '/static/ap/african president images/meetRebels.jpg';
  update(locations[2]);
  assassinationWindow();
}

function smallTribute() {
  if (checkIfCanAfford(1000)) {
    infoText.innerText = "You offer a tribute to the rebels to quell their hostilities. -1000 funds.";
    rebelStrength -= rebelStrength * 0.5;
    funds -= 1000;
    resetButtons();
    updateStats();
  }
  else {
    infoText.innerText = "Insufficient funds.";
    resetButtons();
  }

}

function offerCivTerritory() {
  infoText.innerText = "You offer a small piece of territory to the rebels to quell their hostilities.";
  rebelStrength -= rebelStrength * 0.5;
  publicOrder -= publicOrder * 0.25;
  democracy -= democracy * 0.4;
  resetButtons();
  updateStats();
}

function allowIllegal() {
  infoText.innerText = "You offer to turn a blind eye to some of the rebels' crimes.";
  rebelStrength -= rebelStrength * 0.2;
  publicOrder -= publicOrder * 0.25;
  democracy -= democracy * 0.25;
  law -= law * 0.25;
  resetButtons();
  updateStats();
}

function offerWork() {
  if (checkIfCanAfford(100)) {
    playSoundEffect('weaponsSound');
    img.src = '/static/ap/african president images/recruit.jpg';
    infoText.innerText = "You recruit some rebels to fight in your army against other rebel groups. -100 funds.";
    militaryStrength += militaryStrength * 0.15;
    funds -= 100;
    rebelStrength -= rebelStrength * 0.15;
    resetButtons();
    updateStats();
  } else {
    infoText.innerText = "Insufficient funds.";
    resetButtons();
  }

}

function meetPolice() {
  playSoundEffect('officeSound');
  img.src = '/static/ap/african president images/meetPolice.jpg';
  update(locations[3]);
  assassinationWindow();
}

function arrestMinor() {
  img.src = '/static/ap/african president images/arrestMinor.jpg';
  infoText.innerText = "You take a stronger stance on crime. Minor offences will now be treated more severely.";
  law += law * 0.25;
  publicOrder += publicOrder * 0.15;
  rebelStrength -= rebelStrength * 0.2;
  democracy -= democracy * 0.2;
  resetButtons();
  updateStats();
}

function makeSpeech() {
  if (checkIfCanAfford(100)) {
      img.src = '/static/ap/african president images/speech.jpg';
  infoText.innerText = "You lend your charasmatic voice to give a rousing PSA on lowering crime. -100 funds.";
  law += law * 0.1
  funds -= 100;
  democracy += democracy * 0.1;
  resetButtons();
  updateStats();
  } else {
  infoText.innerText = "Insufficient funds.";
  resetButtons();
  }
}

function investMorePolice() {
  if (checkIfCanAfford(100)) {
    playSoundEffect('weaponsSound');
    infoText.innerText = "Looking around the department, you notice that a little extra funding might go a long way. -250 funds.";
    law += law * 0.15;
    funds -= 250;
    resetButtons();
    updateStats();
  } else {
    infoText.innerText = "Insufficient funds.";
    resetButtons();
}
}

function communityOutreach() {
  if (checkIfCanAfford(250)) {
    img.src = '/static/ap/african president images/community.jpg';
    infoText.innerText = "You work with police in a community outreach event to encourage lawful behaviour. Funds -250";
    law += law * 0.15;
    publicOrder += publicOrder * 0.1;
    rebelStrength -= rebelStrength * 0.2;
    democracy += democracy * 0.1;
    funds -= 250;
    resetButtons();
    updateStats();
  } else {
    infoText.innerText = "Insufficient funds.";
    resetButtons();
}
}

function recruitPolice() {
  if (checkIfCanAfford(100)) {
    playSoundEffect('weaponsSound');
    img.src = '/static/ap/african president images/recruit.jpg';
    infoText.innerText = "You choose some talented soldiers to join your personal security team. -100 funds.";
    militaryStrength -= militaryStrength * 0.15;
    funds -= 100;
    personalSecurity += militaryStrength * 0.15;
    resetButtons();
    updateStats();
  } else {
    infoText.innerText = "Insufficient funds.";
    resetButtons();
  }
}

function meetBank() {
  playSoundEffect('officeSound');
  img.src = '/static/ap/african president images/meetBank.jpg';
  update(locations[4]);
  assassinationWindow();
}

function printMoney() {
  img.src = '/static/ap/african president images/printMoney.jpg';
  const inflation = Math.floor(Math.random() * 20 + 1);
  infoText.innerText = `You print more national currency. This will reduce the value of your currency due to inflation, but in the short term, you have raised your funds by ${inflation}%.`;
  funds += (funds / inflation);
  publicOrder -= inflation / 2;
  rebelStrength += inflation / 2;
  democracy -= inflation / 2;
  law -= inflation / 2;
  militaryStrength -= inflation / 2;
  updateStats();
  resetButtons();
}
function foreignLoan() {
  img.src = '/static/ap/african president images/printMoney.jpg';
  const loan = Math.floor(Math.random() * ((publicOrder + law + militaryStrength) / 10)) + 500;
  infoText.innerText = `You take a loan from a foreign country. Funds +${loan}, Democracy -${loan / 1.5}%, Public Order +${loan / 2}%, Military strength +${loan / 3}%, Law +${loan / 3}%, Rebel Strength -${loan / 2}%.`;
  funds += loan;
  publicOrder += loan / 2;
  rebelStrength -= loan / 2;
  publicOrder += loan / 2;
  militaryStrength += loan / 3;
  law += loan / 3;
  updateStats();
  resetButtons();
}

function lowerRates() {
  const happyBoost = Math.floor(Math.random() * 30 + 5);
  const ratesLower = funds / 10;
  infoText.innerText = `You lower interest rates costing %10 of your current funds. Funds -${funds / 10}, Democracy +${happyBoost}%, Public Order +${happyBoost}%, Military strength +${happyBoost / 3}%, Law +${happyBoost / 3}%, Rebel Strength -${happyBoost}%.`;
  funds -= ratesLower;
  if (funds < 0) {
    funds = 0;
  }
  publicOrder += happyBoost;
  democracy += happyBoost;
  rebelStrength -= happyBoost;
  militaryStrength += happyBoost / 3;
  law += happyBoost / 3;
  updateStats();
  resetButtons();
}

function suspendBanks() {
  img.src = '/static/ap/african president images/suspend.jpg';
  const sadBoost = Math.floor(Math.random() * 10);
  infoText.innerText = `You temporarily suspend banking services to your people to stabilize your funds. Funds +${funds}, Democracy -${sadBoost}%, Public Order -${sadBoost}%, Military strength -${sadBoost / 2}%, Law -${sadBoost / 2}%, Rebel Strength +${sadBoost}%.`;
  funds = funds * 2;
  publicOrder -= sadBoost;
  democracy -= sadBoost;
  rebelStrength += sadBoost;
  militaryStrength -= sadBoost / 2;
  law -= sadBoost / 2;
  updateStats();
  resetButtons();
}

function confiscateMoney() {
  img.src = '/static/ap/african president images/confiscate.jpg';
  const civMoneyBoost = Math.floor(Math.random() * 20) + 1;
  const civMoney = funds * civMoneyBoost;
  infoText.innerText = `You confiscate the private funds of your citizens! This will have grave consequences. Funds +${funds}, Democracy -${sadBoost}%, Public Order -${sadBoost}%, Military strength -${sadBoost / 2}%, Law -${sadBoost / 2}%, Rebel Strength +${sadBoost}%.`;
  funds += civMoney;
  publicOrder = publicOrder * 0.1;
  democracy -= sadBoost;
  rebelStrength += sadBoost;
  militaryStrength -= sadBoost / 2;
  law -= sadBoost / 2;
  updateStats();
  resetButtons();
}

function meetSecurity() {
  img.src = '/static/ap/african president images/meetSecurity.jpg';
  update(locations[5]);
  assassinationWindow();
}

function securityMeeting() {
  infoText.innerText = "You convene with your security team and discuss measures to increase your safety. Personal Security +20%.";
  personalSecurity += personalSecurity * 0.2;
  updateStats();
  resetButtons();
}

function createDouble() {
  if (checkIfCanAfford(1000)) {
    img.src = '/static/ap/african president images/double.jpg';
    infoText.innerText = "You assign one of your security team members to act as your double, in an attempt to misdirect would be assassins. -1000 funds. Democracy - 20%. Personal Security +100%.";
    funds -= 1000;
    democracy -= democracy * 0.2;
    personalSecurity += personalSecurity;
    updateStats();
    resetButtons();
  } else {
    infoText.innerText = "Insufficient funds.";
    resetButtons();
  }
}

function enterShelter() {
  img.src = '/static/ap/african president images/shelter.jpg';
  infoText.innerText = "You are in your presidential shelter. Personal Security +50%. Democracy -10%. Public Order -10%. Rebel Strength +10%.";
  democracy -= democracy * 0.1;
  personalSecurity += personalSecurity * 0.5;
  rebelStrength += rebelStrength * 0.1;
  publicOrder -= publicOrder * 0.1;
  if (timeOfDayString == 'evening') {
    newDay();
    infoText.innerText = `Good morning Mr. President. You rest the night in the shelter. It is now day ${gameDay}.`;
    updateTimeOfDay();
    updateStats();
    timeValueText.innerText = timeOfDayString;
    dayValueText.innerHTML = gameDay;
    binaryButtons("stay in shelter", "leave shelter", enterShelter, office);
  } else {
    updateTimeOfDay();
    updateStats();
    timeValueText.innerText = timeOfDayString;
    dayValueText.innerHTML = gameDay;
    binaryButtons("stay in shelter", "leave shelter", enterShelter, office);
  }

}

function lose() {
  stopBGM();
  playSoundEffect('loseSound');
  img.src = '/static/ap/african president images/lose.jpg';
  update(locations[6]);
}

function winGame() {
  stopBGM();
  playSoundEffect('winSound');
  img.src = '/static/ap/african president images/win.jpg';
  update(locations[7]);
  fetch('/african_president/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')  // Include the CSRF token
    },
    body: JSON.stringify({})
})
.then(response => response.json())
.then(data => {
    console.log(data.message); // Optionally display a message or handle response
})
.catch(error => console.error('Error:', error));
}


function office() {
  img.src = '/static/ap/african president images/office.jpg';
  update(locations[8]);
  timeOfDayString = getTimeOfDay(timeOfDay);
  if (timeOfDayString == 'evening') {
    newDay();
    infoText.innerText = `Good morning Mr. President. What is your first order of business for day ${gameDay} of your presidency?`;
    randomEvent();
  } else {
    infoText.innerText = `What is your next order of business for today?`;
  }
  updateTimeOfDay();
  updateStats();
  timeValueText.innerText = timeOfDayString;
  dayValueText.innerHTML = gameDay;
}

function assassinationAttempt() {
  const rebelPowerBoost = Math.floor(Math.random() * 10)
  if (rebelStrength + rebelPowerBoost >= personalSecurity) {
    infoText.innerText = "You have been assassinated.";
    playSoundEffect('assassinWinSound');
    img.src = '/static/ap/african president images/assassinated.jpg';
    nextButtons(lose);
  } else {
    playSoundEffect('assassinFailSound');
    img.src = '/static/ap/african president images/attempt.jpg';
    publicOrder -= rebelPowerBoost;
    rebelStrength -= rebelPowerBoost;
    democracy -= rebelPowerBoost;
    law -= rebelPowerBoost / 2;
    personalSecurity -= rebelPowerBoost;
    infoText.innerText = "An attempt on your life has been made! Thanks to the quick actions of your security. The assassination was a failure.";
    resetButtons();
    updateStats();
  }
}

function assassinationWindow() {
  const percentageChanceOfAssassination = Math.floor(Math.random() * 400);
  if (rebelStrength >= percentageChanceOfAssassination) {
    assassinationAttempt();
  }
}

function randomEvent() {
  const diceRoll = Math.floor(Math.random() * 10);
  if (diceRoll == 9) {
    rebelTerroristAttack();
  } else if (diceRoll == 8) {
    westernAid();
  } else if (diceRoll == 7) {
    policeRaid();
  } else if (diceRoll == 6) {
    coupAttempt();
  } else if (diceRoll == 5) {
    religousLeaders();
  } else {
    return false;
  }
}

function rebelTerroristAttack() {
  if (rebelStrength >= law) {
  const randomChoice = Math.floor(Math.random() * 6);
    if ((randomChoice == 0) || (randomChoice == 5)) {
      playSoundEffect('terrorSound');
      img.src = '/static/ap/african president images/terr1.jpg';
      infoText.innerText = `There is news of a terrrorist attack by the rebels. A religous site was targeted, and many civilians have been killed. We must increase law enforcement! Public order -${publicOrder * 0.3}. Rebel Strength +${rebelStrength * 0.3}`;
      publicOrder -= publicOrder * 0.3;
      rebelStrength += rebelStrength * 0.3;
      updateStats();
      nextButtons(office);
    } else if (randomChoice == 1) {
      playSoundEffect('terrorSound');
      img.src = '/static/ap/african president images/terr1.jpg';
      infoText.innerText = `There is news of a terrrorist attack by the rebels. A suicide bomber detonated in a shopping mall, many civilians have been killed! Public order -${publicOrder * 0.4}. Rebel Strength +${rebelStrength * 0.4}`;
      publicOrder -= publicOrder * 0.4;
      rebelStrength += rebelStrength * 0.4;
      updateStats();
      nextButtons(office);
    } else if (randomChoice == 2) {
      playSoundEffect('terrorSound');
      img.src = '/static/ap/african president images/terr2.jpg';
      infoText.innerText = `There is news of a terrrorist attack by the rebels. A rebel has rundown a crowd of civilians, many have been killed! Public order -${publicOrder * 0.5}. Rebel Strength +${rebelStrength * 0.5}`;
      publicOrder -= publicOrder * 0.5;
      rebelStrength += rebelStrength * 0.5;
      updateStats();
      nextButtons(office);
    } else if (randomChoice == 3) {
      playSoundEffect('terrorSound');
      img.src = '/static/ap/african president images/terr2.jpg';
      infoText.innerText = `There is news of a terrrorist attack by the rebels. A group of rebels has infiltrated a military outpost, civilians in the area are being attacked! Public order -${publicOrder * 0.6}. Rebel Strength +${rebelStrength * 0.6}. Military Strength -${militaryStrength * 0.3}`;
      publicOrder -= publicOrder * 0.6;
      rebelStrength += rebelStrength * 0.6;
      militaryStrength -= militaryStrength * 0.5;
      updateStats();
      nextButtons(office);
    } else if (randomChoice == 4) {
      playSoundEffect('terrorSound');
      img.src = '/static/ap/african president images/badAttack.jpg';
      infoText.innerText = `There is news of a terrrorist attack by the rebels. A group of rebels has blown-up a police station, officers have been killed, prisoners released, and civilians in the area are being attacked! Public order -${publicOrder * 0.7}. Rebel Strength +${rebelStrength * 0.7}. Law -${law * 0.4}`;
      publicOrder -= publicOrder * 0.6;
      rebelStrength += rebelStrength * 0.6;
      militaryStrength -= militaryStrength * 0.5;
      updateStats();
      nextButtons(office);
    }
  }
}

function westernAid() {
  if (democracy > 90) {
    img.src = '/static/ap/african president images/printMoney.jpg';
    infoText.innerText = `You recieve a call from a certain foreign president. Your great efforts to bring democracy to your nation have been noticed. You recieve a huge foreign aid donation. Funds +10000. Military Strength +10%`;
    funds += 10000;
    militaryStrength += 10;
    updateStats();
    nextButtons(office);
  } else if (democracy > 80) {
    img.src = '/static/ap/african president images/printMoney.jpg';
    infoText.innerText = `You recieve a call from a certain foreign president. Your journey on the road to democracy has been noticed. You recieve a large foreign aid donation. Funds +8000. Military Strength +5%`;
    funds += 8000;
    militaryStrength += 5;
    updateStats();
    nextButtons(office);
  } else if (democracy > 70) {
    img.src = '/static/ap/african president images/printMoney.jpg';
    infoText.innerText = `You recieve a call from a certain foreign president. Your first steps on the road to democracy have been noticed. You recieve a large foreign aid donation. Funds +5000.`;
    funds += 5000;
    updateStats();
    nextButtons(office);
  } else {
    infoText.innerText = "Our democracy rating is quite low. Perhaps larger foreign democracies may support us if we can show growth...";
    updateStats();
    nextButtons(office);
  }
}

function policeRaid() {
  if (law > rebelStrength + 20) {
    img.src = '/static/ap/african president images/goodRootOut.jpg';
    playSoundEffect('attackSound');
    infoText.innerText = "Last night the police raided a warehouse storing rebel weapons. Law +10%. Rebel Strength -10%. Public order +10%.";
    publicOrder += publicOrder * 0.1;
    democracy += democracy * 0.1;
    law += law * 0.1;
    rebelStrength -= rebelStrength * 0.1;
    updateStats();
    nextButtons(office);
  }
}

function coupAttempt() {
  if (rebelStrength > personalSecurity) {
    const randomChoice = Math.floor(Math.random() * 6);
    if (randomChoice >= 4) {
      playSoundEffect('attackSound');
      img.src = '/static/ap/african president images/badAttack.jpg';
      infoText.innerText = "During the night rebels stormed the presidential office in an attempted coup. The president was captured and killed.";
      nextButtons(lose);
    } else if (randomChoice >= 2) {
      playSoundEffect('attackSound');
      img.src = '/static/ap/african president images/goodRootOut.jpg';
      infoText.innerText = "During the night rebels stormed the presidential office in an attempted coup. The president was successfully protected by his personal security team. We need to strengthen security. Next time he may not be so lucky.";
      personalSecurity += personalSecurity * 0.1;
      rebelStrength -= rebelStrength * 0.1;
      updateStats();
      nextButtons(office);
    } else {
      return false;
    }
  }
}

function religiousLeaders() {
  img.src = '/static/ap/african president images/africa.jpg';
  infoText.innerText = "This morning, several highly respected religious leaders called for peace in our nation. Public Order +10%. Rebel Strength -10%.";
  publicOrder += publicOrder * 0.1;
  rebelStrength -= rebelStrength * 0.1;
  updateStats();
  nextButtons(office);
}

function dailyStatDrip() {
  if (gameDay >= 20) {
    publicOrder -= publicOrder * 0.1;
    law -= law * 0.1;
    militaryStrength -= militaryStrength * 0.1;
    personalSecurity -= personalSecurity * 0.1;
    democracy -= democracy * 0.1;
    rebelStrength += 15
    rebelStrength += rebelStrength * 0.1;
    updateStats();
  }  else if (gameDay >= 10) {
    publicOrder -= publicOrder * 0.07;
    law -= law * 0.07;
    militaryStrength -= militaryStrength * 0.07;
    personalSecurity -= personalSecurity * 0.07;
    democracy -= democracy * 0.07;
    rebelStrength += 10
    rebelStrength += rebelStrength * 0.07;
    updateStats();
  } else {
    publicOrder -= publicOrder * 0.05;
    law -= law * 0.05;
    militaryStrength -= militaryStrength * 0.05;
    personalSecurity -= personalSecurity * 0.05;
    democracy -= democracy * 0.05;
    rebelStrength += 5
    rebelStrength += rebelStrength * 0.05;
    updateStats();
  }
}

function restart() {
  if (gameDay > 30) {
    stopWinMusic();
  }
  publicOrder = 50;
  democracy = 50;
  law = 50;
  rebelStrength = 50;
  militaryStrength = 50;
  personalSecurity = 50;
  funds = 500;
  gameDay = 1;
  time = 0;
  updateStats();
  playBGM();
  dayValueText.innerHTML = gameDay;
  timeValueText.innerText = timeOfDay;
  office();
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}
