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

  return {
    init, 
    el
  };
})();


const player = (name, type, token) => {
  let ownedSquares = [];
  return {name, type, token, ownedSquares};
};



const game = (() => {
  let players = [];
  let currentPlayer;

  const getCurrentPlayer = () => currentPlayer;

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

  const changePlayer = () => {
    currentPlayer = (currentPlayer === players[0]) ? players[1] : players[0];
  }

  return {
    init, 
    getCurrentPlayer,
    changePlayer
  };

})();




const eventHandler = (() => {

  const init = () => {
    bindEvents();
  };

  const bindEvents = () => {
    gameBoard.el.addEventListener('click', e => handleSquareClick(e));
  };

  const handleSquareClick = (e) => {
    game.getCurrentPlayer().ownedSquares.push(e.target.dataset.sqid);
    displayHandler.fillSquare(e);
    game.changePlayer();
  };

  return {init};
  
})();

const displayHandler = (() => {
  const fillSquare = (e) => {
    e.target.textContent = game.getCurrentPlayer().token;
  };

  return {fillSquare};
})();

game.init();