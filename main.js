const maxStat = 100;



  // Players data structure includes new stats Energy, Social, Stress, and relationship levels
  let players = [
    {
      name: "",
      gender: "Other",
      school: "Public",
      job: "Gamer",
      age: 18,
     knowledge: Math.floor(Math.random() * 51) + 50,      // 50 - 100
    health: Math.floor(Math.random() * 51) + 50,
    happiness: Math.floor(Math.random() * 51) + 50,     
    energy: Math.floor(Math.random() * 51) + 50,
    social: Math.floor(Math.random() * 51) + 50,
     intelligence: Math.floor(Math.random() * 51) + 50,
      money: Math.floor(Math.random() * 51) + 50,          // 50 - 100
     stress: Math.floor(Math.random() * 51) + 50,
      relationships: [0], 
      avatar: "👤"
    },
    {
      name: "",
      gender: "Other",
      school: "Public",
      job: "Gamer",
      age: 18,
      health: 80,
      happiness: 50,
      knowledge: 20,
      money: 20,
      energy: 70,
      social: 30,
      stress: 20,
      relationships: [0], // with player 1
      avatar: "👤"
    }
  ];

  let currentPlayerIndex = 0;
  let turnCount = 1;

  // Gender to emoji avatar map
  const genderAvatars = {
    Male: "🧑",
    Female: "👩‍🦰",
    Other: "🧑"
  };

  // Utility function to clamp values between min and max
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  // Update UI function updates all player stats bars and info
  function updateUI() {
    for (let i = 0; i < players.length; i++) {
      const p = players[i];
      document.getElementById(`player${i+1}NameDisplay`).textContent = p.name || `Player ${i+1}`;
      document.getElementById(`player${i+1}Age`).textContent = p.age;
      document.getElementById(`player${i+1}Health`).style.width = p.health + '%';
      document.getElementById(`player${i+1}Happiness`).style.width = p.happiness + '%';
      document.getElementById(`player${i+1}Knowledge`).style.width = p.knowledge + '%';
      document.getElementById(`player${i+1}Money`).style.width = p.money + '%';

      // New stats
      document.getElementById(`player${i+1}Energy`).style.width = p.energy + '%';
      document.getElementById(`player${i+1}Social`).style.width = p.social + '%';
      // Stress bar fills inversely (less stress = more green?), but we keep red and normal: width = stress%
      document.getElementById(`player${i+1}Stress`).style.width = p.stress + '%';

      // Avatar update
      document.getElementById(`player${i+1}Avatar`).textContent = p.avatar;
    }

    document.getElementById('turnIndicator').textContent = `Turn ${turnCount} - ${players[currentPlayerIndex].name}'s turn`;
  }

  // Setup player avatars based on gender
  function assignAvatars() {
    for(let i=0; i<players.length; i++) {
      players[i].avatar = genderAvatars[players[i].gender] || "👤";
    }
  }

  // Clamp all stats and sanity check after changes
  function clampAllStats(player) {
    player.health = clamp(player.health, 0, maxStat);
    player.happiness = clamp(player.happiness, 0, maxStat);
    player.knowledge = clamp(player.knowledge, 0, maxStat);
    player.money = clamp(player.money, 0, maxStat);
    player.energy = clamp(player.energy, 0, maxStat);
    player.social = clamp(player.social, 0, maxStat);
    player.stress = clamp(player.stress, 0, maxStat);
  }



  // Calculate happiness gain multiplier based on friendship level
  function friendshipMultiplier(playerIndex, otherIndex) {
    // Simple linear scale: 0 relationship = 1x, max 100 = 2x happiness gain
    const rel = players[playerIndex].relationships[otherIndex] || 0;
    return 1 + rel / 100;
  }

  // Update relationship status message
  function updateRelationshipStatus() {
    const p = players[currentPlayerIndex];
    const otherIndex = currentPlayerIndex === 0 ? 1 : 0;
    const friendship = p.relationships[otherIndex];
    let status = "";
    if(friendship >= 75) status = "Best Friends ❤️";
    else if(friendship >= 50) status = "Good Friends 🙂";
    else if(friendship >= 25) status = "Acquaintances";
    else status = "Strangers";
    document.getElementById('relationshipStatus').textContent = `${p.name}'s relationship with ${players[otherIndex].name}: ${status}`;
  }

  // Events array for random event system
  const randomEvents = [
    {
      description: "Had a great sleep, Energy +15, Stress -10",
      effect: (p) => { p.energy = clamp(p.energy + 15, 0, maxStat); p.stress = clamp(p.stress - 10, 0, maxStat); }
    },
    {
      description: "Got stuck in traffic, Stress +15, Energy -10",
      effect: (p) => { p.stress = clamp(p.stress + 15, 0, maxStat); p.energy = clamp(p.energy - 10, 0, maxStat); }
    },
    {
      description: "Found some money on the street, Money +10",
      effect: (p) => { p.money = clamp(p.money + 10, 0, maxStat); }
    },
    {
      description: "Had an argument, Stress +20, Happiness -15",
      effect: (p) => { p.stress = clamp(p.stress + 20, 0, maxStat); p.happiness = clamp(p.happiness - 15, 0, maxStat); }
    },
    {
      description: "Met a new friend, Social +20, Happiness +10",
      effect: (p) => { p.social = clamp(p.social + 20, 0, maxStat); p.happiness = clamp(p.happiness + 10, 0, maxStat); }
    },
    {
      description: "Had a healthy meal, Health +15, Energy +10",
      effect: (p) => { p.health = clamp(p.health + 15, 0, maxStat); p.energy = clamp(p.energy + 10, 0, maxStat); }
    },
    {
      description: "Felt lonely, Social -10, Happiness -10",
      effect: (p) => { p.social = clamp(p.social - 10, 0, maxStat); p.happiness = clamp(p.happiness - 10, 0, maxStat); }
    }
  ];

  // Milestone messages to show when age hits milestones
  const milestones = [21, 30, 40, 50, 60];

  function checkMilestones(p) {
    if(milestones.includes(p.age)) {
      document.getElementById('milestoneMsg').textContent = `${p.name} has reached age ${p.age}! A new chapter begins.`;
    } else {
      document.getElementById('milestoneMsg').textContent = "";
    }
  }

  // Action handlers
  function study() {
    let p = players[currentPlayerIndex];
    if(p.energy < 20) {
      alert("Not enough energy to study.");
      return;
    }
    p.knowledge += 10;
    p.energy -= 20;
    p.stress += 5;
    p.happiness += 5;
    clampAllStats(p);
    nextPlayerTurn();
  }

  function work() {
    let p = players[currentPlayerIndex];
    if(p.energy < 15) {
      alert("Not enough energy to work.");
      return;
    }
    p.money += 20;
    p.energy -= 15;
    p.stress += 10;
    p.happiness -= 5;
    p.health -= 15;
    clampAllStats(p);
    nextPlayerTurn();
  }

  function exercise() {
    let p = players[currentPlayerIndex];
    if(p.energy < 25) {
      alert("Not enough energy to exercise.");
      return;
    }
    p.health += 10;
    p.energy -= 25;
    p.stress -= 15;
    p.happiness += 10;
    clampAllStats(p);
    nextPlayerTurn();
  }

  function chat() {
    let p = players[currentPlayerIndex];
    let otherIndex = currentPlayerIndex === 0 ? 1 : 0;
    if(p.energy < 5) {
      alert("Not enough energy to chat.");
      return;
    }
    // Happiness gain scales with friendship
    let multiplier = friendshipMultiplier(currentPlayerIndex, otherIndex);
    let happinessGain = Math.floor(10 * multiplier);
    p.happiness += happinessGain;
    p.energy -= 5;
    p.social += 10;
    // Increase relationship a bit
    p.relationships[otherIndex] = clamp(p.relationships[otherIndex] + 5, 0, 100);
    players[otherIndex].relationships[currentPlayerIndex] = clamp(players[otherIndex].relationships[currentPlayerIndex] + 5, 0, 100);

    clampAllStats(p);
    updateRelationshipStatus();
    nextPlayerTurn();
  }

  function help() {
    let p = players[currentPlayerIndex];
    let otherIndex = currentPlayerIndex === 0 ? 1 : 0;
    if(p.energy < 10) {
      alert("Not enough energy to help.");
      return;
    }
    // Helping increases happiness and relationship more
    let multiplier = friendshipMultiplier(currentPlayerIndex, otherIndex);
    let happinessGain = Math.floor(15 * multiplier);
    p.happiness += happinessGain;
    p.energy -= 10;
    p.social += 15;
    // Increase relationship more strongly
    p.relationships[otherIndex] = clamp(p.relationships[otherIndex] + 10, 0, 100);
    players[otherIndex].relationships[currentPlayerIndex] = clamp(players[otherIndex].relationships[currentPlayerIndex] + 10, 0, 100);

    clampAllStats(p);
    updateRelationshipStatus();
    nextPlayerTurn();
  }

  function sleep() {
  let p = players[currentPlayerIndex];
  p.energy += 20;    // Restore lots of energy
  p.stress -= 30;    // Reduce stress significantly
  p.health += 10;    // Bonus health boost from rest
  clampAllStats(p);
  document.getElementById('eventMsg').textContent = `${p.name} took a good rest and feels refreshed!`;
  nextPlayerTurn();
}

function party() {
  let p = players[currentPlayerIndex];
  if (p.energy < 30) {
    alert("Not enough energy to party.");
    return;
  }
  p.social += 35;      // Big social boost
  p.happiness += 20;   // Big happiness boost
  p.energy -= 30;      // Consumes energy
  p.stress += 20;       // Causes some stress
  p.health -= 15;
  clampAllStats(p);
  document.getElementById('eventMsg').textContent = `${p.name} partied hard and had fun!`;
  nextPlayerTurn();
}

function randomEvent() {
  const p = players[currentPlayerIndex];
  const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
  event.effect(p);
  document.getElementById('eventMsg').textContent = event.description;
}



  // Function to apply random event for current player each turn
  function nextPlayerTurn() {
  clampAllStats(players[currentPlayerIndex]);
  checkMilestones(players[currentPlayerIndex]);

  // Move to next player
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

  // If all players had their turn (new round)
  if (currentPlayerIndex === 0) {
    turnCount++;
    players.forEach(p => p.age++);

    // Trigger random event only every 5 years
    if (players.some(p => p.age % 5 === 0)) {
      randomEvent(); // This triggers event for current player (which is now 0)
    }
  }

  // Check game over after aging
  const maxAge = 80;
  if (players.some(p => p.age >= maxAge)) {
    alert("Game Over! Someone reached age " + maxAge + ".");
    disableGameControls();
    return;
  }

  updateRelationshipStatus();
  updateUI();
}


  // Start game setup function
  document.getElementById('startBtn').onclick = function() {
    const p1Name = document.getElementById('player1Name').value.trim();
    const p1Gender = document.getElementById('player1Gender').value;
    const p1School = document.getElementById('player1School').value;
    const p1Job = document.getElementById('player1Job').value;

    const p2Name = document.getElementById('player2Name').value.trim();
    const p2Gender = document.getElementById('player2Gender').value;
    const p2School = document.getElementById('player2School').value;
    const p2Job = document.getElementById('player2Job').value;

    if(!p1Name || !p1Gender || !p1School || !p1Job || !p2Name || !p2Gender || !p2School || !p2Job) {
      alert("Please fill out all fields for both players.");
      return;
    }


    function disableGameControls() {
  document.querySelectorAll('button').forEach(btn => {
    btn.disabled = true;
  });
  document.getElementById('eventMsg').textContent = "The game has ended.";
}

    players[0].name = p1Name;
    players[0].gender = p1Gender;
    players[0].school = p1School;
    players[0].job = p1Job;

    players[1].name = p2Name;
    players[1].gender = p2Gender;
    players[1].school = p2School;
    players[1].job = p2Job;

    // Initialize relationships array for both players
    players[0].relationships = [0, 0];
    players[1].relationships = [0, 0];

    assignAvatars();

    document.getElementById('profile-setup').style.display = "none";
    document.getElementById('dashboard').style.display = "block";

    updateRelationshipStatus();
    updateUI();
  };

 
  // Buttons for actions
  document.getElementById('sleepBtn').addEventListener('click', sleep);
  document.getElementById('partyBtn').addEventListener('click', party);
  document.getElementById('studyBtn').onclick = study;
  document.getElementById('workBtn').onclick = work;
  document.getElementById('exerciseBtn').onclick = exercise;
  document.getElementById('chatBtn').onclick = chat;
  document.getElementById('helpBtn').onclick = help;
  document.getElementById('nextTurnBtn').onclick = () => {
    // Skip current player's turn without action
    randomEvent();
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    if(currentPlayerIndex === 0) {
      turnCount++;
      players.forEach(p => p.age++);
    }
    updateRelationshipStatus();
    updateUI();
  };
