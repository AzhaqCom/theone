import tyrionImage from '../assets/tyrion.png';
import rhingannImage from '../assets/rhingann.png'
import kaelImage from '../assets/kael.png'
import finnImage from '../assets/finn.png'
import zaraImage from '../assets/zara.png'

export const companions = {
    "tyrion": {
        name: "Tyrion",
        level: 1,
        race: "Humain",
        class: "Jeune Guerrier",
        historic: "Chercheur de Reliques",
        role: "tank",
        maxHP: 12,
        currentHP: 12,
        ac: 18,
        initiative: 0,
        speed: "9m",
        proficiencyBonus: 2,
        hitDice: 1,
        hitDiceType: 6,
        type: "companion",
        stats: {
            force: 18,
            dexterite: 16,
            constitution: 15,
            intelligence: 13,
            sagesse: 10,
            charisme: 12
        },
        movement: 6,
        image: tyrionImage,
        attacks: [
            {
                name: "son Épée longue",
                type: "melee",
                range: 1,
                description: "Une attaque avec une épée longue",
                damageDice: "1d8",
                damageType: "tranchant",
                stat: "force"
            }
        ],
        inventory: [],
        aiPriority: ["protect", "taunt", "melee_attack"],
        // Modificateurs intelligents pour affiner les décisions
        aiModifiers: {
            "protect": {
                allyLowHPBonus: +60,        // Gros bonus si allié en danger
                allyUnderAttackBonus: +40,  // Protection active
                emergencyBonus: +100        // Situation critique
            },
            "taunt": {
                multipleEnemiesBonus: +30,  // Plus d'ennemis = plus utile
                strongEnemyBonus: +45,      // Contre ennemi dangereux
                allyInMeleeBonus: +25       // Protéger allié au contact
            },
            "melee_attack": {
                closestEnemyBonus: +20,     // Ennemi le plus proche
                finishingBonus: +35,        // Achever ennemi faible
                revengeBonus: +30           // Contre attaquant d'allié
            }
        },
        spellcasting: null
    },
    "rhingann": {
        name: "Rhingann",
        level: 1,
        race: "Naine",
        class: "Clerc",
        historic: "",
        role: "healer",
        maxHP: 13,
        currentHP: 13,
        ac: 14,
        initiative: 0,
        speed: "9m",
        proficiencyBonus: 2,
        hitDice: 1,
        hitDiceType: 8,
        type: "companion",
        stats: {
            force: 14,
            dexterite: 10,
            constitution: 14,
            intelligence: 10,
            sagesse: 18,
            charisme: 10
        },
        movement: 6,
        image: rhingannImage,
        attacks: [
            {
                name: "son Marteau de guerre",
                type: "melee",
                range: 1,
                description: "Une attaque avec un marteau de guerre",
                damageDice: "1d8",
                damageType: "contondant",
                stat: "force"
            }
        ],
        inventory: [],
        aiPriority: ["heal", "buff", "ranged_support"],
        // Modificateurs intelligents pour healer
        aiModifiers: {
            "heal": {
                criticalHPBonus: +150,      // Allié en danger de mort
                tankPriorityBonus: +60,     // Prioriser tank
                selfPreservationBonus: +80, // Se soigner en priorité si bas
                multipleWoundedBonus: +40   // Plusieurs blessés
            },
            "buff": {
                preCombatBonus: +70,        // Avant combat
                tankBuffBonus: +50,         // Buffer le tank
                groupBuffBonus: +45         // Buff de groupe
            },
            "ranged_support": {
                safeDistanceBonus: +30,     // Maintenir distance
                finishingBonus: +40,        // Achever ennemi faible
                enemyCasterBonus: +35       // Cibler lanceurs ennemis
            }
        },
        spellcasting: {
            class: "Clerc",
            spellSlots: {
                "1": { total: 2, used: 0 }
            },
            knownSpells: ["Soins", "Bénédiction"],
            preparedSpells: ["Soins", "Bénédiction"],
            slotsRemaining: {
                "1": 2
            }
        }
    },
    "kael": {
        name: "Kael",
        level: 1,
        race: "Elfe des bois",
        class: "Rôdeur",
        historic: "Chasseur Solitaire",
        role: "tank",
        maxHP: 13,
        currentHP: 13,
        ac: 15,
        initiative: 0,
        speed: "9m",
        proficiencyBonus: 2,
        hitDice: 1,
        hitDiceType: 10,
        type: "companion",
        stats: {
            force: 12,
            dexterite: 16,
            constitution: 12,
            intelligence: 10,
            sagesse: 14,
            charisme: 8
        },
        movement: 6,
        image: kaelImage,
        attacks: [
            {
                name: "Épée Courte",
                type: "melee",
                range: 1,
                description: "Une attaque avec une épée courte.",
                damageDice: "1d6",
                damageType: "perforant",
                stat: "dexterite"
            }
        ],
        inventory: [],
        aiPriority: ["ranged_attack", "support_skill"],
        spellcasting: {
            class: "Rôdeur",
            spellSlots: null,
            knownSpells: [],
            preparedSpells: []
        }
    },
    "finn": {
        name: "Finn",
        level: 1,
        race: "Gnome",
        class: "Inventeur",
        historic: "Génie Mécanique",
        role: "support",
        maxHP: 10,
        currentHP: 10,
        ac: 13,
        initiative: 0,
        speed: "7.5m",
        proficiencyBonus: 2,
        hitDice: 1,
        hitDiceType: 8,
        type: "companion",
        stats: {
            force: 8,
            dexterite: 14,
            constitution: 12,
            intelligence: 18,
            sagesse: 13,
            charisme: 11
        },
        movement: 5,
        image: finnImage,
        attacks: [
            {
                name: "Dague de précision",
                type: "melee",
                range: 1,
                description: "Une dague légère et précise",
                damageDice: "1d4",
                damageType: "perforant",
                stat: "dexterite"
            },
            {
                name: "Projectile énergétique",
                type: "ranged",
                range: 6,
                description: "Dispositif de tir à énergie concentrée",
                damageDice: "1d6",
                damageType: "force",
                stat: "intelligence"
            }
        ],
        inventory: ["Détecteur planaire Mark VII", "Kit d'inventeur", "Composants mécaniques"],
        aiPriority: ["support_skill", "ranged_attack", "heal"],
        spellcasting: {
            class: "Inventeur",
            spellSlots: {
                "1": { total: 1, used: 0 }
            },
            knownSpells: ["Détection de la magie", "Réparation"],
            preparedSpells: ["Détection de la magie", "Réparation"],
            slotsRemaining: {
                "1": 1
            }
        }
    },
    "zara": {
        name: "Zara",
        level: 2,
        race: "Humaine",
        class: "Sorcière",
        historic: "Érudite Planaire",
        role: "dps",
        maxHP: 14,
        currentHP: 14,
        ac: 12,
        initiative: 0,
        speed: "9m",
        proficiencyBonus: 2,
        hitDice: 2,
        hitDiceType: 6,
        type: "companion",
        stats: {
            force: 9,
            dexterite: 13,
            constitution: 14,
            intelligence: 16,
            sagesse: 15,
            charisme: 17
        },
        movement: 6,
        image: zaraImage,
        attacks: [
            {
                name: "Bâton mystique",
                type: "melee",
                range: 1,
                description: "Un bâton imprégné d'énergie magique",
                damageDice: "1d6",
                damageType: "contondant",
                stat: "force"
            },
            {
                name: "Trait de feu",
                type: "ranged",
                range: 12,
                description: "Projectile magique enflammé",
                damageDice: "1d10",
                damageType: "feu",
                stat: "charisme"
            }
        ],
        inventory: ["Grimoire planaire", "Composants de sorts", "Cristal de focalisation"],
        aiPriority: ["ranged_spell", "area_damage", "debuff"],
        spellcasting: {
            class: "Sorcière",
            spellSlots: {
                "1": { total: 3, used: 0 },
                "2": { total: 1, used: 0 }
            },
            knownSpells: ["Trait de feu", "Bouclier", "Détection de la magie", "Invisibilité", "Toile d'araignée"],
            preparedSpells: ["Trait de feu", "Bouclier", "Détection de la magie", "Invisibilité"],
            slotsRemaining: {
                "1": 3,
                "2": 1
            }
        }
    }

};
