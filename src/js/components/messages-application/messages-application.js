/**
 * The messages-application web component module.
 *
 * @author Beata Eriksson <be222gr@student.lnu.se>
 * @version 1.1.0
 */

import './components/nickname-form'
import './components/the-chat'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    .outerborder {
      border: 1px solid black;
    }
    .container {
      width: 600px;
    }
    h2 {
      margin: 0px;
      padding: 10px;
    }
    .hidden {
      display:none;
    }
  </style>
  <section class="outerborder">
  <div class="container">
    <h2>The messages</h2>
    <button id="changename" value="Change nickname">Change Nickname</button>
  </div>
  </section>
`

customElements.define('messages-application',
  /**
   * Represents a messages-application element.
   */
  class extends HTMLElement {
    /**
     * Container element that view a static headline and append either the nickname form or the chat viewing the messages.
     */
    #container
    /**
     * Button for changing the nickname.
     */
    #changeName
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#container = this.shadowRoot.querySelector('.container')

      this.#container.addEventListener('filled', event => {
        this.#storeNickname(event.detail)
        this.#container.removeChild(event.target)
        this.#changeName.removeAttribute('class', 'hidden')
      })

      this.#changeName = this.shadowRoot.querySelector('#changename')
      this.#changeName.addEventListener('click', event => {
        this.clearStorage()
        this.#nicknameForm()
        this.#container.removeChild(this.shadowRoot.querySelector('the-chat'))
      })

      // See if there is a nickname stored..
      this.#checkNickname()
    }

    /**
     * Methods that checks local storage for users nickname, parses it - else, view form to set a nickname.
     */
    #checkNickname () {
      let savedName = []
      if (JSON.parse(window.localStorage.getItem('messages-nickname')) !== null) {
        savedName = JSON.parse(window.localStorage.getItem('messages-nickname'))
        this.#theChat(savedName[0].nickname)
      } else {
        this.#nicknameForm()
      }
    }

    /**
     * Adds nickname form element to the container element.
     */
    #nicknameForm () {
      this.#changeName.setAttribute('class', 'hidden')
      const nickname = document.createElement('nickname-form')
      this.#container.appendChild(nickname)
    }

    /**
     * Adds a the-chat element to the container element.
     *
     * @param {string} nickname - The chosen name of the user.
     */
    #theChat (nickname) {
      const chat = document.createElement('the-chat')
      chat.setAttribute('name', `${nickname}`)
      this.#container.appendChild(chat)
    }

    /**
     * Methods that saves new nickname to local storage when nickname form is submitted with a new nickname.
     *
     * @param {string} nickname - The chosen nickname being the event detail from the custom event created in nickname-form.
     */
    #storeNickname (nickname) {
      const savedName = []
      savedName.push({ nickname: `${nickname}` })
      window.localStorage.setItem('messages-nickname', JSON.stringify(savedName))
      this.#checkNickname()
    }

    /**
     * Method to use if wanting to clear storage.
     */
    clearStorage () {
      localStorage.removeItem('messages-nickname')
    }
  }
)
