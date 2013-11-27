// ==UserScript==
// @name	Cutesync
// @description	Tiny, read-only namesync for 4chan's mobile layout. Does not require 4chan X.
// @namespace	im.a.gay.cat
// @author	team !kittensORw
// @credits	Milky and his Namesync
// @include	*4chan.org/b/*
// @include	*4chan.org/soc/*
// @icon    http://i.imgur.com/nLnuluW.png
// @version	1.1.2
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
		
		    $.getVal = function(k, v){
                    if(typeof(Storage) !=="undefined"){
                            if(!v || v == null){
								if(localStorage.getItem("" + k) != null){
                                    return localStorage.getItem("" + k);
								}else{
									return 'undefined';
								}
                            }else{
                                if(localStorage.getItem("" + k) != null){
                                    return localStorage.getItem("" + k);
								}else{
									return v;
								}
                            }
                    }else{
                            return 'storage unavailable';
                    }
            }
           
    $.setVal = function(k, v){
                    if(typeof(Storage) !=="undefined"){
                            if(!v || v == null){
                                    return 'undefined';
                            }else{
                                    return localStorage.setItem("" + k, v);
                            }
                    }else{
                            return 'storage unavailable';
                    }
            }
           
    $.delVal = function(k){
                    return localStorage.removeItem(k);
            }
                
        $.htm = function(s, v){
			if(!v || v == null){
					return s.innerHTML;
			}else{
					s.innerHTML = v;
			}
			return s;
		}
		
		    $.val = function(s, v){
                    if(!v || v == null){
                            return s.value;
                    }else{
                            s.value = v;
                    }
                    return s;
            }
				
		$.event = function(t, i) {
			if (i == null) {
				i = {};
			}
			return d.dispatchEvent(new CustomEvent(t, i));
		} 
		
		    $.elm = function(t, a, s){
                    var e = d.createElement(t);
                    if(a){
                            for (key in a){
                                    e.setAttribute(key, a[key]);
                            }
                    }
                    if(s){
                            s.appendChild(e);
                    }
                    return e;
           }
                
        $.get = function(t, b, p, n, e, s){
            if(p){           
                var x = new XMLHttpRequest();
    			x.onreadystatechange = function () {
    				if (x.readyState == 4) {
                        return true;
    				}
    			}
    			var params = "p=" + p + "&t=" + t + "&b=" + b + "&n="  + (encodeURIComponent(n)) + "&s="  + (encodeURIComponent(s)) + "&e="  + (encodeURIComponent(e)) + "&dnt=0";
    			x.open("POST", "https://www.namesync.org/namesync/sp.php", true);
    			x.setRequestHeader('X-Requested-With', 'NameSync4.5.2');
    			x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    			x.send(params);         
            }else{     
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
		
		if(window.location.href.indexOf('/res/') > -1){
		  var $$thread = window.location.href.split('/res/')[1].split('#')[0];
		  var $$board = window.location.href.split('/res/')[0].split('.org/')[1];
		}else{
		  var $$thread = null;
		   var $$board = window.location.href.split('.org/')[1].split('/')[0];
		}
		
		function cnPg(){
		  return $$('.reply').length;
		}
		
		var $di, $ci, $pg, $cn;
		
		$cn = 0;			
		$pg = cnPg();		
		$ci = setInterval(function(){ei()},50);
		
		function buildFrm(){
		  if($.htm($('#postForm')).indexOf('syncName') == -1){ 
    		  $nm = {};
    		  $nm['id'] = 'syncNameC';
    		  $nm['class'] = 'syncNameC';
    		  $nm = $.elm('tr', $nm, $('tbody', $('#postForm')));
    		  $.htm($nm, '<td>Namesync</td><input type="text" id="syncName" placeholder="Name"/><input type="text" id="syncEmail" placeholder="Email"/><input type="text" id="syncSub" placeholder="Subject"/>');
    		  if($.getVal('CSname', 'unav') != 'unav'){$.val($('#syncName'), $.getVal('CSname', ' '));}
    		  if($.getVal('CSemail', 'unav') != 'unav'){$.val($('#syncEmail'), $.getVal('CSemail', ' '));}
    		  if($.getVal('CSsub', 'unav') != 'unav'){$.val($('#syncSub'), $.getVal('CSsub', ' '));}
    		  $('#syncName').addEventListener('change', function(){ $.setVal('CSname', $.val($('#syncName'))); }, false);
    		  $('#syncEmail').addEventListener('change', function(){ $.setVal('CSemail', $.val($('#syncEmail'))); }, false);
    		  $('#syncSub').addEventListener('change', function(){ $.setVal('CSsub', $.val($('#syncSub'))); }, false);
    		  $('#postForm').parentNode.addEventListener('submit', qrPosting, false);
		  }
		}
		buildFrm();	
		
		function checkforP(){
    		  if(window.location.href.indexOf($.getVal('CSposting', 'undefined')) > -1){
    		      $.setVal('CSposting', 'undefined');
    		      var $newPost = window.location.href.split('#p')[1];
                  $.get($$thread, $$board, $newPost, $.val($('#syncName')), $.val($('#syncEmail')), $.val($('#syncSub'))); 		      
    		  }
		}
		checkforP();
		
		function qrPosting(){
		  $.setVal('CSposting', $$thread);
		}
		
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
				if(cnPg() != $pg){
				    $cn = cnPg() - $pg;
				    $pg = cnPg();
				    return $.event('ThreadUpdate', { detail: { board: b, thread: t, count: $cn } });
				}
			    return false;
			}
			return false;
		}


}
initCuteSync();