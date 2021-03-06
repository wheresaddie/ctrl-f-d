/*
  Ctrl+F'd
  A bookmarklet script to censor text on a web page, in the Rush Limbaugh style.
  by Greg Leuch <http://www.gleuch.com>
 
  ------------------------------------------------------------------------------------
 
  Why Rush, you ask? Read this: http://www.gleuch.com/play/ctrl-f-d
 
*/


Array.prototype.in_array = function(p_val, sensitive) {for(var i = 0, l = this.length; i < l; i++) {if ((sensitive && this[i] == p_val) || (!sensitive && this[i].toLowerCase() == p_val.toLowerCase())) {return true;}} return false;};
function rgb2hex(rgb) {rgb = rgb.replace(/\s/g, "").replace(/^(rgb\()(\d+),(\d+),(\d+)(\))$/, "$2|$3|$4").split("|"); return "#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);} 
function hex(x) {var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8","9", "A", "B", "C", "D", "E", "F"); return isNaN(x) ? "00" : hexDigits[(x-x%16)/16] + hexDigits[x%16];}

var $_ = false, $ctrl_f_d = document.createElement('script'), local = true;
$ctrl_f_d.src = 'http://assets.gleuch.com/jquery-latest.js';
$ctrl_f_d.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild($ctrl_f_d);


function ctrlfd_wait() {
  if ((local && typeof(jQuery) == 'undefined') || (!local && typeof(unsafeWindow.jQuery) == 'undefined')) {
    window.setTimeout(ctrlfd_wait,100);
  } else {
    ctrlfd_start(local ? jQuery : unsafeWindow.jQuery);
  }
}

function ctrlfd_start($_) {
  $_.fn.reverse = function(){return this.pushStack(this.get().reverse(), arguments);};

  (function($_) {
    $_.ctrlfd = function(data, c) {
      if (!$_.ctrlfd.settings.finish) $_.ctrlfd.init();
      $_(data).ctrlfd(c);
      if (!$_.ctrlfd.settings.finish) $_.ctrlfd.finish();
    };
 
    $_.fn.ctrlfd = function(c) {
      return this.filter(function() {return $_.ctrlfd.filter(this);}).each(function() {$_.ctrlfd.censor(this, c);});
    };

    $_.extend($_.ctrlfd, {
      settings : {hide_bg : true, tag_start : '<span class="ctrlfd">', tag_end : '</span>', init : false, finish : false},

      filter : function(self) {
        if (self.nodeType == 1) {
          var tag = self.tagName.toLowerCase();
          return !(self.className.match('ctrlfd') || tag == 'head' || tag == 'img' || tag == 'script');
        } else {
          return true;
        }
      },

      censor : function(self, c) {
        $_(self).css({'text-shadow' : 'none'});

        if (self.nodeType == 3) {
          if (self.nodeValue.replace(/\s/ig, '') != '') {
            if (!c) c = $_(self).parent() ? $_(self).parent().css('color') : '#000000';
            var ntb = '<span class="ctrlfd" style="color: '+ c +'; background-color:'+c+';">';
            $_(self).after(ntb+ self.nodeValue.replace(/\s\s/ig, ' ').replace(/\n/ig, '').split(' ').join($_.ctrlfd.settings.tag_end +' '+ ntb) + $_.ctrlfd.settings.tag_end);
            self.nodeValue = '';
          }
        } else if (self.nodeType == 1) {
          c = rgb2hex($_(self).css('color'));
          if ($_(self).children().length > 0) {
            $_.ctrlfd($_(self).contents(), c);
          } else if ($_(self).children().length == 0) {
            $_(self).html($_.ctrlfd.settings.tag_start + $_(self).text() + $_.ctrlfd.settings.tag_end).addClass('ctrlfd').css({'background-color': c});
          } else {
            $_(self).addClass('ctrlfd');
          }
        }
      },

      init : function() {
        $_.ctrlfd.settings.init = true;
      },

      finish : function() {
        $_(document).each(function() {
          var r = this.title.split(" ");
          for (var i=0; i<r.length; i++) if (!(/(\||\-)/ig).test(r[i])) r[i] = r[i].replace(/\S/ig, '-');
          this.title = r.join(' ');
        });

        setTimeout(function() {
          $_('object,embed,iframe').each(function() {
            var r = $_(this);
            r.wrap(document.createElement('div'));
            var s = $_(this).parent();
            s.css({width: r.width(), height: r.height()}).addClass('ctrlfd');
            r.remove();
          });
        }, 1000);

        $_('img, input[type=image]').each(function() {
          var r = $_(this), w = r.width(), h = r.height();
          r.css({width: r.width(), height: r.height()}).attr('src', 'http://assets.gleuch.com/blank.png').width(w).height(h);
        });

        var s = document.createElement("style");
        s.innerHTML = ".ctrlfd {font-size: inherit !important; "+ ($_.ctrlfd.settings.hide_bg ? "background-image: none !important;" : "") +"} .bg_ctrlfd {"+ ($_.ctrlfd.settings.hide_bg ? "background-image: none !important;" : "") +"} select, input, textarea, object, embed, img, button, hr {background: #000 !important; color: #000 !important; border-color: #000 !important;}";
        $_('head').append(s);

        /*if ($_.ctrlfd.settings.hide_bg) $_('body *, body, html').each(function() {$_(this).addClass('bg_ctrlfd');});*/

        $_.ctrlfd.settings.finish = true;
      }
    });
  })($_);
  
  /* $(window).ready(function() { */
    /* Remove some shitty ads */
    $('iframe, a[href~=atdmt], script[src~=doubleclick]').remove();
  /* }); */
  /* $_(document).ready(function() { */
    $_.ctrlfd('html', '#000000');

    /* setTimeout(function() {
      if ($_.ctrlfd.settings.md5 != $('*').size()) {
        $_.ctrlfd('html', '#000000');
        $_.ctrlfd.settings.md5 = $('*').size();
      }
    }, 2000); */
  /* }); */
}


ctrlfd_wait();