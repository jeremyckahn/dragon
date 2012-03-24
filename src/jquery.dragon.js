;(function ($) {

  /**
   * Options:
   *
   *   - noCursor
   */
  $.fn.dragon = function (opts) {
    opts = opts || {};
    this.css('position', 'absolute');

    if (!opts.noCursor) {
      this.css('cursor', 'pointer');
    }

    initDragonEls(this, opts);
  };

  function initDragonEls ($els, opts) {
    $els.each(function (i, el) {
      var $el = $(el);

      $el.on('mousedown', onMouseDown);
      $el.on('mouseup', onMouseUp);

    });
  }

  function onMouseDown (evt) {
  }

  function onMouseUp (evt) {
  }

} (jQuery));
