// ==UserScript==
// @name     Klack Enhancer
// @namespace   http://www.klack.de
// @description Now with code !
// @include     https://www.klack.de/*
// @version     1
// @require     http://code.jquery.com/jquery-1.9.1.js
// @require     http://code.jquery.com/ui/1.10.3/jquery-ui.js
// @resource    btnUpImg  https://beta.uyl.me/lab/img.php?image=8547_arrow85b_lci6.png
// @resource    myKlackCss  file:///C:/Dev/BrowserAddons/Firefox/myKlackCss.css
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @grant           unsafeWindow
// ==/UserScript==
// return;
var cssTxt  = GM_getResourceText ('myKlackCss');
window.cssresource = GM_getResourceText;
GM_addStyle (cssTxt);

// Append some text to the element with id someText using the jQuery library.
var $ = this.jQuery = jQuery.noConflict(true);
// ToDo: Add past dates to dateSelect (--86400)

$(function () {
//    $.on = $.noop;
    // $.on = $.on;
     console.log('klack enhancer ready()');
    function storeScrollPosition(e) {
        console.log("store scrollPos: update cookie scrollY..", unsafeWindow.document.scrollingElement.scrollTop);
        unsafeWindow.document.cookie = 'scrollpos=' + unsafeWindow.document.scrollingElement.scrollTop + ";path='/'";
        console.log("store scrollPos ran, cookie is now", unsafeWindow.document.cookie);
    }

    function restoreScrollPosition() {
        var cookieValue = unsafeWindow.docxument.cookie.replace(/(?:(?:^|.*;\s*)scrollpos\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        console.log("cookieValue %s, cookie: %o", cookieValue, unsafeWindow.document.cookie);
        if ( cookieValue ) {
            unsafeWindow.document.scrollingElement.scrollTop = cookieValue;
        }
    }

    function addBtn(btnClass, imgSrc) {
        var $btn = $('<img src="' + imgSrc + '" />');
        return $btn.addClass(btnClass)
            .css({
            position: "fixed",
            bottom: 0,
            right: 0,
            cursor: "pointer",
            zIndex: "99999"
        });
    };

    var scrllRestoreBtnSrc = 'data:image/png;base64,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';

    var $scrollRestoreBtn = addBtn("myRestoreScrollPosBtn");

    $scrollRestoreBtn.css({
        bottom: 'auto',
        top: 0,
        left: '50px'
    }).attr('src', scrllRestoreBtnSrc)
    .on("click", function() {
        restoreScrollPosition();
    })
    .prependTo("body");

    window.setTimeout(function() {
        $scrollRestoreBtn.hide();
    }, 10000);


    var $links = $(".details > .content > a:first-child, td.broadcast > a");


//     $(window).on('unload', function(e) {
//         storeScrollPosition(e);
//     });

    $('body').on('click', '#myDialogWrp', function() {
        $(this).remove();
    });

    $('#klack_menu, #componentHeader, #breadcrumbs').css({
//         display: 'none'
    });

    $("#content, #all, #mainContent").css({width: "100%", padding: 0});

    var imgSrc = "data:image/png;base64,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";
    var tid;
    var $upBtn = $('<img src="' + imgSrc + '" />').addClass("my_upBtn").css({
        position: "fixed",
        bottom: "80px",
        right: "50px",
        cursor: "pointer",
        zIndex: "99999",
        transform: "rotate(90deg)"
    });

	const formTpl = '<form id="scrollOptsIn">\
		<fieldset>\
		<legend>Choose position to scroll to!</legend>\
		<div><label for="left">Left (number)</label>\
			<input id="left" name="left" type="number"></div>\
		<div><label for="top">Top (number)</label>\
			<input id="top" name="top" type="number"></div>\
		<div><label for="scroll">Smooth scroll?</label>\
			<input id="scroll" name="scroll" type="checkbox"></div>\
		<div>\
			<button>Scroll</button>\
		</div>\
		</fieldset>\
	</form>';

    const $formTpl = $(formTpl).css({
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 9999,
        background: 'white'
    });
//     $("body").prepend($formTpl);

    var scrollY = 0;
    var $downBtn = $('<img src="' + imgSrc + '" />').addClass("my_downBtn").add($('<img src="' + imgSrc + '" />').addClass("my_upBtn")).css({
        position: "fixed",
        bottom: "50px",
        right: "50px",
        cursor: "pointer",
        zIndex: "99999"
    }).filter('.my_upBtn').css({
        bottom: "80px",
        transform: "rotate(180deg)"
    }).end().appendTo('body');

//     $('#scrollOptsIn').on('submit', function (e) {
//         e.preventDefault();
// //         var scrollAmmount = $(window).innerHeight() - 200;
//         let scrollOptions = {
//             left: $('#left').val() || 0,
//             top: $('#top').val() || 1,
//             behavior: $('#scroll')[0].checked ? 'smooth' : 'auto'
//         };        var scrollAmmount = 3;
//         scrollAmmount = $(this).hasClass("my_upBtn") ? scrollAmmount * -1 : scrollAmmount;
//         console.log("scrollBtn click, scrollOptions: %o", scrollOptions);
//         if ( tid ) {
//             tid = window.clearInterval(tid);
//             return;
//         }
//         var i=1;
//         tid = window.setInterval(function () {
//             console.log("by page started %o", i++);
//             window.scrollBy(scrollOptions);
// //             window.scrollBy({
// //                 top: scrollAmmount,
// //                 left: 0,
// //                 behavior: 'auto'
// //             });
//             //         window.scrollByPage(1);
//         }, 15);


//         /*
//       tid = window.setInterval(function () {
//         window.scrollTo({
//           top: scrollAmmount > 0 ? scrollY+=2 : scrollY-=2,
//           left: 0,
//           behavior: 'auto'
//         });
//       }, 8);
//   });
//   */

//   var $pageDownBtn = $('<img src="' + imgSrc + '" />')
//   	.addClass("my_pageDownBtn")
//   	.css({
//     position: "fixed",
//     bottom: "50px",
//     right: "20px",
//     cursor: "pointer",
//     zIndex: "99999"
//     bottom: "80px",
//     transform: "rotate(180deg)"
//   }).appendTo('body').on('click', function () {
//    //   window.scrollByPages(1);

//     });


    function prepareLinkForLayer($link) {
        $link
            .data('oldClick', $link.attr('onclick'))
            .attr('onclick', 'return false;')
            .on('click', function(e) {
            // 	console.log('link onclick: ', $link.find('.title'));
            var $layer = showInLayer($link);
            return false;
        })
            .on('click', function(e) {
            var details = window.open(
                this.href,
                '',
                'height = 700, width = 743,scrollbars=yes,status=no,directories=no,menubar=no,resizable=no,location=tabelle'
            );
            details.focus();
        });
    }

    function showInLayer($link) {
        var url = $link.data('oldClick').match(/.*window\.open\('([^']+)/)[1];
        return $('<div id="myDialogWrp" />').css({
            background: '#fff',
            position: 'fixed',
            zIndex: 99,
            maxWidth: '650px',
            left: '50px',
            top: '20px'
        })
        // .width(4/5*$(window).width())
            .load(url + ' #detailsContent table.min').appendTo('body');
        /* 	.position({
          my: 'bottom left',
          at: 'top center',
          of: $link
        });
       */
    }

    function isAfterNow(timeStr) {
        var nowDate = new Date()
        }

    function getPercentage(timeStr) {
        var timePos = Math.floor($cell.innerWidth() * currentMinute / 60);
        return timePos;
    }

    var $closeBtn = $('button.txtClose.txtButton').on('click', function(e) {
            var details = window.open(
                this.href,
                '',
                'height = 700, width = 743,scrollbars=yes,status=no,directories=no,menubar=no,resizable=no,location=tabelle'
            );
            details.focus();
        });

    var $dataRows = $("tr.even, tr,odd");
    $dataRows.each(function () {
        var $cells = $(this).children("td");
        $cells.each(function (i) {
            var $cell = $(this);
            var $checkCell;
            var currentDate = new Date();
            var timeArr;
            if ($cells.length > i + 1) {
                var $nextCell = $cells.eq(i+1);
                $checkCell = $nextCell;
            } else {
                $checkCell = $cell;
            }
            //    timeArr = $checkCell.find('.time').text().split(':');
            if (true || timeArr.length) {
                //    	console.log("time: ", timeArr.join(':'));
                timeArr = $checkCell.find('.time').text().replace(/.*(\d+):(\d+)/, function ($all, $m1, $m2) {
                    //      console.log("replace callback args: ", arguments);
                });
            }
        });
    });



    var $timeHeader = $("table.bcAll tbody > tr:first th:not(.offsetLeft)");
    var currentHour = new Date().getHours();
    var currentMinute = new Date().getMinutes();
    $timeHeader.each(function () {
        var $cell = $(this);
        var timeStr = $.trim( $cell.text() );
        var timeParts = timeStr.split(':');
        var timePos = 0;

        if ( timeParts[0] == currentHour ) {

            if (currentMinute > 0) {
                timePos = Math.floor($cell.innerWidth() * currentMinute / 60);
            }
            $cell.css({position: "relative"})

            console.log("$cell.innerWidth() * minute / 60: %o", $cell.innerWidth() * currentMinute/60);
            console.log("pos in header: ", timePos);
        }
    });
});