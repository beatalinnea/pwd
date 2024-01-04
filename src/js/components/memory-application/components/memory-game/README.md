# &lt;memory-game&gt;

A web component that represents a memory game.

## Attributes

### `boardsize`

The `boardsize` attribute, if present, specifies the size of the grid. Its value must be `large` (4x4), `medium` (4x2) or `small` (2x2).

Default value: large

## Events

| Event Name | Fired When |
|------------|------------|
| `memory-game:tiles-match`| The tiles facing up match.
| `memory-game:tiles-mismatch`| The tiles facing up do not match.
| `memory-game:game-over`| The game is over.


## Example

```html
   <my-memory-game></my-memory-game>
```