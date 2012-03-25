;(function ($) {

  var $win = $(window);

  /**
   * Options:
   *
   *   - noCursor
   */
  $.fn.dragon = function (opts) {
    initDragonEls(this, opts || {});
  };

  function initDragonEls ($els, opts) {
    $els.css('position', 'absolute');

    if (!opts.noCursor) {
      $els.css('cursor', 'pointer');
    }

    $els.each(function (i, el) {
      var $el = $(el);
      var position = $el.position();
      var top = position.top;
      var left = position.left;

      $el.css('top', top);
      $el.css('left', left);
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
