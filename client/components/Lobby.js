import React from 'react'
import firebase from 'firebase'

export default class Lobby extends React.Component {
  constructor() {
    super()
    this.state = {
      roomArr: [],
      roomInput: ''
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.roomRef = firebase.database().ref('Pong_Rooms/rooms')
    this.roomRef.on('value', data => {
      let keys = []
      let rooms = data.val()
      // console.log('ROOMS', rooms)
      for (let key in rooms) {
        if (!rooms[key].private) {
          keys.push(key)
        }
      }
      console.log('are we getting in this function at all?')
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

  handleChange(event) {
    this.setState({roomInput: event.target.value})
  }

  render() {
    let rooms = this.state.roomArr
    return (
      <div>
        <h1>This is the Lobby</h1>
        <label>
          Got a code? Enter it here:
          <input
            type="text"
            value={this.state.roomInput}
            onChange={this.handleChange}
          />
        </label>
        <button type="button" onClick={() => this.onJoin(this.state.roomInput)}>
          Join Room
        </button>
        <ul>
          {rooms.map(room => {
            // console.log(room)
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
