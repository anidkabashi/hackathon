document.addEventListener('DOMContentLoaded', () => {
  const player = {
    name: '',
    age: 18,
    health: 100,
    happiness: 100,
    knowledge: 50,
    money: 100
  };

  const startBtn = document.getElementById('startBtn');
  const nameInput = document.getElementById('nameInput');
  const dashboard = document.getElementById('dashboard');
  const profileSetup = document.getElementById('profile-setup');
  const playerNameSpan = document.getElementById('playerName');
  const ageSpan = document.getElementById('age');
  const healthSpan = document.getElementById('health');
  const happinessSpan = document.getElementById('happiness');
  const knowledgeSpan = document.getElementById('knowledge');
  const moneySpan = document.getElementById('money');
  const eventMsg = document.getElementById('eventMsg');
  const actionButtons = document.querySelectorAll('.actions button');

  function updateDashboard() {
    ageSpan.textContent = player.age;
    healthSpan.textContent = player.health;
    happinessSpan.textContent = player.happiness;
    knowledgeSpan.textContent = player.knowledge;
    moneySpan.textContent = player.money;
  }

  function capStat(stat) {
    if (stat > 100) return 100;
    if (stat < 0) return 0;
    return stat;
  }

  function endGame() {
    alert(`You lived a full life, ${player.name}! 🎉 Game Over.`);
    location.reload();
  }

  function chooseAction(action) {
    player.age += 1;
    let message = '';

    switch(action) {
      case 'study':
        player.knowledge = capStat(player.knowledge + 10);
        player.happiness = capStat(player.happiness - 5);
        message = "You learned a new skill!";
        break;
      case 'exercise':
        player.health = capStat(player.health + 10);
        player.money = capStat(player.money - 5);
        message = "You feel strong and energetic!";
        break;
      case 'work':
        player.money = capStat(player.money + 20);
        player.health = capStat(player.health - 5);
        message = "You earned some cash!";
        break;
      case 'relax':
        player.happiness = capStat(player.happiness + 15);
        player.knowledge = capStat(player.knowledge - 5);
        message = "You binged a new show!";
        break;
    }

    updateDashboard();
    eventMsg.textContent = message;

    if (player.age >= 80) {
      endGame();
    }
  }

  startBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      alert('Please enter your name!');
      return;
    }
    player.name = name;
    playerNameSpan.textContent = player.name;

    profileSetup.style.display = 'none';
    dashboard.style.display = 'block';

    updateDashboard();
  });

  actionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const action = button.getAttribute('data-action');
      chooseAction(action);
    });
  });
});
