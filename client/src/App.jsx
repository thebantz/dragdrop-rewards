import React from 'react';
import Board from './components/Board.jsx';
import Card from './components/Card.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <main className="flexbox">

          <Board id="board-rewards" className="board">
            Rewards
            <Card id='card-6' className="card" draggable="true">
              <p>Card R5</p>
            </Card>
          </Board>

          <Board id="board-1" className="board">
            Category 1
            <Card id='card-1' className="card" draggable="true">
              <p>Card R1</p>
            </Card>
          </Board>

          <Board id="board-2" className="board">
            Category 2
            <Card id='card-2' className="card" draggable="true">
              <p>Card R2</p>
            </Card>
          </Board>

          <Board id="board-3" className="board">
            Category 3
            <Card id='card-3' className="card" draggable="true">
              <p>Card R3</p>
            </Card>
          </Board>

          <Board id="board-4" className="board">
            Category 4
            <Card id='card-4' className="card" draggable="true">
              <p>Card R4</p>
            </Card>
          </Board>

          <Board id="board-5" className="board">
            Category 5
            <Card id='card-5' className="card" draggable="true">
              <p>Card R5</p>
            </Card>
          </Board>

        </main>
      </div>
    )
  }
}

export default App;