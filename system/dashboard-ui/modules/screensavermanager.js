define(["exports","./dom.js","./common/servicelocator.js","./common/playback/playbackmanager.js","./emby-apiclient/connectionmanager.js","./common/inputmanager.js","./emby-apiclient/events.js","./common/pluginmanager.js","./common/usersettings/usersettings.js","./common/methodtimer.js","./input/mouse.js"],function(_exports,_dom,_servicelocator,_playbackmanager,_connectionmanager,_inputmanager,_events,_pluginmanager,_usersettings,_methodtimer,_mouse){Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0;var isPlayingVideo,lastFunctionalEvent=0;function getCurrentPlugin(){for(var option=function(){try{return _usersettings.default.screensaver()}catch(err){return null}}(),plugins=_pluginmanager.default.ofType("screensaver"),i=0,length=plugins.length;i<length;i++){var plugin=plugins[i];if(plugin.id===option)return plugin}return null}function ScreenSaverManager(){this.onInputFn=function(e){e.preventDefault(),this.hide()}.bind(this),this.hideFn=this.hide.bind(this),_events.default.on(_usersettings.default,"change",function(e,name){"screensaver"===name&&this.resetInterval()}.bind(this)),_events.default.on(_connectionmanager.default,"localusersignedin",function(e){lastFunctionalEvent=Date.now(),this.resetInterval()}.bind(this)),_events.default.on(_connectionmanager.default,"localusersignedout",function(e){lastFunctionalEvent=Date.now(),this.resetInterval()}.bind(this));var apiClient=_connectionmanager.default.currentApiClient();apiClient&&apiClient.getCurrentUserId()&&this.resetInterval()}function onReject(){}_events.default.on(_playbackmanager.default,"playbackstart",function(e,player,state){(isPlayingVideo=player.isLocalPlayer&&state.NowPlayingItem&&"Audio"!==state.NowPlayingItem.MediaType)&&(lastFunctionalEvent=Date.now())}),_events.default.on(_playbackmanager.default,"playbackstop",function(e,stopInfo){isPlayingVideo&&!stopInfo.nextMediaType&&(lastFunctionalEvent=Date.now(),isPlayingVideo=!1)}),ScreenSaverManager.prototype.resetInterval=function(){getCurrentPlugin()?this.setInterval():this.clearInterval()},ScreenSaverManager.prototype.setInterval=function(){this.interval||_servicelocator.appHost.supports("screensaver")&&(this.interval=new _methodtimer.default({onInterval:function(){var now,doc;this.isShowing()||isPlayingVideo||(now=Date.now())-lastFunctionalEvent<3e5||"hidden"===(doc=document).visibilityState||!doc.hasFocus()||_inputmanager.default.idleTime()<3e5||now-_mouse.default.lastMouseInputTime()<3e5||this.show()}.bind(this),timeoutMs:3e4,type:"interval"}))},ScreenSaverManager.prototype.clearInterval=function(){var interval=this.interval;interval&&(this.interval=null,interval.destroy())},ScreenSaverManager.prototype.showScreenSaver=function(screensaver){this.activeScreenSaver||(console.log("Showing screensaver "+screensaver.name),screensaver.show(),this.activeScreenSaver=screensaver,this.removeHideEventListeners(),this.addHideEventListeners(),screensaver=this.onInputFn,_inputmanager.default.on(window,screensaver))},ScreenSaverManager.prototype.isShowing=function(){return null!=this.activeScreenSaver},ScreenSaverManager.prototype.show=function(){this.isShowing()||getCurrentPlugin()&&require(["registrationServices"]).then(function(deps){return deps[0].validateFeature("screensaver",{showDialog:!1})}).then(function(){var screensaver=getCurrentPlugin();screensaver&&this.showScreenSaver(screensaver)}.bind(this),onReject)},ScreenSaverManager.prototype.addHideEventListeners=function(){var hideFn=this.hideFn;_dom.default.addEventListener(window,"click",hideFn,{capture:!0,passive:!0}),_dom.default.addEventListener(window,"mousemove",hideFn,{capture:!0,passive:!0})},ScreenSaverManager.prototype.removeHideEventListeners=function(){var hideFn=this.hideFn;_dom.default.removeEventListener(window,"click",hideFn,{capture:!0,passive:!0}),_dom.default.removeEventListener(window,"mousemove",hideFn,{capture:!0,passive:!0})},ScreenSaverManager.prototype.hide=function(){lastFunctionalEvent=Date.now();var screensaver=this.activeScreenSaver;screensaver&&(this.activeScreenSaver=null,console.log("Hiding screensaver"),screensaver.hide(),console.log("unbind "+Date.now()),this.removeHideEventListeners(),screensaver=this.onInputFn,_inputmanager.default.off(window,screensaver))};_exports.default=new ScreenSaverManager});