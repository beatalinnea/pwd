/**
 * The Personal Web Desktop application web component module.
 *
 * @author Beata Eriksson <be222gr@student.lnu.se>
 * @version 1.1.0
 */

import '../container-window/'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    .background {
      font-size: 1.5em;
      background-color: #cfcfcf;
      height: 100vh;
      width: 100vw;
      text-align: center;
      display: flex;
      align-items: flex-end;
      margin:  0px;
      position: relative;
    }
    #header {
      width: 100%;
      background-color: #B3B3B3;
      position: absolute;
      height: 20px;
      top: 0px;
    }
    #topbar {
      margin: 1px;
      padding-left: 5px;
      color: #000000;
      font-size: 15px;
      text-align: left;
    }
    .dock {
        height: 80px;
        background-color: #B3B3B3;
        width: 100%;
        display: flex;
    }

    img {
      margin-top: 10px;
      margin-left: 10px;
      height: 60px;
      margin-right: 20px;
    }

    img:hover {
      cursor: pointer;
    }
  </style>
  <div class="background">
  <div id="header">
    <p id="topbar">this is my desktop</p>
  </div>
  <section class="dock"><img class="memoryicon" alt="Memory game"><img class="chaticon" alt="The messages"><img class="jokeicon" alt="Bad jokes"></section>
  <div>
`

customElements.define('pwd-application',
  /**
   * Represents a PWD-application element.
   */
  class extends HTMLElement {
    /**
     * Container element for the application icons, representing the dock.
     */
    #dock
    /**
     * Container for the sub-apps to be held in when opened.
     */
    #background
    /**
     * The icon for the memory-application.
     */
    #memoryIcon
    /**
     * The icon for the messages-application.
     */
    #chatIcon
    /**
     * The icon for the joke-application.
     */
    #jokeIcon
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#dock = this.shadowRoot.querySelector('.dock')
      this.#background = this.shadowRoot.querySelector('.background')

      this.#memoryIcon = this.shadowRoot.querySelector('.memoryicon')
      this.#memoryIcon.addEventListener('click', event => {
        this.#startAnyApp('memory')
      })

      this.#chatIcon = this.shadowRoot.querySelector('.chaticon')
      this.#chatIcon.addEventListener('click', event => {
        this.#startAnyApp('chat')
      })

      this.#jokeIcon = this.shadowRoot.querySelector('.jokeicon')
      this.#jokeIcon.addEventListener('click', event => {
        this.#startAnyApp('joke')
      })

      // Listening to custom event close-window from container-window.
      this.#background.addEventListener('close-window', event => {
        this.#background.removeChild(event.target)
      })
    }

    /**
     * Called by browser when element added to the DOM. Adds the pictures for the icons to the dock.
     */
    connectedCallback () {
      const memoryImg = (new URL('./img/memory-icon.png', import.meta.url)).href
      this.#memoryIcon.setAttribute('src', `${memoryImg}`)
      this.#dock.appendChild(this.#memoryIcon)

      const chatImg = (new URL('./img/chat-icon.png', import.meta.url)).href
      this.#chatIcon.setAttribute('src', `${chatImg}`)
      this.#dock.appendChild(this.#chatIcon)

      const jokeImg = (new URL('./img/joke-icon.png', import.meta.url)).href
      this.#jokeIcon.setAttribute('src', `${jokeImg}`)
      this.#dock.appendChild(this.#jokeIcon)
    }

    /**
     * Method that gets called when user clicks on any of the icons at the dock.
     * Depending on which application to start, the parameter, will call a certain public method
     * from container-window.
     *
     * @param {string} app - The name of the app to be opened.
     */
    #startAnyApp (app) {
      for (const child of this.#background.children) {
        child.style.zIndex = '0'
      }
      const openApp = document.createElement('container-window')
      openApp.style.top = `${this.#background.children.length * 10}px`
      openApp.style.left = `${this.#background.children.length * 10}px`
      switch (app) {
        case 'joke':
          openApp.startJoke()
          break
        case 'memory':
          openApp.startMemory()
          break
        case 'chat':
          openApp.startChat()
          break
      }
      this.#background.appendChild(openApp)
      openApp.moveElement(openApp)
      openApp.addEventListener('click', event => {
        for (const child of this.#background.children) {
          child.style.zIndex = '0'
        }
        openApp.style.zIndex = '1'
      })
    }
  }
)
