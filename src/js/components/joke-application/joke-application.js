/**
 * The joke-application web component.
 *
 * @author Beata Eriksson <be222gr@student.lnu.se>
 * @version 1.1.0
 */

const template = document.createElement('template')
template.innerHTML = `
  <style>
    .border {
        border: 1px solid black;
        background-color: #70c2c6;
        width: 600px;
        padding-bottom: 20px;
    }
    #jokebutton {
        cursor: pointer;
    }
    .joke {
      overflow-y: scroll;
      height: 100px;
      background-color: antiquewhite;
      margin-left: 30px;
      margin-right: 30px;
    }
    .headline {
        padding-left: 50px;
        padding-right: 50px;
        margin-top: 0px;
    }
    .jokefield {
        border: none;
    }
    p {
      padding-left: 50px;
      padding-right: 50px;
      font-size: 1.1rem;
    }
    h3 {
      margin: 10px;
      font-style: italic;
    }
    .hidden {
      display: none;
    }
    button {
      cursor: pointer;
    }
  </style>
  <section class="border">
  <h3>The greatest...</h3>
    <h2 class="headline">BAD JOKES</h2>
  <div class="joke">
</div>
  <form id="jokeform">
  <fieldset class="jokefield">
    <input type="submit" id="jokebutton" value="Get new joke">
  </fieldset>
  </form>
  <button id="addjoke" class="hidden">Add to pocket</button>
  <button id="clearpocket" class="hidden">Empty my pocket</button>
  <button id="viewpocket">My joke pocket</button>
</section>
`

customElements.define('joke-application',
  /**
   * Represents a joke-application element.
   */
  class extends HTMLElement {
    /**
     * Element that will hold the joke to be fetched from the API and viewed to the user.
     */
    #joke
    /**
     * Button for adding the joke that is being viewed to your joke pocket.
     */
    #addJoke
    /**
     * Button for viewing the joke pocket, your saved jokes.
     */
    #viewPocket
    /**
     * Button for deleting the jokes that are saved in your pocket.
     */
    #clearPocket
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#joke = this.shadowRoot.querySelector('.joke')
      this.#addJoke = this.shadowRoot.querySelector('#addjoke')
      this.#viewPocket = this.shadowRoot.querySelector('#viewpocket')
      this.#clearPocket = this.shadowRoot.querySelector('#clearpocket')

      const jokeForm = this.shadowRoot.querySelector('#jokeform')
      jokeForm.addEventListener('submit', event => {
        event.preventDefault()
        this.#getJoke()
        this.#joke.replaceChildren()
      })

      this.#addJoke.addEventListener('click', event => {
        event.preventDefault()
        const theJoke = this.shadowRoot.querySelector('p')
        this.#addToPocket(theJoke.textContent)
      })

      this.#viewPocket.addEventListener('click', event => {
        event.preventDefault()
        this.#joke.replaceChildren()
        this.#viewJokes()
      })

      this.#clearPocket.addEventListener('click', event => {
        event.preventDefault()
        this.#joke.replaceChildren()
        this.clearStorage()
        this.#viewJokes()
      })
    }

    /**
     * Asks for a new joke and if there already is one being viewed, removes it.
     */
    async #getJoke () {
      if (this.#addJoke.hasAttribute('class', 'hidden')) {
        this.#addJoke.removeAttribute('class', 'hidden')
      }
      if (!this.#clearPocket.hasAttribute('class', 'hidden')) {
        this.#clearPocket.setAttribute('class', 'hidden')
      }

      const newJoke = await this.#fetchJoke()
      this.#joke.replaceChildren()
      const newP = document.createElement('p')
      newP.textContent = `${newJoke}`
      this.#joke.appendChild(newP)
    }

    /**
     * Async method that will fetch a new joke from api.
     */
    async #fetchJoke () {
      try {
        const response = await fetch('https://icanhazdadjoke.com/', {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          }
        })
        if (!response.ok) {
          const error = new Error(`Fetch error ${response.status}`)
          error.message = `Fetch error ${response.status}`
        }
        const data = await response.json()
        return data.joke
      } catch (error) {
        console.log(error.message)
      }
    }

    /**
     * Method that sets new item holding a joke in local storage. Gets called when user clicks on button for adding joke to pocket..
     *
     * @param {string} joke - The joke to be saved.
     */
    #addToPocket (joke) {
      let savedJokes = []
      if (JSON.parse(window.localStorage.getItem('joke-pocket')) !== null) {
        savedJokes = JSON.parse(window.localStorage.getItem('joke-pocket'))
      }
      savedJokes.push({ joke: `${joke}` })
      window.localStorage.setItem('joke-pocket', JSON.stringify(savedJokes))
    }

    /**
     * Methods that will parse the jokes saved in local storage and view them when clicking on button for viewing pocket.
     *
     */
    #viewJokes () {
      if (!this.#addJoke.hasAttribute('class', 'hidden')) {
        this.#addJoke.setAttribute('class', 'hidden')
      }
      if (this.#clearPocket.hasAttribute('class', 'hidden')) {
        this.#clearPocket.removeAttribute('class', 'hidden')
      }

      let savedJokes = []
      if (JSON.parse(window.localStorage.getItem('joke-pocket')) !== null) {
        savedJokes = JSON.parse(window.localStorage.getItem('joke-pocket'))
        for (let i = 0; i < savedJokes.length; i++) {
          const newP = document.createElement('p')
          newP.textContent = `${savedJokes[i].joke}`
          this.#joke.appendChild(newP)
        }
      } else {
        const newP = document.createElement('p')
        newP.textContent = 'Your pocket is empty!'
        this.#joke.appendChild(newP)
      }
    }

    /**
     * Method to use if wanting to clear storage.
     */
    clearStorage () {
      localStorage.removeItem('joke-pocket')
    }
  }
)
