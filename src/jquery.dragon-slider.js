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
  };


  $.fn.dragonSlider = function (opts) {
    opts = opts || {};
    var defaultsCopy = $.extend({}, DEFAULTS);
    initDragonSliderEls(this, $.extend(defaultsCopy, opts));
  };


  function initDragonSliderEls ($els, opts) {

    $els.each(function (i, el) {
      var $el = $(el);
      var $handle = createDragHandle($el);
      $el
        .addClass('dragon-slider')
        .width(opts.width)
        .append($handle);
    });
  }


  function createDragHandle (container) {
    var $handle = $(document.createElement('BUTTON'));
    $handle.addClass('dragon-slider-handle');
    $handle.dragon({
      'within': container
    });

    return $handle;
  }

} (this.jQuery));
