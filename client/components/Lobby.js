import React from 'react'
import firebase from 'firebase'

export default class Lobby extends React.Component {
  componentDidMount() {
    const rootRef = firebase.database().ref('Pong_Rooms')
    console.log('helloRef in Mount', rootRef)
    // rootRef.on('value', (snap) => {
    //   console.log(snap.val(), 'snapshot val data')
    //   this.setState({
    //     ballX: snap.val().ballX,
    //     ballY: snap.val().ballY,
    //     leftRecY: snap.val().leftRecY,
    //   })
    // })
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
    console.log('check FB')
  }

  render() {
    let roomRef = firebase.database().ref('Pong_Rooms/rooms')
    console.log(roomRef, 'this is the roomRef')
    roomRef.on('child_added', data => {
      let rooms = data.val()
      let keys = Object.keys(rooms)

      console.log(rooms, 'this is rooms within child_added')
    })
    return (
      <div>
        <h1>This is the Lobby</h1>
        {/* {roomRef} */}
        <div id="Create Button">
          <button type="button" onClick={() => this.onClick()}>
            Create Room
          </button>
        </div>
      </div>
    )
  }
}
