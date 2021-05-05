// ==UserScript==
// @name     Klack Enhance "Jetzt im TV & similar"
// @namespace   http://www.klack.de
// @version  1
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
//     var DBG = true;
	var currentDate = new Date();
	var currentHour = currentDate.getHours();
	var currentMinute = currentDate.getMinutes();

	function getTimeshiftUrl(hours) {
		// returns a modified location string, with params set to timeshift
		// the displayed tv schedule by the specified ammount of hours
		// (relative to the currently displayed schedule)
		// falsy values reset timeshift to 0
		var locationPathParts = document.location.pathname.split("/");
		var shiftAmmount = hours * 60;
		locationPathParts[locationPathParts.length -3] = shiftAmmount ? locationPathParts[locationPathParts.length -3] * 1 + shiftAmmount : 0;
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
	
	$buttonRow.siblings().css({
//         position: "relative",
		zIndex: 1,
//         background: "rgba(200, 08, 12, 0.56)"
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

	function getDurationBar(fractionViewed, duration, timeSinceStart) {
		var $durationInfo = $("<div />").css({
			marginBottom: "1em"
		});

		var $durationBarWrp = $('<div />').css({
			background: "red 0 0 no-repeat",
			border: "1px solid #555"
		}).append($("<div />").css({
			background: "lime 0 0 no-repeat",
			height: "5px",
			width: fractionViewed * 100 + "%"
		}));

		var tStr = (duration - timeSinceStart);

		return $durationInfo
			.append($durationBarWrp)
			.append('<div>Seit ' + timeSinceStart + ' / ' + duration + ' Minuten | Noch '  + tStr + ' </div>')
	}

	function paintCell($cell, fractionViewed, duration, timeSinceStart) {
		var $durationInfo = getDurationBar(fractionViewed, duration, timeSinceStart);

		$cell.prepend($durationInfo);
	}

	var stationList = $("table.broadcasts tbody");
	var $stationDisplay = $("#selectstationSelect .selectValue .value");

	$(document).ready(function(e) {
		var stations = stationList.children(".evenRow, .oddRow");
		$stationDisplay.html(function(i, oldVal) {
			return oldVal + ' <b>(' + stations.length + ')</b>';
		});
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
		if (DBG === true) {
			$dCells.eq(i).prepend('<div>timeSinceStart: ' + timeSinceStart + ' Min<br /></div>');
		}
		if (timeSinceStart > 0) {
			fractionViewed = getRatio(timeSinceStart, duration);
			fractionViewedDisplayValue = (fractionViewed * 100) + '%';
			paintCell($dCells.eq(i), fractionViewed, duration, timeSinceStart);
			$dCells.eq(i).prepend('<div>' + fractionViewedDisplayValue + ' bereits gelaufen<br />timeSinceStart: ' + timeSinceStart + 'min <br /></div>');
		} else {
			// negative delta t means  time is in the future
			if (DBG === true) {
				$dCells.eq(i).prepend('<b>noch nicht gestartet</b><br />');
			}
						$dCells.eq(i).prepend('<div>Gstartet vor: ' + timeSinceStart + ' min<br />  Laufzeit: ' + duration + ' min<br /> </div>');
		}

	});
});
