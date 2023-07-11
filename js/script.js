// GAMEBOARD MODULE

const gameBoard = (() => {
  let squares = [];
  const el = document.querySelector('.game-board');

  const init = () => {
    resetBoard();
    createSquares();
    render();
  };

  const createSquares = () => {
    for (let i = 0; i < 9; i++) {
      const squareEl = document.createElement('div');
      squareEl.classList.add('board-square', 'open');
      squareEl.dataset.sqid = i;
      squares.push(squareEl);
    };
  };

  const resetBoard = () => {
    squares = [];
    Array.from(el.children).forEach(child => el.removeChild(child));
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

  const reset = () => {
    clearOwnedSquares();
    currentPlayer = players[0];
    winner = null;
    gameBoard.init();
  };

  const clearOwnedSquares = () => {
    players.forEach(plyr => plyr.ownedSquares = []);
  };

  const createPlayers = () => {
    const player1 = player('Player One', 'human', 'X');
    players.push(player1);
    const player2 = player('Player Two', 'human', 'O');
    players.push(player2);

    currentPlayer = player1;
  };

  const playerMove = (sqid) => {
    assignSquareToPlayer(sqid);
    changePlayer();
    checkGameOver();
  };

  const assignSquareToPlayer = (id) => {
    currentPlayer.ownedSquares.push(id);
  };

  const changePlayer = () => {
    currentPlayer = (currentPlayer === players[0]) ? players[1] : players[0];
  };

  const checkGameOver = () => {
    if (isWin() || isDraw()) displayHandler.showResults(winner);
  };

  const isWin = () => {
    let win = false;
    players.forEach(p => {if (checkForComboMatch(p)) win = true});
    return win;
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
        return true;
      }
    }
  };

  const isDraw = () => {
    return allSquaresAreOwned() && winner === null;
  };

  const allSquaresAreOwned = () => {
    return (players[0].ownedSquares.length + players[1].ownedSquares.length === 9);
  };

  return {
    init,
    reset,
    getCurrentPlayer,
    getWinner,
    playerMove
  };
})();

// EVENT HANDLER MODULE

const eventHandler = (() => {
  const replayBtn = document.querySelector('.replay-btn');

  const init = () => {
    bindEvents();
  };

  const bindEvents = () => {
    gameBoard.el.addEventListener('click', e => handleSquareClick(e));
    replayBtn.addEventListener('click', () => handleResetClick());
  };

  const handleSquareClick = (e) => {
    if (!isSquareEmpty(e) || game.getWinner() !== null) return;
    displayHandler.fillSquare(e);
    game.playerMove(parseInt(e.target.dataset.sqid));
  };

  const handleResetClick = () => {
    displayHandler.hideResults();
    game.reset();
  };

  const isSquareEmpty = (e) => {
    return (e.target.textContent === '') ? true : false;
  };

  return {init};
})();

// DISPLAY HANDLER MODULE

const displayHandler = (() => {
  const resultsEl = document.querySelector('.results');
  const resultsTextEl = document.querySelector('.results-text');

  const fillSquare = (e) => {
    e.target.textContent = game.getCurrentPlayer().token;
    e.target.classList.remove('open');
    colourPlayerToken(e);
  };

  const colourPlayerToken = (e) => {
    e.target.style.color = (e.target.textContent === 'X') ? '#FFC800' : '#FF8427';
  };

  const updateResultText = (winner) => {
    resultsTextEl.textContent = (winner !== null) ? 
      `${winner.name} wins!`:
      `It's a draw!`;
  };

  const showResults = (winner) => {
    updateResultText(winner);
    resultsEl.classList.toggle('show');
  };

  const hideResults = () => {
    resultsEl.classList.toggle('show');
  };

  return {
    fillSquare, 
    showResults, 
    hideResults
  };
})();

game.init();