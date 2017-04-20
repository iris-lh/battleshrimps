var c = require('./constants')

module.exports = {

   attacksPerTurn: (speed)=> {
    if (speed >= c.speedBracket[2]) {
      return 3
    } else if (speed >= c.speedBracket[1]) {
      return 2
    } else if (speed >= c.speedBracket[0]) {
      return 1
    }
  },

  damageReduction: (defence)=> {
    return Math.floor(
      ((c.baseDamageReduction * (c.damageReductionPerPoint**defence))-1)*100
    ) / 100
  },

  dodgeChance: (speed)=> {
    return Math.floor(
      ((c.baseDodge * (c.dodgePerPoint**speed))-1)*100
    ) / 100
  },

  physicalDamagePotential: (fighter)=> {
    return (fighter.physicalAttack * fighter.attacksPerTurn)
  },

  specialDamagePotential: (fighter)=> {
    return (fighter.specialAttack * c.specialMultiplier * fighter.attacksPerTurn)
  },

  favoredTactic: (fighter)=> {
    return fighter.physicalDamagePotential > fighter.specialDamagePotential/c.favoredTacticTilt ? 'physical' : 'special'
  },

  coinFlip: ()=> {
    return Math.floor( Math.random() * (1 - 0 + 1) + 0 )
  },

  rollPercentage: ()=> {
    return Math.floor( Math.random() * (100 - 0 + 1) + 0 ) / 100
  },

  specialAttackDamage: (fighter)=> {
    return Math.floor( Math.random() * (fighter.specialAttack - 1 + 1) + 1 ) * c.specialMultiplier
  }

}
