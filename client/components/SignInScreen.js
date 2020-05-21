import React, {Component} from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase'
import {Button} from '@material-ui/core'

var uiConfig = {
  signInFlow: 'popup',

  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  autoUpgradeAnonymousUsers: true
}

export default class SignInScreen extends Component {
  constructor() {
    super()
    this.state = {
      isSignedIn: false
    }
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(user => this.setState({isSignedIn: !!user}))
  }

  componentWillUnmount() {
    this.unregisterAuthObserver()
  }

  render() {
    if (!this.state.isSignedIn) {
      return (
        <div>
          <h1 className="atariFont">Audtari</h1>
          <p>Please sign-in:</p>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </div>
      )
    }
    let displayName = firebase.auth().currentUser.displayName
    let userRef = firebase.database().ref('Users/' + displayName)
    let newUserData = {
      displayName,
      email: firebase.auth().currentUser.email,
      gamesPlayed: 0
    }
    //  firebase.database().ref('Breakout')
    // userRef.push(newUserData)

    userRef.once('value', data => {
      if (!data.exists()) {
        userRef.push(newUserData)
      }
    })

    return (
      <div>
        <h1 className="atariFont">Audtari</h1>
        <p>
          Welcome {firebase.auth().currentUser.displayName}! You are now
          signed-in!
        </p>
        <a onClick={() => firebase.auth().signOut()}>
          <Button color="default" variant="contained">
            {' '}
            Sign-Out
          </Button>
        </a>
      </div>
    )
  }
}
