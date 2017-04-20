var fighterList = require('./fighters')
var calc = require('./calc')



function preprocessFighter(original) {
  var fighter = {
    name           : original.name,
    maxShield      : original.shield,
    currentShield  : original.shield,
    physicalAttack : original.attack,
    maxDefence     : original.defence,
    currentDefence : original.defence,
    speed          : original.speed,
    specialAttack  : original.special,

    attacksPerTurn: calc.attacksPerTurn(original.speed),

    damageReduction : calc.damageReduction(original.defence),
    dodgeChance     : calc.dodgeChance(original.speed),

    maxCharge     : original.special,
    currentCharge : original.special,

    isDead: false
  }

  fighter.physicalDamagePotential = calc.physicalDamagePotential(fighter)
  fighter.specialDamagePotential = calc.specialDamagePotential(fighter)
  fighter.favoredTactic = calc.favoredTactic(fighter)

  return fighter
}

function updateFighter(original) {
  var fighter = {
    name           : original.name,
    maxShield      : original.maxShield,
    currentShield  : original.currentShield,
    physicalAttack : original.physicalAttack,
    maxDefence     : original.maxDefence,
    currentDefence : original.currentDefence,
    speed          : original.speed,
    specialAttack  : original.specialAttack,

    attacksPerTurn: original.attacksPerTurn,

    damageReduction : calc.damageReduction(original.currentDefence),
    dodgeChance     : original.dodgeChance,

    maxCharge     : original.maxCharge,
    currentCharge : original.currentCharge,

    isDead: original.isDead
  }

  fighter.physicalDamagePotential = original.physicalDamagePotential
  fighter.specialDamagePotential = original.specialDamagePotential
  fighter.favoredTactic = original.favoredTactic

  return fighter
}

function battle(source1, source2, turn=0, log=[]) {
  var f1, f2

  if (turn === 0) {
    log.push(`${source1.name} vs. ${source2.name}\n`)
    var coinFlip = calc.coinFlip()
    if (source1.speed > source2.speed) {
      f1 = updateFighter(source1)
      f2 = updateFighter(source2)
    } else if (source1.speed < source2.speed) {
      f2 = updateFighter(source1)
      f1 = updateFighter(source2)
    } else if (coinFlip === 0) {
      f1 = updateFighter(source1)
      f2 = updateFighter(source2)
    } else {
      f2 = updateFighter(source1)
      f1 = updateFighter(source2)
    }
  } else {
    f1 = updateFighter(source1)
    f2 = updateFighter(source2)
  }

  if (f1.isDead) {
    log.push(`${f1.name} dies.`)
    log.push(`${f2.name} wins!`)
    return {winner: f2, log: log}
  }

  if (f1.currentShield < f1.maxShield) {
    f1.currentShield++
  }

  for (var i=0;i<f1.attacksPerTurn;i++){
    var hit = calc.rollPercentage() >= f2.dodgeChance

    if ((f1.favoredTactic === 'physical' || f1.currentCharge <= 2)) {
      if (hit) {
        var shieldPenetration = f2.currentShield > f1.physicalAttack/2 ? 0 : f1.physicalAttack/2 - f2.currentShield

        f2.currentShield = f2.currentShield < f1.physicalAttack/2 ? 0 : f2.currentShield - f1.physicalAttack/2

        var damageDealt = Math.floor((shieldPenetration * (1 - f2.damageReduction))*10)/10

        f2.currentDefence <= 0 ? f2.isDead = true : f2.currentDefence -= damageDealt

        f2 = updateFighter(f2)

        log.push(`${f1.name} strikes ${f2.name} for ${damageDealt} damage.`)

      } else {
        log.push(`${f1.name} swings and misses.`)
      }

    } else if (f1.favoredTactic === 'special' && f1.currentCharge >= 2) {
      f1.currentCharge > 0 ? f1.currentCharge -= 2 : f1.currentCharge = 0
      if (hit) {
        var specialDamage = calc.specialAttackDamage(f1)
        var shieldPenetration = f2.currentShield > f1.specialAttack ? 0 : f1.specialAttack - f2.currentShield

        f2.currentShield = f2.currentShield < f1.specialAttack ? 0 : f2.currentShield - f1.specialAttack

        var damageDealt = Math.floor((shieldPenetration * (1 - f2.damageReduction))*10)/10

        f2.currentDefence <= 0 ? f2.isDead = true : f2.currentDefence -= damageDealt

        f2 = updateFighter(f2)

        if (f2.currentDefence > 0) {
          f2.currentDefence -= damageDealt
          if (f2.currentDefence < 0) {f2.currentDefence = 0}
        } else if (f2.currentDefence === 0) {
          f2.isDead = true
        }

        log.push(`${f1.name}'s special attack hits ${f2.name} for ${damageDealt} damage.`)

      } else {
        log.push(`${f1.name}'s special attack misses.`)
      }
    }
  }
  return battle(f2, f1, turn+1, log)
}

function displayLog(log, delay, i=0) {
  console.log(log[i])
  if (i > log.length-2) {
    return
  } else {
    setTimeout(()=>{displayLog(log, delay, i+1)}, delay)
  }
}



var fighter1 = preprocessFighter(fighterList[0])
var fighter2 = preprocessFighter(fighterList[11])
var b1 = battle(fighter1, fighter2)

displayLog(b1.log, 1000)
