This is (going to be) a draggable plugin for jQuery.  While jQueryUI's $.fn.draggable() is fine for most applications, I've run into a number of performance and functional issues in my own work.  So I'm rolling my own.

Features of jQueryUI's $.fn.draggable() that I need:
  * containment
  * handle
  * axis
  * drag/dragstop events
