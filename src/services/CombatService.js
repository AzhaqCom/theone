import { enemyTemplates } from '../data/enemies'
import { getModifier } from '../utils/calculations'

/**
 * Service gérant toute la logique métier du combat
 */
export class CombatService {
  /**
   * Initialise un nouveau combat
   */
  initializeCombat(playerCharacter, playerCompanion, encounterData) {
    // Créer les ennemis
    const enemies = this.createEnemiesFromEncounter(encounterData)
    
    // Créer l'ordre d'initiative
    const turnOrder = this.rollInitiative(playerCharacter, playerCompanion, enemies)
    
    // Positions initiales
    const positions = this.initializePositions(
      playerCharacter, 
      playerCompanion, 
      enemies, 
      encounterData.enemyPositions
    )
    
    return {
      enemies,
      turnOrder,
      positions,
      currentTurn: 0
    }
  }

  /**
   * Crée les ennemis à partir des données de rencontre
   */
  createEnemiesFromEncounter(encounterData) {
    if (!encounterData?.enemies?.length) {
      throw new Error('Aucun ennemi défini dans la rencontre')
    }

    return encounterData.enemies.flatMap((encounter, encounterIndex) => {
      const template = enemyTemplates[encounter.type]
      
      if (!template) {
        console.error(`Template non trouvé pour: ${encounter.type}`)
        return []
      }

      return Array(encounter.count)
        .fill(null)
        .map((_, index) => ({
          ...template,
          id: `${encounter.type}_${encounterIndex}_${index}`,
          name: encounter.count > 1 ? `${template.name} ${index + 1}` : template.name,
          type: 'enemy',
          currentHP: template.currentHP ?? template.maxHP ?? 10,
          maxHP: template.maxHP ?? 10,
          ac: template.ac ?? 10,
          stats: { ...template.stats },
          attacks: [...(template.attacks || [])],
          image: template.image || '',
          isAlive: true
        }))
    })
  }

  /**
   * Lance l'initiative pour tous les combattants
   */
  rollInitiative(playerCharacter, playerCompanion, enemies) {
    const combatants = []

    // Vérification de sécurité
    if (!playerCharacter || !playerCharacter.stats) {
      console.error('CombatService: playerCharacter ou playerCharacter.stats manquant')
      throw new Error('Personnage joueur requis pour initialiser le combat')
    }

    // Joueur
    const playerInit = this.rollD20() + getModifier(playerCharacter.stats.dexterite)
    combatants.push({
      ...playerCharacter,
      id: 'player',
      type: 'player',
      initiative: playerInit,
      isAlive: true
    })

    // Compagnon
    if (playerCompanion) {
      const companionInit = this.rollD20() + getModifier(playerCompanion.stats.dexterite)
      combatants.push({
        ...playerCompanion,
        id: 'companion', 
        type: 'companion',
        initiative: companionInit,
        isAlive: true
      })
    }

    // Ennemis
    enemies.forEach(enemy => {
      const enemyInit = this.rollD20() + getModifier(enemy.stats.dexterite)
      combatants.push({
        ...enemy,
        initiative: enemyInit
      })
    })

    // Trier par initiative (plus haute en premier, joueur gagne les égalités)
    return combatants.sort((a, b) => {
      if (b.initiative === a.initiative) {
        // Priorité: player > companion > enemy
        if (a.type === 'player') return -1
        if (b.type === 'player') return 1
        if (a.type === 'companion') return -1
        if (b.type === 'companion') return 1
        return 0
      }
      return b.initiative - a.initiative
    })
  }

  /**
   * Initialise les positions de combat
   */
  initializePositions(playerCharacter, playerCompanion, enemies, customPositions = null) {
    const positions = {
      // Positions par défaut du joueur
      player: { x: 1, y: 2 },
      companion: playerCompanion ? { x: 0, y: 2 } : null,
      
      // État de mouvement
      playerHasMoved: false,
      companionHasMoved: false
    }

    // Positions des ennemis
    if (customPositions) {
      // Utiliser les positions personnalisées
      enemies.forEach((enemy, index) => {
        const customPos = customPositions[index]
        if (customPos) {
          positions[enemy.id] = { x: customPos.x, y: customPos.y }
        } else {
          // Position par défaut si pas de position custom
          positions[enemy.id] = this.getDefaultEnemyPosition(index, enemies.length)
        }
      })
    } else {
      // Positions par défaut
      enemies.forEach((enemy, index) => {
        positions[enemy.id] = this.getDefaultEnemyPosition(index, enemies.length)
      })
    }

    return positions
  }

  /**
   * Calcule une position par défaut pour un ennemi
   */
  getDefaultEnemyPosition(index, totalEnemies) {
    const cols = 8
    const rows = 6
    
    // Placer les ennemis du côté droit
    const startX = Math.floor(cols * 0.6)
    const availableWidth = cols - startX
    
    if (totalEnemies === 1) {
      return { x: startX + Math.floor(availableWidth / 2), y: Math.floor(rows / 2) }
    }
    
    // Répartir sur plusieurs lignes si nécessaire
    const enemiesPerRow = Math.min(availableWidth, totalEnemies)
    const row = Math.floor(index / enemiesPerRow)
    const col = index % enemiesPerRow
    
    return {
      x: startX + col,
      y: Math.max(1, Math.min(rows - 2, row + 1))
    }
  }

  /**
   * Exécute une action du joueur
   */
  executePlayerAction(playerCharacter, action, targets, enemies, positions) {
    const messages = []
    const results = {
      damage: [],
      effects: [],
      messages
    }

    if (!action || !targets.length) {
      messages.push({ text: "Aucune action ou cible sélectionnée", type: 'error' })
      return results
    }

    switch (action.type) {
      case 'attack':
        return this.executeAttack(playerCharacter, action, targets, results)
      
      case 'spell':
        return this.executeSpell(playerCharacter, action, targets, results)
      
      default:
        messages.push({ text: `Type d'action inconnu: ${action.type}`, type: 'error' })
        return results
    }
  }

  /**
   * Exécute une attaque
   */
  executeAttack(attacker, weapon, targets, results) {
    targets.forEach(target => {
      // Jet d'attaque
      const attackRoll = this.rollD20()
      const attackBonus = this.getAttackBonus(attacker, weapon)
      const totalAttack = attackRoll + attackBonus
      
      const criticalHit = attackRoll === 20
      const hit = totalAttack >= target.ac || criticalHit
      
      if (hit) {
        // Dégâts
        let damage = this.rollDamage(weapon.damage)
        if (criticalHit) {
          damage *= 2
          results.messages.push({
            text: `💥 Coup critique ! ${attacker.name} inflige ${damage} dégâts à ${target.name} !`,
            type: 'critical'
          })
        } else {
          results.messages.push({
            text: `⚔️ ${attacker.name} touche ${target.name} et inflige ${damage} dégâts`,
            type: 'hit'
          })
        }
        
        results.damage.push({ targetId: target.id, damage })
      } else {
        results.messages.push({
          text: `❌ ${attacker.name} manque ${target.name} (${totalAttack} vs CA ${target.ac})`,
          type: 'miss'
        })
      }
    })
    
    return results
  }

  /**
   * Exécute un sort
   */
  executeSpell(caster, spell, targets, results) {
    // TODO: Implémenter la logique des sorts
    results.messages.push({
      text: `🔮 ${caster.name} lance ${spell.name}`,
      type: 'spell'
    })
    
    return results
  }

  /**
   * Calcule le bonus d'attaque
   */
  getAttackBonus(character, weapon) {
    const proficiencyBonus = Math.ceil(character.level / 4) + 1
    
    // Utiliser FOR pour les armes de mêlée, DEX pour les armes à distance
    const abilityMod = weapon.range > 5 
      ? getModifier(character.stats.dexterite)
      : getModifier(character.stats.force)
    
    return abilityMod + proficiencyBonus
  }

  /**
   * Lance les dégâts d'une arme
   */
  rollDamage(damageString) {
    // Format: "1d8+2" ou "2d6"
    const match = damageString.match(/(\d+)d(\d+)(\+(\d+))?/)
    if (!match) return 0
    
    const [, numDice, dieSize, , bonus] = match
    let total = 0
    
    for (let i = 0; i < parseInt(numDice); i++) {
      total += Math.floor(Math.random() * parseInt(dieSize)) + 1
    }
    
    return total + (parseInt(bonus) || 0)
  }

  /**
   * Lance un dé à 20 faces
   */
  rollD20() {
    return Math.floor(Math.random() * 20) + 1
  }

  /**
   * Vérifie si un combattant est vaincu
   */
  isDefeated(character) {
    return character.currentHP <= 0
  }

  /**
   * Vérifie les conditions de victoire/défaite
   */
  checkCombatEnd(playerCharacter, playerCompanion, enemies) {
    const playerDefeated = this.isDefeated(playerCharacter)
    const companionDefeated = playerCompanion ? this.isDefeated(playerCompanion) : true
    const allEnemiesDefeated = enemies.every(enemy => this.isDefeated(enemy))
    
    if (playerDefeated && companionDefeated) {
      return 'defeat'
    }
    
    if (allEnemiesDefeated) {
      return 'victory'
    }
    
    return null
  }
}