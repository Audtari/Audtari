import React from 'react'
import firebase from 'firebase'

export default class Lobby extends React.Component {
  constructor() {
    super()
    this.state = {
      rooms: {}
    }
  }

  componentDidMount() {
    this.roomRef = firebase.database().ref('Pong_Rooms/rooms')
    this.roomRef.on('value', data => {
      let rooms = data.val()

      // for (let key in rooms) {
      //   if (!rooms[key].private) {
      //     if (rooms[key].name) {
      //       keys.push(rooms[key].name)
      //     } else {
      //       keys.push(key)
      //     }
      //   }
      // }
      this.setState({
        rooms: rooms
      })
    })
  }

  onClick() {
    let isPrivate = document.getElementById('private').checked
    let name = document.getElementById('roomName').value

    let newRoomKey = firebase
      .database()
      .ref('Pong_Rooms')
      .child('/rooms')
      .push().key
    const newRoomData = {
      name: name,
      ballX: 300,
      ballY: 250,
      leftRecY: 300,
      rightRecY: 300,
      scores: {
        player1Score: 0,
        player2Score: 0
      },
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
    let rooms = this.state.rooms
    let keys = []
    for (let key in rooms) {
      if (!rooms[key].private) {
        if (rooms[key].name) {
          keys.push(rooms[key].name)
        } else {
          keys.push(key)
        }
      }
    }
    return (
      <div>
        <h1>This is the Lobby</h1>
        <ul>
          {keys.map(room => {
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
            <label>Private?</label>
            <input type="checkbox" id="private" />
            <label>RoomCode</label>
            <input type="text" id="roomName" />
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
