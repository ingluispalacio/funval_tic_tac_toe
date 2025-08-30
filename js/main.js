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

let player1Count = 0;
let player2Count = 0;
let tieCount = 0;
const elementPlayer1Count = document.getElementById("player1-count");
const elementPlayer2Count = document.getElementById("player2-count");
const elementTieCount = document.getElementById("tie-count");
elementPlayer1Count.innerText = player1Count;
elementPlayer2Count.innerText = player2Count;
elementTieCount.innerText = tieCount;
const divWinner = document.getElementById("div-winner");

const modal = document.getElementById("modal");
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
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
const quitGameBtn = document.getElementById("btn-quit-game");

const principalView = document.getElementById("principal-view");
const gameView = document.getElementById("game-view");

let selectModeGame = "cpuGame";

cpuBtn.addEventListener("click", () => onGame());
playerBtn.addEventListener("click", () => onGame("onGamePlayer"));
quitGameBtn.addEventListener("click", () => quitGame());

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

const labelWinnerX = `
<svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="6.5"
            stroke="currentColor"
            class="size-16 text-[#31c4be]"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
<p class="text-[#31c4be] ">
          TAKES THE ROUND
        </p>
`;
const labelWinnerO = `
<svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="6"
            stroke="currentColor"
            class="size-16 text-[#f2b237]"
          >
            <circle cx="12" cy="12" r="8" />
          </svg>
<p class="text-[#f2b237]">
          TAKES THE ROUND
        </p>
`;

const labelWinnerTie = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-12 text-[#606766]">
  <path d="M10.5 1.875a1.125 1.125 0 0 1 2.25 0v8.219c.517.162 1.02.382 1.5.659V3.375a1.125 1.125 0 0 1 2.25 0v10.937a4.505 4.505 0 0 0-3.25 2.373 8.963 8.963 0 0 1 4-.935A.75.75 0 0 0 18 15v-2.266a3.368 3.368 0 0 1 .988-2.37 1.125 1.125 0 0 1 1.591 1.59 1.118 1.118 0 0 0-.329.79v3.006h-.005a6 6 0 0 1-1.752 4.007l-1.736 1.736a6 6 0 0 1-4.242 1.757H10.5a7.5 7.5 0 0 1-7.5-7.5V6.375a1.125 1.125 0 0 1 2.25 0v5.519c.46-.452.965-.832 1.5-1.141V3.375a1.125 1.125 0 0 1 2.25 0v6.526c.495-.1.997-.151 1.5-.151V1.875Z" />
</svg>

<p class="text-[#606766] mb-4">
          TIE
        </p>
`;

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (gameOver || board[index]) return;

    if (selectModeGame === "cpuGame" && currentPlayer !== selectPick) return;

    board[index] = currentPlayer;
    cell.innerHTML = currentPlayer === "X" ? xIconGame : oIconGame;

    checkWinner();

    if (!gameOver) {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateTurn();

      if (selectModeGame === "cpuGame" && currentPlayer !== selectPick) {
        setTimeout(cpuMove, 500); // pequeño delay para sensación natural
      }
    }
  });
});

const nextRoundBtn = document.getElementById("btn-next-round");
nextRoundBtn.addEventListener("click", () => {
  resetGame();
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});


function cpuMove() {
  const emptyCells = board
    .map((val, idx) => (val === null ? idx : null))
    .filter((v) => v !== null);

  if (emptyCells.length === 0) return;

  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[randomIndex] = currentPlayer;
  cells[randomIndex].innerHTML = currentPlayer === "X" ? xIconGame : oIconGame;

  checkWinner();

  if (!gameOver) {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateTurn();
  }
}

function resetGame() {
  board.fill(null);
  cells.forEach((cell) => (cell.innerHTML = ""));
  currentPlayer = selectPick;
  gameOver = false;
  startGame();
}

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

      if (board[a] === selectPick) {
        player1Count= parseInt(elementPlayer1Count.innerText) +1;
        elementPlayer1Count.innerText = player1Count;
      } else {
        player2Count= parseInt(elementPlayer2Count.innerText) +1;
        elementPlayer2Count.innerText = player2Count;
      }
      const labelWinner = board[a] === "X" ? labelWinnerX : labelWinnerO;
      divWinner.innerHTML = `${labelWinner} `;
      modal.classList.add("flex");
      modal.classList.remove("hidden");
      return;
    }
  }

  if (!board.includes(null)) {
    gameOver = true;
    tieCount= parseInt(elementTieCount.innerText) +1;
    elementTieCount.innerText = tieCount;
    divWinner.innerText = `IT'S A TIE`;
    modal.classList.add("flex");
    modal.classList.remove("hidden");
  }
}

function startGame() {
  board.fill(null);
  cells.forEach((cell) => (cell.innerHTML = ""));
  gameOver = false;

  currentPlayer = "X";
  updateTurn();

  
  gameView.classList.remove("hidden");
  principalView.classList.add("hidden");

  if (selectModeGame === "cpuGame" && currentPlayer !== selectPick) {
    setTimeout(cpuMove, 500);
  }
}
function onGame(btnPlayer = "") {
  const bgPlayer1 = document.getElementById("bg-player1");
  const bgPlayer2 = document.getElementById("bg-player2");
  const labelPlayer1 = document.getElementById("label-player1");
  const labelPlayer2 = document.getElementById("label-player2");
  const iconPlayer1 = selectPick === "X" ? "X" : "O";
  const iconPlayer2 = selectPick === "X" ? "O" : "X";
  if (btnPlayer === "onGamePlayer") {
    selectModeGame = "playerGame";
    labelPlayer1.innerText = `${iconPlayer1} (P1)`;
    labelPlayer2.innerText = `${iconPlayer2} (P2)`;
  } else {
    labelPlayer1.innerText = `${iconPlayer1} (YOU)`;
    labelPlayer2.innerText = `${iconPlayer2} (CPU)`;
  }
  if (selectPick === "X") {
    bgPlayer1.classList.remove("bg-[#f2b237]");
    bgPlayer1.classList.add("bg-[#31c4be]");
    bgPlayer2.classList.remove("bg-[#31c4be]");
    bgPlayer2.classList.add("bg-[#f2b237]");
  } else {
    bgPlayer2.classList.remove("bg-[#f2b237]");
    bgPlayer2.classList.add("bg-[#31c4be]");
    bgPlayer1.classList.remove("bg-[#31c4be]");
    bgPlayer1.classList.add("bg-[#f2b237]");
  }
  currentPlayer = selectPick;
  startGame();
}

function quitGame() {
  resetGame();
  player1Count = 0;
  player2Count = 0;
  tieCount = 0;
  elementPlayer1Count.innerText = player1Count;
  elementPlayer2Count.innerText = player2Count;
  elementTieCount.innerText = tieCount;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  gameView.classList.add("hidden");
  principalView.classList.remove("hidden");
}
