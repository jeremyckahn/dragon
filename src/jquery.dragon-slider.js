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


  $.fn.dragonSlider = function (opts) {
    initDragonSliderEls(this, opts || {});
  };


  function initDragonSliderEls ($els, opts) {

    $els.each(function (i, el) {
      var $el = $(el);
      var $btn = createDragHandle();
      $el.addClass('dragon-slider');
      $el.append($btn);
    });
  }


  function createDragHandle () {
    var $btn = $(document.createElement('BUTTON'));
    $btn.dragon();

    return $btn;
  }

} (this.jQuery));
