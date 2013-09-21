/**
 * jQuery Dragon.  It's a dragging plugin!
 *   By Jeremy Kahn (jeremyckahn@gmail.com)
 *   MIT License.
 *   For more info: https://github.com/jeremyckahn/dragon
 */
;(function ($) {

  var $win = $(window);
  var $doc = $(document.documentElement);
  var noop = $.noop || function () {}; // NOOP!


  /**
   * Options:
   *
   *   @param {boolean} noCursor Prevents the drag cursor from being "move"
   *   @param {string} axis The axis to constrain dragging to.  Either 'x' or
   *     'y'.  Disabled by default.
   *   @param {jQuery} within The jQuery'ed element's bounds to constrain the
   *     drag range within.
   *   @param {string} handle A jQuery selector for the "handle" element within
   *     the dragon element that initializes the dragging action.
   *   @param {function} dragStart Fires when dragging begins.
   *   @param {function} drag Fires for every tick of the drag.
   *   @param {function} dragEnd Fires when dragging ends.
   */
  $.fn.dragon = function (opts) {
    initDragonEls(this, opts || {});
  };


  // CONSTANTS
  $.extend($.fn.dragon, {
    'AXIS_X': 'x'
    ,'AXIS_Y': 'y'
  });


  /**
   * @param {jQuery} $els
   * @param {Object} opts
   */
  function initDragonEls ($els, opts) {
    opts.axis = opts.axis || {};
    $els.attr('draggable', 'true');
    $els.on('dragstart', preventDefault);

    if (!opts.noCursor) {
      if (opts.handle) {
        $els.find(opts.handle).css('cursor', 'move');
      } else {
        $els.css('cursor', 'move');
      }
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
          ,'position': 'absolute'
        })
        .data('dragon', {})
        .data('dragon-opts', opts);

      $el.on('touchend', $.proxy(onTouchEnd, $el));
      $el.on('touchmove', $.proxy(onTouchMove, $el));

      if (opts.handle) {
        $el.on('mousedown',  opts.handle, $.proxy(onMouseDown,  $el));
        $el.on('touchstart', opts.handle, $.proxy(onTouchStart, $el));
      } else {
        $el.on('mousedown',  $.proxy(onMouseDown,  $el));
        $el.on('touchstart', $.proxy(onTouchStart, $el));
      }

    });
  }


  /**
   * @param {jQuery.Event} evt
   */
  function onMouseDown (evt) {
    var data = this.data('dragon');

    if (data.isDragging) {
      return;
    }

    var onMouseUpInstance = $.proxy(onMouseUp, this);
    var onMouseMoveInstance = $.proxy(onMouseMove, this);
    var initialPosition = this.position();
    this.data('dragon', {
      'onMouseUp': onMouseUpInstance
      ,'onMouseMove': onMouseMoveInstance
      ,'isDragging': true
      ,'left': initialPosition.left
      ,'top': initialPosition.top
      ,'grabPointX': initialPosition.left - evt.pageX
      ,'grabPointY': initialPosition.top - evt.pageY
    });

    $doc
      .on('mouseup', onMouseUpInstance)
      .on('blur', onMouseUpInstance)
      .on('mousemove', onMouseMoveInstance);

    $win
      .on('blur', onMouseUpInstance);

    $doc.on('selectstart', preventSelect);
    fire('dragStart', this, evt);
  }


  /**
   * @param {jQuery.Event} evt
   */
  function onTouchStart (evt) {
    evt.preventDefault();

    var data = this.data('dragon');

    if (data.isDragging) {
      return;
    }

    var onTouchEndInstance = $.proxy(onTouchEnd, this);
    var onTouchMoveInstance = $.proxy(onTouchMove, this);
    var initialPosition = this.position();
    this.data('dragon', {
      'onTouchEnd': onTouchEndInstance
      ,'onTouchMove': onTouchMoveInstance
      ,'isDragging': true
      ,'left': initialPosition.left
      ,'top': initialPosition.top
      ,'grabPointX': initialPosition.left - evt.originalEvent.pageX
      ,'grabPointY': initialPosition.top - evt.originalEvent.pageY
    });

    $doc
      .on('touchend', onTouchEndInstance)
      .on('blur', onTouchEndInstance)
      .on('touchmove', onTouchMoveInstance);

    $win
      .on('blur', onTouchEndInstance);

    $doc.on('selectstart', preventSelect);
    fire('dragStart', this, evt);
  }


  /**
   * @param {jQuery.Event} evt
   */
  function onMouseUp (evt) {
    onDragEnd(this, evt, false);
  }


  /**
   * @param {jQuery.Event} evt
   */
  function onTouchEnd (evt) {
    evt.preventDefault();
    onDragEnd(this, evt, true);
  }


  /**
   * @param {jQuery} $el
   * @param {jQuery.Event} evt
   * @param {boolean} isTouch
   */
  function onDragEnd ($el, evt, isTouch) {
    var data = $el.data('dragon');
    data.isDragging = false;

    if (isTouch) {
      $doc.off('touchend', data.onTouchEnd)
        .off('blur', data.onTouchEnd)
        .off('touchmove', data.onTouchMove)
        .off('selectstart', preventSelect);

      $win.off('blur', data.onTouchEnd);

      delete data.onTouchEnd;
      delete data.onTouchMove;
    } else {
      $doc.off('mouseup', data.onMouseUp)
        .off('blur', data.onMouseUp)
        .off('mousemove', data.onMouseMove)
        .off('selectstart', preventSelect);

      $win.off('blur', data.onMouseUp);

      delete data.onMouseUp;
      delete data.onMouseMove;
    }

    fire('dragEnd', $el, evt);
  }


  /**
   * @param {jQuery.Event} evt
   */
  function onMouseMove (evt) {
    onMove(this, evt, evt.pageX, evt.pageY);
  }


  /**
   * @param {jQuery.Event} evt
   */
  function onTouchMove (evt) {
    evt.preventDefault();
    onMove(this, evt, evt.originalEvent.pageX, evt.originalEvent.pageY);
  }


  /**
   * @param {jQuery} $el
   * @param {jQuery.Event} evt
   * @param {number} pageX
   * @param {number} pageY
   */
  function onMove ($el, evt, pageX, pageY) {
    var data = $el.data('dragon');
    var opts = $el.data('dragon-opts');
    var newCoords = {};

    if (opts.axis !== $.fn.dragon.AXIS_X) {
      newCoords.top = pageY + data.grabPointY;
    }

    if (opts.axis !== $.fn.dragon.AXIS_Y) {
      newCoords.left = pageX + data.grabPointX;
    }

    if (opts.within) {
      // omg!
      var offset = $el.offset();
      var width = $el.outerWidth(true);
      var height = $el.outerHeight(true);
      var container = opts.within;
      var containerWidth = container.innerWidth();
      var containerHeight = container.innerHeight();
      var containerOffset = container.offset();
      var containerPaddingTop = parseInt(container.css('paddingTop'), 10);
      var containerTop = containerOffset.top + containerPaddingTop;
      var containerBottom = containerTop + containerHeight;
      var containerPaddingLeft = parseInt(container.css('paddingLeft'), 10);
      var containerLeft = containerOffset.left + containerPaddingLeft;
      var containerRight = containerLeft + containerWidth;
      var marginLeft = parseInt($el.css('marginLeft'), 10);
      var marginTop = parseInt($el.css('marginTop'), 10);
      var marginBottom = parseInt($el.css('marginBottom'), 10);
      var marginRight = parseInt($el.css('marginRight'), 10);
      var minDistanceLeft = containerPaddingLeft - marginLeft;
      var minDistanceRight = containerWidth + marginRight;
      var minDistanceTop = containerPaddingTop - marginTop;
      var minDistanceBottom = containerHeight + marginBottom;

      if (newCoords.left < minDistanceLeft
          || offset.left < containerLeft) {
        newCoords.left = minDistanceLeft;
      }

      if (newCoords.left + width > minDistanceRight
          || offset.left > containerRight) {
        newCoords.left = minDistanceRight - width;
      }

      if (newCoords.top < minDistanceTop
          || offset.top < containerTop) {
        newCoords.top = minDistanceTop;
      }

      if (newCoords.top + height > minDistanceBottom
          || offset.top > containerBottom) {
        newCoords.top = minDistanceBottom - height;
      }
    }

    $el.css(newCoords);
    fire('drag', $el, evt);
  }


  // This event handler fixes some craziness with the startselect event breaking
  // the cursor style.
  // http://forum.jquery.com/topic/chrome-text-select-cursor-on-drag
  /**
   * @param {jQuery.Event} evt
   */
  function preventSelect(evt) {
    evt.preventDefault();
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else if (document.selection) {
      document.selection.clear();
    }
  }


  /**
   * @param {jQuery.Event} evt
   */
  function preventDefault (evt) {
    evt.preventDefault();
  }


  // Yep, you only get to bind one event handler.  Much faster this way.
  /**
   * @param {string} event
   * @param {jQuery} $el
   * @param {jQuery.Event} evt
   */
  function fire (event, $el, evt) {
    var handler = $el.data('dragon-opts')[event];
    // Patch the proxied Event Object
    evt.target = $el[0];
    if (handler) {
      handler(evt);
    }

    $el.trigger(event);
  }

} (this.jQuery));
