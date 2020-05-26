import React from 'react'
import {Link} from 'react-router-dom'
import {Switch} from '@material-ui/core'
// import PropTypes from 'prop-types'
// import {connect} from 'react-redux'
// import {logout} from '../store'

class Navbar extends React.Component {
  constructor() {
    super()
    this.state = {
      selected: '',
      home: false,
      accountInfo: false,
      pong: false,
      lobby: false,
      br: false
    }
    this.handleToggle = this.handleToggle.bind(this)
    this.baseState = this.state
  }

  handleToggle(event) {
    event.preventDefault()
    if (this.state.selected === '') {
      // console.log(event.target.name, 'is this a thing?')
      this.setState({
        selected: event.target.name,
        [event.target.name]: event.target.checked
      })
    } else {
      this.setState(this.baseState)
      this.setState({
        selected: event.target.name,
        [event.target.name]: event.target.checked
      })
    }
  }

  render() {
    return (
      <div id="navbar">
        {/* <h1 className="gradient-text atariFont">Audtari</h1> */}
        <nav>
          <div className="switchboard">
            <div className="left-side">
              <Link to="/home">
                <Switch
                  checked={this.state.home}
                  name="home"
                  onChange={this.handleToggle}
                  color="default"
                />
              </Link>
              <Link to="/accountInfo">
                <Switch
                  checked={this.state.accountInfo}
                  name="accountInfo"
                  onChange={this.handleToggle}
                  color="default"
                />
              </Link>
            </div>
            <div className="right-side">
              <Link to="/pong">
                <Switch
                  checked={this.state.pong}
                  name="pong"
                  onChange={this.handleToggle}
                  color="default"
                />
              </Link>
              <Link to="/lobby">
                <Switch
                  checked={this.state.lobby}
                  name="lobby"
                  onChange={this.handleToggle}
                  color="default"
                />
              </Link>
              <Link to="/br">
                <Switch
                  checked={this.state.br}
                  name="br"
                  onChange={this.handleToggle}
                  color="default"
                />
              </Link>
            </div>

            {/* The navbar will show these links before you log in */}
            <Link to="/home">Home</Link>
            <Link to="/accountInfo">Account Info</Link>
            <Link to="/pong">Pong SP</Link>
            <Link to="/lobby">Pong MP</Link>
            <Link to="/br">Breakout</Link>
          </div>
        </nav>
        {/* <hr /> */}
      </div>
    )
  }
}

export default Navbar

// /**
//  * CONTAINER
//  */
// const mapState = (state) => {
//   return {
//     isLoggedIn: !!state.user.id,
//   }
// }

// const mapDispatch = (dispatch) => {
//   return {
//     handleClick() {
//       dispatch(logout())
//     },
//   }
// }

// export default connect(mapState, mapDispatch)(Navbar)

// /**
//  * PROP TYPES
//  */
// Navbar.propTypes = {
//   handleClick: PropTypes.func.isRequired,
//   isLoggedIn: PropTypes.bool.isRequired,
// }
