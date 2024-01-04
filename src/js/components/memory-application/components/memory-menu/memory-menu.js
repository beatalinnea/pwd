/**
 * The memory-menu web component module.
 *
 * @author Beata Eriksson <be222gr@student.lnu.se>
 * @version 1.1.0
 */

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
      text-align: center;
    }
    .menu {
      background-color: antiquewhite;
      max-width: 700px;
      height: min-content;
    }
    h2 {
      padding: 1em;
      margin: 0;
      color: #912222;
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
  <div class="menu">
    <h2>Welcome to poké memory</h2>
        <button class="size" id="small">Play 2x2</button>
        <button class="size" id="medium">Play 2x4</button>
        <button class="size" id="large">Play 4x4</button>
    <h3>Learn more about our pokémons?</h3>
    <button id="pokedex">To our pokédex</button>
  </div>
`

customElements.define('memory-menu',
  /**
   * Represents a memory-menu element.
   */
  class extends HTMLElement {
    /**
     * Array containing all of the button elements in the menu.
     */
    #buttons
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      const small = this.shadowRoot.querySelector('#small')
      small.addEventListener('click', event => {
        event.preventDefault()
        this.dispatchEvent(new CustomEvent('memory-small', {
          bubbles: true
        }))
      })

      const medium = this.shadowRoot.querySelector('#medium')
      medium.addEventListener('click', event => {
        event.preventDefault()
        this.dispatchEvent(new CustomEvent('memory-medium', {
          bubbles: true
        }))
      })

      const large = this.shadowRoot.querySelector('#large')
      large.addEventListener('click', event => {
        event.preventDefault()
        this.dispatchEvent(new CustomEvent('memory-large', {
          bubbles: true
        }))
      })

      const pokedex = this.shadowRoot.querySelector('#pokedex')
      pokedex.addEventListener('click', event => {
        event.preventDefault()
        this.dispatchEvent(new CustomEvent('view-pokedex', {
          bubbles: true
        }))
      })

      this.#buttons = Array.from(this.shadowRoot.querySelectorAll('button'))
    }

    /**
     * Called by the browser when added to the DOM. Using switch as from MDN.
     * Listens to keydown events in game menu.
     */
    connectedCallback () {
      let chosenButton = this.#buttons[0]
      chosenButton.focus()

      this.#buttons.forEach(button => (
        button.addEventListener('keydown', (event) => {
          switch (event.key) {
            case 'Down': // IE/Edge specific value
            case 'ArrowDown':
              chosenButton = this.#buttons[3]
              chosenButton.focus()
              break
            case 'Up': // IE/Edge specific value
            case 'ArrowUp':
              chosenButton = this.#buttons[0]
              chosenButton.focus()
              break
            case 'Left': // IE/Edge specific value
            case 'ArrowLeft':
              if ((this.#buttons.indexOf(chosenButton) - 1) < 0) {
                chosenButton = this.#buttons[0]
              } else {
                chosenButton = this.#buttons[(this.#buttons.indexOf(chosenButton) - 1)]
              }
              chosenButton.focus()
              break
            case 'Right': // IE/Edge specific value
            case 'ArrowRight':
              if (this.#buttons.length <= (this.#buttons.indexOf(chosenButton) + 1)) {
                chosenButton = this.#buttons[0]
              } else {
                chosenButton = this.#buttons[(this.#buttons.indexOf(chosenButton) + 1)]
              }
              chosenButton.focus()
              break
            case 'Enter':
              event.target.click()
              break
          }
          event.preventDefault()
        }, true)
      ))
    }
  }
)
