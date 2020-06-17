import React from 'react';
import Swimlanes from './components/Swimlanes.jsx';
import Kanban from './components/Kanban.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Swimlanes />
    )
  }
}

export default App;