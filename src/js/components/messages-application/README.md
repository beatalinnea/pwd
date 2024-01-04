# &lt;messages-aplication&gt;

A web component when opened for the first time will present an instance of the web component nickname-form and save the users nickname in local storage as `messages-nickname`. Once we get a nickname, or directly if we  already had one stored, we will append an instance of the-chat and set a `name` attribute with our `messages-nickname` for it.

## Methods

### `clearStorage()`

A method that, when called, will clear the local storage from the item `messages-nickname`.

Parameters: none

Returns: none

## Events

| Event Name | Fired When |
|------------|------------|
| `filled`| When nickname form is submitted with your typed nickname.

## Example

```html
   <messages-application></messages-application>
```

