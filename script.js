const emojis = ["✊", "✋", "✌️"];
let emojiCounts = {
  "✊": 0,
  "✋": 0,
  "✌️": 0,
};

function updateEmojiCounts() {
  document.getElementById("count-emoji1").textContent = emojiCounts["✊"];
  document.getElementById("count-emoji2").textContent = emojiCounts["✋"];
  document.getElementById("count-emoji3").textContent = emojiCounts["✌️"];
}

function saveBoard() {
  const grid = document.getElementById("grid");
  const boardState = [];

  grid.querySelectorAll(".grid-cell").forEach((cell) => {
    const emoji = cell.querySelector("span").textContent;
    const score = cell.querySelector(".score")
      ? cell.querySelector(".score").textContent
      : null;
    boardState.push({ emoji, score });
  });

  localStorage.setItem("boardState", JSON.stringify(boardState));
  alert("Board state saved!");
}

function loadBoard() {
  const boardState = JSON.parse(localStorage.getItem("boardState"));
  if (!boardState) {
    alert("No saved board state found!");
    return;
  }

  const rows = Math.ceil(boardState.length / Math.sqrt(boardState.length));
  const cols = Math.ceil(boardState.length / rows);
  document.getElementById("rows").value = rows;
  document.getElementById("cols").value = cols;

  generateBoard(); // Regenerate the board with the new dimensions

  const grid = document.getElementById("grid");
  boardState.forEach((item, index) => {
    const cell = grid.children[index];
    if (cell) {
      const emoji = cell.querySelector("span");
      emoji.textContent = item.emoji;

      const score = cell.querySelector(".score");
      if (score && item.score !== null) {
        score.textContent = item.score;
        setScoreColor(score, parseInt(item.score)); // Set score color based on loaded value
      }
    }
  });
}

function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

function createEmojiElement() {
  const emoji = document.createElement("span");
  emoji.textContent = getRandomEmoji();

  emoji.onclick = () => {
    const currentEmoji = emoji.textContent;
    const nextEmoji =
      emojis[(emojis.indexOf(currentEmoji) + 1) % emojis.length];
    emoji.textContent = nextEmoji;

    // Update the counts accordingly
    emojiCounts[currentEmoji]--; // Decrease the count of the current emoji
    emojiCounts[nextEmoji]++; // Increase the count of the new emoji
    updateEmojiCounts(); // Update the display for counts
  };

  return emoji;
}

function getRandomScore(min, max, excludeZero) {
  if (excludeZero) {
    while (true) {
      const score = Math.floor(Math.random() * (max - min + 1) + min);
      if (score !== 0) {
        return score;
      }
    }
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function setScoreColor(scoreElement) {
  const score = parseInt(scoreElement.textContent);
  if (score > 0) {
    scoreElement.style.color = "green";
  } else if (score < 0) {
    scoreElement.style.color = "red";
  } else {
    scoreElement.style.color = "black";
  }
}

function createScoreElement(min, max, excludeZero) {
  const score = document.createElement("div");
  score.classList.add("score");
  const randomScore = getRandomScore(min, max, excludeZero);
  score.textContent = randomScore;
  setScoreColor(score);

  // Change score on click
  score.onclick = () => {
    const newScore = prompt("Enter new score:", score.textContent);
    if (!isNaN(newScore) && newScore !== null && newScore !== "") {
      score.textContent = newScore;
      setScoreColor(score);
    }
  };
  return score;
}

function generateBoard() {
  const grid = document.getElementById("grid");
  const rows = document.getElementById("rows").value;
  const cols = document.getElementById("cols").value;
  const minScore = parseInt(document.getElementById("min-score").value);
  const maxScore = parseInt(document.getElementById("max-score").value);
  const generateScore = document.getElementById("generate-score").checked;
  const excludeZero = document.getElementById("exclude-zero").checked;

  grid.innerHTML = ""; // Clear previous grid
  // Reset emoji counts
  emojiCounts = {
    "✊": 0,
    "✋": 0,
    "✌️": 0,
  };
  updateEmojiCounts(); // Update the display for counts

  grid.style.gridTemplateColumns = `repeat(${cols}, 50px)`;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");

      // Random emoji
      const emoji = createEmojiElement();
      emojiCounts[emoji.textContent]++;
      cell.appendChild(emoji);

      // Conditionally add random score
      if (generateScore) {
        const score = createScoreElement(minScore, maxScore, excludeZero);
        cell.appendChild(score);
      }

      grid.appendChild(cell);
    }
  }

  updateEmojiCounts(); // Update the display for counts
}
