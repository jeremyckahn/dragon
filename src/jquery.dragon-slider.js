/**
 * jQuery Dragon Slider.  It's a slider plugin!
 *   v0.1.0
 *   By Jeremy Kahn (jeremyckahn@gmail.com)
 *   Depends on jQuery jquery.dragon.js
 *   MIT License.
 *   For more info: https://github.com/jeremyckahn/dragon
 */

;(function ($) {

  var $win = $(window);
  var $doc = $(document.documentElement);
  var noop = $.noop || function () {};


  // CONSTANTS
  var DEFAULTS = {
    'width': 250
    ,'increment': .02
  };
  var KEY_RIGHT = 39;
  var KEY_LEFT = 37;


  /**
   * @param {Object=} opts
   *   @param {number} width
   */
  $.fn.dragonSlider = function (opts) {
    opts = opts || {};
    var defaultsCopy = $.extend({}, DEFAULTS);
    initDragonSliderEls(this, $.extend(defaultsCopy, opts));
  };


  /**
   * @param {number} val Between 0 and 1.
   */
  $.fn.dragonSliderSet = function (val) {
    val = Math.min(1, val);
    val = Math.max(0, val);
    var $handle = this.find('.dragon-slider-handle');
    var scaledVal = val * (this.width() - $handle.outerWidth());
    $handle.css('left', scaledVal);
  };


  /**
   * @return {number} Between 0 and 1.
   */
  $.fn.dragonSliderGet = function () {
    var $handle = this.find('.dragon-slider-handle');
    var left = $handle.position().left;
    return left / (this.width() - $handle.outerWidth());
  };


  /**
   * @param {jQuery} $els
   * @param {Object} opts
   */
  function initDragonSliderEls ($els, opts) {
    $els.each(function (i, el) {
      var $el = $(el);
      var $handle = createDragHandle($el);
      $el
        .addClass('dragon-slider')
        .width(opts.width)
        .append($handle)
        .data('dragon-slider', $.extend({}, opts));
    });
  }


  /**
   * @param {jQuery} $container
   */
  function createDragHandle ($container) {
    var $handle = $(document.createElement('BUTTON'));
    $handle.addClass('dragon-slider-handle');
    $handle.dragon({
      'within': $container
    });
    $handle.on('keydown', onHandleKeydown);

    return $handle;
  }


  function onHandleKeydown (ev) {
    var $el = $(this);
    var $parent = $el.parent();
    var current = $parent.dragonSliderGet();
    var increment = $parent.data('dragon-slider').increment;
    var key = ev.which;

    if (key === KEY_LEFT) {
      $parent.dragonSliderSet(current - increment);
    } else if (key === KEY_RIGHT) {
      $parent.dragonSliderSet(current + increment);
    }
  }

} (this.jQuery));
