import React, {Component} from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase'

var uiConfig = {
  signInFlow: 'popup',
  signInSuccessWithAuthResult: () => false,
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    }
  ]
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
    return (
      <div>
        <h1 className="atariFont">Audtari</h1>
        <p>
          Welcome {firebase.auth().currentUser.displayName}! You are now
          signed-in!
        </p>
        <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
      </div>
    )
  }
}
