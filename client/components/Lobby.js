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
      let keys = []
      let rooms = data.val()
      console.log('ROOMS', rooms)
      for (let key in rooms) {
        if (!rooms[key].private) {
          keys.push(key)
        }
      }

      this.setState({
        roomArr: keys
      })
    })
  }

  onClick() {
    let isPrivate = document.getElementById('private').checked
    console.log(isPrivate)
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
      },
      private: isPrivate
    }
    const updates = {}
    updates['/rooms/' + newRoomKey] = newRoomData
    firebase
      .database()
      .ref('Pong_Rooms')
      .update(updates)
    this.onJoin(newRoomKey)
    // window.location.href = `/multi/${newRoomKey}`
    // if (!isPrivate) {
    //   this.setState((prevState) => ({
    //     roomArr: [...prevState.roomArr, newRoomKey],
    //   }))
    // }
  }

  createRoomForm() {
    let form = document.getElementById('create-room-form')
    form.style.display = 'block'
  }

  onJoin(room) {
    let currentUser
    if (!firebase.auth().currentUser) {
      currentUser = firebase.auth().signInAnonymously()
    } else {
      currentUser = firebase.auth().currentUser.uid
    }
    console.log('CURRENT USER', currentUser)
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
            console.log(room)
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
          <button type="button" onClick={() => this.createRoomForm()}>
            Create Room
          </button>
        </div>
        <div id="create-room-form">
          <form>
            <label>Private</label>
            <input type="checkbox" id="private" />
            <br />
            <button type="button" onClick={() => this.onClick()}>
              Create Room
            </button>
          </form>
        </div>
      </div>
    )
  }
}
