import jQuery from 'jquery';
import _ from 'lodash';
/**
 * @name		jQuery KnobKnob plugin
 * @author		Martin Angelov
 * @version 	1.0
 * @url			http://tutorialzine.com/2011/11/pretty-switches-css3-jquery/
 * @license		MIT License
 */

(function($){
  var rotation = 0;
  $.fn.knobKnob = function(props, value){
    let max = 270;

    if (_.isString(props)) {
      return this.each(function() {
        var el = $(this);
        switch (props) {
          case 'update':
            var knob = el.find('.knob');
            var knobTop = knob.find('.top');
            knobTop.css('transition','all 350ms ease-in');
            knobTop.css('transform','rotate('+(value * max)+'deg)');
            setTimeout(function () {
              knobTop.css('transition','all 0ms');
            }, 365);
            rotation = value;
            el.data('knobKnob').turn(value);
        }
      });
    }

    var options = $.extend({
      snap: 0,
      value: 0,
      turn: function(){}
    }, props || {});

    var tpl = '<div class="knob">\
        				<div class="top"></div>\
				        <div class="base"></div>\
                <span class="min">Min</span>\
                <span class="max">Max</span>\
                <div class="ticks">\
                  <div class="tick activetick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                  <div class="tick"></div>\
                </div>\
			        </div>';

    return this.each(function(){

      var el = $(this);
      el.data('knobKnob', options);
      el.append(tpl);
      var knob = $('.knob',el);
      var knobTop = knob.find('.top');
      var startDeg = -1;
      var currentDeg = 0;
      rotation = 0;
      var lastDeg = 0;
      var doc = $(document);


      if(options.value > 0 && options.value <= max){
        rotation = currentDeg = options.value;
        knobTop.css('transform','rotate('+(currentDeg)+'deg)');
        options.turn(currentDeg/max);
      }

      var dragStart = function(e){

        e.preventDefault();

        var offset = knob.offset();
        var center = {
          y : offset.top + knob.height()/2,
          x: offset.left + knob.width()/2
        };

        var a, b, deg, tmp,
          rad2deg = 180/Math.PI;

        var drag = function(e){
          //if (!mainTrackPower) return;
          a = center.y - e.pageY;
          b = center.x - e.pageX;
          deg = Math.atan2(a,b)*rad2deg;

          // we have to make sure that negative
          // angles are turned into positive:
          if(deg<0){
            deg = 360 + deg;
          }

          // Save the starting position of the drag
          if(startDeg == -1){
            startDeg = deg;
          }

          // Calculating the current rotation
          tmp = Math.floor((deg-startDeg) + rotation);

          // Making sure the current rotation
          // stays between 0 and 359
          if(tmp < 0){
            tmp = 360 + tmp;
          }
          else if(tmp > 359){
            tmp = tmp % 360;
          }

          // Snapping in the off position:
          if(options.snap && tmp < options.snap){
            tmp = 0;
          }

          // This would suggest we are at an end position;
          // we need to block further rotation.
          if (tmp > 270 || Math.abs(tmp - lastDeg) > 180){
            return false;
          }

          currentDeg = tmp;
          lastDeg = tmp;

          knobTop.css('transform','rotate('+(currentDeg)+'deg)');
          options.turn(currentDeg/max);
        };

        knob.on('mousemove.rem', drag);
        knob.on('touchmove.rem', drag);

        var endDrag = function(){
          knob.off('.rem');
          doc.off('.rem');

          // Saving the current rotation
          rotation = currentDeg;

          // Marking the starting degree as invalid
          startDeg = -1;
        };

        doc.on('mouseup.rem',endDrag);
        doc.on('touchup.rem', endDrag);


      };

      knob.on('mousedown', dragStart);
      knob.on('touchstart', dragStart)
    });
  };

})(jQuery);
