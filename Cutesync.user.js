// ==UserScript==
// @name	Cutesync
// @description	Tiny, read-only namesync for 4chan's mobile layout. Does not require 4chan X.
// @namespace	im.a.gay.cat
// @author	team !kittensORw
// @credits	Milky and his Namesync
// @include	*4chan.org/b/*
// @include	*4chan.org/soc/*
// @version	1.0.1
// ==/UserScript==

function initCutesync(){

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
                
        $.get = function(t, b){
				var x = new XMLHttpRequest();
				x.overrideMimeType('application/json');
				x.onreadystatechange = function () {
					if (x.readyState == 4) {
						var syncData, tgt, synced, rTrip, rName;
						syncData = JSON.parse(x.responseText);
						for(var ii=0; ii < syncData.length; ii++){
							rTrip = (syncData[ii]['t'] || '');
							rName = (syncData[ii]['n'] || 'Anonymous');
							tgt = $('.name', $('#pc'+syncData[ii]['p'], $('#t'+t)));
							synced = $.htm(tgt, rName + ' <span style="font-weight:normal;">' + rTrip + '</span>');
						}
						return x.responseText;
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
		}
		gPage();
		
		var $di, $ci;
		
		$ci = setInterval(function(){ei()},100);
		
		function ei(){
			if($.htm($('.mobile-tu-status')) == 'Updating...'){
				$di = setInterval(function(){bi()},100);
				clearInterval($ci);
			}
		}
		
		function bi(){
			if($.htm($('.mobile-tu-status')) != 'Updating...'){
				gPage();
				$ci = setInterval(function(){ei()},100);
				clearInterval($di);
			}
		}

} document.addEventListener("DOMContentLoaded", initCutesync, false);