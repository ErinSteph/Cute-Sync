// ==UserScript==
// @name	Cutesync
// @description	Tiny, read-only namesync for 4chan's mobile layout. Does not require 4chan X.
// @namespace	im.a.gay.cat
// @author	team !kittensORw
// @credits	Milky and his Namesync
// @include	*4chan.org/b/*
// @include	*4chan.org/soc/*
// @icon    http://i.imgur.com/nLnuluW.png
// @version	1.0.4
// ==/UserScript==

function initCuteSync(){

        var d, db, $, $$;

        d = document;
        db = document.body;

        $ = function(s, p){
			if(!p || p == null){
					p = db;
			}
			return p.querySelector(s);
		}        
                
        $$ = function(s, p){
			if(!p || p == null){
					p = db;
			}
			return p.querySelectorAll(s);
		}                
                
        $.htm = function(s, v){
			if(!v || v == null){
					return s.innerHTML;
			}else{
					s.innerHTML = v;
			}
			return s;
		}
				
		$.event = function(t, i) {
			if (i == null) {
				i = {};
			}
			return d.dispatchEvent(new CustomEvent(t, i));
		}                
                
        $.get = function(t, b){
			var x = new XMLHttpRequest();
			x.overrideMimeType('application/json');
			x.onreadystatechange = function () {
				if (x.readyState == 4) {
					var syncData, tgt, synced, rTrip, rName, rSub, rSubS;
					syncData = JSON.parse(x.responseText);
					for(var ii=0; ii < syncData.length; ii++){
						rTrip = (syncData[ii]['t'] || '');
						rName = (syncData[ii]['n'] || '');
						rSub = (syncData[ii]['s'] || '');
						rSubS = rSub.substring(0,30); 
						if(rSub.length != rSubS.length){
							rSubS = rSubS + '...';
						}
						tgt = $('.nameBlock', $('#pc'+syncData[ii]['p'], $('#t'+t)));
						synced = $.htm(tgt, '<span class="name">' + rName + '</span> <span class="postertrip">' + rTrip + '</span><br><span class="subject"><span title="' + rSub + '">' + rSubS + '</span></span>');
					}
					return $.event('NamesSynced', { detail: { board: b, thread: t } });
				}
			}
			x.open("GET", "https://www.namesync.org/namesync/qp.php?t="+t+"&b="+b, true);
			x.setRequestHeader('X-Requested-With', 'NameSync4.5.2');
			x.send();
		}

        var $threads = $$('.thread');
        
		function gPage(){
			for(var n=0; n < $threads.length; n++){
					var $board = window.location.href.split('.org/')[1].split('/')[0];        
					var $thread = $threads[n].id.split('t')[1];        
					$.get($thread, $board);
			}
			return false;
		}
		
		gPage();
		
		var $di, $ci;
		
		$ci = setInterval(function(){ei()},50);
		
		function ei(){
			if($.htm($('.mobile-tu-status')) == 'Updating...'){
				$di = setInterval(function(){bi()},100);
				clearInterval($ci);
			}
			return false;
		}
		
		function bi(){
			if($.htm($('.mobile-tu-status')) != 'Updating...'){
				gPage();
				$ci = setInterval(function(){ei()},50);
				clearInterval($di);
				return $.event('ThreadUpdate', { detail: { board: b, thread: t } });
			}
			return false;
		}


}
initCuteSync();