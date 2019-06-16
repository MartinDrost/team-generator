import React from 'react';
import './styles.css';
import Footer from '../footer';
import Router from '../router';
import NotificationCenter from '../notificationCenter';

const App: React.FC = () => {
  return (
    <>
      <NotificationCenter />
      <div className="app-component">
        <Router />
        <Footer />
      </div>
    </>
  );
};

export default App;
