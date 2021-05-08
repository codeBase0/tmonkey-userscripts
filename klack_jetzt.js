// ==UserScript==
// @name     Klack Enhance "Jetzt im TV & similar"
// @namespace   http://www.klack.de
// @version  1.1
// @description Refactoring in progress
// @require     http://code.jquery.com/jquery-1.9.1.js
// @require     http://code.jquery.com/ui/1.10.3/jquery-ui.js
// @include     https://www.klack.de/*
// @run-at document-end
// ==/UserScript==

// @include  https://www.klack.de/fernsehprogramm/2015-im-tv*
// @include  https://www.klack.de/fernsehprogramm/2200-im-tv*
// @include  https://www.klack.de/fernsehprogramm/was-laeuft-gerade*
// @grant       none

$(function() {
    var DBG = false;
    var DBG = true;
    var currentDate = new Date();
    var currentHour = currentDate.getHours();
    var currentMinute = currentDate.getMinutes();

    function addCss(rules) {
        var styleEl = document.createElement('style');

        // Append <style> element to <head>
        document.head.appendChild(styleEl);

        var cssStr = '';

        for (var i = 0; i < rules.length; i++) {
            var j = 1,
                rule = rules[i],
                selector = rule[0],
                propStr = '';

            // If the second argument of a rule is an array of arrays, correct our variables.
            if (Array.isArray(rule[1][0])) {
                rule = rule[1];
                j = 0;
            }

            for (var pl = rule.length; j < pl; j++) {
                var prop = rule[j];
                propStr += prop[0] + ': ' + prop[1] + (prop[2] ? ' !important' : '') + ';\n';
            }

            // Insert CSS Rule
            cssStr += selector + '{' + propStr + '}\n';
        }

        styleEl.innerHTML = cssStr;
    }

    function getPathParts(url) {
        // returns the specified timeshift value from [a given] location string, with params set to timeshift
        var locationPathParts = (url || document.location.pathname).split("/");

        return locationPathParts;
    }

    /*
        @param elem - DOM of the element we want to check
        @param vpEdge - specifies which edge of the viewport should be checked against 
        return boolean true|false - true if parts of the element are out of bounds at the specified edge of the viewport  
    */
    function isOutOfViewport(elem, "upper") {
        var boundingRect = elem.getBoundingClientRect();
        var elemOffset;

        if ( vpEdge === "upper" ) {
            return boundingRect.top < 0;
        } else {
            return boundingRect.bottom > window.height;
        }
        var elemOffset = elem.getBoundingClientRect()[vpEdge === "lower" ? "bottom" : "top"];
        
        return locationPathParts;
    }

    function getTimeshiftUrl(hours) {
        // returns a modified location string, with params set to timeshift
        // the displayed tv schedule by the specified ammount of hours
        // (relative to the currently displayed schedule)
        // falsy values reset timeshift to 0
        var locationPathParts = getPathParts();
        var shiftAmmount = hours * 60;

        if (locationPathParts.length < 4) {
            return 0;
        }

        locationPathParts[3] = shiftAmmount ? locationPathParts[3] * 1 + shiftAmmount : 0;

        return locationPathParts.join("/");
    }

    var $rows = $("table.broadcasts tbody > tr:not(.buttons)");
    var $tCells = $rows.find('td.time');
    var $dCells = $rows.find('td.details > .content');
    var serverNow = Date.now();
    var resultsDate;

    // Stickify timeshift buttons
    var $buttonRow = $('table.broadcasts tr.buttons').css({
        position: "sticky",
        top: 0,
        zIndex: 999,
        background: "rgba(200, 208, 212, 0.56)"
    });

    var $shiftDayBackBtn = $("<a>&lt; -24h</a>").attr("href", getTimeshiftUrl(-24));
    var $shiftDayFwdkBtn = $("<a>&gt; +24h</a>").attr("href", getTimeshiftUrl(24));
    var $shiftResetBtn = $("<a>X</a>").attr("href", getTimeshiftUrl(0));
    $buttonRow.find("td:first").prepend($shiftDayBackBtn).append($shiftResetBtn);
    $buttonRow.find("td:last div").append($shiftDayFwdkBtn).prepend($shiftResetBtn.clone());

    if (DBG === true) {
        console.log("$rows: %o", $rows);
        console.log("$tCells: %o", $tCells);
        console.log("$dCells: %o", $dCells);
    }

    function getRatio(minutesPassedSinceStart, minutesTotal) {
        var timePos = minutesPassedSinceStart / minutesTotal;
        return Math.min(Math.round(timePos * 1000) / 1000, 1);
    }

    function getMinutesSince(timeStr, $cell) {
        timeStr = $.trim( timeStr );
        var timeParts = timeStr.split(':');
        var date = new Date();
        var startTime = date.getTime();
        var timePassed = 0;

        date.setHours(timeParts[0]);
        date.setMinutes(timeParts[1]);
//         date.setDate(date.getDate()-2); // summertime debug set

        startTime = date.getTime();

        timePassed = serverNow - startTime;
//         console.log("getMinutesSince(%s): 1st result: %d, startTime set: %o", timeStr, timePassed, startTime );
//          $cell.prepend('<div>getMinutesSince(' + timeStr + '): <br />1st result: : ' + Math.round(timePassed / 60000) + ' Min<br />(' + date + ' - ' + Date() + ')<br /> startTime: ' + startTime + ' </div>');
        if (DBG === true) {
            $cell.prepend(
                '<div>getMinutesSince(' + timeStr
                + '): <br />1st result: : ' + Math.round(timePassed / 60000) + ' Min<br />(' + date + ' - ' + Date()
                + '): <br />serverNowt: : ' + serverNow + ' (' + serverNow + ') <br />'
                + '): <br />startTime: : ' + startTime + ' (' + startTime + ') <br />'
                + ' </div>');
        }
        return Math.round(timePassed / 60000);
    }

    function bindDebugClick(el) {
        el.addEventListener(function() {
            console.log("$dCells:hier" );
        });
    }

    function getDurationInfo(fractionViewed, duration, timeSinceStart) {
        var $durationInfo = $("<div />").addClass("durationInfo");

        var percentageStr = Math.round(fractionViewed * 10000)/100 + '%';

        var $durationBar = $('<div class="durationBar" />')
            .append($("<div />").attr("data-width", percentageStr));

        var tStr = (duration - timeSinceStart);

        return $durationInfo
            .append($durationBar)
            .append('<div class="durationDetails"><p><b>' + percentageStr + ' gelaufen</b></p><p>' + timeSinceStart + ' / ' + duration + ' Minuten</p><p>Noch '  + tStr + '</p></div>')
    }

    var SHOW_DURATION_INFO = true;

    addCss([
        ['.durationInfo ', [
            ['position', 'relative'],
            ['margin-bottom', '1em'],
            ['display', 'none']
        ]],
        ['html.durationInfo-enhancement-visible .durationInfo ', [
            ['display', 'block']
        ]],
        ['.durationInfo .durationBar ', [
            ['background', 'red 0 0 no-repeat'],
            ['border', '1px solid #555']
        ]],
        ['.durationInfo .durationBar > div', [
            ['background', 'lime 0 0 no-repeat'],
            ['height', '5px'],
            ['padding', '2px 0'],
            ['width', "attr(data-width)"]
        ]],
        ['.durationInfo .durationDetails ', [
            ['display', 'none'],
            ['position', 'absolute'],
            ['width', '100%'],
            ['top', '-8px'],
            ['left', '0'],
            ['padding', '5px 3px'],
            ['background', 'rgba(222,222,222,0.7)'],
            ['border', '2px solid grey'],
            ['border-radius', '4px']
        ]],
        ['.durationInfo:hover .durationDetails,\r\n' +
         '.durationInfo .durationDetails:hover ', [
            ['display', 'block', true]
        ]]
    ]);

    $(document).ready(function(e) {
        var stationList = $("table.broadcasts tbody");
        var $stationDisplay = $("#selectstationSelect .selectValue .value");
        var stations = stationList.children(".evenRow, .oddRow");
        $stationDisplay.html(function(i, oldVal) {
            return oldVal + ' <b>(' + stations.length + ')</b>';
        });
        $('html').toggleClass('durationInfo-enhancement-visible', SHOW_DURATION_INFO);
    });

    ( $("#componentHeader .time").text() ).replace(/(\d+)\.(\d+)\.(\d+),\s*(\d+):(\d+)\s*Uhr/i, function(match, d, m, y, h, minutes) {
        console.log("parsed serverNow: d: %o, m: %o, y: %o, all: %o", d, m, y, match, new Date(y, m-1, d, h, minutes));
//         serverNow = new Date(y, m-1, d, h, minutes).getTime();
        serverNow = new Date(y, m-1, d, h, minutes);
//         serverNow.setDate(serverNow.getDate()-2);  // summertime debug set
        serverNow =  serverNow.getTime();
    });

    ( $("#select .value").text() ).replace(/(\d+)\.(\d+)\.(\d+)/i, function(match, d, m, y) {
        console.log("parsed tv time: d: %o, m: %o, y: %o, all: %o", d, m, y, match, new Date(y, m, d));
        resultsDate = new Date(y, m-1, d).getTime();
    });

    $tCells.each(function(i, v) {
        var startTimeStr = $.trim( $tCells.eq(i).text() );
        if (!startTimeStr ) {
            console.err("no startTimeStr found (%o) - i: %o, tCell: %o || dCell: %o", startTimeStr, i, $tCells.eq(i),$dCells.eq(i));
        }
        var detailsTxt = $dCells.eq(i).text();
        var duration = 0;
        var fractionViewed = 0; // 0-1 value
        var fractionViewedDisplayValue = '';
        var timeSinceStart = 0;
        detailsTxt.replace(/Laufzeit: (\d+) Minuten/i, function(match, group1) {
            duration = 1 * (group1 || 0);
        });

        timeSinceStart = getMinutesSince(startTimeStr, $dCells.eq(i));

        if (timeSinceStart < -21 * 60) {
            // datumswechsel
            timeSinceStart += 24 * 60;
        }
        if (timeSinceStart > 0) {
            fractionViewed = getRatio(timeSinceStart, duration);
            fractionViewedDisplayValue = (fractionViewed * 100) + '%';

            $dCells.eq(i).prepend(getDurationInfo(fractionViewed, duration, timeSinceStart));
        } else {
            $dCells.eq(i).prepend('<b>noch nicht gestartet</b><br />');
        }
        if (DBG === true) {
            // $dCells.eq(i).prepend('<div>timeSinceStart: ' + timeSinceStart + ' Min<br /></div>');
            if (timeSinceStart > 0) {
                $dCells.eq(i).prepend('<div>Gestartet vor: ' + timeSinceStart + ' min<br />  Laufzeit: ' + duration + ' min<br /> </div>');
                $dCells.eq(i).prepend('<div>' + fractionViewedDisplayValue + ' bereits gelaufen<br />timeSinceStart: ' + timeSinceStart + 'min <br /></div>');
            } else {
                // negative delta t means  time is in the future
                $dCells.eq(i).prepend('<b>noch nicht gestartet</b><br />');
            }
        }

    });
});
