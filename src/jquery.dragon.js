;(function ($) {

  var $win = $(window);
  var $doc = $(document);

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
      $els.css('cursor', 'move');
    }

    $els.each(function (i, el) {
      var $el = $(el);
      var position = $el.position();
      var top = position.top;
      var left = position.left;

      $el
        .css({
          'top': top
          ,'left': left
        })
        .on('mousedown', $.proxy(onMouseDown, $el));
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
      ,'grabPointX': initialPosition.left - evt.pageX
      ,'grabPointY': initialPosition.top - evt.pageY
    });

    $win
      .on('mouseup', onMouseUpInstance)
      .on('blur', onMouseUpInstance)
      .on('mousemove', onMouseMoveInstance);

    $doc.on('selectstart', preventSelect);
  }

  function onMouseUp (evt) {
    var data = this.data('dragon');
    $win.off('mouseup', data.onMouseUp);
    $win.off('blur', data.onMouseUp);
    $win.off('mousemove', data.onMouseMove);
    $doc.off('selectstart', preventSelect);
    delete data.onMouseUp;
    delete data.onMouseMove;
  }

  function onMouseMove (evt) {
    var data = this.data('dragon');
    this.css({
      'left': evt.pageX + data.grabPointX
      ,'top': evt.pageY + data.grabPointY
    });
  }

  // This event handler fixes some craziness with the startselect event breaking
  // the cursor CSS setting.
  // http://forum.jquery.com/topic/chrome-text-select-cursor-on-drag
  function preventSelect(evt) {
    evt.preventDefault();
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else if (document.selection) {
      document.selection.clear();
    }
  }

} (jQuery));
