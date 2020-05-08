import React from 'react'
import Pong from './Pong'

// import all games and store here ... ?
const gameList = [Pong]

export default function singleGamePage() {
  return (
    <div>
      {gameList.map(Game => (
        <div key={1} className="gameContainer">
          <h1>{Game.name}</h1>
          <Game />
        </div>
      ))}
    </div>
  )
}
