/**
 * Utility functions for D&D calculations
 */

/**
 * Calculates D&D ability modifier from ability score
 * @param {number} score - The ability score
 * @returns {number} The modifier
 */
export const getModifier = (score) => Math.floor((score - 10) / 2)

/**
 * Rolls a single die
 * @param {number} sides - Number of sides on the die
 * @returns {number} The roll result
 */
export const rollDie = (sides) => Math.floor(Math.random() * sides) + 1

/**
 * Rolls a d20
 * @returns {number} Result between 1-20
 */
export const rollD20 = () => rollDie(20)

/**
 * Rolls a d20 with modifier
 * @param {number} modifier - The modifier to add
 * @returns {number} The total roll result
 */
export const rollD20WithModifier = (modifier = 0) => rollD20() + modifier

/**
 * Rolls dice based on a dice string format (e.g., "2d6", "1d4")
 * @param {string} diceString - The dice notation
 * @returns {number} The total rolled value
 */
export const rollDice = (diceString) => {
  if (!diceString || !diceString.includes('d')) return 0
  
  const [num, size] = diceString.split('d').map(Number)
  let total = 0
  
  for (let i = 0; i < num; i++) {
    total += rollDie(size)
  }
  
  return total
}

/**
 * Calculates distance between two grid positions (Manhattan distance)
 * @param {Object} pos1 - First position {x, y}
 * @param {Object} pos2 - Second position {x, y}
 * @returns {number} The distance in grid squares
 */
export const calculateDistance = (pos1, pos2) => {
  if (!pos1 || !pos2 || pos1.x === undefined || pos2.x === undefined) {
    return Infinity // Distance infinie si positions invalides
  }
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y)
}

/**
 * Checks if an attack hits based on attack roll vs AC
 * @param {number} attackRoll - The attack roll result
 * @param {number} targetAC - The target's Armor Class
 * @returns {boolean} Whether the attack hits
 */
export const doesAttackHit = (attackRoll, targetAC) => {
  return attackRoll >= targetAC
}