import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText
} from '@material-ui/core'
import firebase from 'firebase'

export default function AlertDialog(props) {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onJoin = room => {
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

  const newRoom = val => {
    setOpen(false)
    let isPrivate = val
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
    let currentUser
    if (!firebase.auth().currentUser) {
      currentUser = firebase.auth().signInAnonymously()
    } else {
      currentUser = firebase.auth().currentUser.uid
    }
    console.log('CURRENT USER', currentUser)
    let checkForPlayersRef = firebase
      .database()
      .ref('Pong_Rooms/rooms/' + newRoomKey + '/users')
    const updates = {}
    let userObj
    checkForPlayersRef.once('value', data => {
      userObj = data.val()
    })
    if (userObj.player1 === 'user1') {
      updates['/rooms/' + newRoomKey + '/users/player1'] = currentUser
      updates['/rooms/' + newRoomKey + '/gameState'] = 'waiting'
    } else {
      updates['/rooms/' + newRoomKey + '/users/player2'] = currentUser
      updates['/rooms/' + newRoomKey + '/gameState'] = 'active'
    }
    // const updates = {}
    updates['/rooms/' + newRoomKey] = newRoomData
    firebase
      .database()
      .ref('Pong_Rooms')
      .update(updates)
    console.log(props, 'props from the Dialog')
    // onJoin(newRoomKey)
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Create Room
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'What kind of room are you creating?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Would you like this to be a public game that others can join or a
            private game for you and a friend?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={newRoom(false)} color="primary">
            Public
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Private
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
