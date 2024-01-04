/**
 * The flipping-tiles web component module. Boiler plate code used from exercise, minimally modified by my own preferences -
 * listening to key event for flipping tile and uses attribute focus.
 *
 * @author Beata Eriksson <be222gr@student.lnu.se>
 * @version 1.1.0
 */

const template = document.createElement('template')
template.innerHTML = `
   <style>
     :host {
         display: block;
         height: 100px;
         width: 100px;
         position: relative;
         border-color: #858585;
     }
 
     :host([hidden]) #tile {
         cursor: default;
         pointer-events: none;
         box-shadow: none;
         visibility: hidden;
     }
    
     /* rotate to flip */
     :host([face-up]) #tile {
       transform: rotateY(180deg);
     }
 
     #tile {
       display: inline-block; /* To be put next to eachother*/ 
       height: 100%;
       width: 100%; /* fill all of :host size */
       border: solid 1px #484848;
       border-radius: 7px;
       background-color: #ffffff;
       cursor: pointer; /* to see that it is clickable */
       /* transform to flip */
       transform-style: preserve-3d;
       transition: 0.5s;
     }
 
     #tile:hover, #tile:focus{
       box-shadow: 0px 0px 10px #484848;
     }
 
     /* when tile is moved away */
     #tile[disabled] {
       cursor: default;
       pointer-events: none;
     }
 
     #front,
     #back {
       width: calc(100% - 6px);
       height: calc(100% - 6px);
       border-radius: 5px;
       margin:3px;
       position: absolute;
       top:0;
       left:0;
       backface-visibility: hidden; /* annars flippar baksidan */
     }
 
     #front {
       transform: rotateY(180deg);
     }
 
     #back {
       background:#818181 no-repeat center/50%;
     }
 
     slot {
         width: 100%;
         height: 100%;
         display: flex;
         justify-content: center;
         align-items: center;
     }

     ::slotted(img) {
         max-width: 98%;
         max-height: 98%;
     }
   </style>
   
   <button part="tile-main" id="tile">
     <div part="tile-front" id="front">
       <slot></slot>
     </div>
     <div part="tile-back" id="back"></div>
   </button>
 `

customElements.define('flipping-tiles',
  /**
   * Represents a flipping tile.
   */
  class extends HTMLElement {
    /**
     * The element representing the tile.
     *
     * @type {HTMLButtonElement}
     */
    #tile

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#tile = this.shadowRoot.querySelector('#tile')
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['face-up', 'disabled', 'hidden', 'focus']
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.addEventListener('click', (event) => {
        // makes sure using mouse left button or no button (keyboard)
        // and not allowing certain keys to use for flip.
        if (event.button === 0 &&
           event.buttons < 2 &&
           !event.altKey &&
           !event.ctrlKey &&
           !event.metaKey &&
           !event.shiftKey) {
          this.#flip()
        }
      })

      // Make it possible to flip with enter key.
      this.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          this.#flip()
        }
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
      // Enable or disable the button inside the shadow DOM.
      if (name === 'disabled' || name === 'hidden') {
        // Determine if the disabled attribute should be present or absent.
        const isPresent = Boolean(newValue) || newValue === ''

        if (isPresent) {
          this.#tile.setAttribute('disabled', '')
        } else {
          this.#tile.removeAttribute('disabled')
        }
      }

      // focus on tile if attribute focus.
      if (name === 'focus') {
        this.#tile.focus()
      }
    }

    /**
     * Specifies whether this instance contains the same content as another tile.
     *
     * @param {*} other - The tile to test for equality
     * @returns {boolean} true if other has the same content as this tile instance.
     */
    isEqual (other) {
      return this.isEqualNode(other)
    }

    /**
     * Flips the current instance, if it is not disabled.
     */
    #flip () {
      // Do nothing if the element is disabled or hidden.
      if (this.hasAttribute('disabled') ||
         this.hasAttribute('hidden')) {
        return
      }

      // when flipped, remove focus.
      if (this.hasAttribute('focus')) {
        this.removeAttribute('focus')
      }

      // if tile already is facing up, flip will make it face down.
      if (this.hasAttribute('face-up')) {
        this.removeAttribute('face-up')
      } else {
        this.setAttribute('face-up', '')
      }

      // Raise the my-flipping-tile:flip event.
      this.dispatchEvent(new CustomEvent('flipping-tiles:flip', {
        bubbles: true,
        detail: { faceUp: this.hasAttribute('face-up') }
      }))
    }
  }
)
