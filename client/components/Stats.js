import React from 'react'
import firebase from 'firebase'

let userKey
let userData
export default class Stats extends React.Component {
  constructor() {
    super()
    this.state = {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      goalsScored: 0
    }
  }
  componentDidMount() {
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
      let statRef = firebase.database().ref('Users/' + displayName)
      statRef.on('value', data => {
        userKey = Object.keys(data.val())
        let userStats = firebase
          .database()
          .ref('Users/' + displayName + '/' + userKey[0])
        userStats.on('value', snap => {
          userData = snap.val()
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
  render() {
    return (
      <div>
        <h4>Games Played: {this.state.gamesPlayed}</h4>
        <h4>Wins: {this.state.wins}</h4>
        <h4>Losses: {this.state.losses}</h4>
        <h4>Goals Scored: {this.state.goalsScored}</h4>
      </div>
    )
  }
}
