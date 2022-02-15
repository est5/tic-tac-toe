const createPlayer = (mark) => {
  let winCount = 0;

  function addWinPoint() {
    winCount++;
  }

  function getWins() {
    return winCount;
  }

  function resetWins() {
    winCount = 0;
  }

  return {
    mark,
    addWinPoint,
    getWins,
    resetWins,
  };
};
let sel = "X";
while (1) {
  sel = prompt("Player 1 select X or O").toUpperCase();
  if (sel === "X" || sel === "O") {
    break;
  }
}

let p1 = createPlayer(sel);
let p2 = createPlayer(p1.mark === "X" ? "O" : "X");

// Assume 1st player always goes first
let active = p1;
let turnCount = 0;

const gameBoard = (function () {
  const currentPlayer = document.querySelector(".current-player");
  const _boardLength = 9;
  let pseudoBoard = Array(9).fill("");
  const _container = document.querySelector(".container");
  const totalScoreText = document.querySelector(".score");

  function addMarkToArray(index, mark) {
    pseudoBoard[index] = mark;
    turnCount++;
  }

  const _addEvent = function (square) {
    square.addEventListener("click", (e) => {
      if (square.innerText != "") {
        return;
      }
      addMarkToArray(square.id - 1, active.mark);
      square.innerText = active.mark;

      if (turnCount > 4) {
        game.checkWinner(pseudoBoard);
      }
      game.swapActivePlayer();
      currentPlayer.innerText = `'${active.mark}' your turn`;
    });
  };

  const renderWinner = (w) => {
    const winner = document.querySelector(".winner");
    winner.style.visibility = "visible";
    if (w == "tie") {
      winner.innerText = "Last round result: TIE";
      return;
    }
    winner.innerText = `${w.mark.toUpperCase()} won last round`;
  };

  const render = () => {
    totalScoreText.innerText = `P1 (${p1.mark}): ${p1.getWins()} wins , P2 (${
      p2.mark
    }): ${p2.getWins()} wins`;
    totalScoreText.style.visibility = "visible";
    currentPlayer.style.visibility = "visible";
    currentPlayer.innerText = `'${active.mark}' your turn`;

    for (let i = 0; i < _boardLength; i++) {
      const square = document.createElement("div");
      square.className = "square";
      _addEvent(square);
      square.id = i + 1;

      _container.appendChild(square);
    }
  };

  function reset() {
    const squares = document.querySelectorAll(".square");

    squares.forEach((ele) => {
      ele.remove();
    });
    pseudoBoard = Array(9).fill("");
    turnCount = 0;
    render();
  }

  return {
    render,
    reset,
    turnCount,
    totalScoreText,
    renderWinner,
  };
})();

const game = (function () {
  function swapActivePlayer() {
    active == p1 ? (active = p2) : (active = p1);
  }

  function checkWinner(pseudoBoard) {
    if (turnCount == 9) {
      gameBoard.reset();
      gameBoard.renderWinner("tie");
    }
    for (let i = 0, j = 0, g = 0; i < 9; i += 3, j++) {
      let col = [pseudoBoard[j], pseudoBoard[j + 3], pseudoBoard[j + 6]];

      let row = [pseudoBoard[i], pseudoBoard[i + 1], pseudoBoard[i + 2]];

      let diag = [pseudoBoard[g], pseudoBoard[g + 4], pseudoBoard[g + 8]];
      let revDiag = [
        pseudoBoard[g + 2],
        pseudoBoard[g + 4],
        pseudoBoard[g + 6],
      ];

      if (
        checkSetOfThree(row) ||
        checkSetOfThree(col) ||
        checkSetOfThree(diag) ||
        checkSetOfThree(revDiag)
      ) {
        active.addWinPoint();
        gameBoard.renderWinner(active);
        gameBoard.totalScoreText.innerText = `P1 (${
          p1.mark
        }): ${p1.getWins()} wins , P2 (${p2.mark}): ${p2.getWins()} wins`;
        gameBoard.reset();
        break;
      }
    }
  }

  function checkSetOfThree(elements) {
    if (elements[0] == "" || elements[1] == "" || elements[2] == "") {
      return;
    }
    return elements[0] === elements[2] && elements[0] === elements[1];
  }

  return {
    swapActivePlayer,
    checkWinner,
  };
})();

const buttons = (function () {
  const restart = document.querySelector(".restart");
  const resetScore = document.querySelector(".reset-score");

  function addEvent() {
    restart.addEventListener("click", () => {
      gameBoard.reset();
      const winner = document.querySelector(".winner");
      winner.style.visibility = "hidden";
    });
    resetScore.addEventListener("click", () => {
      gameBoard.reset();
      p1.resetWins();
      p2.resetWins();
      const winner = document.querySelector(".winner");
      winner.style.visibility = "hidden";

      gameBoard.totalScoreText.innerText = `P1 (${
        p1.mark
      }): ${p1.getWins()} wins , P2 (${p2.mark}): ${p2.getWins()} wins`;
    });
  }
  return {
    addEvent,
  };
})();
buttons.addEvent();
gameBoard.render();
