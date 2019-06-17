import React from 'react';
import './styles.css';
import { BrowserRouter, Route } from 'react-router-dom';
import AccessView from '../../views/accessView';
import RoomView from '../../views/roomView';

export default class Router extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Route path="/" exact component={AccessView} />
        <Route path="/room/:accessCode" exact component={RoomView} />
      </BrowserRouter>
    );
  }
}
