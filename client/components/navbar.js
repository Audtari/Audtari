import React from 'react'
import {Link} from 'react-router-dom'
// import PropTypes from 'prop-types'
// import {connect} from 'react-redux'
// import {logout} from '../store'

const Navbar = () => (
  <div>
    <h1 className="gradient-text atariFont">Audtari</h1>
    <nav>
      <div>
        {/* The navbar will show these links before you log in */}
        <Link to="/home">Home</Link>
        <Link to="/accountInfo">Account Info</Link>
        <Link to="/pong">Pong SP</Link>
        <Link to="/lobby">Pong MP</Link>
        <Link to="/br">Breakout</Link>
      </div>
    </nav>
    <hr />
  </div>
)

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
