// ==UserScript==
// @name	Cutesync 
// @namespace	im.a.gay.cat
// @author	team !kittensORw
// @credits	Milky and his Namesync
// @include	*4chan.org/b/*
// @include	*4chan.org/soc/*
// @version	1.0.0
// ==/UserScript==

function init(){

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
					syncData = JSON.parse(x.responseText);
					for(var ii=0; ii < syncData.length; ii++){
							var tgt = $('.name', $('#pc'+syncData[ii]['p'], $('#t'+t)));
							var synced = $.htm(tgt, (syncData[ii]['n'] || 'Anonymous') + ' <span style="font-weight:normal;">' + syncData[ii]['t'] + '</span>');
					}
					return x.responseText;
				}
			}
			x.open("GET", "https://www.namesync.org/namesync/qp.php?t="+t+"&b="+b, true);
			x.setRequestHeader('X-Requested-With', 'NameSync4.5.2');
			x.send();
	}

	var $threads = $$('.thread');

	for(var n=0; n < $threads.length; n++){
		var $board = window.location.href.split('.org/')[1].split('/')[0];	
		var $thread = $threads[n].id.split('t')[1];	
		$.get($thread, $board);
	}

} document.addEventListener("DOMContentLoaded", init, false);