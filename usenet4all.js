// ==UserScript==
// @name     Usenet4all DL Helper
// @description just makes life easier
// @version  1
// @grant    none
// @match    https://usenet-4all.pw/forum/showthread.php*
// @require     https://code.jquery.com/jquery-1.9.1.js
//console.log("Usenet4All");

// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
$(function () {
  const idList = [];
  const nzblinks = [];
  var $links = $('[id^="thanks_postbtn."]:visible');
  $links.each(function(i, val) {
    return;
    const $link = $(this);
    const id = $link.attr('id').replace('thanks_postbtn.', '');
    idList.push(id);
    if (typeof thanks_do === 'function') {
      thanks_do(id);
      console.log("ran thanks_do on id %o", id);
    } else {
      console.log("did not run thanks_do for id %o", id);
    }
  });

//  $('a.nzblnk').each(function (i, nzblink) {
//		window.location = nzblink.attr('href');
//  });

  console.log("idList %o", idList);
  // once done:
  $.each(idList, function(i, id) {
  //  return;
    const $container = $('#post_message_' + id);
    const nzblink = $container.find('a.nzblnk');
    nzblinks.push(nzblink);
    console.log("nzlink %d: %o",i ,nzblinks);
		window.location = nzblink.attr('href');
//    nzblink.click();
  });

  console.log("nzlinks processed %o", nzblinks);

  const $scrollBtns = $('#topcontrol, #topcontrol + div');
  $scrollBtns.last().off('click');

  const $btnDown = $('#topcontrol, #topcontrol + div').last();
  $btnDown.on('click', function () {
    window.scrollTo(0, window.scrollMaxY - 1085);
    return false;
  });

    var test = $('<a href="nzblnk:?t=See.Reich.der.Blinden.S01E08.Das.Haus.der.Erleuchtung.GERMAN.DL.WebRip.x264-iND&amp;h=75fe296d4df376585b318180&amp;p=8zOfDDz2vbHaRdOSPCZNWjXYsTylE6SCLx4MwhC" class="nzblnk">NZBLNK</a>');
    $('#posts').on('click', 'a.nzblnk[href*="See.Reich.der.Blinden."]', function () {
        $(this).attr("href", (i, oldHref) => {
          return oldHref.replace("See.Reich.der.Blinden.", "See.");
      });
    });

});