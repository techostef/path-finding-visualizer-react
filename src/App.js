import React from 'react';
import './App.css';
import BoardComponent from './game/BoardComponent';
import BoardContainer from './game/BoardContainer';
import BoardHeader from './game/BoardHeader';

function App() {

  const timerInterval = 50

  return (
    <div className="App">
      <BoardContainer>
        <BoardHeader/>
        <BoardComponent
          timerInterval={timerInterval}
        />
      </BoardContainer>
    </div>
  );
}

export default App;
