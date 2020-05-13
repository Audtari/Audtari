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
      console.log(keys, 'object.keys')

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
      rightRecY: 300
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
    console.log('check FB')
  }

  render() {
    // console.log(roomRef, 'this is the roomRef')

    let rooms = this.state.roomArr
    console.log(rooms, 'this is the room array')
    return (
      <div>
        <h1>This is the Lobby</h1>
        <ul>
          {rooms.map(room => {
            return <li key={room}>{room}</li>
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
