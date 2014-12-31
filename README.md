# jQuery.fn.dragon

*It's another draggin' plugin!*

Why did I waste a weekend building another dragging plugin, when jQueryUI has a
perfectly useful plugin to do the same thing?  Because it wasn't fast enough
for my needs.  jQueryUI's implementation has a lot of abstraction, and a
reeeeeally long call stack if you look at the breakpoints on your event handler
callbacks.  In most cases this isn't a problem, but for the [apps I
build](https://github.io/jeremyckahn/stylie), performance matters.  Event
handler callbacks can be expensive enough to begin with, and burying them in a
great big call stack isn't going to help.

Additionally, I didn't need all of the features that jQueryUI's
`$.fn.draggable` plugin provides.  They're great, but I don't want to load code
I don't need.  This plugin is independant of any widget or core architecture,
just plop it on your page after jQuery and you're good to go.

Dragon is divided up into two main components: `$.fn.dragon` and
`$.fn.dragonSlider`.  The former handles general dragging functionality, and
the latter creates a handy slider widget.  `$.fn.dragonSlider` depends on
`$.fn.dragon`, and they are in separate files under `src/`.

There's a very good chance that Dragon isn't a good fit for your app.  But it
was a good fit for mine, and perhaps you have a similar need for a lightweight,
minimalist dragging plugin.  Bon Appétit!

## $.fn.dragon

Make an element draggable with this:

````javascript
$('.selector').dragon(options);
````

`options` is an object.  It can be omitted.

### Options:

  * `noCursor`: A boolean.  False by default.  If true, the mouse cursor icon
    isn't changed to `move` when the element is dragged.
  * `axis`: A string.  If this is "x" or `$.fn.dragon.AXIS_X`, the element can
    only be dragged along the X axis.  If it is "y" or `$.fn.dragon.AXIS_Y`,
    the element can only be dragged along the Y axis.
  * `within`: A jQuery'ed element.  A containing element to constrain the
    movement of the `dragon`'ed element within.
  * `handle`: A jQuery object or string referencing a child of the `dragon`'ed
    element.  This element will act as the "handle" for dragging the
    `dragon`'ed element.

### Events:

These go in the `options` object as well.  Separated from the above list for
clarity.

  * `dragStart`: A function.  Fires when dragging begins.
  * `drag`: A function.  Fires for each tick of the drag.
  * `dragEnd`: A function.  Fires when dragging ends.

_Important note!_ Only one handler can be bound per event.  This is done on
purpose, as I didn't want to sacrifice performance for supporting multiple
event handlers.

## $.fn.dragonDisable

Disable Dragon temporarily.

## $.fn.dragonEnable

Re-enable Dragon after calling $.fn.dragonEnable.

## $.fn.dragonSlider

To create a slider, load `src/css/jquery.dragon-slider.css`,
`src/jquery.dragon-slider.js`,  and do this:

````javascript
$('.container').dragonSlider(options);
````

`options` is an object.  It can be omitted.

### Options:

  * `drag`: A function.  Fires every tick that the user drags the slider handle
    for.
  * `width`: A number.  How many pixels wide the slider should be.

### $.fn.dragonSliderGet

````javascript
var slider = $('.container').dragonSlider();
slider.dragonSliderGet();
````

Returns the value of the slider.  This value is normalized (between 0 and 1).

### $.fn.dragonSliderSet

````javascript
var slider = $('.container').dragonSlider();
slider.dragonSliderSet(0.5, false);
````

Sets the value of the slider.  Supplied value should be normalized (between 0
and 1).  The second parameter is a boolean.  Set it `true` to fire the `drag`
event handler that you set, or set it to `false` or omit it to prevent it from
being fired.

## Compatibility

  * IE6 and above.  Hooray!
  * Modern browsers.

## Setup

Requires [Bower](http://twitter.github.com/bower/) for jQuery dependency.  When
Bower is installed, do this at the command line:

````
$: bower install
````
