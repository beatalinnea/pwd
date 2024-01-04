# &lt;container-window&gt;

A web component that will simulate an opened window at your desktop for sub-apps to be appended into. The window will be draggable listening to mouse events.

## Methods

### `startMemory ()`

A method that, when called, will create an instance of `memory-application` and append it to this web components draggable container window.

Parameters: none

Returns: none

### `startChat ()`

A method that, when called, will create an instance of `messages-application` and append it to this web components draggable container window.

Parameters: none

Returns: none

### `startJoke ()`

A method that, when called, will create an instance of `joke-application` and append it to this web components draggable container window.

Parameters: none

Returns: none

### `moveElement(movingWindow)`

When called, it will make the element being the parameter be draggable through mouse events.

Parameters: HTMLElement - the element to be moveable.

Returns: none

## Events

| Event Name | Fired When |
|------------|------------|
| `close-window`| User clicks button `close` on this container-window element being an opened instance of this type.
| `start-over`| User clicks start-over button in memory-application, the current instance of that appended element will be replaced with a new one.

## Example

```html
   <container-window></container-window>
```
