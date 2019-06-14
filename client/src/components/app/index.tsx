import React from 'react';
import './styles.css';
import Footer from '../footer';
import Router from '../router';

const App: React.FC = () => {
  return (
    <div className="app-component">
      <Router />
      <Footer />
    </div>
  );
};

export default App;
