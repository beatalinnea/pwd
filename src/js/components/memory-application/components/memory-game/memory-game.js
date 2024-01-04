/**
 * The memory-game web component module. Boiler plate code used from exercise, minimally modified by my own preferences.
 *
 * @author Beata Eriksson <be222gr@student.lnu.se>
 * @version 1.1.0
 */

import '../flipping-tiles'

/*
 * Loop trough to get images from img folder.
 */
const imagesAmount = 9

const imgUrl = new Array(imagesAmount)
for (let i = 0; i < imagesAmount; i++) {
  imgUrl[i] = (new URL(`../img/${i}.png`, import.meta.url)).href
}

/*
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      --tile-size: 80px;
    }
    #game-board {
      padding: 10px;
      background-color: #ffffff;
      display: grid;
      grid-template-columns: repeat(4, var(--tile-size));
      gap: 20px;
    }
    #game-board.small {
      grid-template-columns: repeat(2, var(--tile-size));
    }
    flipping-tiles {
      width: var(--tile-size);
      height: var(--tile-size);
    }
    flipping-tiles::part(tile-back) {
      border-width: 5px;
      background: #818181 url('${imgUrl[0]}') no-repeat center/50%;
    }
  </style>
  <template id="tile-template">
    <flipping-tiles>
    <img />
    </flipping-tiles>
  </template>
  <div id="game-board">
  </div>
`

/*
 * Define custom element.
 */
customElements.define('memory-game',
  /**
   * Represents a memory game
   */
  class extends HTMLElement {
    /**
     * The game board element.
     *
     * @type {HTMLDivElement}
     */
    #gameBoard

    /**
     * The tile template element.
     *
     * @type {HTMLTemplateElement}
     */
    #tileTemplate

    /**
     * Counter, how many tries
     */
    #counter

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Get the game board element in the shadow root.
      this.#gameBoard = this.shadowRoot.querySelector('#game-board')

      // Get the tile template element in the shadow root.
      this.#tileTemplate = this.shadowRoot.querySelector('#tile-template')

      // Set a counter of tries to zero
      this.#counter = 0
    }

    /**
     * Gets the board size.
     *
     * @returns {string} The size of the game board.
     */
    get boardSize () {
      return this.getAttribute('boardsize')
    }

    /**
     * Sets the board size.
     *
     * @param {string} value - The size of the game board.
     */
    set boardSize (value) {
      this.setAttribute('boardsize', value)
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['boardsize']
    }

    /**
     * Get the game board size dimensions.
     *
     * @returns {object} The width and height of the game board.
     */
    get #gameBoardSize () {
      const gameBoardSize = {
        width: 4,
        height: 4
      }

      switch (this.boardSize) {
        case 'small' : {
          gameBoardSize.width = gameBoardSize.height = 2
          break
        }

        case 'medium' : {
          gameBoardSize.height = 2
          break
        }
      }

      return gameBoardSize
    }

    /**
     * Get all tiles.
     *
     * @returns {object} An object containing grouped tiles.
     */
    get #tiles () {
      const tiles = Array.from(this.#gameBoard.children)
      return {
        all: tiles,
        faceUp: tiles.filter(tile => tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        faceDown: tiles.filter(tile => !tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        hidden: tiles.filter(tile => tile.hasAttribute('hidden'))
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      if (!this.hasAttribute('boardsize')) {
        this.setAttribute('boardsize', 'large')
      }

      this.#upgradeProperty('boardsize')

      this.#gameBoard.addEventListener('flipping-tiles:flip', () => this.#onTileFlip())
      this.addEventListener('dragstart', (event) => {
        // Disable element dragging.
        event.preventDefault()
        event.stopPropagation()
      })
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'boardsize') {
        this.#init()
      }
    }

    /**
     * Run the specified instance property through the class setter.
     *
     * @param {string} prop - The property's name.
     */
    #upgradeProperty (prop) {
      if (Object.hasOwnProperty.call(this, prop)) {
        const value = this[prop]
        delete this[prop]
        this[prop] = value
      }
    }

    /**
     * Initializes the game board size and tiles.
     */
    #init () {
      const { width, height } = this.#gameBoardSize

      const tilesCount = width * height

      if (tilesCount !== this.#tiles.all.length) {
        // Remove existing tiles, if any.
        while (this.#gameBoard.firstChild) {
          this.#gameBoard.removeChild(this.#gameBoard.lastChild)
        }

        if (width === 2) {
          this.#gameBoard.classList.add('small')
        } else {
          this.#gameBoard.classList.remove('small')
        }

        // Add tiles.
        for (let i = 0; i < tilesCount; i++) {
          const tile = this.#tileTemplate.content.cloneNode(true)
          this.#gameBoard.appendChild(tile)
        }
      }

      // Create a sequence of numbers between 0 and 15,
      // and then shuffle the sequence.
      const indexes = [...Array(tilesCount).keys()]

      for (let i = indexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexes[i], indexes[j]] = [indexes[j], indexes[i]]
      }

      // Set the tiles' images.
      this.#tiles.all.forEach((tile, i) => {
        tile.querySelector('img').setAttribute('src', imgUrl[indexes[i] % (tilesCount / 2) + 1])
        tile.faceUp = tile.disabled = tile.hidden = false
      })

      if (this.#tiles.faceDown.length >= 1) {
        this.#focusOnTile()
      }
    }

    /**
     * Focuses on the tiles facing down in the game. Switch as from MDN. Makes it possible to play with
     * arrow left, arrow right and enter for flip.
     *
     */
    #focusOnTile () {
      let chosenTile = this.#tiles.faceDown[0]

      this.#tiles.faceDown.forEach(tile => (
        tile.addEventListener('keydown', (event) => {
          switch (event.key) {
            case 'Left': // IE/Edge specific value
            case 'ArrowLeft':
              chosenTile.removeAttribute('focus', '')
              if ((this.#tiles.faceDown.indexOf(chosenTile) - 1) < 0) {
                chosenTile = this.#tiles.faceDown[0]
              } else {
                chosenTile = this.#tiles.faceDown[(this.#tiles.faceDown.indexOf(chosenTile) - 1)]
              }
              chosenTile.setAttribute('focus', '')
              break
            case 'Right': // IE/Edge specific value
            case 'ArrowRight':
              chosenTile.removeAttribute('focus', '')
              if (this.#tiles.faceDown.length <= (this.#tiles.faceDown.indexOf(chosenTile) + 1)) {
                chosenTile = this.#tiles.faceDown[0]
              } else {
                chosenTile = this.#tiles.faceDown[(this.#tiles.faceDown.indexOf(chosenTile) + 1)]
              }
              chosenTile.setAttribute('focus', '')
              break
            case 'Enter':
              chosenTile.removeAttribute('focus', '')
              if (this.#tiles.faceDown.length <= (this.#tiles.faceDown.indexOf(chosenTile) + 1)) {
                chosenTile = this.#tiles.faceDown[0]
              } else {
                chosenTile = this.#tiles.faceDown[(this.#tiles.faceDown.indexOf(chosenTile) + 1)]
              }
              chosenTile.setAttribute('focus', '')
              break
          }
          event.preventDefault()
        }, true)
      ))
      chosenTile.setAttribute('focus', '')
    }

    /**
     * Handles flip events.
     */
    #onTileFlip () {
      const tiles = this.#tiles
      const tilesToDisable = Array.from(tiles.faceUp)

      if (tiles.faceUp.length > 1) {
        tilesToDisable.push(...tiles.faceDown)
      }

      tilesToDisable.forEach(tile => (tile.setAttribute('disabled', '')))

      const [first, second, ...tilesToEnable] = tilesToDisable

      if (second) {
        const isEqual = first.isEqual(second)
        const delay = isEqual ? 400 : 1000
        window.setTimeout(() => {
          let eventName = 'memory-game:tiles-mismatch'
          if (isEqual) {
            first.setAttribute('hidden', '')
            second.setAttribute('hidden', '')
            eventName = 'memory-game:tiles-match'
          } else {
            first.removeAttribute('face-up')
            second.removeAttribute('face-up')
            tilesToEnable.push(first, second)
          }
          // counts how many tries
          this.#counter = this.#counter + 1

          this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            detail: { first, second }
          }))

          if (tiles.all.every(tile => tile.hidden)) {
            tiles.all.forEach(tile => (tile.disabled = true))
            this.dispatchEvent(new CustomEvent('memory-game:won-game', {
              bubbles: true,
              detail: this.#counter
            }))

            this.#init()
          } else {
            tilesToEnable?.forEach(tile => (tile.removeAttribute('disabled')))
          }
        }, delay)
      }
    }
  }
)
