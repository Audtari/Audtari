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

let userKey
let userData
export default class SignInScreen extends Component {
  constructor() {
    super()
    this.state = {
      isSignedIn: false,
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      goalsScored: 0
    }
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(user => this.setState({isSignedIn: !!user}))

    if (firebase.auth().currentUser) {
      let displayName = firebase.auth().currentUser.displayName
      let userRef = firebase.database().ref('Users/' + displayName)
      let newUserData = {
        displayName,
        email: firebase.auth().currentUser.email,
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        goalsScored: 0
      }
      this.statRef = firebase.database().ref('Users/' + displayName)
      this.statRef
        .on('value', data => {
          userKey = Object.keys(data.val())
        })
        .then(() => {
          console.log(userKey, 'userKey')
          let userStats = firebase
            .database()
            .ref('Users/' + displayName + '/' + userKey[0])
          userStats
            .on('value', data => {
              userData = data.val()
            })
            .then(() => {
              console.log(userData, 'userData in the state setting')
            })
        })

      userRef.once('value', data => {
        if (!data.exists()) {
          userRef.push(newUserData)
        } else {
          this.setState({
            gamesPlayed: userData.gamesPlayed,
            wins: userData.wins,
            losses: userData.losses,
            goalsScored: userData.goalsScored
          })
        }
      })
    }
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

    return (
      <div>
        <h1 className="atariFont">Audtari</h1>
        <p>
          Welcome {firebase.auth().currentUser.displayName}! You are now
          signed-in!
        </p>
        <h4>Games Played: {this.state.gamesPlayed}</h4>
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
