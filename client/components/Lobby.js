import React from 'react'
import firebase from 'firebase'

export default class Lobby extends React.Component {
  constructor() {
    super()
    this.state = {
      roomArr: []
    }
  }
  componentDidMount() {
    let roomRef = firebase.database().ref('Pong_Rooms')
    roomRef.on('child_added', data => {
      let rooms = data.val()
      let keys = Object.keys(rooms)

      this.setState({
        roomArr: keys
      })
    })
  }

  onClick() {
    let newRoomKey = firebase
      .database()
      .ref('Pong_Rooms')
      .child('/rooms')
      .push().key
    const newRoomData = {
      ballX: 300,
      ballY: 250,
      leftRecY: 300,
      rightRecY: 300,
      gameState: 'empty',
      users: {
        player1: 'user1',
        player2: ''
      }
    }
    const updates = {}
    updates['/rooms/' + newRoomKey] = newRoomData
    firebase
      .database()
      .ref('Pong_Rooms')
      .update(updates)
    this.setState(prevState => ({
      roomArr: [...prevState.roomArr, newRoomKey]
    }))
  }

  onJoin(room) {
    let currentUser = firebase.auth().currentUser.uid
    let checkForPlayersRef = firebase
      .database()
      .ref('Pong_Rooms/rooms/' + room + '/users')
    const updates = {}
    let userObj
    checkForPlayersRef.once('value', data => {
      userObj = data.val()
    })
    if (userObj.player1 === 'user1') {
      updates['/rooms/' + room + '/users/player1'] = currentUser
      updates['/rooms/' + room + '/gameState'] = 'waiting'
    } else {
      updates['/rooms/' + room + '/users/player2'] = currentUser
      updates['/rooms/' + room + '/gameState'] = 'active'
    }
    firebase
      .database()
      .ref('Pong_Rooms')
      .update(updates)
    window.location.href = `/multi/${room}`
  }

  render() {
    // console.log(roomRef, 'this is the roomRef')

    let rooms = this.state.roomArr
    return (
      <div>
        <h1>This is the Lobby</h1>
        <ul>
          {rooms.map(room => {
            return (
              <div key={room}>
                <li>{room}</li>{' '}
                <button type="button" onClick={() => this.onJoin(room)}>
                  Join Room
                </button>
              </div>
            )
          })}
        </ul>
        <div id="Create Button">
          <button type="button" onClick={() => this.onClick()}>
            Create Room
          </button>
        </div>
      </div>
    )
  }
}
