document.addEventListener("DOMContentLoaded", function () {
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.setAttribute("data-theme", "dark");
    document.querySelector('input[type="checkbox"]').checked = true;
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    document.querySelector('input[type="checkbox"]').checked = false;
  }
});

function toggleDarkMode() {
  const checkbox = document.querySelector('input[type="checkbox"]');
  if (document.documentElement.getAttribute("data-theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.theme = "light";
    checkbox.checked = false;
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.theme = "dark";
    checkbox.checked = true;
  }
}

const xPick = document.getElementById("pick-x");
const oPick = document.getElementById("pick-o");

let selectPick = "X";

function selectMark(selected, other, pick = "X") {
  other.classList.remove("bg-[#a8bec9]", "text-[#192a32]");
  other.classList.add("text-[#a8bec9]");

  selected.classList.remove("text-[#a8bec9]");
  selected.classList.add("bg-[#a8bec9]", "text-[#192a32]");
  selectPick = pick;
}

xPick.addEventListener("click", () => selectMark(xPick, oPick, "X"));
oPick.addEventListener("click", () => selectMark(oPick, xPick, "O"));

const cpuBtn = document.getElementById("btn-cpu");
const playerBtn = document.getElementById("btn-player");

let selectModeGame = "cpuGame";
function onGame(btnPlayer = "") {
  if (btnPlayer === "onGamePlayer") {
    selectModeGame = "playerGame";
  }
  currentPlayer = selectPick;
  updateTurn();
  const principalView = document.getElementById("principal-view");
  const gameView = document.getElementById("game-view");
  gameView.classList.remove("hidden");
  principalView.classList.add("hidden");
}
cpuBtn.addEventListener("click", () => onGame());
playerBtn.addEventListener("click", () => onGame("onGamePlayer"));

let currentPlayer = "X";
let board = Array(9).fill(null);
let gameOver = false;

const cells = document.querySelectorAll("main > div");
const turnIcon = document.getElementById("turnIcon");

const xIconLabel = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    stroke-width="6.5" stroke="currentColor" class="size-6 text-[#a8bec9]">
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
  </svg>
`;

const oIconLabel = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    stroke-width="6" stroke="currentColor" class="size-6 text-[#a8bec9]">
    <circle cx="12" cy="12" r="8"/>
  </svg>
`;

const xIconGame = ` <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="6.5"
            stroke="currentColor"
            class="size-12 text-[#31c4be]"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
`;

const oIconGame = ` <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="6"
            stroke="currentColor"
            class="size-12 text-[#f2b237]"
          >
            <circle cx="12" cy="12" r="8" />
          </svg>
`;

function updateTurn() {
  turnIcon.innerHTML = currentPlayer === "X" ? xIconLabel : oIconLabel;
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let [a, b, c] of winPatterns) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameOver = true;
      alert(`🎉 ¡Player ${board[a]} You WON!`);
      return;
    }
  }

  if (!board.includes(null)) {
    gameOver = true;
    alert("🤝 ¡Tie!");
  }
}

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (gameOver || board[index]) return;

    board[index] = currentPlayer;
    cell.innerHTML = currentPlayer === "X" ? xIconGame : oIconGame;

    checkWinner();

    if (!gameOver) {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateTurn();
    }
  });
});

const resetButton = document.getElementById("resetBtn");
resetButton.addEventListener("click", () => {
  board.fill(null);
  cells.forEach((cell) => (cell.innerHTML = ""));
  currentPlayer = selectPick;
  gameOver = false;
  updateTurn();
});
