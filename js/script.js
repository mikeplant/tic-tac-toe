const gameBoard = (() => {
  const squares = [];
  const gameBoard = document.querySelector('.game-board');

  const init = () => {
    createSquares();
    render();
  }

  const createSquares = () => {
    for (let i = 1; i <= 9; i++) {
      const square = document.createElement('div');
      square.classList.add('board-square');
      square.dataset.sqid = i;
      squares.push(square);
    };
  };

  const render = () => {
    squares.forEach(sq => gameBoard.append(sq));
  };

  return {init};
})();