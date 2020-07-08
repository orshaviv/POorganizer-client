import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { createBrowserHistory } from 'history';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router } from 'react-router';

import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

import UserStore from './stores/user.store';
import AuthService from './services/auth.service';
import PurchaseOrdersStore from "./stores/purchaseorders.store";
import PurchaseOrdersService from "./services/purchaseorders.service";
import UserPreferencesService from "./services/user-preferences.service";

const services = {};
const stores = {};

stores.routerStore = new RouterStore();
const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, stores.routerStore);

services.userPreferencesService = new UserPreferencesService();
services.purchaseOrdersService = new PurchaseOrdersService(stores.routerStore);
services.authService = new AuthService();

stores.purchaseOrdersStore = new PurchaseOrdersStore(services.purchaseOrdersService);
stores.userStore = new UserStore(services.authService, services.userPreferencesService);

const Root = (
  <Provider {...stores}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>
);
ReactDOM.render(Root, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
