import React, { Component, Fragment } from 'react';
import { Route } from 'react-router';
import { inject, observer } from 'mobx-react';

import SignInPage from './pages/signin/SignInPage';
import SignUpPage from './pages/signup/SignUpPage';
import TasksPage from './pages/tasks/TasksPage';
import CreateTaskPage from './pages/create-task/CreateTaskPage';
import PurchaseOrdersPage from "./pages/tasks/PurchaseOrdersPage";

@inject('routerStore')
@observer
class App extends Component {
  render() {
    return (
      <Fragment>
        <Route exact path="/" component={SignInPage} />
        <Route path="/signin/" component={SignInPage} />
        <Route path="/signup/" component={SignUpPage} />
        <Route exact path="/purchaseorders" component={PurchaseOrdersPage} />
        <Route exact path="/tasks" component={TasksPage} />
        <Route exact path="/tasks/create" component={CreateTaskPage} />
      </Fragment>
    );
  }
}

export default App;
