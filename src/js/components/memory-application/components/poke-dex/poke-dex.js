/**
 * The poke-dex web component module.
 *
 * @author Beata Eriksson <be222gr@student.lnu.se>
 * @version 1.1.0
 */

/*
 * Loop trough to get images from img folder.
 */
const imagesAmount = 9
const imgUrl = new Array(imagesAmount)
for (let i = 0; i < imagesAmount; i++) {
  imgUrl[i] = (new URL(`../img/${i}.png`, import.meta.url)).href
}

const template = document.createElement('template')
template.innerHTML = `
  <style>
    .book {
        display: flex;
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
    img {
        max-width: 70px;
    }
    img:hover, img:active {
        cursor: pointer;
    }
    #large {
        max-width: 130px;
        position: relative;
    }
    .hidden {
        display:none;
    }
    .description {
        width: min-content;
        height: min-content;
        
    }
    #info {
        position: absolute;
        left: 180px;
        margin-right: 30px;
        margin-top: 20px;
    }
    /* Media query for iPhones (new models) */
@media only screen and (max-width: 600px) {
  .book {
    display: flex;
    flex-direction: column; /* Stack items vertically on smaller screens */
    align-items: center; /* Center items horizontally on smaller screens */
  }

  button {
    background-color: #cfcfcf;
    cursor: pointer;
    display: inline-block;
    margin: 5px; /* Adjust margin for smaller screens */
    padding: 5px; /* Adjust padding for smaller screens */
    font-size: 0.8em; /* Adjust font size for smaller screens */
    border-radius: 15px; /* Adjust border-radius for smaller screens */
    border: 1px solid black;
  }

  button:hover {
    box-shadow: 0px 0px 5px #484848; /* Adjust box-shadow for smaller screens */
  }

  img {
    max-width: 50px; /* Adjust max-width for smaller screens */
  }

  img:hover,
  img:active {
    cursor: pointer;
  }

  #large {
    max-width: 90px; /* Adjust max-width for smaller screens */
    position: relative;
  }

  .hidden {
    display: none;
  }

  .description {
    width: min-content;
    height: min-content;
  }

  #info {
    position: absolute;
    left: 100px; /* Adjust left position for smaller screens */
    margin-right: 10px; /* Adjust margin-right for smaller screens */
    margin-top: 10px; /* Adjust margin-top for smaller screens */
    font-size: 15px;
  }
}
  </style>
  <div>
    <h2>Welcome to poké dex</h2>
    <h3>Learn more about our pokémons</h3>
    <section class="description" class="hidden"><p id="info" class="hidden"></p></section>
    <section class="allpokes">
    </section>
    <button id="back">Go back</button>
  </div>
`

customElements.define('poke-dex',
  /**
   * Represents a poke-dex element.
   */
  class extends HTMLElement {
    /**
     * Element where the images of all the pokemons will be pushed in to.
     */
    #allPokes
    /**
     * Element holding the information about the pokemon, fetched from API.
     */
    #info
    /**
     * Holding both the picture and the text information of the pokémon being clicked.
     */
    #description
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      const back = this.shadowRoot.querySelector('#back')
      back.addEventListener('click', event => {
        event.preventDefault()
        this.dispatchEvent(new CustomEvent('go-back', {
          bubbles: true
        }))
      })

      this.#info = this.shadowRoot.querySelector('#info')
      this.#description = this.shadowRoot.querySelector('.description')
      this.#allPokes = this.shadowRoot.querySelector('.allpokes')

      // View pictures of all pokemons.
      for (let i = 1; i < imagesAmount; i++) {
        const insertPicture = document.createElement('img')
        insertPicture.setAttribute('src', imgUrl[i])
        this.#allPokes.appendChild(insertPicture)
        insertPicture.addEventListener('click', event => {
          this.#removeFocus()
          this.#whenClicked(imgUrl[i])
        })
      }
    }

    /**
     * Views the description of clicked pokémon and calls method for fetching information about it.
     *
     * @param {URL} image - The url for the certain image of pokémon being clicked.
     */
    #whenClicked (image) {
      const makeBigger = this.shadowRoot.querySelector(`img[src='${image}']`)
      makeBigger.setAttribute('id', 'large')
      this.#info.removeAttribute('class', 'hidden')
      this.#description.appendChild(makeBigger)

      for (let i = 1; i < imagesAmount; i++) {
        if (image.includes(`${i}.png`)) {
          // translate the picture url to the right pokédex number if needed.
          switch (i) {
            case 2:
              i = 94
              break
            case 3:
              i = 133
              break
            case 5:
              i = 68
              break
            case 6:
              i = 121
              break
            case 8:
              i = 73
              break
          }
          // call on method with i as parameter, the number of the specific pokémon.
          this.#fetchInfo(i)
        }
      }
    }

    /**
     * Removes focus from the pokémon that previously was clicked, makes it small again.
     */
    #removeFocus () {
      const focusedElement = this.shadowRoot.querySelector('#large')
      if (focusedElement !== null) {
        if (this.#description.hasChildNodes()) {
          this.#description.removeChild(this.shadowRoot.querySelector('#large'))
          this.#allPokes.appendChild(focusedElement)
          focusedElement.removeAttribute('id', 'large')
        }
      }
    }

    /**
     * Fetching information about the pokémon using poke api.
     *
     * @param {number} id - The pokédex number of the pokémon being fetched..
     */
    async #fetchInfo (id) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-form/${id}/`)
        if (!response.ok) {
          const error = new Error(`Fetch error ${response.status}`)
          error.message = `Fetch error ${response.status}`
        }
        const data = await response.json()
        this.#info.textContent = `My name is ${data.name} #${data.id} and I am a ${searchTypes()} type Pokémon. `

        /**
         * Loops through fetched data.
         *
         * @returns {string} A string with the pokémon type.
         */
        function searchTypes () {
          let types = ''
          for (let i = 0; i < data.types.length; i++) {
            if (i === 0) {
              types = `${data.types[i].type.name}`
            } else {
              types = `${types} and ${data.types[i].type.name}`
            }
          }
          return types
        }
      } catch (error) {
        console.log(error.message)
      }
    }
  }
)
