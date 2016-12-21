(function() {
  if(location.href.indexOf('interaction13dev')>=0) {
    var $v = $('#videoContainer');
    if($v.length>0) {
      var a = false;
      var kkeys = '';
      var konami = '38,38,40,40,37,39,37,39,66,65';
      var retards = '82,69,84,65,82,68,83';
      $(window).keydown(function(e) {
        kkeys += ',' + e.keyCode;
        if(kkeys.indexOf(retards)>=0 && !a) {
          a = true;
          // DO KONAMI THING
        
          $v.css({overflow:'hidden', height:'500px'}).html('<img src="http://f.cl.ly/items/392B2P2F3z251B033E06/retards-bird-owl-funny-retards-demotivational-poster-1220096956.jpeg" style="width:100%;height:auto;margin-top:-15px;" />');
          window.scrollTo(0, $v.position().top-50);
          var clearit = setTimeout(function() {
            clearTimeout(clearit);
            $('p,a,h1,h2,h3,h4,h5,h6,aside,#welcomeMessage,.row:not(#content)').css({visibility:'hidden'});
            $v.find('img').css({position:'fixed', minHeight:'500px'}).animate({width:$(window).width(), top:-30, left:0, minHeight:$(window).height()});
          }, 2000);

        }
      });
    }
  }
})();

