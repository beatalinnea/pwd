/**
 * The nickname-form web component.
 *
 * @author Beata Eriksson <be222gr@student.lnu.se>
 * @version 1.1.0
 */

const template = document.createElement('template')
template.innerHTML = `
  <style>
    .nickname {
      padding: 1em;
      text-align: center;
      border: none;
    }
    #start {
        cursor: pointer;
    }
    /* Media query for small screens (phones) */
@media screen and (max-width: 600px) {
  .nickname {
    padding: 0.5em; /* Adjust padding for smaller screens */
    text-align: center;
    border: none;
    font-size: 1rem; /* Adjust font size for smaller screens */
  }

  #start {
    cursor: pointer;
    margin-top: 10px; /* Add some space above the #start button on smaller screens */
    font-size: 1rem; /* Adjust font size for smaller screens */
  }
}
  </style>
  <form id="nicknameform">
  <fieldset class="nickname">
    <label for="your_nickname">Your nickname:</label>
    <input type="text" id="yournickname" autocomplete="off">
    <input type="submit" id="start" value="Chat">
  </fieldset>
  </form>
`

customElements.define('nickname-form',
  /**
   * Represents a nickname-form element.
   */
  class extends HTMLElement {
    /**
     * What will be typed in the input field as the chosen nickname.
     */
    #yourNickname
    /**
     * The form to be submitted, holding the input fields.
     */
    #nicknameform
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#yourNickname = this.shadowRoot.querySelector('#yournickname')
      this.#nicknameform = this.shadowRoot.querySelector('#nicknameform')

      this.#nicknameform.addEventListener('submit', event => {
        event.preventDefault()
        this.dispatchEvent(new CustomEvent('filled', {
          bubbles: true,
          detail: `${this.#yourName}`
        }))
      })
      this.#nicknameform.addEventListener('click', event => {
        this.#yourNickname.focus()
      })
    }

    /**
     * Called by the browser when added to the DOM.
     */
    connectedCallback () {
      this.#yourNickname.focus()
    }

    /**
     * Called when element is deleted from the DOM.
     */
    disconnectedCallback () {
      this.#yourNickname.value = ''
    }

    /**
     * Gets the nickname.
     *
     * @returns {string} The chosen nickname.
     */
    get #yourName () {
      if (typeof this.#yourNickname.value !== 'string' || this.#yourNickname.value.length === 0) {
        this.#yourNickname.value = 'Anonymous User...'
      }
      return this.#yourNickname.value
    }
  }
)
