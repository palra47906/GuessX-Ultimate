let randomNumber;
let attempts;
let bestScore = localStorage.getItem('bestScore') || null;
let timerInterval;
let timeLeft = 60;


function playSound(id) {
  const sound = document.getElementById(id);
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 60;
  document.getElementById('timer').innerText = `⏳ ${timeLeft}`;
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').innerText = `⏳ ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame(false);
    }
  }, 1000);
}

function startGame() {
  randomNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  document.getElementById('message').innerText = '';
  document.getElementById('score').innerText = '';
  document.getElementById('guessInput').value = '';
  updateHighScoreDisplay();
  startTimer();
  console.log("Random Number (for debug):", randomNumber);
}

function updateHighScoreDisplay() {
  if (bestScore !== null) {
    document.getElementById('highscore').innerText = `🏅 Best Score: ${bestScore}/100`;
  } else {
    document.getElementById('highscore').innerText = "🏅 No High Score Yet!";
  }
}

function checkGuess() {
  const guess = parseInt(document.getElementById('guessInput').value);
  if (isNaN(guess)) {
    document.getElementById('message').innerText = "⚠️ Please enter a valid number!";
    return;
  }

  attempts++;
  const difference = Math.abs(randomNumber - guess);

  if (guess > randomNumber) {
    document.getElementById('message').innerText = "📉 Lower Number Please!";
    playSound('failSound');
  } else if (guess < randomNumber) {
    document.getElementById('message').innerText = "📈 Higher Number Please!";
    playSound('failSound');
  } else {
    const score = Math.max(0, 100 - (attempts - 1) * 5);
    document.getElementById('score').innerText = `🏆 Your Score: ${score}/100`;
    playSound('successSound');
    clearInterval(timerInterval);
    confetti({ particleCount: 200, spread: 70, origin: { y: 0.6 } });
    if (bestScore === null || score > bestScore) {
      bestScore = score;
      localStorage.setItem('bestScore', bestScore);
      playSound('highScoreSound');
      alert("🎉 New High Score!! 🏅");
    }
    endGame(true);
  }

  if (guess !== randomNumber) {
    if (difference >= 50) {
      document.getElementById('score').innerText = "😅 You are very far!";
    } else if (difference >= 20) {
      document.getElementById('score').innerText = "🙂 You are far.";
    } else if (difference >= 10) {
      document.getElementById('score').innerText = "😃 You are close!";
    } else {
      document.getElementById('score').innerText = "🔥 You are very close!";
    }
  }
}

function beginGame() {
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('gameContainer').classList.add('visible');
  startGame();
}

function endGame(won) {
  document.getElementById('gameOverScreen').classList.remove('hidden');
  document.getElementById('finalMessage').innerText = won ? "🎉 You guessed it right!" : "⏰ Time's up! Better luck next time.";
}

function restartGame() {
  document.getElementById('gameOverScreen').classList.add('hidden');
  document.getElementById('gameContainer').classList.remove('visible');
  setTimeout(() => beginGame(), 500);
}