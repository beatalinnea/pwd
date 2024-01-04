# &lt;pwd-application&gt;

A web component is used to simulate a personal web desktop, containing sub-apps to open that will be representing in a dock.

## Methods

### `#startAnyApp(app)`

A method that, when called, will create a new instance of the sub-app which the user chose to click in form of the representing icon in the desktop dock.
It will call the right public method from <cointaner-window> to start the correct sub-app.

Parameters: app - the name of the application to start.

Returns: nothing.

## Events

| Event Name | Fired When |
|------------|------------|
| `click`    | The user clicks on an icon at the dock.
| `close-window`| The user has clicked close on the appended <cointaner-window> element.

## Example

```html
   <pwd-application></pwd-application>
```