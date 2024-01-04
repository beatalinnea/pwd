# &lt;the-chat&gt;

A web component used to connect with a web socket server and be able to send and recieve messages through it, the messages will be viewed in form of a chat element that will append the messages from the web socket and view a input type text field for writing, with emoji-support through emoji-api.

## Attributes

### `name`

A String attribute; will be set by the parent element when creating and appending an instance of this type.

Default value: none

## Sources

Private methods being called using fetch for emoji support in the chat. Having its source at `https://emoji-api.com/`

## Example

```html
   <the-chat name="nickname"></the-chat>
```