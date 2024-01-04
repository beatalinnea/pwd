/**
 * The container-window web component module.
 *
 * @author Beata Eriksson <be222gr@student.lnu.se>
 * @version 1.1.0
 */

import '../memory-application/'
import '../messages-application'
import '../joke-application'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      position: absolute;
      border: 1px solid #000000;
    }
    .header {
      height: 1em;
      background-color: #cccccc;
      position: relative;
    }
    #close {
      position: absolute;
      top: 2px;
      right: 2px;
      cursor: pointer;
    }
    .container {
        border: 2px solid #cfcfcf;
        background-color: #ffffff;
    }
    #appname {
      margin: 0px;
      padding-top: 3px;
      font-size: 1rem;
    }
  </style>
  <div class="header">
    <p id="appname"></p>
    <button id="close">exit</button>
  </div>
  <div class="container">
  <div>
`

customElements.define('container-window',
  /**
   * Represents a container-window element.
   */
  class extends HTMLElement {
    /**
     * A moveable element that will contain the opened sub-apps.
     */
    #container
    /**
     * Element for the container to view the name of the application being opened in that specific window.
     */
    #appname
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#container = this.shadowRoot.querySelector('.container')
      this.#appname = this.shadowRoot.querySelector('#appname')

      const close = this.shadowRoot.querySelector('#close')
      close.addEventListener('click', event => {
        event.preventDefault()
        this.dispatchEvent(new CustomEvent('close-window', {
          bubbles: true
        }))
      })

      // listens to start-over custom element from memory-application.
      this.#container.addEventListener('start-over', event => {
        this.#container.removeChild(event.target)
        this.startMemory()
      })
    }

    /**
     * Called by the browser when element removed from the DOM, will empty the container holding the name of the application.
     */
    disconnectedCallback () {
      this.#appname.textContent = ''
    }

    /**
     * Public method that will append the memory to a moving container
     * window.
     */
    startMemory () {
      const memoryApplication = document.createElement('memory-application')
      this.#container.appendChild(memoryApplication)
      this.#appname.textContent = 'Poké Memory'
    }

    /**
     * Public method that will append the chat to a moving container
     * window.
     */
    startChat () {
      const chatApplication = document.createElement('messages-application')
      this.#container.appendChild(chatApplication)
      this.#appname.textContent = 'The messages'
    }

    /**
     * Public method that will append the custom application to a moving container
     * window.
     */
    startJoke () {
      const jokeApplication = document.createElement('joke-application')
      this.#container.appendChild(jokeApplication)
      this.#appname.textContent = 'Bad Jokes'
    }

    /**
     * Public method to call to make element moveable, used code from MDN Web API mouse events and took a lot of help
     * and code from source: "www.w3schools.com/howto/howto_js_draggable.asp".
     *
     * @param {HTMLElement} movingWindow - The element to be moved.
     */
    moveElement (movingWindow) {
      let pos1 = 0
      let pos2 = 0
      let pos3 = 0
      let pos4 = 0
      movingWindow.onmousedown = dragMouseDown

      /**
       * Function being called when mouse pushed down on element.
       *
       * @param {event} event - The event that occurs when mouse down.
       */
      function dragMouseDown (event) {
        event = event || movingWindow.event
        event.preventDefault()
        // get the mouse cursor position at startup:
        pos3 = event.clientX
        pos4 = event.clientY
        document.onmouseup = closeDragElement
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag
      }

      /**
       * Function being called when element gets dragged.
       *
       * @param {event} event - The event that occurs when element is being dragged.
       */
      function elementDrag (event) {
        event = event || movingWindow.event
        event.preventDefault()
        // calculate the new cursor position:
        pos1 = pos3 - event.clientX
        pos2 = pos4 - event.clientY
        pos3 = event.clientX
        pos4 = event.clientY
        // set the element's new position:
        movingWindow.style.top = (movingWindow.offsetTop - pos2) + 'px'
        movingWindow.style.left = (movingWindow.offsetLeft - pos1) + 'px'
      }

      /**
       * Stops the drag event when mouse is not pushed down or moving.
       */
      function closeDragElement () {
        // stop moving when mouse button is released:
        document.onmouseup = null
        document.onmousemove = null
      }
    }
  }
)
