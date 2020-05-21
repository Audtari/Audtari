import React from 'react'
import firebase from 'firebase'
import {
  Button,
  Input,
  ListItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  TextField,
  List,
  ListItemText
} from '@material-ui/core'
// import AlertDialog from './Dialog'

export default class Lobby extends React.Component {
  constructor() {
    super()
    this.state = {
      roomArr: [],
      roomInput: '',
      open1: false,
      open2: false,
      roomType: false,
      roomName: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.clickOpenCode = this.clickOpenCode.bind(this)
    this.clickCloseCode = this.clickCloseCode.bind(this)
    this.onClick = this.onClick.bind(this)
    this.handleListItemClick = this.handleListItemClick.bind(this)
  }

  componentDidMount() {
    this.roomRef = firebase.database().ref('Pong_Rooms/rooms')
    this.roomRef.on('value', data => {
      let rooms = data.val()

      this.setState({
        roomArr: rooms
      })
      // console.log('ROOMS', rooms)
      console.log('are we getting in this function at all?')
      // this.setState({
      //   roomArr: keys,
      // })
    })
  }

  onClick() {
    let isPrivate = document.getElementById('roomName').value
    // let privateBool = bool
    console.log(isPrivate)

    this.setState({
      open1: false
    })
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
      name: this.state.roomName,
      private: this.state.roomType
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

  handleNameChange(event) {
    this.setState({roomName: event.target.value})
  }

  setOpen(val) {
    this.setState({
      open1: val
    })
  }

  handleClickOpen() {
    this.setState({
      open1: true
    })
  }

  clickOpenCode() {
    this.setState({
      open2: true
    })
  }

  clickCloseCode() {
    this.setState({
      open2: false
    })
  }

  handleClose() {
    this.setState({
      open1: false
    })
  }

  handleListItemClick(string) {
    if (string === 'public') {
      this.setState({
        roomType: false
      })
    } else {
      this.setState({
        roomType: true
      })
    }
  }

  render() {
    let rooms = this.state.roomArr
    let keys = []
    for (let key in rooms) {
      if (!rooms[key].private) {
        keys.push(key)
      }
    }
    return (
      <div className="component">
        <h1>This is the Lobby</h1>
        <Button
          variant="outlined"
          color="secondary"
          onClick={this.clickOpenCode}
        >
          Got a Code?
        </Button>
        <Dialog
          open={this.state.open2}
          onClose={this.clickCloseCode}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Enter it below</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="roomName"
              label="Room Code"
              type="name"
              fullWidth
              value={this.state.roomName}
              onChange={this.handleNameChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onClick} color="primary">
              Create my Room
            </Button>
          </DialogActions>
        </Dialog>
        <Button
          variant="outlined"
          onClick={() => this.onJoin(this.state.roomInput)}
        >
          Join Room
        </Button>
        <ul className="rooms">
          {keys.map(room => {
            // console.log(room)
            return (
              <div key={room}>
                <ListItem>{rooms[room].name}</ListItem>{' '}
                <Button variant="outlined" onClick={() => this.onJoin(room)}>
                  Join Room
                </Button>
              </div>
            )
          })}
        </ul>
        {/* <div id="Create Button">
          <Button variant="outlined" onClick={() => this.createRoomForm()}>
            Create Room
          </Button>
        </div> */}
        <div>
          <Button
            variant="contained"
            color="default"
            onClick={this.handleClickOpen}
          >
            Create Room
          </Button>
          <Dialog
            open={this.state.open1}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {'What kind of room are you creating?'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Would you like this to be a public game that others can join or
                a private game for you and a friend?
              </DialogContentText>
              <List>
                <ListItem
                  button
                  onClick={() => this.handleListItemClick('public')}
                >
                  <ListItemText primary="Public" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => this.handleListItemClick('private')}
                >
                  <ListItemText primary="Private" />
                </ListItem>
              </List>
              <TextField
                autoFocus
                margin="dense"
                id="roomName"
                label="Room Name"
                type="name"
                fullWidth
                value={this.state.roomName}
                onChange={this.handleNameChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onClick} color="primary">
                Create my Room
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        {/* <AlertDialog
            open={open}
            // onJoin={this.onJoin}
            // onClick={this.onClick}
          /> */}
        {/* <Dialog
            open={open}
            // onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Would you like this to be a public game that others can join or
                a private game for you and a friend?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary" autofocus>
                Public
              </Button>
              <Button color="primary">Private</Button>
            </DialogActions>
          </Dialog> */}
        <div id="create-room-form">
          <form>
            <label>Private</label>
            <input type="checkbox" id="private" />
            <br />
            <Button type="button" onClick={() => this.onClick()}>
              Create Room
            </Button>
          </form>
        </div>
        {/* <div className="footer"></div> */}
      </div>
    )
  }
}
