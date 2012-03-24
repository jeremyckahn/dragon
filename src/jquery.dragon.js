;(function ($) {

  var $win = $(window);

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
      $el.on('mousedown', $.proxy(onMouseDown, $el));
    });
  }

  function onMouseDown (evt) {
    var onMouseUpInstance = $.proxy(onMouseUp, this);
    var onMouseMoveInstance = $.proxy(onMouseMove, this);
    var initialPosition = this.position();
    this.data('dragon', {
      'onMouseUp': onMouseUpInstance
      ,'onMouseMove': onMouseMoveInstance
      ,'left': initialPosition.left
      ,'top': initialPosition.top
    });

    $win.on('mouseup', onMouseUpInstance);
    $win.on('blur', onMouseUpInstance);
    $win.on('mousemove', onMouseMoveInstance);
  }

  function onMouseUp (evt) {
    var data = this.data('dragon');
    $win.off('mouseup', data.onMouseUp);
    $win.off('blur', data.onMouseUp);
    $win.off('mousemove', data.onMouseMove);
    delete data.onMouseUp;
    delete data.onMouseMove;
  }

  function onMouseMove (evt) {
  }

} (jQuery));
