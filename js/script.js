// GAMEBOARD MODULE

const gameBoard = (() => {
  const squares = [];
  const el = document.querySelector('.game-board');

  const init = () => {
    createSquares();
    render();
  }

  const createSquares = () => {
    for (let i = 0; i < 9; i++) {
      const squareEl = document.createElement('div');
      squareEl.classList.add('board-square');
      squareEl.dataset.sqid = i;
      squares.push(squareEl);
    };
  };

  const render = () => {
    squares.forEach(sq => el.append(sq));
  };

  return {init, el};
})();


const player = (name, type, token) => {
  let ownedSquares = [];
  return {name, type, token, ownedSquares};
};

// GAME LOGIC MODULE

const game = (() => {
  let players = [];
  let currentPlayer;
  let winner = null;

  const getCurrentPlayer = () => currentPlayer;
  const getWinner = () => winner;

  const init = () => {
    gameBoard.init();
    eventHandler.init();
    createPlayers();
  };

  const createPlayers = () => {
    const player1 = player('p1', 'human', 'X');
    players.push(player1);
    const player2 = player('p2', 'human', 'O');
    players.push(player2);

    currentPlayer = player1;
  }

  const playerMove = (sqid) => {
    assignSquareToPlayer(sqid);
    changePlayer();
    checkGameOver();
  }

  const assignSquareToPlayer = (id) => {
    currentPlayer.ownedSquares.push(id);
  }

  const changePlayer = () => {
    currentPlayer = (currentPlayer === players[0]) ? players[1] : players[0];
  }

  const checkGameOver = () => {
    checkForWin();
    checkForDraw();
  }

  const checkForWin = () => {
    players.forEach(p => checkForComboMatch(p));
  };

  const checkForComboMatch = (p) => {
    const winningCombos = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ];
    for (let i = 0; i < winningCombos.length; i++) {
      if (winningCombos[i].every(sq => p.ownedSquares.includes(sq))) {
        winner = p;
        console.log('win') ////
      }
    }
  };

  const checkForDraw = () => {
    return allSquaresAreOwned() && winner === null;
  };

  const allSquaresAreOwned = () => {
    return (players[0].ownedSquares.length + players[1].ownedSquares.length === 9);
  }

  return {
    init, 
    getCurrentPlayer,
    getWinner,
    playerMove
  };
})();

// EVENT HANDLER MODULE

const eventHandler = (() => {

  const init = () => {
    bindEvents();
  };

  const bindEvents = () => {
    gameBoard.el.addEventListener('click', e => handleSquareClick(e));
  };

  const handleSquareClick = (e) => {
    if (!isSquareEmpty(e) || game.getWinner() !== null) return;
    displayHandler.fillSquare(e);
    game.playerMove(parseInt(e.target.dataset.sqid));
  };

  const isSquareEmpty = (e) => {
    return (e.target.textContent === '') ? true : false;
  };

  return {init};
})();

// DISPLAY HANDLER MODULE

const displayHandler = (() => {
  const fillSquare = (e) => {
    e.target.textContent = game.getCurrentPlayer().token;
    colourPlayerToken(e);
  };
  const colourPlayerToken = (e) => {
    e.target.style.color = (e.target.textContent === 'X') ? '#FFC800' : '#FF8427';
  }

  return {fillSquare};
})();

game.init();