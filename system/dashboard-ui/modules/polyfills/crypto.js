globalThis.crypto||(globalThis.crypto={}),crypto.randomUUID||(crypto.getRandomValues?crypto.randomUUID=function(){return([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,function(c){return(c^crypto.getRandomValues(new Uint8Array(1))[0]&15>>c/4).toString(16)})}:crypto.randomUUID=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c){var r=16*Math.random()|0;return("x"===c?r:3&r|8).toString(16)})});