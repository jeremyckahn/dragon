# jQuery.fn.dragon

*It's another draggin' plugin!*

Why did I waste a weekend building another dragging plugin, when jQueryUI has a perfectly useful plugin to do the same thing?  Because it wasn't fast enough for my needs.  jQueryUI's implementation has a lot of abstraction, and a reeeeeally long call stack if you look at the breakpoints on your event handler callbacks.  In most cases this isn't a problem, but for the [apps I build](https://github.com/jeremyckahn/stylie), performance matters.  Event handler callbacks can be expensive enough to begin with, and burying them in a great big call stack isn't going to solve any problems.

Additionally, I personally didn't need all of features that jQueryUI's fn.draggable plugin provides.  They're great, but I really don't need to send them over the wire.  This plugin is independant of any widget or core craziness, just plop it on your page after jQuery and you're good to go.

There's a very good chance that Dragon isn't a good fit for your app.  But it was a good fit for mine, and perhaps you have similar requirements.  Bon Appétit!

## Compatibility

  * IE6 and above.  Hooray!
  * Modern browsers.
