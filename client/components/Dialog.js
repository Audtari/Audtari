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
    const updates = {}
    updates['/rooms/' + newRoomKey] = newRoomData
    firebase
      .database()
      .ref('Pong_Rooms')
      .update(updates)
    console.log(props, 'props from the Dialog')
    props.onJoin(newRoomKey)
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
          <Button onClick={handleClose} color="primary">
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
