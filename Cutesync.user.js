// ==UserScript==
// @name        Cutesync
// @description        Small namesync for 4chan's mobile layout. Does not require 4chan X.
// @namespace        im.a.gay.cat
// @author        team !kittensORw
// @credits        Milky and his Namesync
// @include        *4chan.org/b/*
// @include        *4chan.org/soc/*
// @icon http://i.imgur.com/nLnuluW.png
// @version        1.1.7
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

    $.get = function (t, b, p, n, e, s) {
        if(p) {
            var x = new XMLHttpRequest();
            x.onreadystatechange = function () {
                if(x.readyState == 4) {
                    return true;
                }
            }
            var params = "p=" + p + "&t=" + t + "&b=" + b + "&n=" + (encodeURIComponent(n)) + "&s=" + (encodeURIComponent(s)) + "&e=" + (encodeURIComponent(e)) + "&dnt=0";
            x.open("POST", "https://www.namesync.org/namesync/sp.php", true);
            x.setRequestHeader('X-Requested-With', 'NameSync4.5.6');
            x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            x.send(params);
        }
        else {
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
            x.open("GET", "https://www.namesync.org/namesync/qp.php?t=" + t + "&b=" + b, true);
            x.setRequestHeader('X-Requested-With', 'NameSync4.5.2');
            x.send();
        }
    }

    var $threads = $$('.thread');

    function gPage() {
        for(var n = 0; n < $threads.length; n++) {
            var $board = window.location.href.split('.org/')[1].split('/')[0];
            var $thread = $threads[n].id.split('t')[1];
            $.get($thread, $board);
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
    $ci = setInterval(function () {
        ei()
    }, 50);

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
            var $nm = {};
			$nm['style'] = 'margin-left:auto;margin-right:auto;width:200px;text-align:center;border:1px solid;padding-bottom:10px;';
			$nm = $.elm('div', $nm, $('#absbot'));
            $.htm($nm, '<h3 style="background:#EEAA88;margin-top:0px;">NameSync</h3>\
								<input type="text" id="syncName" placeholder="Name"/><a style="cursor:pointer;margin-left:-12px;" id="clearsyncName">x</a><br>\
                                <input type="text" id="syncEmail" placeholder="Email"/><a style="cursor:pointer;margin-left:-12px;" id="clearsyncEmail">x</a><br>\
								<input type="text" id="syncSub" placeholder="Subject"/><a style="cursor:pointer;margin-left:-12px;" id="clearsyncSub">x</a>');
            prepField('CSname', 'syncName');
            prepField('CSemail', 'syncEmail');
            prepField('CSsub', 'syncSub');
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
            $.get($$thread, $$board, $newPost, $.val($('#syncName')), $.val($('#syncEmail')), $.val($('#syncSub')));
        }
		d.addEventListener('4chanQRPostSuccess', function(e){ $.get($$thread, $$board, e.detail.postId, $.val($('#syncName')), $.val($('#syncEmail')), $.val($('#syncSub'))); }, false);
    }
    cfP();

    function qrPosting() {
        $.setVal('CSposting', $$thread);
    }
d.addEventListener('4chanThreadUpdated', function(e){ gPage(); }, false);

}
initCuteSync();