import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './app'
import * as firebase from 'firebase'

var firebaseConfig = {
  apiKey: 'AIzaSyB4aOKcTsbXbhse3IZ7_vjLf5TxZAbracU',
  authDomain: 'test-project-f4a68.firebaseapp.com',
  databaseURL: 'https://test-project-f4a68.firebaseio.com',
  projectId: 'test-project-f4a68',
  storageBucket: 'test-project-f4a68.appspot.com',
  messagingSenderId: '399505072260',
  appId: '1:399505072260:web:b43d070c6189b88e7362d1',
  measurementId: 'G-37ER8HZ4L0'
}

firebase.initializeApp(firebaseConfig)
firebase.database()

// establishes socket connection
import './socket'

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
)
