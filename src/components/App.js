import React, { Component } from 'react';
import logo from '../styles/logo.svg';
import '../styles/App.css';
import Game from '../game/main.js'

var fighters = require('../game/fighters.json')



function enterLog(component, log, delay) {
  component.setState({log: [log[0]]})
  var i = 1
  var id = setInterval(()=> {
      if (i >= log.length) {clearInterval(id)}

      var out = document.getElementById("battle-log");
      // allow 1px inaccuracy by adding 1
      var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;

      component.setState({log: component.state.log.concat(log[i])})
      i++

      if(isScrolledToBottom) {
        out.scrollTop = out.scrollHeight - out.clientHeight;
      }

    },
    delay
  )
  return id
}



class App extends Component {
  constructor(props) {
    super(props)
    this.state = {fighter1:0, fighter2:0, log: [], timerId:null}
  }

  startGame = ()=> {
    clearInterval(this.state.timerId)
    this.setState({log:[]})
    var game = new Game()
    var battle = game.battle(fighters[this.state.fighter1], fighters[this.state.fighter2])
    // this.setState({log: battle.log, winner: battle.winner})
    this.setState({timerId: enterLog(this, battle.log, 1000)})
  }

  renderPortrait = (fighterId, elementId)=> {
    if (this.state.winner) {
      var winner = this.state.winner
      var fighter = fighters[fighterId]
      console.log(fighter.name, winner.name)
    }
    return (
      <div className='portrait'>
        <img id={elementId} src={require(`../../public/images/${fighterId}.jpg`)}/>
        {/* <img id='skull-and-bones' src={require(`../../public/images/skull-and-bones.png`)} /> */}

      </div>
    )
  }

  renderLog = ()=> {
    return this.state.log.map(
      line => <li>{line}</li>
    )
    // console.log(this.state.log)
  }

  handleSelectChange = (e)=> {
    e.target.id === 'fighter1' ? this.setState({fighter1:e.target.value}) : this.setState({fighter2:e.target.value})
  }

  fighterSelector = (id)=> {
    return (
      <select id={id} className='fighter-select' onChange={this.handleSelectChange}>
        {fighters.map((fighter, i) => <option value={i}>{fighter.name}</option>)}
      </select>
    )
  }

  render() {
    return (
      <div className="App">

        <div>
          {this.fighterSelector('fighter1')}

          <button id='start-battle-button'onClick={
            this.startGame
          }>BATTLE</button>

          {this.fighterSelector('fighter2')}

        </div>

        <div id='bottom'>

          {this.renderPortrait(this.state.fighter1, 'fighter1-portrait')}

          <ul id='battle-log'>{
            this.renderLog()
          }</ul>

          {this.renderPortrait(this.state.fighter2, 'fighter2-portrait')}
        </div>

        <a className='credits' href='<a href="http://www.freepik.com/free-vector/shrimp-icon_761754.htm">Designed by Freepik</a>'>Tab icon designed by Freepik</a>

      </div>
    );
  }
}

export default App;
