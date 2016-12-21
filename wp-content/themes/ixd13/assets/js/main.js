/* Author: Jonathan "Yoni" Knoll

Requires:

http://interaction13.ixda.org/wp-content/themes/ixd13/assets/partials/program.json
*/
var KEYS={BACKSPACE:8,TAB:9,RETURN:13,ESC:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,LEFT:37,UP:38,RIGHT:39,DOWN:40,DELETE:46,COMMA:188};

(function() {
 
var re = new RegExp;

var doClickActions = function(e) {
  var scope = e.data;
  if(scope.debug) {
    console.log(e, scope);
  }
  // console.log(scope);
  var node = this;
  var actions = [],
      data = {},
      toggles = [],
      $target = null,
      target = null,
      targetType = null;
  if(node.getAttribute('data-c-actions')) {
    actions = node.getAttribute('data-c-actions').split(' '); 
  }  
  try {
    if(node.tagName.toLowerCase()=='a') {
      var hash = node.hash;
      if(!!hash) {
        $target = $(hash);
        targetType = 'element';
      }
      else if(node.getAttribute('data-selector')) {
        $target = $(node.getAttribute('data-selector'));
        targetType = 'selector';
      }
      else {
        target = node.href;
        targetType = 'url';
      }
    }
    else if(node.getAttribute('data-target')) { // allows any element to set a target
      $target = $('#' + node.getAttribute('data-target'));
      targetType = 'element';
    }
    else { // defaults to the node's parent (why not?)
      $target = $(node).parent();
      targetType = 'parent';
    }
  }
  catch(err) {
    if(typeof scope._errors=='undefined') {
      scope._errors = [{_event:e, _error:err}];
    }
    else {
      scope.errors.push({_event:e, _error:err});
    }
    if(!!scope.debug) {
      console.error(scope._errors);
    }
  }
  if(targetType!=='url' && node.tagName.toLowerCase()=='a' && !node.getAttribute('data-return')) {
    e.preventDefault();
  }
  for(var i=0, aLen=actions.length, action; i<aLen; i++) {
    action = actions[i];
    if(typeof scope.handlers[action]!=='undefined') {
      scope.handlers[action]( e, {
        node: node,
        title: node.getAttribute('data-title') ? node.getAttribute('data-title') : null,
        href: node.getAttribute('href') ? node.getAttribute('href').split('#')[0] : null,
        $target: $target,
        target: target,
        targetType: targetType,
        $data: typeof data[action]!=='undefined' ? data[action] : data
      });
    }
  }
}; // doClickActions

function titleSort(a, b) {
  var aTitle = a.getAttribute('data-title');
  var bTitle = b.getAttribute('data-title');  
  var check = [aTitle, bTitle];
  check.sort();
  a = check.indexOf(aTitle);
  b = check.indexOf(bTitle);
  return a-b;
}

function daySort(a, b) {
  var aDate = $(a).find('time').attr('datetime');
  var bDate = $(b).find('time').attr('datetime');
  var check = [aDate, bDate];
  check.sort();
  a = check.indexOf(aDate);
  b = check.indexOf(bDate);
  return a-b;
}

window.ixd13 = { 
  $window: $(window),
  $body: null,
  $modal: null,
  handlers: {
    
    toggleClass: function(e, args) {
      args.$target.toggleClass(args.node.getAttribute('data-class'));
    }, // toggleDisplay
    
    closeModal: function(e, args) {
      // $('#screen').remove();
      $('.screen .close').click();
      // location.href = location.href.split('#')[0] + '#/';
      
      // ixd13.$modal = null;
      // ixd13.helpers.modalPositioner();      
    }, // closeModal
    
    toggleModal: function(e, args) {
      $('.' + args.node.getAttribute('data-screen')).addClass('screen').find('.show').removeClass('show');
    }, // toggleModal

    toggleText: function(e, args) {
      var text = args.node.getAttribute('data-text');
      args.node.setAttribute('data-text', args.node.innerHTML);
      args.node.innerHTML = text;
    }, // toggleText

    scrollTo: function(e, args) {
      try {
        if(!!args.node && args.node.getAttribute('data-reset')!=='false') {
          // ixd.$E.trigger('ixda:scrolling', [args]);
          // $window.trigger('ixda:fake-scroll');
        }
        if(!!args.$target.length) {
          if(e && !!e.preventDefault) {
            e.preventDefault();
          }
          // DEBUGGER.debugIt('scrollTo', {e:e, args:args}, 'info');
          // if($args.target.is(':visible')) {
            window.scrollTo(0, args.$target.offset().top-60);
          // }
          // else {
          //   
          // }
        }
      }
      catch(err) {
        // DEBUGGER.handleError(err);
      }
    }, // scrollTo

    showSpeaker: function(e, args) {
      ixd13.handlers.closeModal();
      $.tmpl('speaker-modal', ixd13.speakers[args.node.getAttribute('data-speaker-id')])
          .lightbox_me({
            // onClose:ixd13.helpers.setTitle
            onClose:ixd13.helpers.setTitle
          });
      location.href = location.href.replace(/^(.*)\/?#.*/gim, "$1") + '#/' + args.node.getAttribute('data-speaker-id');
      // ixd13.helpers.setTitle(args.node.title);
      ixd13.helpers.setTitle($('.speaker-screen>article').attr('title'));
      // if(ixd13.debug) {
      //   console.log(e, args);
      // }
      // ixd13.handlers.closeModal();
      // ixd13.$body.append(
      //   $.tmpl('speaker-modal', ixd13.speakers[args.node.getAttribute('data-speaker-id')]).lightbox_me();
      // );
      // location.href = location.href.replace(/^(.*)\/?#.*/gim, "$1") + '#/' + args.node.getAttribute('data-speaker-id');
      // ixd13.$modal = $('#screen').find('.speaker');
      // ixd13.helpers.modalHelper();
      // ixd13.helpers.modalPositioner();
    }, // showSpeaker
    
    showSession: function(e, args) {
      ixd13.handlers.closeModal();
      $.tmpl('session-modal', ixd13.program[args.node.getAttribute('data-event-id')])
        .lightbox_me({
          onClose:ixd13.helpers.setTitle
        });
      location.href = location.href.replace(/^(.*)\/?#.*/gim, "$1") + '#/' + args.node.getAttribute('data-event-id');
      ixd13.helpers.setTitle($('.session-screen>article').attr('data-title'));
      // if(ixd13.debug) {
      //   console.log(e, args);
      // }
      // ixd13.handlers.closeModal();
      // ixd13.$body.append(
      //   $.tmpl('session-modal', ixd13.program[args.node.getAttribute('data-event-id')])
      // );
      // location.href = location.href.replace(/^(.*)\/?#.*/gim, "$1") + '#/' + args.node.getAttribute('data-event-id');
      // ixd13.$modal = $('#screen').find('.session');
      // ixd13.helpers.modalHelper();
      // ixd13.helpers.modalPositioner();
    }, // showSession
    
    showDay : function(e, args) {
      var $sessionLists = $('.schedule-day');
      var changed = this.id;
      var filters = '.' + $.map($('.controls .filter'), function(x) {
        return $(x).val();
      }).join('.');
      
      $sessionLists.show();
      var day = $(this).val();
      if(day=='session') {
        $sessionLists.find('.session').show();  
        $sessionLists.find('.other-links').show();
        location.href = location.href.replace(/^(.*)\/?#.*/gim, "$1") + '#/';
      }
      else {
        $sessionLists.find('.session').hide().filter(filters).show();
        $sessionLists.find('.other-links').hide();
        location.href = location.href.replace(/^(.*)\/?#.*/gim, "$1") + '#/day/' + $(this).val();
      }
      $sessionLists.filter(':not(:has(.session:visible))').hide();
    } // showDay
    
  }, // handlers
  helpers: {
    setTitle: function(descriptor) {
      if(!!descriptor) {
        document.title = descriptor + ' | ' + ixd13.title;
      }
      else {
        location.href = location.href.split('#')[0] + '#/';
        document.title = ixd13.title;
      }
    }, // resetTitle
    
    // modalHelper: function() {
    //   ixd13.$window.one('keydown', function(e) {
    //     if(e.which==KEYS.ESC) {
    //       ixd13.handlers.closeModal();
    //     }
    //   });
    // }, // modalHelper
    // 
    // modalPositioner: function() {
    //   if(ixd13.$modal) {
    //     if(Modernizr.touch) {
    //       $('#screen').css({height:$(document).height() + 'px'});
    //       ixd13.$modal.css({
    //         marginTop: (window.scrollY+10) + 'px'
    //       }).addClass('show');
    //     }
    //     else {
    //       ixd13.$modal.css({
    //         marginTop: ((ixd13.$window.height()-ixd13.$modal.height())*0.4) + 'px'
    //       }).addClass('show');
    //     }
    //     ixd13.$body.css({height:ixd13.$window.height(), overflow:'hidden'});
    //   }
    //   else {
    //     ixd13.$body.css({height:'auto', overflow:'visible'});
    //   }
    // }, // modalPositioner
    // 
    disableSpeakerModals: function(err) {
      ixd13.errors = err;
      $('.speaker-link').attr('data-c-actions', 'disable');
    } // disableSpeakerModals
  
    
  }, // helpers
  
  initializers: {
    
    insertTryptych: function() {
      var pid = ixd13.$body.attr('data-page-id'), $t;
      if(['home', 'about', 'plan-your-trip'].indexOf(pid)>=0) {
        $t = $('#tryptych');
        $.ajax({
          url:'/wp-content/themes/ixd13/templates/tryptychs-' + pid + '.html',
          type:'get',
          dataType:'html',
          success: function(data) {
            if(!!data) {
              $t.html(data);
            }
            else {
              $t.remove();
            }
          }, // success
          error: function(data) {
            $t.remove();
          } // error
        });
      }

    }, // insertTryptych
    
    activateSpeakers: function() {
      if((/(program|schedule|speakers|reception|idea-markets)/).test(ixd13.$body.attr('class'))) {
        $.ajax({
          url:'/wp-content/themes/ixd13/assets/partials/speaker.tmpl',
          type:'get',
          dataType:'html',
          success: function(tmpl) {
            $.template('speaker-modal', tmpl);
            $.ajax({
              url:'/wp-content/themes/ixd13/assets/partials/speakers.json',
              type:'get',
              dataType:'json',
              success: function(data) {
                ixd13.speakers = data;
                var hash = location.hash;
                if(!!hash && hash.indexOf('/day/')<0) {
                  $('[data-c-actions="showSpeaker"][data-speaker-id=' + hash.substr(2) + ']').click();
                }
              },
              error: ixd13.helpers.disableSpeakerModals
            });
          },
          error: ixd13.helpers.disableSpeakerModals
        });
      } // if
    }, // activateSpeakers
    
    activateProgram: function() {
      if((/(program|schedule|speakers|reception|idea-markets)/).test(ixd13.$body.attr('class'))) {
        $.ajax({
          url:'/wp-content/themes/ixd13/assets/partials/session.tmpl',
          type:'get',
          dataType:'html',
          success: function(tmpl) {
            $.template('session-modal', tmpl);
            $.ajax({
              url:'/wp-content/themes/ixd13/assets/partials/program.json',
              type:'get',
              dataType:'json',
              success: function(data) {
                ixd13.program = data;
                var hash = location.hash;
                if(!!hash && hash.indexOf('/day/')<0) {
                  $('[data-c-actions="showSession"][data-event-id=' + hash.substr(2) + ']').click();
                }
              },
              error: ixd13.helpers.disableSpeakerModals
            });
          },
          error: ixd13.helpers.disableSpeakerModals
        });
        
        var $filters = $('.controls .filter'); // i think this has to move into the success handler
        $.ajax({
          url:'/wp-content/themes/ixd13/assets/partials/program_controls.html?v=1',
          type:'get',
          dataType:'html',
          success: function(data) {
            
            ixd13.$body.filter('.program, .program-test').find('.page-header').append(data);
            $filters.filter('#session-type').find('option').each(function(i, opt) {
              if(!$('article[data-session-type="' + opt.value + '"]').length) {
                $(opt).hide();
              }
            });
            // var $sessionLists = $('.session-list');
            var $sessionLists = $('.schedule-day');
            
            // $filters.live('change ixd:change', ixd13.handlers.showDay);
            var $sessionFilter = $('#session-day');
            $sessionFilter.live('change ixd:change', ixd13.handlers.showDay);
            var hash = location.hash;
            if(!!hash && hash.indexOf('/day/')>=0) {
              var day = hash.replace(/^.*day\/(\w+)\/?$/gim, "$1");
              $sessionFilter.val(day);
              $sessionFilter.trigger('change');
            }

            $('.controls').animate({ opacity:1.0 }, 'slow');

          }, // success
          error: function() {
        
          }
        });

        $('.session-list article').each(function(i, session) {
          var $this = $(this);
          var $desc = $this.find('.description');
          var more = false;
          if(!!$desc.length) {
            var $p = $desc.find('p, ul, ol');
            var s;
            if(!!$p.filter(':not(:first-child)').length) {
              $p.filter(':not(:first-child)').addClass('cut');
              more = true;
            }
            else if($p.first().text().length>250) {
              s = $p.first().text().split(/^(.{5,450}[?!.])(?!$)/gm);
              if(s.length>2 && s[0]=='' && s[2]!=='') {
                $p.first().html( s[1] + ' <span class="cut">' + s[2] + '</span>' );
                more = true;
              }
            }
            if(more) {
              $desc.append('<p class="more"><a href="#' + this.getAttribute('id') + '" data-c-actions="toggleClass toggleText" data-class="show-more" data-text="less&hellip;">more&hellip;</a></p>');
            }
          }
          else {  
            $this.find('.expand-it').remove();
          }
        });
        
      } // if
    }, // activateProgram
    
    activateNav: function() {
      $('#menu-primary-navigation li:not(.menu-home) a').each(function(i, v) {
        if(location.href.indexOf(this.href)>=0) {
          $(this).parent().addClass('active');
        }
      });
    }, // activateNav
    
    activateCarousel: function() {
      var $carousel = $('#myCarousel');
      if($carousel.length>0) {
        var $slides = $carousel.find('.carousel-inner');
        var slides = ['_12_2', '_12_4', '_12_5', '11_2', '12_3', '1', '2', '3'];
        for(var i=0, sLen=slides.length, slide; i<sLen; i++) {
          $slides.append('<div class="item"><img src="/assets/img/anniversary/ixd' + slides[i] + '.jpg" alt=""></div>');
        }
        $.carousel();
      }
    }, // activateCarousel
    
    addLiveEvents: function() {
      $('[data-c-actions]').live('click', ixd13, doClickActions);
      $('.screen').live('click', function(e) {
        if(e.target==this) {
          ixd13.handlers.closeModal(e, { $target:$(this) });
        }
      });
    } // addLiveEvents
    
  }, // initializers

  
  applied: [],

  _init: function() {
    ixd13.$body = $('body');
    ixd13.title = document.title;
    // ixd13.$window.on('resize', ixd13.helpers.modalPositioner);
    if(location.search.substr(1).indexOf('debug')>=0) {
      ixd13.debug = true;
      console.log('Initializing...');
    }
    $.each(this.initializers, function(k, init) {
      if($.inArray(k, ixd13.applied)<0) {
        init.apply(ixd13);
        if(ixd13.debug) {
          console.log('... ' + k + ' ... initialized!');
        }
        ixd13.applied.push(k);
      }
    });
  
  } // _init
}; // ixd13

$(document).ready(function() {
  ixd13._init();
});

})();
