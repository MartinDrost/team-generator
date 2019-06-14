import React from 'react';
import './styles.css';
import Footer from '../footer/component';
import Router from '../router/component';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router />
      <Footer />
    </div>
  );
};

export default App;
