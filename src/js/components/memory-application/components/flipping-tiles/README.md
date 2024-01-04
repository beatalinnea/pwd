# &lt;flipping-tiles&gt;

A web component that when creating an instance of this it creates one flippable tile that will be an element that is viewed as double sided.

## Attributes

### `face-up`

A boolean attribute which, if present, renders the element faced up, showing its front.

Default value: undefined

### `disabled`

A boolean attribute which, if present, indicates that the user should not be able to interact with the element.

Default value: undefined

### `hidden`

A boolean attribute which, if present, hides the inner of the element and renders an outline.

Default value: undefined

### `focus`

If tile gets the attribute focus it will fire the `.focus()` on that specific tile.

Default value: undefined

## Events

| Event Name | Fired When |
|------------|------------|
| `flipping-tiles:flip`| Clicking or pressing enter on tile while tile is focused.

## Styling with CSS

The main element (button) is styleable using the part `tile-main`

The front element (div) is styleable using the part `tile-front`

The back element (div) is styleable using the part `tile-back`

## Example

```html
   <my-flipping-tile face-up>
    <img src="./images/2.png" alt="phonograph" />
   </my-flipping-tile>
```