import React from 'react';
import './App.css';
import BoardComponent from './game/BoardComponent';
import BoardContainer from './game/BoardContainer';
import BoardHeader from './game/BoardHeader';

function App() {

  return (
    <div className="App">
      <BoardContainer>
        <BoardHeader/>
        <BoardComponent/>
      </BoardContainer>
    </div>
  );
}

export default App;
