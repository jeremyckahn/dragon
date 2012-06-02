# jQuery.fn.dragon

*It's another draggin' plugin!*

Why did I waste a weekend building another dragging plugin, when jQueryUI has a perfectly useful plugin to do the same thing?  Because it wasn't fast enough for my needs.  jQueryUI's implementation has a lot of abstraction, and a reeeeeally long call stack if you look at the breakpoints on your event handler callbacks.  In most cases this isn't a problem, but for the [apps I build](https://github.com/jeremyckahn/stylie), performance matters.  Event handler callbacks can be expensive enough to begin with, and burying them in a great big call stack isn't going to solve any problems.

Additionally, I personally didn't need all of features that jQueryUI's fn.draggable plugin provides.  They're great, but I really don't need to send them over the wire.  This plugin is independant of any widget or core craziness, just plop it on your page after jQuery and you're good to go.

There's a very good chance that Dragon isn't a good fit for your app.  But it was a good fit for mine, and perhaps you have a similar need for a lightweight, minimalist dragging plugin.  Bon Appétit!

## API

Call it like this:

````javascript
$('.selector').dragon(options);
````

`options` is an Object.  It can be omitted.

###Options:

  * `noCursor`: A Boolean.  False by default.  If true, the mouse cursor icon isn't changed to "move" when the element is dragged.
  * `axis`: A string.  If this is "x" or `$.fn.dragon.AXIS_X`, the element can only be dragged along the X axis.  If it is "y" or `$.fn.dragon.AXIS_Y`, the element can only be dragged along the Y axis.
  * `within`: A jQuery'ed element.  A containing element to constrain the movement of the `dragon`ed element within.
  * `handle`: A string.  This should be a jQuery selector targeting a child of the `dragon`ed element.  This child element will act as the "handle" for dragging the `dragon`ed element.

###Events:

These go in the `options` Object as well.  Separated from the above list for clarity.

  * `dragStart`: A function.  Fires when dragging begins.
  * `drag`: A function.  Fires for each tick of the drag.
  * `dragEnd`: A function.  Fires when dragging ends.

_Important note!_ Only one handler can be bound per event.  This is done on purpose, as I didn't want to sacrifice performance for supporting multiple event handlers.

## Compatibility

  * IE6 and above.  Hooray!
  * Modern browsers.
