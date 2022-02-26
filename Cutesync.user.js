// ==UserScript==
// @name        Cutesync
// @description        Small namesync for 4chan's mobile layout. Does not require 4chan X.
// @namespace        ErinSteph
// @author        Erin !kittensORw
// @credits        Milky and namesync, Opros and frensync
// @include        *4chan.org/b/*
// @include        *4chan.org/trash/*
// @icon http://i.imgur.com/nLnuluW.png
// @updateURL     https://github.com/ErinSteph/Cute-Sync/raw/master/Cutesync.user.js
// @downloadURL     https://github.com/ErinSteph/Cute-Sync/raw/master/Cutesync.user.js
// @version        2.1.4
// ==/UserScript==

function initCuteSync() {

    var d, db, $, $$;

    d = document;
    db = document.body;

    $ = function (s, p) {
        if(!p || p == null) {
            p = db;
        }
        return p.querySelector(s);
    }

    $$ = function (s, p) {
        if(!p || p == null) {
            p = db;
        }
        return p.querySelectorAll(s);
    }

    $.getVal = function (k, v) {
        if(typeof (Storage) !== "undefined") {
            if(!v || v == null) {
                if(localStorage.getItem("" + k) != null) {
                    return localStorage.getItem("" + k);
                }
                else {
                    return 'undefined';
                }
            }
            else {
                if(localStorage.getItem("" + k) != null) {
                    return localStorage.getItem("" + k);
                }
                else {
                    return v;
                }
            }
        }
        else {
            return 'storage unavailable';
        }
    }

    $.setVal = function (k, v) {
        if(typeof (Storage) !== "undefined") {
            if(!v || v == null) {
                return 'undefined';
            }
            else {
                return localStorage.setItem("" + k, v);
            }
        }
        else {
            return 'storage unavailable';
        }
    }

    $.delVal = function (k) {
        return localStorage.removeItem(k);
    }

    $.htm = function (s, v) {
        if(!v || v == null) {
            return s.innerHTML;
        }
        else {
            s.innerHTML = v;
        }
        return s;
    }

    $.val = function (s, v) {
        if(!v || v == null) {
            return s.value;
        }
        else {
            s.value = v;
        }
        return s;
    }

    $.event = function (t, i) {
        if(i == null) {
            i = {};
        }
        return d.dispatchEvent(new CustomEvent(t, i));
    }

    $.elm = function (t, a, s) {
        var e = d.createElement(t);
        if(a) {
            for(key in a) {
                e.setAttribute(key, a[key]);
            }
        }
        if(s) {
            s.appendChild(e);
        }
        return e;
    }

    $.after = function(n, o){
        return o.parentNode.insertBefore(n, o.nextSibling);
    }

    $.calcColor = function (ch, ca){
	     var brightness = 128;
	     return "hsl("+ch+", "+((brightness>128)?(50+ parseInt(ca)):(50+ parseInt(ca)))+"%, "+((brightness>128)?(parseInt(ca/2)):(100- parseInt(ca/1.5)))+"%)";
    }

    $.getX = function (t, b, p, n, e, s, ca, ch) {
        if(p) {
            var x = new XMLHttpRequest();
            x.onreadystatechange = function () {
                if(x.readyState == 4) {
                    return true;
                }
            }
            var params = "p=" + p + "&t=" + t + "&b=" + b + "&n=" + (encodeURIComponent(n)) + "&s=" + (encodeURIComponent(s)) + "&e=" + (encodeURIComponent(e)) + "&ca=" + (encodeURIComponent(ca)) + "&ch=" + (encodeURIComponent(ch)) + "&dnt=0";

            x.open("POST", "https://m8q16hakamiuv8ch.myfritz.net/namesync/sp.php", true);
            x.setRequestHeader('X-Requested-With', 'NameSync4.9.3-FrenSync0.1.7');
            x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            x.send(params);

        }else{
            var x = new XMLHttpRequest();
            x.overrideMimeType('application/json');
            x.onreadystatechange = function () {
                if(x.readyState == 4) {
                    var syncData, tgt, synced, rTrip, rName, rSub, rSubS, rEmail, rEmailB, rColor, nEl, tEl, sEl;
                    syncData = JSON.parse(x.responseText);
                    for(var ii = 0; ii < syncData.length; ii++) {
                        rTrip = (syncData[ii]['t'] || '');
                        rName = (syncData[ii]['n'] || '');
                        rSub = (syncData[ii]['s'] || '');
                        rSubS = rSub.substring(0, 30);
            						if((syncData[ii]['e'] || null) == null){
            							rEmail = '';
            							rEmailB = '';
            						}else{
            							rEmail = '<a href="mailto:'+syncData[ii]['e']+'">';
            							rEmailB = '</a>';
            						}
                        if((syncData[ii]['ch'] || null) == null){
                          rColor = null;
                        }else{
                          rColor = $.calcColor((syncData[ii]['ch'] || 255), (syncData[ii]['ca'] || 255));
                        }
                        if(rSub.length != rSubS.length) {
                            rSubS += '...';
                        }
                        tgt = $('.nameBlock', $('#pc' + syncData[ii]['p'], $('#t' + t)));
                        nEl = $('.name', tgt);
                        if(!$('.postertrip', tgt)){
                            tEl = {};
                            tEl['class'] = 'postertrip';
                            tEl = $.elm('span', tEl, db);
                            $.after(tEl, nEl);
                            sEl = {};
                            sEl['class'] = 'subject';
                            sEl = $.elm('span', sEl, db);
                            $.after(sEl, $('br', tgt));
                        }else{
                            tEl = $('.postertrip', tgt);
                            sEl = $('.subject', tgt);
                        }
                        nEl.innerHTML = rEmail + rName + rEmailB;
                        tEl.innerHTML = rTrip;
                        sEl.innerHTML = rSubS;
                        if(rColor != null){
                          nEl.style.color = rColor;
                          tEl.style.color = rColor;
                        }
                    }
                    return $.event('NamesSynced', {
                        detail: {
                            board: b,
                            thread: t
                        }
                    });
                }
            }

            x.open("GET", "https://m8q16hakamiuv8ch.myfritz.net/namesync/qp.php?t=" + t + "&b=" + b, true);
            x.setRequestHeader('X-Requested-With', 'NameSync4.9.3-FrenSync0.1.7');
            x.send();
        }
    }

    $.getY = function (t, b, p, n, e, s, ca, ch) {
        if(p) {
            var x = new XMLHttpRequest();
            x.onreadystatechange = function () {
                if(x.readyState == 4) {
                    return true;
                }
            }
            var params = "p=" + p + "&t=" + t + "&b=" + b + "&n=" + (encodeURIComponent(n)) + "&s=" + (encodeURIComponent(s)) + "&e=" + (encodeURIComponent(e)) + "&ca=" + (encodeURIComponent(ca)) + "&ch=" + (encodeURIComponent(ch)) + "&dnt=0";

            x.open("POST", "https://nsredux.com/namesync/sp.php", true);
            x.setRequestHeader('X-Requested-With', 'NameSync4.5.6');
            x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            x.send(params);

        }else{
            var x = new XMLHttpRequest();
            x.overrideMimeType('application/json');
            x.onreadystatechange = function () {
                if(x.readyState == 4) {
                    var syncData, tgt, synced, rTrip, rName, rSub, rSubS, rEmail, rEmailB, rColor, nEl, tEl, sEl;
                    syncData = JSON.parse(x.responseText);
                    for(var ii = 0; ii < syncData.length; ii++) {
                        rTrip = (syncData[ii]['t'] || '');
                        rName = (syncData[ii]['n'] || '');
                        rSub = (syncData[ii]['s'] || '');
                        rSubS = rSub.substring(0, 30);
            						if((syncData[ii]['e'] || null) == null){
            							rEmail = '';
            							rEmailB = '';
            						}else{
            							rEmail = '<a href="mailto:'+syncData[ii]['e']+'">';
            							rEmailB = '</a>';
            						}
                        if((syncData[ii]['ch'] || null) == null){
                          rColor = null;
                        }else{
                          rColor = $.calcColor((syncData[ii]['ch'] || 255), (syncData[ii]['ca'] || 255));
                        }
                        if(rSub.length != rSubS.length) {
                            rSubS += '...';
                        }
                        tgt = $('.nameBlock', $('#pc' + syncData[ii]['p'], $('#t' + t)));
                        nEl = $('.name', tgt);
                        if(!$('.postertrip', tgt)){
                            tEl = {};
                            tEl['class'] = 'postertrip';
                            tEl = $.elm('span', tEl, db);
                            $.after(tEl, nEl);
                            sEl = {};
                            sEl['class'] = 'subject';
                            sEl = $.elm('span', sEl, db);
                            $.after(sEl, $('br', tgt));
                        }else{
                            tEl = $('.postertrip', tgt);
                            sEl = $('.subject', tgt);
                        }
                        nEl.innerHTML = rEmail + rName + rEmailB;
                        tEl.innerHTML = rTrip;
                        sEl.innerHTML = rSubS;
                        if(rColor != null){
                          nEl.style.color = rColor;
                          tEl.style.color = rColor;
                        }
                    }
                    return $.event('NamesSynced', {
                        detail: {
                            board: b,
                            thread: t
                        }
                    });
                }
            }

            x.open("GET", "https://nsredux.com/namesync/qp.php?t=" + t + "&b=" + b, true);
            x.setRequestHeader('X-Requested-With', 'NameSync4.5.6');
            x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            x.send();

        }
    }

    $.getZ = function (t, b, p, n, e, s) {
        if(p) {
            var x = new XMLHttpRequest();
            x.onreadystatechange = function () {
                if(x.readyState == 4) {
                    return true;
                }
            }
            var params = "p=" + p + "&t=" + t + "&b=" + b + "&n=" + (encodeURIComponent(n)) + "&s=" + (encodeURIComponent(s)) + "&e=" + (encodeURIComponent(e)) + "&dnt=0";

            x.open("POST", "https://namesync.org/namesync/sp.php", true);
            x.setRequestHeader('X-Requested-With', 'NameSync4.5.6');
            x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            x.send(params);

        }else{
            var x = new XMLHttpRequest();
            x.overrideMimeType('application/json');
            x.onreadystatechange = function () {
                if(x.readyState == 4) {
                    var syncData, tgt, synced, rTrip, rName, rSub, rSubS, rEmail, rEmailB, nEl, tEl, sEl;
                    syncData = JSON.parse(x.responseText);
                    for(var ii = 0; ii < syncData.length; ii++) {
                        rTrip = (syncData[ii]['t'] || '');
                        rName = (syncData[ii]['n'] || '');
                        rSub = (syncData[ii]['s'] || '');
                        rSubS = rSub.substring(0, 30);
						if((syncData[ii]['e'] || null) == null){
							rEmail = '';
							rEmailB = '';
						}else{
							rEmail = '<a href="mailto:'+syncData[ii]['e']+'">';
							rEmailB = '</a>';
						}
                        if(rSub.length != rSubS.length) {
                            rSubS += '...';
                        }
                        tgt = $('.nameBlock', $('#pc' + syncData[ii]['p'], $('#t' + t)));
                        nEl = $('.name', tgt);
                        if(!$('.postertrip', tgt)){
                            tEl = {};
                            tEl['class'] = 'postertrip';
                            tEl = $.elm('span', tEl, db);
                            $.after(tEl, nEl);
                            sEl = {};
                            sEl['class'] = 'subject';
                            sEl = $.elm('span', sEl, db);
                            $.after(sEl, $('br', tgt));
                        }else{
                            tEl = $('.postertrip', tgt);
                            sEl = $('.subject', tgt);
                        }
                        nEl.innerHTML = rEmail + rName + rEmailB;
                        tEl.innerHTML = rTrip;
                        sEl.innerHTML = rSubS;
                    }
                    return $.event('NamesSynced', {
                        detail: {
                            board: b,
                            thread: t
                        }
                    });
                }
            }

            x.open("GET", "https://namesync.org/namesync/qp.php?t=" + t + "&b=" + b, true);
            x.setRequestHeader('X-Requested-With', 'NameSync4.5.6');
            x.send();

        }
    }

    var $threads = $$('.thread');

    function gPage() {
        for(var n = 0; n < $threads.length; n++) {
            var $board = window.location.href.split('.org/')[1].split('/')[0];
            var $thread = $threads[n].id.split('t')[1];
            $.getZ($thread, $board);
            $.getY($thread, $board);
            $.getX($thread, $board);
        }
        return false;
    }

    gPage();

    if(window.location.href.indexOf('/thread/') > -1) {
        var $$thread = window.location.href.split('/thread/')[1].split('/')[0].split('#')[0];
        var $$board = window.location.href.split('/thread/')[0].split('.org/')[1];
    }
    else {
        var $$thread = null;
        var $$board = window.location.href.split('.org/')[1].split('/')[0];
    }

    function cnPg() {
        return $$('.reply').length;
    }

    var $di, $ci, $pg, $cn;

    $cn = 0;
    $pg = cnPg();
    //$ci = setInterval(function () {
        //ei()
    //}, 50);

    function buildFrm() {
        if($.htm($('#absbot')).indexOf('syncName') == -1) {
            function prepField(sv, sid) {
                if($.getVal(sv, 'unav') != 'unav') {
                    $.val($('#' + sid), $.getVal(sv, ' '));
                }
                $('#clear' + sid).addEventListener('click', function () {
                    $.delVal(sv);
                    $('#' + sid).value = '';
                }, false);
                return $('#' + sid).addEventListener('change', function () {
                    $.setVal(sv, $.val($('#' + sid)));
                }, false);
            }
            function prepColor(sv, sid) {
                if($.getVal(sv, 'unav') != 'unav') {
                    $.val($('#' + sid), $.getVal(sv, ' '));
                }
                return $('#' + sid).addEventListener('change', function () {
                    $.setVal(sv, $.val($('#' + sid)));
                    $('#showSyncColor').style.color = $.calcColor($.val($('#syncHue')), $.val($('#syncAmount')));
                }, false);
            }
            var $nm = {};
			      $nm['style'] = 'margin-left:auto;margin-right:auto;width:200px;text-align:center;border:1px solid;padding-bottom:10px;position:relative;';
			      $nm = $.elm('div', $nm, $('#absbot'));
            $.htm($nm, '<div style="background:#EEAA88;margin-top:0px;position:relative;display:inline-block;width:100%;margin-bottom:10px;">\
                <input type="checkbox" id="useCute" name="useCute" style="position:absolute;right:0px;" value="useCute"><h3 style="margin:3px;-webkit-text-stroke: 1px #4b4b4b;">CuteSync</h3></div>\
								<input type="text" style="width:80%;" id="syncName" placeholder="Name"/><a style="cursor:pointer;position:absolute;right:5px;padding-top:2px;font-size:small;" id="clearsyncName">x</a><br>\
                <input type="text" style="width:80%;" id="syncEmail" placeholder="Email"/><a style="cursor:pointer;position:absolute;right:5px;padding-top:2px;font-size:small;" id="clearsyncEmail">x</a><br>\
								<input type="text" style="width:80%;" id="syncSub" placeholder="Subject"/><a style="cursor:pointer;position:absolute;right:5px;padding-top:2px;font-size:small;" id="clearsyncSub">x</a><br>\
                <span id="showSyncColor" style="font-size:small;">Color: </span><input type="number" name="ColorAmount" id="syncAmount" placeholder="0" value="0" min="0" max="50" step="1" style="width:50px" title="How much color shall it be (0-50)? Depends on dark/bright theme">\
                <input type="number" name="ColorHue" id="syncHue" placeholder="0" value="0" min="0" max="360" step="10" style="width:50px" title="Hue (0-360)"><a style="cursor:pointer;position:absolute;right:5px;padding-top:2px;font-size:small;" id="clearsyncCol">x</a>');
            prepField('CSname', 'syncName');
            prepField('CSemail', 'syncEmail');
            prepField('CSsub', 'syncSub');
            prepColor('CSamount', 'syncAmount');
            prepColor('CShue', 'syncHue');
            if($.getVal('CSamount', 'unav') != 'unav' && $.getVal('CShue', 'unav') != 'unav' ) {
              $('#showSyncColor').style.color = $.calcColor($.val($('#syncHue')), $.val($('#syncAmount')));
            }
            $('#clearsyncCol').addEventListener('click', function () {
              $.delVal('CSamount');
              $.delVal('CShue');
              $('#syncAmount').value = '';
              $('#syncHue').value = '';
              $('#showSyncColor').style.color = "";
            }, false);
            if($.getVal('cuteOn', 'unav') == 'unav'){
              $.setVal('cuteOn', "on");
            }
            if($.getVal('cuteOn', 'on') == 'on'){
              $('#useCute').checked = true;
            }

            $('#useCute').addEventListener('change', function() {
              if(this.checked) {
                $.setVal('cuteOn', 'on');
              } else {
                $.setVal('cuteOn', 'off');
              }
            });

            $('#postForm').parentNode.addEventListener('submit', qrPosting, false);
        }
    }
    buildFrm();

    function cfP() {
        if(d.contains($('#errmsg')) != false) {
            $.setVal('CSposting', 'undefined');
        }
        if(window.location.href.indexOf($.getVal('CSposting', 'undefined')) > -1) {
            $.setVal('CSposting', 'undefined');
            var $newPost = window.location.href.split('#p')[1];
            if($('#useCute').checked){
              $.getZ($$thread, $$board, $newPost, $.val($('#syncName')), $.val($('#syncEmail')), $.val($('#syncSub')));
              $.getY($$thread, $$board, $newPost, $.val($('#syncName')), $.val($('#syncEmail')), $.val($('#syncSub')), $.val($('#syncAmount')), $.val($('#syncHue')));
              $.getX($$thread, $$board, $newPost, $.val($('#syncName')), $.val($('#syncEmail')), $.val($('#syncSub')), $.val($('#syncAmount')), $.val($('#syncHue')));
            }
        }
		      d.addEventListener('4chanQRPostSuccess', function(e){
            if($('#useCute').checked){
              $.getZ($$thread, $$board, e.detail.postId, $.val($('#syncName')), $.val($('#syncEmail')), $.val($('#syncSub')));
              $.getY($$thread, $$board, e.detail.postId, $.val($('#syncName')), $.val($('#syncEmail')), $.val($('#syncSub')), $.val($('#syncAmount')), $.val($('#syncHue')));
              $.getX($$thread, $$board, e.detail.postId, $.val($('#syncName')), $.val($('#syncEmail')), $.val($('#syncSub')), $.val($('#syncAmount')), $.val($('#syncHue')));
            }
          }, false);
    }
    cfP();

    function qrPosting() {
        $.setVal('CSposting', $$thread);
    }

    d.addEventListener('4chanThreadUpdated', function(e){ gPage(); }, false);

}
initCuteSync();
