/* global jQuery, module */
/**
 * jQuery Dragon.  It's a dragging plugin!
 *   By Jeremy Kahn (jeremyckahn@gmail.com)
 *   MIT License.
 *   For more info: https://github.com/jeremyckahn/dragon
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS style for Browserify
    module.exports = factory;
  } else {
    // Browser globals
    factory(jQuery);
  }
} (function ($) {

  var $win = $(window);
  var $doc = $(document.documentElement);
  var noop = $.noop || function () {}; // NOOP!


  /**
   * Options:
   *
   *   @param {boolean} noCursor Prevents the drag cursor from being "move"
   *   @param {boolean} noInitialPosition Prevent setting the initial inline
   *   styles for top, left, and position (they are set once the user begins
   *   dragging regardless).  False by default.
   *   @param {string} axis The axis to constrain dragging to.  Either 'x' or
   *     'y'.  Disabled by default.
   *   @param {jQuery} within The jQuery'ed element's bounds to constrain the
   *     drag range within.
   *   @param {string|jQuery} handle A jQuery instance or selector for the
   *   "handle" element within the dragon element that initializes the dragging
   *   action.
   *   @param {function} dragStart Fires when dragging begins.
   *   @param {function} drag Fires for every tick of the drag.
   *   @param {function} dragEnd Fires when dragging ends.
   */
  $.fn.dragon = function (opts) {
    initDragonEls(this, opts || {});
    return this;
  };


  $.fn.dragonDisable = function () {
    this.data('isDragonEnabled', false);
    return this;
  };


  $.fn.dragonEnable = function () {
    this.data('isDragonEnabled', true);
    return this;
  };


  // CONSTANTS
  $.extend($.fn.dragon, {
    'AXIS_X': 'x'
    ,'AXIS_Y': 'y'
  });


  var ZERO_OUT_RIGHT_AND_BOTTOM = {
    right: ''
    ,bottom: ''
  };


  /**
   * @param {jQuery} $els
   * @param {Object} opts
   */
  function initDragonEls ($els, opts) {
    opts.axis = opts.axis || {};
    $els.addClass('dragon');

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

      $el.data('isDragonEnabled', true);

      if (!opts.noInitialPosition) {
        var position = $el.position();
        var top = position.top;
        var left = position.left;

        $el.css({
          top: top
          ,left: left
          ,position: 'absolute'
        });
      }

      $el
        .data('dragon', {})
        .data('dragon-opts', opts);

      $el.on('touchend', $.proxy(onTouchEnd, $el));
      $el.on('touchmove', $.proxy(onTouchMove, $el));

      var handle = opts.handle;

      if (handle) {
        var $handle = typeof handle === 'string' ? $el.find(handle) : handle;
        $handle.on('mousedown', $.proxy(onMouseDown,  $el));
        $handle.on('touchstart', $.proxy(onTouchStart, $el));
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

    if (data.isDragging || !this.data('isDragonEnabled')) {
      return;
    }

    this.attr('draggable', 'true');
    var onMouseUpInstance = $.proxy(onMouseUp, this);
    var onMouseMoveInstance = $.proxy(onMouseMove, this);
    var initialOffset = this.offset();
    this.data('dragon', {
      'onMouseUp': onMouseUpInstance
      ,'onMouseMove': onMouseMoveInstance
      ,'isDragging': true
      ,'left': initialOffset.left
      ,'top': initialOffset.top
      ,'grabPointX': initialOffset.left - evt.pageX
      ,'grabPointY': initialOffset.top - evt.pageY
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

    if (data.isDragging || !this.data('isDragonEnabled')) {
      return;
    }

    var onTouchEndInstance = $.proxy(onTouchEnd, this);
    var onTouchMoveInstance = $.proxy(onTouchMove, this);
    var initialOffset = this.offset();
    this.data('dragon', {
      'onTouchEnd': onTouchEndInstance
      ,'onTouchMove': onTouchMoveInstance
      ,'isDragging': true
      ,'left': initialOffset.left
      ,'top': initialOffset.top
      ,'grabPointX': initialOffset.left - evt.originalEvent.pageX
      ,'grabPointY': initialOffset.top - evt.originalEvent.pageY
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

    // Remove the "draggable" attribute so that text within the element can be
    // selected when the element is not being dragged.
    $el.attr('draggable', 'false');
    $el.removeClass('is-dragging');

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
      newCoords.top = Math.round(pageY + data.grabPointY);
    }

    if (opts.axis !== $.fn.dragon.AXIS_Y) {
      newCoords.left = Math.round(pageX + data.grabPointX);
    }

    if (opts.within) {
      var $container = opts.within;
      var containerOffset = $container.offset();

      // Adjust the bounding box for the CSS box model
      var minLeft = containerOffset.left +
          parseInt($container.css('padding-left'), 10) +
          parseInt($container.css('border-left-width'), 10);

      var minTop = containerOffset.top +
          parseInt($container.css('padding-top'), 10) +
          parseInt($container.css('border-top-width'), 10);

      var maxLeft = containerOffset.left
          + $container.outerWidth()
          - parseInt($container.css('border-right-width'), 10)
          - parseInt($container.css('padding-right'), 10)
          + parseInt($el.css('margin-left'), 10)
          + parseInt($el.css('margin-right'), 10)
          - $el.outerWidth(true);

      var maxTop = containerOffset.top
          + $container.outerHeight()
          - parseInt($container.css('border-bottom-width'), 10)
          - parseInt($container.css('padding-bottom'), 10)
          + parseInt($el.css('margin-top'), 10)
          + parseInt($el.css('margin-bottom'), 10)
          - $el.outerHeight(true);

      newCoords.top =  Math.min(newCoords.top, maxTop);
      newCoords.top =  Math.max(newCoords.top, minTop);
      newCoords.left = Math.min(newCoords.left, maxLeft);
      newCoords.left = Math.max(newCoords.left, minLeft);
    }

    $el
      .addClass('is-dragging')
      .css(ZERO_OUT_RIGHT_AND_BOTTOM)
      .offset(newCoords);
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
      handler.call($el, evt);
    }

    $el.trigger(event);
  }

}));
