import {Component} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import CustomerListPage from './pages/CustomerListPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import CustomerFormPage from './pages/CustomerFormPage';

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={CustomerListPage} />
          <Route exact path="/customers/new" component={CustomerFormPage} />
          <Route exact path="/customers/:id/edit" component={CustomerFormPage} />
          <Route exact path="/customers/:id" component={CustomerDetailPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;

