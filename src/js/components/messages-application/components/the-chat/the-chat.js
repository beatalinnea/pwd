/**
 * The-chat web component module.
 *
 * @author Beata Eriksson <be222gr@student.lnu.se>
 * @version 1.1.0
 */

import '../nickname-form'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    .innerborder {
      margin: 10px;
    }
    .chat {
      background-color: #cfcfcf;
      color: #000000;
      height: 300px;
      overflow-y: scroll;
      scrollbar-width: none;
    }
    #messageform {
      background-color: #cfcfcf;
      color: #000000;
    }
    #field {
      border:none;
    }
    #yourmessage {
      padding-right: 25px;
      outline: none;
      width: 180px;
      height: 20px;
    }
    p {
      margin: 0px;
      text-align: left;
      padding: 4px;
      font-size: 0.6em;
    }
    li {
      list-style: none;
      display: inline;
      cursor: pointer;
    }
    .hidden {
      display: none;
    }
    #emojiicon {
      position: absolute;
      left: 300px;
      top: 8px;
      max-width: 18px;
    }
    #emojiicon:hover {
      cursor: pointer;
    }
    .holdtext {
      height: 30px;
      position: relative;
    }
    .emojilist {
      max-width: 200px;
      max-height: 100px;
      margin: 0px;
      overflow-x: hidden;
      overflow-y: scroll;
      background: #ffffff;
      position: absolute;
      left: 151px;
      top: 340px;
      border: 1px solid #B3B3B3;
      padding: 0px;
    }
    #send {
      cursor: pointer;
      height: 25px;
    }
  </style>
  <section class="innerborder">
  <div class="chat">
  </div>
  <form id="messageform">
  <fieldset id="field">
  <ul class="emojilist" class="hidden"></ul>
    <div class="holdtext">
    <input type="text" name="textfield" id="yourmessage" minlength="1" maxlength="40"  autocomplete="off">
    <img id="emojiicon">
    <input type="submit" id="send" value="Send message">
  </div>
  </fieldset>
  </form>
  </section>
`

customElements.define('the-chat',
  /**
   * Represents a the-chat element.
   */
  class extends HTMLElement {
    /**
     * The web socket to connect to.
     */
    #socket
    /**
     * The form element to listen to when being submitted when sending a message in the chat.
     */
    #messageForm
    /**
     * The text field for the user to type a message.
     */
    #yourMessage
    /**
     * Div-element that will view the messages being sent and recieved.
     */
    #chat
    /**
     * The ul element for all the emojis to be pushed in to as list elements.
     */
    #emojiList
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#yourMessage = this.shadowRoot.querySelector('#yourmessage')
      this.#emojiList = this.shadowRoot.querySelector('.emojilist')

      this.#chat = this.shadowRoot.querySelector('.chat')
      this.#chat.addEventListener('click', event => {
        this.#yourMessage.focus()
      })

      this.#messageForm = this.shadowRoot.querySelector('#messageform')
      this.#messageForm.addEventListener('submit', event => {
        event.preventDefault()
        const message = this.#yourMessage.value
        this.#sendMessage(this.#nickname, message)
        this.#yourMessage.value = ''
        this.#yourMessage.focus()
      })

      // set the image URL for the clickable emoji icon, when clicked - list of emojis appears.
      const emojiIcon = this.shadowRoot.querySelector('#emojiicon')
      const emojiURL = (new URL('./img/joke-icon.png', import.meta.url)).href
      emojiIcon.setAttribute('src', `${emojiURL}`)
      emojiIcon.addEventListener('click', event => {
        this.#emojiList.toggleAttribute('hidden')
      })
    }

    /**
     * Called by the browser when added to the DOM. Will put focus on text field, fetch emojis from emoji-API and set up new
     * web socket for the chat.
     */
    connectedCallback () {
      this.#yourMessage.focus()
      this.#fetchEmoji()

      this.#socket = new window.WebSocket('wss://courselab.lnu.se/message-app/socket')
      this.#socket.addEventListener('message', event => {
        const message = JSON.parse(event.data)
        if (message.username !== 'The Server' && message.username !== 'Server') {
          if (this.#chat.children.length >= 20) {
            this.#chat.removeChild(this.#chat.firstElementChild)
          }
          const newP = document.createElement('p')
          newP.textContent = `${message.username}: ${message.data}`
          this.#chat.appendChild(newP)
          this.#chat.lastChild.scrollIntoView()
        }
      })
      this.#socket.addEventListener('open', event => {
      })
    }

    /**
     * Called by the browser when element removed from the DOM. Will close the web socket.
     */
    disconnectedCallback () {
      this.#socket.close()
    }

    /**
     * Gets the name attribute.
     *
     * @returns {string} The attribute holding the chosen name of the user.
     */
    get name () {
      return this.getAttribute('name')
    }

    /**
     * Sets the name.
     *
     * @param {string} value - The chosen name of the user.
     */
    set name (value) {
      this.setAttribute('name', value)
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['name']
    }

    /**
     * Gets the nickname.
     *
     * @returns {string} the nickname.
     */
    get #nickname () {
      return this.name
    }

    /**
     * Method that gets called when sending your message.
     *
     * @param {string} username - The nickname.
     * @param {string} message - The typed message to be sent.
     */
    #sendMessage (username, message) {
      const data = {
        type: 'message',
        data: `${message}`,
        username: `${username}`,
        channel: 'my, not so secret, channel',
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }
      this.#socket.send(JSON.stringify(data))
    }

    /**
     * Fetching emojis from emoji-api. And sends the response to #viewEmoji method.
     */
    async #fetchEmoji () {
      try {
        const response = await fetch('https://emoji-api.com/emojis?access_key=6deb1f78d3157c419bb50aff54387814d40ebbad')
        if (!response.ok) {
          const error = new Error(`Fetch error ${response.status}`)
          error.message = `Fetch error ${response.status}`
        }
        const data = await response.json()
        this.#viewEmoji(data)
      } catch (error) {
        console.log(error.message)
      }
    }

    /**
     * Method that pushes emojis in to a clickable li elements to be held in a ul list, when an emoji is clicked it is being added
     * to the textfield. For this I took some help at source: youtube.com/watch?v=oHyZHrlN7vo/.
     *
     * @param {object[]} data - The collection of emojis from emoji-api.
     */
    #viewEmoji (data) {
      this.#emojiList.toggleAttribute('hidden')
      data.forEach(emoji => {
        const li = document.createElement('li')
        li.setAttribute('name', emoji.slug)
        li.textContent = emoji.character
        this.#emojiList.appendChild(li)
        li.addEventListener('click', event => {
          this.#yourMessage.value = `${this.#yourMessage.value}${event.target.textContent}`
          this.#emojiList.toggleAttribute('hidden')
        })
      })
    }
  }
)
