const createPlayer = (mark) => {
  let winCount = 0;

  function addWinPoint() {
    winCount++;
  }

  function getWins() {
    return winCount;
  }

  return {
    mark,
    addWinPoint,
    getWins,
  };
};

// Add text input for player mark
let p1 = createPlayer("x");
let p2 = createPlayer("o");

// Assume 1st player always goes first
let active = p1;

const gameBoard = (function () {
  const _boardLength = 9;
  let pseudoBoard = Array(9).fill("");
  const _container = document.querySelector(".container");

  let turnCount = 0;

  function swapActivePlayer() {
    active == p1 ? (active = p2) : (active = p1);
  }

  function addMarkToArray(index, mark) {
    pseudoBoard[index] = mark;
    turnCount++;
  }

  function checkWinner() {
    if (turnCount == 9) {
      console.log("tie");
      reset();
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
        // print winner
        console.log("winner " + active.mark);
        // print total score
        console.log(
          "Total score : Player1: " +
            p1.getWins() +
            ", Player2: " +
            p2.getWins()
        );
        // reset desk
        reset();
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

  const _addEvent = function (square) {
    square.addEventListener("click", (e) => {
      if (square.innerText != "") {
        return;
      }
      console.log(active.mark);
      addMarkToArray(square.id - 1, active.mark);
      square.innerText = active.mark;

      if (turnCount > 4) {
        checkWinner();
      }
      console.log(turnCount);
      swapActivePlayer();
    });
  };

  const render = () => {
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
    active = p2;

    squares.forEach((ele) => {
      ele.remove();
    });
    pseudoBoard = Array(9).fill("");
    turnCount = 0;
    render();
  }

  return {
    render,
  };
})();

const game = (function () {
  const play = function () {};
})();
gameBoard.render();
