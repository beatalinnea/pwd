# &lt;joke-application&gt;

A web component that fetches jokes from API to be viewed to the user while clicking button `Get joke`. Provides a functionality being a `joke pocket` for the user to be able to save their favorite jokes. Will appear in local storage and can be viewed by clicking button `View joke pocket`

## Methods

### `clearStorage()`

A method that, when called, will clear the local storage from the item `joke-pocket`.

Parameters: none

Returns: none

## Sources

Private methods are being called where using fetch for fetching the jokes being presented. Having its source at `https://icanhazdadjoke.com/`

## Example

```html
   <joke-application></joke-application>
```
