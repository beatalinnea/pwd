/**
 * The memory-application web component module.
 *
 * @author Beata Eriksson <be222gr@student.lnu.se>
 * @version 1.1.0
 */

import './components/memory-game'
import './components/memory-menu'
import './components/poke-dex'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    .container {
        background-color: antiquewhite;
        border: 1px solid;
    }
    .hidden {
        display: none;
    }
    h2 {
        margin-top: 0px;
        padding: 10px;
    }
    button {
      background-color: #cfcfcf;
      cursor: pointer;
      display: inline-block;
      margin: 10px;
      padding: 10px;
      font-size: 1em;
      border-radius: 20px;
      border: 1px solid black;
    }
    button:hover {
      box-shadow: 0px 0px 10px #484848;
    }
  </style>
  <div class="container">
    <h2 class="hidden"></h2>
    <button class="hidden" id="startover">Try again!</button>
  </div>
`

customElements.define('memory-application',
  /**
   * Represents a memory-application element.
   */
  class extends HTMLElement {
    /**
     * Container that will either hold the memory-menu, memory-game or poke-dex.
     */
    #container
    /**
     * Button to be viewed when memory game is ended, if wanting to play again.
     */
    #startOver
    /**
     * Will view in how many tries you solved the memory.
     */
    #winnerText
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#startOver = this.shadowRoot.querySelector('#startover')
      this.#winnerText = this.shadowRoot.querySelector('h2')
      this.#container = this.shadowRoot.querySelector('.container')

      const memoryGame = document.createElement('memory-game')
      const memoryMenu = document.createElement('memory-menu')
      this.#container.appendChild(memoryMenu)

      this.#container.addEventListener('memory-small', event => {
        memoryGame.setAttribute('boardsize', 'small')
        this.#container.removeChild(event.target)
        this.#container.appendChild(memoryGame)
      })

      this.#container.addEventListener('memory-medium', event => {
        memoryGame.setAttribute('boardsize', 'medium')
        this.#container.removeChild(event.target)
        this.#container.appendChild(memoryGame)
      })

      this.#container.addEventListener('memory-large', event => {
        memoryGame.setAttribute('boardsize', 'large')
        this.#container.removeChild(event.target)
        this.#container.appendChild(memoryGame)
      })

      // Listens to memory-game custom event for winning. Event detail represents how many tries.
      this.#container.addEventListener('memory-game:won-game', event => {
        this.#container.removeChild(event.target)
        this.#wonMemory(event.detail)
        this.#startOver.focus()
      })

      this.#startOver.addEventListener('click', event => {
        event.preventDefault()
        this.dispatchEvent(new CustomEvent('start-over', {
          bubbles: true
        }))
      })

      // Listens to view-pokedex event from memory-menu, to open the pokédex.
      this.#container.addEventListener('view-pokedex', event => {
        this.#container.removeChild(event.target)
        this.#container.appendChild(document.createElement('poke-dex'))
      })

      // Listens to go-back event from poke-dex, to close the pokédex and get back to menu.
      this.#container.addEventListener('go-back', event => {
        this.#container.removeChild(event.target)
        this.#container.appendChild(document.createElement('memory-menu'))
      })
    }

    /**
     * Called by the browser when element removed from the DOM.
     */
    disconnectedCallback () {
      this.#startOver.setAttribute('class', 'hidden')
      this.#winnerText.setAttribute('class', 'hidden')
    }

    /**
     * Method that gets called when user won the game, will put the amount of tries in viewed text.
     *
     * @param {number} amount - How many tries it took the user to solve the memory.
     */
    #wonMemory (amount) {
      this.#winnerText.textContent = `You made it in ${amount} times!`
      this.#winnerText.removeAttribute('class', 'hidden')
      this.#startOver.removeAttribute('class', 'hidden')
    }
  }
)
