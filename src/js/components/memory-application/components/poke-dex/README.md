# &lt;poke-dex&gt;

A web component viewing eight pokémons lined up. When clicking one of them, this will through poke-api fetch information about that certain pokémon and present that to the user.

## Events

| Event Name | Fired When |
|------------|------------|
| `go-back`| User wants to close the pokédex by clicking button `Go back`

## Sources

Private methods being called using fetch for emoji support in the chat. Having its source at `https://pokeapi.co/api/`

## Example

```html
   <poke-dex></poke-dex>
```