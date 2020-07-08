import React, { Component, Fragment } from 'react';
import { Route } from 'react-router';
import { inject, observer } from 'mobx-react';

import SignInPage from './pages/signin/SignInPage';
import SignUpPage from './pages/signup/SignUpPage';
import CreatePurchaseOrderPage from "./pages/create-purchaseorder/CreatePurchaseOrderPage";
import PurchaseOrdersPage from "./pages/purchaseorders/PurchaseOrdersPage";
import SinglePurchaseOrderPage from "./pages/purchaseorders/SinglePurchaseOrderPage";
import UpdateUserPreferences from "./pages/user-preferences/UserPreferencesPage";

@inject('routerStore')
@observer
class App extends Component {
  render() {
    return (
      <Fragment>
        <Route exact path="/" component={SignInPage} />
        <Route path="/signin/" component={SignInPage} />
        <Route path="/signup/" component={SignUpPage} />
          <Route exact path="/userpreferences/" component={UpdateUserPreferences} />
        <Route exact path="/purchaseorders" component={PurchaseOrdersPage} />
        <Route exact path="/purchaseorders/create" component={CreatePurchaseOrderPage} />
        <Route exact path="/purchaseorders/id/:id" component={SinglePurchaseOrderPage} />

      </Fragment>
    );
  }
}

export default App;
