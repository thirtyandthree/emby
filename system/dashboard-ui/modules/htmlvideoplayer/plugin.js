define(["exports","./../htmlvideoplayer/htmlmediahelper.js","./../htmlvideoplayer/basehtmlplayer.js","./../emby-apiclient/events.js","./../emby-apiclient/connectionmanager.js","./../approuter.js","./../browser.js","./../common/globalize.js","./../common/usersettings/usersettings.js","./../common/subtitleappearancehelper.js","./../common/playback/playbackmanager.js","./../layoutmanager.js"],function(_exports,_htmlmediahelper,_basehtmlplayer,_events,_connectionmanager,_approuter,_browser,_globalize,_usersettings,_subtitleappearancehelper,_playbackmanager,_layoutmanager){var WebVTT,supportedFeatures;function getMediaStreamTracks(mediaSource,type){return mediaSource.MediaStreams.filter(function(s){return s.Type===type})}function getMediaStreamSubtitleTracks(mediaSource){return mediaSource.MediaStreams.filter(function(s){return"Subtitle"===s.Type})}function setTracks(elem,tracksHtml){elem.innerHTML=tracksHtml}function getTextTrackUrl(track,item,mediaSource){return window.Windows&&mediaSource.IsLocal&&track.Path?Windows.Storage.StorageFile.getFileFromPathAsync(track.Path).then(function(file){file=URL.createObjectURL(file,{oneTimeOnly:!0});return Promise.resolve(file)}):mediaSource.IsLocal&&track.Path?Promise.resolve(track.Path):(mediaSource=_playbackmanager.default.getSubtitleUrl(track,item.ServerId),Promise.resolve(mediaSource))}function renderCues(instance,cues){var subtitleTextElement=instance.videoSubtitlesElem;subtitleTextElement&&WebVTT?WebVTT.processCues(window,cues,subtitleTextElement,instance.webVTTStyleOptions):console.log("renderCues: nothing to do")}function HtmlVideoPlayer(){_basehtmlplayer.default.call(this),this.name="Video Player",this.id="htmlvideoplayer",this.mediaType="video";var videoDialog,subtitleTrackIndexToSetOnPlaying,audioTrackIndexToSetOnPlaying,currentClock,currentAssRenderer,currentTrackEvents,initialSubtitleTrackTimeout,customTrackIndex=-(this.priority=1),self=this;function sortDefaultTracksFirst(trackA,trackB){return trackA.IsDefault===trackB.IsDefault?0:trackA.IsDefault?-1:trackB.IsDefault?1:0}function onEnded(){destroyCustomTrack(this),_htmlmediahelper.default.onEndedInternal(self,this)}function onTimeUpdate(e){var time,elem;self._started&&((time=this.currentTime)&&!self._timeUpdated&&(self._timeUpdated=!0,(elem=this)!==self._mediaElement||0!==elem.videoWidth||0!==elem.videoHeight||(elem=(self._currentPlayOptions||{}).mediaSource)&&!getMediaStreamTracks(elem,"Video").length||_htmlmediahelper.default.onErrorInternal(self,"mediadecodeerror")),self._currentTime=time,(elem=self._currentPlayOptions)&&(time=1e3*time-self._currentSubtitleOffset,time+=(elem.transcodingOffsetTicks||0)/1e4,function(instance,timeMs){var clock=currentClock;if(clock)try{clock.seek(timeMs/1e3)}catch(err){console.log("Error in libjass: "+err)}else{var trackEvents=currentTrackEvents;if(trackEvents){for(var seconds=timeMs/1e3,activeCues=[],i=0;i<trackEvents.length;i++){var currentTrackEvent=trackEvents[i];if(currentTrackEvent.startTime<=seconds&&currentTrackEvent.endTime>=seconds){activeCues.push(currentTrackEvent);break}}renderCues(instance,activeCues)}}}(self,time)),_events.default.trigger(self,"timeupdate"))}function onVolumeChange(){self.saveVolume(this.volume),_events.default.trigger(self,"volumechange")}function onRateChange(){_events.default.trigger(self,"playbackratechange")}function setInitialSubtitleTrack(){var index=subtitleTrackIndexToSetOnPlaying;null!=index&&(console.log("setInitialSubtitleTrack"),setCurrentTrackElement(self._mediaElement,index,self._currentPlayOptions))}function startInitialSubtitleTrackTimeout(){initialSubtitleTrackTimeout&&(clearTimeout(initialSubtitleTrackTimeout),initialSubtitleTrackTimeout=null),null!=subtitleTrackIndexToSetOnPlaying&&(initialSubtitleTrackTimeout=setTimeout(setInitialSubtitleTrack,400))}function setInitialAudioTrack(){var index=audioTrackIndexToSetOnPlaying;null!=index&&self.canSetAudioStreamIndex()&&self.setAudioStreamIndex(index)}function onPlaying(e){self._started||(self._started=!0,self.seekOnPlaybackStart(e.target,self._currentPlayOptions.playerStartPositionTicks),startInitialSubtitleTrackTimeout(),null!=audioTrackIndexToSetOnPlaying&&setTimeout(setInitialAudioTrack,300)),_events.default.trigger(self,"playing")}function onWaiting(e){_events.default.trigger(self,"waiting")}function onAddTrack(e){e=e.track;console.log("onAddTrack: "+e.id+", language: "+e.language+", kind: "+e.kind+", label: "+e.label),startInitialSubtitleTrackTimeout()}function onRemoveTrack(e){e=e.track;console.log("onRemoveTrack: "+e.id+", language: "+e.language+", kind: "+e.kind+", label: "+e.label)}function onPlay(e){_events.default.trigger(self,"unpause")}function onClick(){_events.default.trigger(self,"click")}function onDblClick(){_events.default.trigger(self,"dblclick")}function onPause(){_events.default.trigger(self,"pause")}function destroyCustomTrack(videoElement){if(self._resizeObserver&&(self._resizeObserver.disconnect(),self._resizeObserver=null),self.videoSubtitlesElem){var elem=self.videoSubtitlesElem;try{elem.remove()}catch(err){console.log("Error removing dialog element: "+err)}self.videoSubtitlesElem=null}if(currentTrackEvents=null,videoElement)for(var allTracks=videoElement.textTracks||[],i=0;i<allTracks.length;i++){var currentTrack=allTracks[i];-1!==currentTrack.label.indexOf("manualTrack")&&(currentTrack.mode="disabled")}customTrackIndex=-1,currentClock=null,self._currentSubtitleOffset=0;elem=self.currentSubtitlesOctopus;elem&&(elem.dispose(),self.currentSubtitlesOctopus=null),currentAssRenderer&&currentAssRenderer.setEnabled(!1),currentAssRenderer=null}function loadWebVTT(){return Emby.importModule("./modules/webvtt/vtt.js").then(function(response){return WebVTT=response})}function fetchSubtitleContent(url,returnNullIfHttps){return returnNullIfHttps&&url.toLowerCase().startsWith("https://")?Promise.resolve(null):new Promise(function(resolve,reject){var xhr=new XMLHttpRequest;xhr.open("GET",url,!0),xhr.onload=function(e){resolve(this.response)},xhr.onerror=reject,xhr.send()})}function fetchVttSubtitles(track,item,mediaSource){track=[getTextTrackUrl(track,item,mediaSource),loadWebVTT()];return Promise.all(track).then(function(responses){var url=responses[0],WebVTT=responses[1];return fetchSubtitleContent(url).then(function(vtt){return new Promise(function(resolve,reject){var parser=new WebVTT.Parser(window,WebVTT.StringDecoder()),cues=[];parser.oncue=function(cue){cues.push(cue)},parser.onflush=function(){resolve(cues)},parser.parse(vtt),parser.flush()})})})}function setTrackForCustomDisplay(videoElement,track){var item,currentPlayOptions;track?customTrackIndex!==track.Index&&(item=(currentPlayOptions=self._currentPlayOptions).item,currentPlayOptions=currentPlayOptions.mediaSource,destroyCustomTrack(videoElement),customTrackIndex=track.Index,function(videoElement,track,item,mediaSource){if(!mediaSource.IsLocal||track.IsExternal){var format=(track.Codec||"").toLowerCase();if("ssa"===format||"ass"===format)return function(videoElement,track,item,mediaSource){(window.Worker&&function(){var elem=document.createElement("canvas");return elem.getContext&&elem.getContext("2d")}()&&!_browser.default.web0s?function(videoElement,track,item,mediaSource){getTextTrackUrl(track,item,mediaSource).then(function(textTrackUrl){Promise.all([fetchSubtitleContent(textTrackUrl,!0),Emby.importModule("./bower_components/javascriptsubtitlesoctopus/dist/subtitles-octopus.js"),loadWebVTT()]).then(function(responses){var subContent=responses[0],canvasParent=(ensureCustomSubtitlesElement(videoElement),self.videoSubtitlesElem),canvas=(canvasParent.classList.add("htmlvideo-subtitles-canvas-parent","flex","align-items-flex-start","justify-content-center"),canvasParent.querySelector("canvas")),responses=(canvas||((canvas=document.createElement("canvas")).classList.add("htmlvideo-subtitles-canvas"),canvasParent.appendChild(canvas)),responses[1]);self.currentSubtitlesOctopus=new responses({video:videoElement,subUrl:subContent?null:textTrackUrl,subContent:subContent,workerUrl:_approuter.default.baseUrl()+"/bower_components/javascriptsubtitlesoctopus/dist/subtitles-octopus-worker.js",legacyWorkerUrl:_approuter.default.baseUrl()+"/bower_components/javascriptsubtitlesoctopus/dist/subtitles-octopus-worker-legacy.js",fonts:function(track){var fonts=[];!function(track){var langsNotNeedingFont,track=(track.Language||"").toLowerCase();return!track||!(langsNotNeedingFont=["dut","nld","nl","eng","en","en-us","en-gb","fin","fi","fre","fra","fr","ger","deu","de","heb","he","hun","hu","ita","it","nor","no","pol","pl","por","pt","pob","pt-br","rus","ru","spa","es","es-mx","es-419","swe","sv"]).includes(track)&&!langsNotNeedingFont.includes(track.split("-")[0])}(track)||fonts.push(_approuter.default.baseUrl()+"/modules/fonts/GoNotoKurrent.woff2");return fonts}(track),onError:function(){_htmlmediahelper.default.onErrorInternal(self,"mediadecodeerror")},lossyRender:null!=window.createImageBitmap,detectAlphaBug:!_browser.default.chromecast,canvas:canvas,canvasParent:canvasParent}),self._resizeObserver||(self._resizeObserver=new ResizeObserver(onVideoResize,{}),self._resizeObserver.observe(videoElement))})})}:function(videoElement,track,item,mediaSource){var rendererSettings={enableSvg:!1};Emby.importModule("./modules/libjass/libjass.js").then(function(libjass){getTextTrackUrl(track,item,mediaSource).then(function(textTrackUrl){libjass.ASS.fromUrl(textTrackUrl).then(function(ass){var clock=new libjass.renderers.ManualClock,renderer=(currentClock=clock,new libjass.renderers.WebRenderer(ass,clock,videoElement.parentNode,rendererSettings));(currentAssRenderer=renderer).addEventListener("ready",function(){try{renderer.resize(videoElement.offsetWidth,videoElement.offsetHeight,0,0),self._resizeObserver||(self._resizeObserver=new ResizeObserver(onVideoResize,{}),self._resizeObserver.observe(videoElement))}catch(ex){}})},function(e){_htmlmediahelper.default.onErrorInternal(self,"mediadecodeerror")})})})})(videoElement,track,item,mediaSource)}(videoElement,track,item,mediaSource)}if(function(){if(_browser.default.web0s&&_browser.default.sdkVersion&&_browser.default.sdkVersion<3)return 1;return}())!function(videoElement,track,item,mediaSource){fetchVttSubtitles(track,item,mediaSource).then(function(cues){ensureCustomSubtitlesElement(videoElement),currentTrackEvents=cues})}(videoElement,track,item,mediaSource);else{var i,length,trackElement=null,expectedId="manualTrack"+track.Index,allTracks=videoElement.textTracks;for(i=0;i<allTracks.length;i++){var currentTrack=allTracks[i];if(currentTrack.label===expectedId){trackElement=currentTrack;break}currentTrack.mode="disabled",removeCueEvents(currentTrack)}trackElement?(trackElement.mode="hidden",addCueEvents(videoElement,trackElement)):(trackElement=videoElement.addTextTrack("subtitles","manualTrack"+track.Index,track.Language||"und"),fetchVttSubtitles(track,item,mediaSource).then(function(cues){for(console.log("downloaded "+cues.length+" track events"),i=0,length=cues.length;i<length;i++){var trackEvent=cues[i],trackEvent=new(window.VTTCue||window.TextTrackCue)(trackEvent.startTime,trackEvent.endTime,trackEvent.text);trackElement.addCue(trackEvent)}trackElement.mode="hidden",addCueEvents(videoElement,trackElement)}))}}(videoElement,track,item,currentPlayOptions)):destroyCustomTrack(videoElement)}function onVideoResize(){_browser.default.iOS||_browser.default.osx?setTimeout(resetVideoRendererSize,500):resetVideoRendererSize()}function resetVideoRendererSize(){var width,videoElement,subtitlesOctopus=self.currentSubtitlesOctopus,subtitlesOctopus=(subtitlesOctopus&&subtitlesOctopus.resize(),currentAssRenderer);subtitlesOctopus&&(width=(videoElement=self._mediaElement).offsetWidth,videoElement=videoElement.offsetHeight,console.log("videoElement resized: "+width+"x"+videoElement),subtitlesOctopus.resize(width,videoElement,0,0))}function ensureCustomSubtitlesElement(videoElement){if(!self.videoSubtitlesElem){var subtitlesContainer=document.createElement("div"),appearanceSettings=(subtitlesContainer.classList.add("videoSubtitles"),_layoutmanager.default.tv&&subtitlesContainer.classList.add("videoSubtitles-tv"),self.videoSubtitlesElem=subtitlesContainer,_usersettings.default.getSubtitleAppearanceSettings()),subtitleStyles=_subtitleappearancehelper.default.getStyleObjects(appearanceSettings);if(null!=appearanceSettings.positionTop)try{document.documentElement.style.setProperty("--subtitles-window-top",appearanceSettings.positionTop+"%")}catch(err){console.log("error setting --subtitles-window-top css variable")}if(null!=appearanceSettings.positionBottom)try{document.documentElement.style.setProperty("--subtitles-window-bottom",appearanceSettings.positionBottom+"%")}catch(err){console.log("error setting --subtitles-window-bottom css variable")}self.webVTTStyleOptions={textStyle:subtitleStyles.text,windowStyle:subtitleStyles.window},videoElement.parentNode.appendChild(subtitlesContainer)}}function setCueAppearance(){var elementId=self.id+"-cuestyle",styleElem=document.querySelector("#"+elementId),elementId=(styleElem||((styleElem=document.createElement("style")).id=elementId,styleElem.type="text/css",document.getElementsByTagName("head")[0].appendChild(styleElem)),_usersettings.default.getSubtitleAppearanceSettings());styleElem.innerHTML=function(appearance,selector){for(var html=(html=selector+"::cue {")+appearance.text.map(function(s){return s.name+":"+s.value+" !important;"}).join("")+"}",i=0,length=appearance.text.length;i<length;i++){var prop=appearance.text[i];"background-color"===prop.name&&(html+=" "+selector+"::-webkit-media-text-track-display-backdrop {background-color: "+prop.value+"!important;}")}return html}(_subtitleappearancehelper.default.getStyles(elementId,{isCue:!0}),".htmlvideoplayer")}function onCueChange(e){e=e.target.activeCues;renderCues(self,e)}function removeCueEvents(track){track.removeEventListener("cuechange",onCueChange)}function addCueEvents(videoElement,track){loadWebVTT(),ensureCustomSubtitlesElement(videoElement),removeCueEvents(track),track.addEventListener("cuechange",onCueChange)}function getNormalizedIndex(track){var index=track.Index||0;return"VideoSideData"===track.DeliveryMethod&&(index+=1e3),index}function sortMediaStreamTextTracks(trackA,trackB){trackA=getNormalizedIndex(trackA),trackB=getNormalizedIndex(trackB);return trackA<trackB?-1:trackB<trackA?1:0}function setCurrentTrackElement(mediaElement,streamIndex,currentPlayOptions){if(self.setSubtitleOffset(0),currentPlayOptions){var mediaSource=currentPlayOptions.mediaSource,currentPlayOptions=(_browser.default.web0s&&_browser.default.sdkVersion&&_browser.default.sdkVersion<3&&("DirectStream"!==(currentPlayOptions=currentPlayOptions.playMethod)&&"DirectPlay"!==currentPlayOptions||"mkv"===mediaSource.Container&&(streamIndex=-1)),console.log("setCurrentTrackElement Setting new text track index to: "+streamIndex),getMediaStreamSubtitleTracks(mediaSource)),mediaSource=-1===streamIndex?null:currentPlayOptions.filter(function(t){return t.Index===streamIndex})[0],targetIndex=(!function(currentSrc,track){if(track){if("Embed"===track.DeliveryMethod)return 1;if("Hls"===track.DeliveryMethod)return 1;if("VideoSideData"===track.DeliveryMethod)return 1;track=(track.Codec||"").toLowerCase();if("ssa"===track||"ass"===track)return}return!(_browser.default.chromecast&&-1!==(currentSrc||"").toLowerCase().indexOf(".m3u8")||_browser.default.web0s&&_browser.default.sdkVersion&&_browser.default.sdkVersion<3)}(self._currentSrc,mediaSource)?(setTrackForCustomDisplay(mediaElement,mediaSource),streamIndex=-1,mediaSource=null):(setTrackForCustomDisplay(mediaElement,null),-1!==streamIndex&&setCueAppearance()),-1),expectedId="textTrack"+streamIndex;if(mediaElement){for(var found,elemTextTracks=mediaElement.textTracks,elemTextTrackslength=elemTextTracks.length,i=0;i<elemTextTrackslength;i++){var tt=elemTextTracks[i],textTrackId=tt.id;console.log("comparing textTrackId "+textTrackId+" to "+expectedId),textTrackId===expectedId&&(targetIndex=i),tt.mode="disabled",removeCueEvents(tt)}if(targetIndex<0&&(currentPlayOptions=currentPlayOptions.filter(function(s){return s.IsTextSubtitleStream&&("Hls"===s.DeliveryMethod||"VideoSideData"===s.DeliveryMethod)}),console.log("mediaStreamTextTracks: "+currentPlayOptions.length),currentPlayOptions.sort(sortMediaStreamTextTracks),!mediaSource||"Hls"!==mediaSource.DeliveryMethod&&"VideoSideData"!==mediaSource.DeliveryMethod?_browser.default.edge&&(targetIndex=-1!==streamIndex&&mediaSource?currentPlayOptions.indexOf(mediaSource):-1):targetIndex=currentPlayOptions.indexOf(mediaSource)),console.log("setCurrentTrackElement targetIndex: "+targetIndex+", track language: "+(null==(currentPlayOptions=mediaSource)?void 0:currentPlayOptions.Language)),0<=targetIndex&&targetIndex<elemTextTrackslength){for(var _i=0,length=elemTextTracks.length;_i<length;_i++){var _textTrack=elemTextTracks[_i];console.log("element has text track: "+_textTrack.id+", language: "+_textTrack.language+", kind: "+_textTrack.kind+", label: "+_textTrack.label)}currentPlayOptions=elemTextTracks,mediaSource=(currentPlayOptions=targetIndex>=(currentPlayOptions="VideoSideData"===mediaSource.DeliveryMethod?function(tracks,kind){for(var list=[],i=0,length=tracks.length;i<length;i++){var track=tracks[i];track.kind===kind&&list.push(track)}return list}(elemTextTracks,"captions"):currentPlayOptions).length?elemTextTracks:currentPlayOptions)[targetIndex];console.log("marking track hidden: "+mediaSource.id+", language: "+mediaSource.language+", kind: "+mediaSource.kind+", label: "+mediaSource.label),mediaSource.mode="hidden",found=!0,addCueEvents(mediaElement,mediaSource)}found||-1===targetIndex||console.log("could not find text track for selection. "+elemTextTrackslength+" total tracks")}}}this.webVTTStyleOptions={},self.play=function(options,signal){var reason,elem;return signal.aborted?((reason=signal.reason)||((reason=new Error("Aborted")).name="AbortError"),Promise.reject(reason)):(reason=options.fullscreen?_approuter.default.showVideoOsd():Promise.resolve(),self._started=!1,self._timeUpdated=!1,self._currentTime=null,self._hlsPlayer&&self.stopInternal(!0,!1,!1),elem=function(){var dlg=document.querySelector(".htmlVideoPlayerContainer");dlg||((dlg=document.createElement("div")).classList.add("htmlVideoPlayerContainer"),document.body.insertBefore(dlg,document.body.firstChild),videoDialog=dlg);var videoElement=dlg.querySelector("video");{var cssClass;videoElement||(cssClass="htmlvideoplayer",_browser.default.edge&&(cssClass+=" htmlvideoplayer-edge"),dlg.insertAdjacentHTML("beforeend",'<video class="'+cssClass+'" preload="metadata" autoplay="autoplay" webkit-playsinline playsinline></video>'),(videoElement=dlg.querySelector("video")).volume=self.getSavedVolume(),videoElement.addEventListener("timeupdate",onTimeUpdate),videoElement.addEventListener("ended",onEnded),videoElement.addEventListener("volumechange",onVolumeChange),videoElement.addEventListener("pause",onPause),videoElement.addEventListener("playing",onPlaying),videoElement.textTracks&&videoElement.textTracks.addEventListener&&(videoElement.textTracks.addEventListener("addtrack",onAddTrack),videoElement.textTracks.addEventListener("removetrack",onRemoveTrack)),videoElement.addEventListener("play",onPlay),videoElement.addEventListener("click",onClick),videoElement.addEventListener("dblclick",onDblClick),videoElement.addEventListener("ratechange",onRateChange),_browser.default.chromecast||videoElement.classList.add("moveUpSubtitles"),self._mediaElement=videoElement,_browser.default.chromecast&&(cast.framework.CastReceiverContext.getInstance().getPlayerManager().setMediaElement(videoElement),self.bindMediaManagerEvents()))}return videoElement}(),reason.then(function(){var _reason;return signal.aborted?((_reason=signal.reason)||((_reason=new Error("Aborted")).name="AbortError"),Promise.reject(_reason)):function(streamInfo,signal){var hlsPlaylistUrl,isHls=-1!==streamInfo.url.toLowerCase().indexOf(".m3u8"),mediaSource=streamInfo.mediaSource,item=streamInfo.item;return mediaSource&&item&&!mediaSource.RunTimeTicks&&isHls&&"Transcode"===streamInfo.playMethod&&(_browser.default.iOS||_browser.default.osx)?(hlsPlaylistUrl=streamInfo.url.replace("master.m3u8","live.m3u8"),console.log("prefetching hls playlist: "+hlsPlaylistUrl),_connectionmanager.default.getApiClient(item).ajax({type:"GET",url:hlsPlaylistUrl,signal:signal}).then(function(){return console.log("completed prefetching hls playlist: "+hlsPlaylistUrl),streamInfo.url=hlsPlaylistUrl,Promise.resolve()},function(){return console.log("error prefetching hls playlist: "+hlsPlaylistUrl),Promise.resolve()})):Promise.resolve()}(options,signal).then(function(){return function(elem,options){_htmlmediahelper.default.removeErrorEventListener(elem);var url=options.url;_browser.default.ps4||(seconds=(options.playerStartPositionTicks||0)/1e7)&&(url+="#t="+seconds);console.log("playing url: "+url),setCurrentTrackElement(elem,-1,options),elem.innerHTML="",_htmlmediahelper.default.destroyHlsPlayer(self),_htmlmediahelper.default.destroyFlvPlayer(self),_htmlmediahelper.default.destroyCastPlayer(self);var seconds=getMediaStreamSubtitleTracks(options.mediaSource);null!=(subtitleTrackIndexToSetOnPlaying=null==options.mediaSource.DefaultSubtitleStreamIndex?-1:options.mediaSource.DefaultSubtitleStreamIndex)&&0<=subtitleTrackIndexToSetOnPlaying&&((initialSubtitleStream=function(mediaStreams,index){for(var i=0,length=mediaStreams.length;i<length;i++)if(mediaStreams[i].Index===index)return mediaStreams[i];return null}(options.mediaSource.MediaStreams,subtitleTrackIndexToSetOnPlaying))&&"Encode"!==initialSubtitleStream.DeliveryMethod||(subtitleTrackIndexToSetOnPlaying=-1));audioTrackIndexToSetOnPlaying="Transcode"===options.playMethod?null:options.mediaSource.DefaultAudioStreamIndex,self._currentPlayOptions=options;var initialSubtitleStream=self.getCrossOriginValue(options.mediaSource,options.playMethod);initialSubtitleStream&&(elem.crossOrigin=initialSubtitleStream);var hasHlsTextTracks=function(tracks){return 0<tracks.filter(function(t){return"Hls"===t.DeliveryMethod}).length}(seconds=seconds.filter(function(s){return s.IsTextSubtitleStream}));return function(tracks,item,mediaSource){return tracks=tracks.map(function(t){return"External"!==t.DeliveryMethod||"ass"===t.Codec||"ssa"===t.Codec?Promise.resolve(""):getTextTrackUrl(t,item,mediaSource).then(function(textTrackUrl){var language=t.Language||"und",label=t.Language||"und";return'<track id="textTrack'+t.Index+'" label="'+label+'" kind="subtitles" src="'+textTrackUrl+'" srclang="'+language+'" />\n'})}),Promise.all(tracks).then(function(trackTags){return trackTags.join("")})}(seconds,options.item,options.mediaSource).then(function(tracksHtml){return"Transcode"!==options.playMethod&&"flv"===options.mediaSource.Container?(setTracks(elem,tracksHtml),self.setSrcWithFlvJs(elem,options,url)):_browser.default.chromecast?self.setCurrentSrcChromecast(elem,options,url,hasHlsTextTracks,tracksHtml):_htmlmediahelper.default.enableHlsJsPlayer(options.mediaSource.RunTimeTicks,"Video")&&-1!==url.indexOf(".m3u8")?(hasHlsTextTracks||setTracks(elem,tracksHtml),self.setSrcWithHlsJs(elem,options,url)):(elem.autoplay=!0,_htmlmediahelper.default.applySrc(elem,url,options).then(function(){return setTracks(elem,tracksHtml),self._currentSrc=url,_htmlmediahelper.default.playWithPromise(self,elem)}))})}(elem,options).then(function(result){var _reason2;return signal.aborted?(self.stopInternal(!1,!1),(_reason2=signal.reason)||((_reason2=new Error("Aborted")).name="AbortError"),Promise.reject(_reason2)):Promise.resolve(result)})})}))},self.loadIntoPlayer=function(elem,options,val,media,data,customData){var protocol,hasHlsTextTracks=customData.hasHlsTextTracks,tracksHtml=customData.tracksHtml;if(-1!==val.indexOf(".m3u8")){if(options.mediaSource.RunTimeTicks)return setTracks(elem,tracksHtml),self._castPlayer&&self._castPlayer.unload(),self._castPlayer=null,customData=media.contentType.toLowerCase(),media=new cast.player.api.Host({url:val,mediaElement:elem}),protocol=cast.player.api.CreateHlsStreamingProtocol(media),console.log("loading playback url: "+val),console.log("contentType: "+customData),media.onError=function(errorCode){console.log("Fatal Error - "+errorCode)},elem.autoplay=!1,self._castPlayer=new cast.player.api.Player(media),self._castPlayer.load(protocol,data.currentTime||0),self._castPlayer.playWhenHaveEnoughData(),Promise.resolve();if(_htmlmediahelper.default.enableHlsJsPlayer(options.mediaSource.RunTimeTicks,"Video")&&-1!==val.indexOf(".m3u8"))return hasHlsTextTracks||setTracks(elem,tracksHtml),self.setSrcWithHlsJs(elem,options,val)}return elem.autoplay=!0,_htmlmediahelper.default.applySrc(elem,val,options).then(function(){return setTracks(elem,tracksHtml),self._currentSrc=val,_htmlmediahelper.default.playWithPromise(self,elem)})},self.setSubtitleStreamIndex=function(index){setCurrentTrackElement(self._mediaElement,index,self._currentPlayOptions)},self.setAudioStreamIndex=function(index){var instance,mediaSource,profile,currentPlayOptions,streams=(currentPlayOptions=(instance=self)._currentPlayOptions)?(mediaSource=currentPlayOptions.mediaSource,profile=instance._lastProfile,getMediaStreamTracks(mediaSource,"Audio").filter(function(stream){return _playbackmanager.default.isAudioStreamSupported(stream,mediaSource,profile)})):[];if(!(streams.length<2)){_browser.default.web0s&&_browser.default.sdkVersion&&4===_browser.default.sdkVersion&&streams.sort(sortDefaultTracksFirst);for(var audioIndex=-1,i=0,length=streams.length;i<length&&(audioIndex++,streams[i].Index!==index);i++);if(-1!==audioIndex){var elem=self._mediaElement;if(elem){var elemAudioTracks=elem.audioTracks||[];if(!(elemAudioTracks.length<2)){for(console.log("found "+elemAudioTracks.length+" audio tracks"),i=0,length=elemAudioTracks.length;i<length;i++)audioIndex===i?(console.log("setting audio track "+i+" to enabled"),elemAudioTracks[i].enabled=!0):(console.log("setting audio track "+i+" to disabled"),elemAudioTracks[i].enabled=!1);setTimeout(function(){elem.currentTime=elem.currentTime},100)}}}}},self.stopInternal=function(destroyPlayer,triggerStopEvent,destroyInterface){var elem=self._mediaElement,src=self._currentSrc;return elem&&(src&&elem.pause(),_htmlmediahelper.default.onEndedInternal(self,elem,triggerStopEvent),destroyPlayer)&&self.destroyInternal(destroyInterface),destroyCustomTrack(elem),Promise.resolve()},self.stop=function(destroyPlayer){return this.stopInternal(destroyPlayer,null,!0)},self.destroyInternal=function(destroyInterface){_htmlmediahelper.default.destroyHlsPlayer(self),_htmlmediahelper.default.destroyFlvPlayer(self);var videoElement=self._mediaElement;videoElement&&(self._mediaElement=null,self._currentAspectRatio=null,destroyCustomTrack(videoElement),_browser.default.chromecast&&self.unBindMediaManagerEvents(),videoElement.removeEventListener("timeupdate",onTimeUpdate),videoElement.removeEventListener("ended",onEnded),videoElement.removeEventListener("volumechange",onVolumeChange),videoElement.removeEventListener("pause",onPause),videoElement.removeEventListener("playing",onPlaying),videoElement.removeEventListener("waiting",onWaiting),videoElement.removeEventListener("play",onPlay),videoElement.removeEventListener("click",onClick),videoElement.removeEventListener("dblclick",onDblClick),videoElement.removeEventListener("ratechange",onRateChange),videoElement.remove()),destroyInterface&&(videoElement=videoDialog)&&(videoDialog=null,videoElement.remove())},self.destroy=function(){return self.destroyInternal(!0)},self.destroyCustomTrack=destroyCustomTrack}function onPictureInPictureError(err){console.log("Picture in picture error: "+err.toString())}function setSubtitleOffset(instance,elem,val){for(var subtitlesOctopus=instance.currentSubtitlesOctopus,textTracks=(subtitlesOctopus&&(subtitlesOctopus.timeOffset=-val/1e3),elem.textTracks||[]),i=0,length=textTracks.length;i<length;i++){var track=textTracks[i],trackMode=track.mode;if("showing"===trackMode||"hidden"===trackMode){trackMode=track.cues;if(trackMode)try{!function(cues,val){val/=1e3;for(var i=0,length=cues.length;i<length;i++){var cue=cues[i];null==cue.originalStartTime&&(cue.originalStartTime=cue.startTime),null==cue.originalEndTime&&(cue.originalEndTime=cue.endTime),cue.startTime=cue.originalStartTime+val,cue.endTime=cue.originalEndTime+val}}(trackMode,val),renderCues(instance,track.activeCues)}catch(err){console.log("error in setSubtitleOffsetIntoCues: "+err)}}}}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,require(["css!modules/htmlvideoplayer/style.css"]),Object.assign(HtmlVideoPlayer.prototype,_basehtmlplayer.default.prototype),HtmlVideoPlayer.prototype.supports=function(feature){var video,list;return supportedFeatures||(list=[],!globalThis.webos&&!globalThis.PalmSystem&&((video=document.createElement("video")).webkitSupportsPresentationMode&&"function"==typeof video.webkitSetPresentationMode&&list.push("PictureInPicture"),document.pictureInPictureEnabled||window.Windows&&Windows.UI.ViewManagement.ApplicationView.getForCurrentView().isViewModeSupported(Windows.UI.ViewManagement.ApplicationViewMode.compactOverlay))&&list.push("PictureInPicture"),CSS.supports("object-fit","cover")&&list.push("SetAspectRatio"),list.push("SetSubtitleOffset"),_browser.default.web0s||_browser.default.netcast||list.push("SetPlaybackRate"),supportedFeatures=list),-1!==supportedFeatures.indexOf(feature)},HtmlVideoPlayer.prototype.canSetAudioStreamIndex=function(index){var video;return"undefined"!=typeof AudioTrack&&!(!(video=this._mediaElement)||!video.audioTracks)},HtmlVideoPlayer.prototype.setPictureInPictureEnabled=function(isEnabled){var video=this._mediaElement;document.pictureInPictureEnabled?video&&(isEnabled?video.requestPictureInPicture():document.exitPictureInPicture()).catch(onPictureInPictureError):window.Windows?(this.isPip=isEnabled)?Windows.UI.ViewManagement.ApplicationView.getForCurrentView().tryEnterViewModeAsync(Windows.UI.ViewManagement.ApplicationViewMode.compactOverlay):Windows.UI.ViewManagement.ApplicationView.getForCurrentView().tryEnterViewModeAsync(Windows.UI.ViewManagement.ApplicationViewMode.default):video&&video.webkitSupportsPresentationMode&&"function"==typeof video.webkitSetPresentationMode&&video.webkitSetPresentationMode(isEnabled?"picture-in-picture":"inline")},HtmlVideoPlayer.prototype.isPictureInPictureEnabled=function(){var video;return document.pictureInPictureEnabled?!!document.pictureInPictureElement:window.Windows?this.isPip||!1:!!(video=this._mediaElement)&&"picture-in-picture"===video.webkitPresentationMode},HtmlVideoPlayer.prototype.setBrightness=function(val){var rawValue,elem=this._mediaElement;elem&&(val=Math.max(0,val),rawValue=val=Math.min(100,val),rawValue=100<=(rawValue=Math.max(20,rawValue))?"none":rawValue/100,elem.style.filter="brightness("+rawValue+");",elem.style.filter="brightness("+rawValue+")",elem.brightnessValue=val,_events.default.trigger(this,"brightnesschange"))},HtmlVideoPlayer.prototype.getBrightness=function(){var elem=this._mediaElement;if(elem)return null==(elem=elem.brightnessValue)?100:elem},HtmlVideoPlayer.prototype.setAspectRatio=function(val){var mediaElement=this._mediaElement;if(mediaElement)switch(val){case"fill":case"cover":mediaElement.style.objectFit=val;break;default:mediaElement.style.objectFit="initial"}this._currentAspectRatio=val},HtmlVideoPlayer.prototype.getAspectRatio=function(){return this._currentAspectRatio||"auto"},HtmlVideoPlayer.prototype.getSupportedAspectRatios=function(){return[{name:_globalize.default.translate("Auto"),id:"auto"},{name:_globalize.default.translate("Cover"),id:"cover"},{name:_globalize.default.translate("Fill"),id:"fill"}]},HtmlVideoPlayer.prototype.getSubtitleOffset=function(val){return this._currentSubtitleOffset},HtmlVideoPlayer.prototype.setSubtitleOffset=function(val){var elem=this._mediaElement;elem&&(this._currentSubtitleOffset=val,setSubtitleOffset(this,elem,val))},HtmlVideoPlayer.prototype.incrementSubtitleOffset=function(val){var elem=this._mediaElement;elem&&(val=this._currentSubtitleOffset+val,this._currentSubtitleOffset=val,setSubtitleOffset(this,elem,val))},HtmlVideoPlayer.prototype.togglePictureInPicture=function(){return this.setPictureInPictureEnabled(!this.isPictureInPictureEnabled())},HtmlVideoPlayer.prototype.getStats=function(){var videoCategory,mediaElement=this._mediaElement,categories=[];return mediaElement&&(categories.push(videoCategory={stats:[],type:"video"}),mediaElement.getVideoPlaybackQuality)&&(mediaElement=mediaElement.getVideoPlaybackQuality().droppedVideoFrames||0,videoCategory.stats.push({label:"Dropped Frames",value:mediaElement})),Promise.resolve({categories:categories})};_exports.default=HtmlVideoPlayer});