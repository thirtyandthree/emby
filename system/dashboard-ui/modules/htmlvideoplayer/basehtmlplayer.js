define(["exports","./htmlmediahelper.js","./../emby-apiclient/connectionmanager.js","./../common/appsettings.js","./../browser.js"],function(_exports,_htmlmediahelper,_connectionmanager,_appsettings,_browser){function BaseHtmlPlayer(){this.type="mediaplayer"}function isValidDuration(duration){return!(!duration||isNaN(duration)||duration===Number.POSITIVE_INFINITY||duration===Number.NEGATIVE_INFINITY)}function getPosterUrl(item){var imageOptions={};return function(item,options){if(item)return"Episode"!==item.Type?null:((options=options||{}).type=options.type||"Primary","Primary"===options.type&&item.SeriesPrimaryImageTag?(options.tag=item.SeriesPrimaryImageTag,_connectionmanager.default.getApiClient(item).getImageUrl(item.SeriesId,options)):"Thumb"===options.type&&item.ParentThumbImageTag?(options.tag=item.ParentThumbImageTag,_connectionmanager.default.getApiClient(item).getImageUrl(item.ParentThumbItemId,options)):null);throw new Error("item cannot be null!")}(item,imageOptions)||function(item,options){if(item)return(options=options||{}).type=options.type||"Primary",item.ImageTags&&item.ImageTags[options.type]?(options.tag=item.ImageTags[options.type],_connectionmanager.default.getApiClient(item).getImageUrl(item.PrimaryImageItemId||item.Id,options)):item.AlbumId&&item.AlbumPrimaryImageTag?(options.tag=item.AlbumPrimaryImageTag,_connectionmanager.default.getApiClient(item).getImageUrl(item.AlbumId,options)):null;throw new Error("item cannot be null!")}(item,imageOptions)}function setCurrentTimeIfNeeded(element,seconds,allowance){Math.abs((element.currentTime||0)-seconds)>=allowance&&(element.currentTime=seconds)}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,BaseHtmlPlayer.prototype.getSavedVolume=function(){return _appsettings.default.get("volume")||1},BaseHtmlPlayer.prototype.saveVolume=function(value){value&&_appsettings.default.set("volume",value)},BaseHtmlPlayer.prototype.canPlayMediaType=function(mediaType){return(mediaType||"").toLowerCase()===this.mediaType},BaseHtmlPlayer.prototype.currentSrc=function(){return this._currentSrc},BaseHtmlPlayer.prototype.getDeviceProfile=function(item,options){return _htmlmediahelper.default.getDeviceProfile(this,item,options)},BaseHtmlPlayer.prototype.currentTime=function(val){var currentTime,mediaElement=this._mediaElement;if(mediaElement){if(null==val)return(currentTime=this._currentTime)?1e3*currentTime:1e3*(mediaElement.currentTime||0);mediaElement.currentTime=val/1e3}},BaseHtmlPlayer.prototype.duration=function(val){var mediaElement=this._mediaElement;if(mediaElement){mediaElement=mediaElement.duration;if(isValidDuration(mediaElement))return 1e3*mediaElement}return null},BaseHtmlPlayer.prototype.getBufferedRanges=function(){var mediaElement=this._mediaElement;if(mediaElement){for(var instance=this,ranges=[],seekable=(mediaElement=mediaElement).buffered||[],mediaElement=instance._currentPlayOptions,offset=(offset=mediaElement?mediaElement.transcodingOffsetTicks:offset)||0,i=0,length=seekable.length;i<length;i++){var start=seekable.start(i),end=seekable.end(i);isValidDuration(start)||(start=0),isValidDuration(end)?ranges.push({start:1e7*start+offset,end:1e7*end+offset}):end=0}return ranges}return[]},BaseHtmlPlayer.prototype.pause=function(){var mediaElement=this._mediaElement;mediaElement&&mediaElement.pause()},BaseHtmlPlayer.prototype.resume=function(){var mediaElement=this._mediaElement;mediaElement&&mediaElement.play()},BaseHtmlPlayer.prototype.unpause=function(){var mediaElement=this._mediaElement;mediaElement&&mediaElement.play()},BaseHtmlPlayer.prototype.paused=function(){var mediaElement=this._mediaElement;return!!mediaElement&&mediaElement.paused},BaseHtmlPlayer.prototype.setVolume=function(val){var mediaElement=this._mediaElement;mediaElement&&(mediaElement.volume=val/100)},BaseHtmlPlayer.prototype.getVolume=function(){var mediaElement;return _browser.default.chromecast?100*cast.framework.CastReceiverContext.getInstance().getSystemVolume().level:(mediaElement=this._mediaElement)?Math.min(Math.round(100*mediaElement.volume),100):void 0},BaseHtmlPlayer.prototype.setPlaybackRate=function(val){var mediaElement=this._mediaElement;mediaElement&&(mediaElement.playbackRate=val)},BaseHtmlPlayer.prototype.getPlaybackRate=function(){var mediaElement=this._mediaElement;if(mediaElement)return mediaElement.playbackRate},BaseHtmlPlayer.prototype.volumeUp=function(){this.setVolume(Math.min(this.getVolume()+2,100))},BaseHtmlPlayer.prototype.volumeDown=function(){this.setVolume(Math.max(this.getVolume()-2,0))},BaseHtmlPlayer.prototype.setMute=function(mute){var mediaElement=this._mediaElement;mediaElement&&(mediaElement.muted=mute)},BaseHtmlPlayer.prototype.isMuted=function(){var mediaElement=this._mediaElement;return!!mediaElement&&mediaElement.muted},BaseHtmlPlayer.prototype.seekable=function(){var start,mediaElement=this._mediaElement;if(mediaElement)return!(!(mediaElement=mediaElement.seekable)||!mediaElement.length)&&(start=mediaElement.start(0),mediaElement=mediaElement.end(0),isValidDuration(start)||(start=0),0<(mediaElement=isValidDuration(mediaElement)?mediaElement:0)-start)},BaseHtmlPlayer.prototype.setCurrentSrcChromecast=function(elem,options,url,hasHlsTextTracks,tracksHtml){elem.autoplay=!0;elem=new cast.framework.messages.LoadRequestData,elem.currentTime=(options.playerStartPositionTicks||0)/1e7,elem.autoplay=!0,elem.media=new cast.framework.messages.MediaInformation,elem.media.contentId=url,elem.media.contentUrl=url,elem.media.contentType=options.mimeType,"application/x-mpegurl"===(options.mimeType||"").toLowerCase()||"application/vnd.apple.mpegurl"===(options.mimeType||"").toLowerCase()?elem.media.streamType=cast.framework.messages.StreamType.OTHER:elem.media.streamType=cast.framework.messages.StreamType.BUFFERED,elem.media.customData={options:options,hasHlsTextTracks:hasHlsTextTracks,tracksHtml:tracksHtml},url=options.item,hasHlsTextTracks=!0;return"Audio"===url.MediaType?(elem.media.metadata=new cast.framework.messages.MusicTrackMediaMetadata,elem.media.mediaCategory=cast.framework.messages.MediaCategory.AUDIO,url.Album&&(elem.media.metadata.albumName=url.Album),null!=url.IndexNumber&&(elem.media.metadata.trackNumber=url.IndexNumber),null!=url.ParentIndexNumber&&(elem.media.metadata.discNumber=url.ParentIndexNumber),url.AlbumArtists&&url.AlbumArtists.length&&(elem.media.metadata.albumArtist=url.AlbumArtists[0].Name),url.ArtistItems&&url.ArtistItems.length&&(elem.media.metadata.artist=url.ArtistItems[0].Name),elem.media.metadata.songTitle=url.Name):"Photo"===url.MediaType?(elem.media.metadata=new cast.framework.messages.PhotoMediaMetadata,elem.media.mediaCategory=cast.framework.messages.MediaCategory.IMAGE,hasHlsTextTracks=!1):"Episode"===url.Type?(elem.media.metadata=new cast.framework.messages.TvShowMediaMetadata,elem.media.mediaCategory=cast.framework.messages.MediaCategory.VIDEO,url.SeriesName&&(elem.media.metadata.seriesTitle=url.SeriesName),null!=url.IndexNumber&&(elem.media.metadata.episode=url.IndexNumber),null!=url.ParentIndexNumber&&(elem.media.metadata.season=url.ParentIndexNumber)):("Movie"===url.Type||"Trailer"===url.Type?elem.media.metadata=new cast.framework.messages.MovieMediaMetadata:elem.media.metadata=new cast.framework.messages.GenericMediaMetadata,elem.media.mediaCategory=cast.framework.messages.MediaCategory.VIDEO),url.OfficialRating&&(elem.media.metadata.contentRating=url.OfficialRating),elem.media.metadata.title=url.Name,url.Studios&&url.Studios.length&&(elem.media.metadata.studio=url.Studios[0].Name),elem.media.userActionStates=[cast.framework.messages.UserActionState.LIKE,cast.framework.messages.UserActionState.DISLIKE],hasHlsTextTracks&&(tracksHtml=[],(options=getPosterUrl(url))&&(elem.media.metadata.posterUrl=options,tracksHtml.push(new cast.framework.messages.Image(elem.media.metadata.posterUrl))),elem.media.metadata.images=tracksHtml),console.log("loading media url into mediaManager"),cast.framework.CastReceiverContext.getInstance().getPlayerManager().load(elem)},BaseHtmlPlayer.prototype.setSrcWithFlvJs=function(elem,options,url){var instance=this;return new Promise(function(resolve,reject){require(["flvjs"],function(flvjs){flvjs=flvjs.createPlayer({type:"flv",url:url},{seekType:"range",lazyLoad:!1,rangeLoadZeroStart:!0});flvjs.attachMediaElement(elem),flvjs.load(),flvjs.play().then(resolve,reject),instance._flvPlayer=flvjs,instance._currentSrc=url})})},BaseHtmlPlayer.prototype.setSrcWithHlsJs=function(elem,options,url){var instance=this;return require(["hlsjs"]).then(function(responses){responses=responses[0];return window.Hls=responses}).then(function(Hls){var hlsOptions={manifestLoadingTimeOut:2e4,debug:!1,testBandwidth:!1,emeEnabled:!1},hls=("Audio"!==options.mediaType||_browser.default.chromecast||(hlsOptions.maxMaxBufferLength=120),new Hls(hlsOptions));return hls.subtitleDisplay=!1,hls.loadSource(url),hls.attachMedia(elem),new Promise(function(resolve,reject){_htmlmediahelper.default.bindEventsToHlsPlayer(instance,hls,elem,resolve,reject),instance._hlsPlayer=hls,instance._currentSrc=url})})},BaseHtmlPlayer.prototype.seekOnPlaybackStart=function(element,ticks){ticks=(ticks||0)/1e7;ticks&&(setCurrentTimeIfNeeded(element,ticks,5),5<=Math.abs((element.currentTime||0)-ticks))&&!function(element,seconds,allowance){setTimeout(function(){setCurrentTimeIfNeeded(element,seconds,allowance)},2500)}(element,ticks,10)},BaseHtmlPlayer.prototype.bindMediaManagerEvents=function(){cast.framework.CastReceiverContext.getInstance().getPlayerManager().setMessageInterceptor(cast.framework.messages.MessageType.LOAD,function(data){var media=data.media,customData=media.customData,val=media.contentId,options=customData.options,elem=this._mediaElement;return this.loadIntoPlayer(elem,options,val,media,data,customData).then(function(){return null})}.bind(this))},BaseHtmlPlayer.prototype.unBindMediaManagerEvents=function(){cast.framework.CastReceiverContext.getInstance().getPlayerManager().setMessageInterceptor(cast.framework.messages.MessageType.LOAD,null)},BaseHtmlPlayer.prototype.getCrossOriginValue=function(mediaSource,playMethod){return mediaSource.IsRemote&&"DirectPlay"===playMethod?null:"anonymous"};_exports.default=BaseHtmlPlayer});