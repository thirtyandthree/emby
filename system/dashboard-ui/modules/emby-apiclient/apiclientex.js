define(["exports","./apiclient.js","./../localdatabase/localassetmanager.js","./../common/servicelocator.js"],function(_exports,_apiclient,_localassetmanager,_servicelocator){Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0;function isLocalId(str){return str&&str.startsWith("local")}function mapToId(i){return i.Id}function stripLocalPrefix(str){str=stripStart(str,"local:");return stripStart(str,"localview:")}function stripStart(str,find){return str&&find&&str.startsWith(find)?str.substr(find.length):str}function convertGuidToLocal(guid){return guid?isLocalId(guid)?guid:"local:"+guid:null}function syncNow(){require(["localsync"],function(localSync){localSync.sync()})}function getLocalUrl(_ref){var _ref=_ref.MediaSources;return _ref&&_ref.length?(_ref=_ref[0]).StreamUrl||_ref.Path:""}function getMusicFolders(serverId){var list=[];return list.push({Name:"Albums",ServerId:serverId,Id:"localview:MusicAlbumsView",Type:"MusicAlbumsView",IsFolder:!0}),list.push({Name:"Songs",ServerId:serverId,Id:"localview:MusicSongsView",Type:"MusicSongsView",IsFolder:!0}),list}function getTopLevelViews(serverId,types,forceIncludeAll){var list=[];return(types.includes("Audio")||forceIncludeAll)&&list.push({Name:"Music",ServerId:serverId,Id:"localview:MusicView",Type:"MusicView",CollectionType:"music",IsFolder:!0}),(types.includes("Photo")||forceIncludeAll)&&list.push({Name:"Photos",ServerId:serverId,Id:"localview:PhotosView",Type:"PhotosView",CollectionType:"photos",IsFolder:!0}),(types.includes("Episode")||forceIncludeAll)&&list.push({Name:"TV",ServerId:serverId,Id:"localview:TVView",Type:"TVView",CollectionType:"tvshows",IsFolder:!0}),(types.includes("Movie")||forceIncludeAll)&&list.push({Name:"Movies",ServerId:serverId,Id:"localview:MoviesView",Type:"MoviesView",CollectionType:"movies",IsFolder:!0}),(types.includes("Video")||forceIncludeAll)&&list.push({Name:"Videos",ServerId:serverId,Id:"localview:VideosView",Type:"VideosView",IsFolder:!0}),(types.includes("MusicVideo")||forceIncludeAll)&&list.push({Name:"Music Videos",ServerId:serverId,Id:"localview:MusicVideosView",Type:"MusicVideosView",CollectionType:"musicvideos",IsFolder:!0}),(types.includes("Trailer")||forceIncludeAll)&&list.push({Name:"Trailers",ServerId:serverId,Id:"localview:TrailersView",Type:"TrailersView",IsFolder:!0}),list}function getDownloadedItems(serverId,options){var items,searchParentId=options.ParentId;switch((searchParentId=searchParentId)?(searchParentId=stripStart(searchParentId,"localview:"),stripStart(searchParentId,"local:")):null){case"MusicView":if(options.Recursive)break;return Promise.resolve({Items:items=getMusicFolders(serverId),TotalRecordCount:items.length})}return _servicelocator.itemRepository.getLibraryItems(serverId,options)}function adjustGuidProperties(downloadedItem){downloadedItem.Id=convertGuidToLocal(downloadedItem.Id),downloadedItem.SeriesId=convertGuidToLocal(downloadedItem.SeriesId),downloadedItem.SeasonId=convertGuidToLocal(downloadedItem.SeasonId),downloadedItem.AlbumId=convertGuidToLocal(downloadedItem.AlbumId),downloadedItem.ParentId=convertGuidToLocal(downloadedItem.ParentId),downloadedItem.ParentThumbItemId=convertGuidToLocal(downloadedItem.ParentThumbItemId),downloadedItem.ParentPrimaryImageItemId=convertGuidToLocal(downloadedItem.ParentPrimaryImageItemId),downloadedItem.PrimaryImageItemId=convertGuidToLocal(downloadedItem.PrimaryImageItemId),downloadedItem.ParentLogoItemId=convertGuidToLocal(downloadedItem.ParentLogoItemId),downloadedItem.ParentBackdropItemId=convertGuidToLocal(downloadedItem.ParentBackdropItemId),downloadedItem.ParentBackdropImageTags=null}_apiclient=function(_ApiClient){babelHelpers.inherits(ApiClientEx,_ApiClient);var _super=_createSuper(ApiClientEx);function ApiClientEx(serverAddress,appName,appVersion,deviceName,deviceId,devicePixelRatio){return babelHelpers.classCallCheck(this,ApiClientEx),_super.call(this,serverAddress,appName,appVersion,deviceName,deviceId,devicePixelRatio)}return babelHelpers.createClass(ApiClientEx,[{key:"getPlaybackInfo",value:function(itemId,options,deviceProfile,signal){var promises=[];return isLocalId(itemId)||options&&isLocalId(options.MediaSourceId)?promises.push(Promise.resolve({MediaSources:[]})):promises.push(babelHelpers.get(babelHelpers.getPrototypeOf(ApiClientEx.prototype),"getPlaybackInfo",this).apply(this,arguments)),options&&options.MediaSourceId&&!isLocalId(options.MediaSourceId)?promises.push(Promise.resolve({MediaSources:[]})):promises.push(_servicelocator.itemRepository.getLibraryItem(this.serverId(),stripLocalPrefix(itemId)).then(function(item){return!item||item.SyncStatus&&"synced"!==item.SyncStatus?{MediaSources:[]}:{MediaSources:item.Item.MediaSources.map(function(m){return null!=options.AudioStreamIndex&&(m.DefaultAudioStreamIndex=parseInt(options.AudioStreamIndex)),null!=options.SubtitleStreamIndex&&(m.DefaultSubtitleStreamIndex=parseInt(options.SubtitleStreamIndex)),m.SupportsDirectPlay=!0,m.SupportsDirectStream=!1,m.SupportsTranscoding=!1,m.IsLocal=!0,m.Name="Downloaded version",m.Id="local:"+m.Id,m})}})),Promise.all(promises).then(function(results){for(var result=results[0],localResult=results[1],i=0,length=localResult.MediaSources.length;i<length;i++)result.MediaSources.unshift(localResult.MediaSources[i]);return result})}},{key:"getAudioStreamUrl",value:function(item,transcodingProfile,directPlayContainers,maxBitrate,maxAudioSampleRate,maxAudioBitDepth,startPosition,enableRemoteMedia){var mediaSource;if(isLocalId(item.Id)&&(item.MediaSources&&item.MediaSources.length))return(mediaSource=item.MediaSources[0]).StreamUrl||mediaSource.Path;return babelHelpers.get(babelHelpers.getPrototypeOf(ApiClientEx.prototype),"getAudioStreamUrl",this).apply(this,arguments)}},{key:"getAudioStreamUrls",value:function(items,transcodingProfile,directPlayContainers,maxBitrate,maxAudioSampleRate,maxAudioBitDepth,startPosition,enableRemoteMedia){var self,ids,_this=this;return items.length?isLocalId(items[0].Id)?Promise.resolve(items.map(getLocalUrl)):(self=this,ids=items.map(function(_ref2){return _ref2.Id}),_servicelocator.itemRepository.getLibraryItemPathsByIds(items[0].ServerId,ids).then(function(localItems){var localItemMap={},localUrls=localItems.map(function(libraryItem){return(localItemMap[libraryItem.ItemId]=libraryItem).LocalPath});if(localUrls.length===items.length)return localUrls;if(localItems.length){for(var streamUrls=[],i=0;i<items.length;i++){var item=items[i],streamUrl=void 0;streamUrl=localItemMap[item.Id]?localItemMap[item.Id].LocalPath:babelHelpers.get(babelHelpers.getPrototypeOf(ApiClientEx.prototype),"getAudioStreamUrl",_this).call(self,item,transcodingProfile,directPlayContainers,maxBitrate,maxAudioSampleRate,maxAudioBitDepth,startPosition,enableRemoteMedia),streamUrls.push(streamUrl||"")}return streamUrls}return babelHelpers.get(babelHelpers.getPrototypeOf(ApiClientEx.prototype),"getAudioStreamUrls",_this).call(self,items,transcodingProfile,directPlayContainers,maxBitrate,maxAudioSampleRate,maxAudioBitDepth,startPosition,enableRemoteMedia)})):Promise.resolve([])}},{key:"getItems",value:function(userId,options){var serverInfo=this.serverInfo();if(serverInfo&&"localview"===options.ParentId)return this.getLocalFolders(serverInfo.Id,userId).then(function(items){items={Items:items,TotalRecordCount:items.length};return Promise.resolve(items)});if(serverInfo&&options&&(isLocalId(options.ParentId)||isLocalId(options.SeriesId)||isLocalId(options.SeasonId)||isLocalId(options.AlbumIds)))return getDownloadedItems(serverInfo.Id,options).then(function(result){return result.Items.forEach(function(item){adjustGuidProperties(item)}),Promise.resolve(result)});if(options&&options.ExcludeItemIds&&options.ExcludeItemIds.length){for(var exItems=options.ExcludeItemIds.split(","),i=0;i<exItems.length;i++)if(isLocalId(exItems[i]))return Promise.resolve({Items:[],TotalRecordCount:0})}else if(options&&options.Ids&&options.Ids.length){var localIds,ids=options.Ids.split(","),hasLocal=!1;for(i=0;i<ids.length;i++)if(isLocalId(ids[i])){hasLocal=!0;break}if(hasLocal)return localIds=ids.map(stripLocalPrefix),_servicelocator.itemRepository.getLibraryItemsByIds(serverInfo.Id,localIds).then(function(items){items.forEach(function(_ref3){adjustGuidProperties(_ref3.Item)});items=items.map(function(_ref4){return _ref4.Item}),items={Items:items,TotalRecordCount:items.length};return Promise.resolve(items)})}return babelHelpers.get(babelHelpers.getPrototypeOf(ApiClientEx.prototype),"getItems",this).apply(this,arguments)}},{key:"getItem",value:function(userId,itemId,options){var serverInfo,list,str;if(itemId)return"localview"===(itemId=itemId&&itemId.toString())&&(serverInfo=this.serverInfo())?function(instance,serverId,userId){return instance.getLocalFolders(serverId,userId).then(function(views){var localView=null;return 0<views.length&&(localView={Name:instance.downloadsTitleText||"Downloads",ServerId:serverId,Id:"localview",Type:"localview",IsFolder:!0}),Promise.resolve(localView)})}(this,serverInfo.Id,userId):(str=itemId)&&str.startsWith("localview:")&&(serverInfo=this.serverInfo())?(str=serverInfo.Id,list=(list=getTopLevelViews(str,[],!0)).concat(getMusicFolders(str)),Promise.resolve(list).then(function(items){items=items.filter(function(_ref5){return _ref5.Id===itemId});return 0<items.length?Promise.resolve(items[0]):Promise.reject()})):isLocalId(itemId)?(serverInfo=this.serverInfo())?_servicelocator.itemRepository.getLibraryItem(serverInfo.Id,stripLocalPrefix(itemId)).then(function(item){return item?(adjustGuidProperties(item.Item),Promise.resolve(item.Item)):Promise.reject()}):Promise.reject():babelHelpers.get(babelHelpers.getPrototypeOf(ApiClientEx.prototype),"getItem",this).apply(this,arguments);throw new Error("null itemId")}},{key:"getLocalFolders",value:function(userId){var serverId,serverInfo=this.serverInfo();return userId=userId||serverInfo.UserId,serverId=serverInfo.Id,_servicelocator.itemRepository.getLibarytemTypes(serverId).then(function(types){return getTopLevelViews(serverId,types)}).catch(function(){return[]})}},{key:"getSyncStatus",value:function(item){return isLocalId(item.Id)?Promise.resolve({}):babelHelpers.get(babelHelpers.getPrototypeOf(ApiClientEx.prototype),"getSyncStatus",this).apply(this,arguments)}},{key:"getSeasons",value:function(itemId,options){return isLocalId(itemId)?(options.SeriesId=itemId,options.IncludeItemTypes="Season",options.Recursive?options.SortBy="ParentIndexNumber,IndexNumber":options.SortBy="IndexNumber",this.getItems(this.getCurrentUserId(),options)):babelHelpers.get(babelHelpers.getPrototypeOf(ApiClientEx.prototype),"getSeasons",this).apply(this,arguments)}},{key:"getEpisodes",value:function(itemId,options){return isLocalId(options.SeasonId)||isLocalId(options.seasonId)||isLocalId(itemId)?(options.SeriesId=itemId,options.IncludeItemTypes="Episode",options.SortBy="ParentIndexNumber,IndexNumber,SortName",this.getItems(this.getCurrentUserId(),options)):babelHelpers.get(babelHelpers.getPrototypeOf(ApiClientEx.prototype),"getEpisodes",this).apply(this,arguments)}},{key:"getLatestOfflineItems",value:function(options){options.SortBy="DateCreated",options.SortOrder="Descending",options.EnableTotalRecordCount=!1;var serverInfo=this.serverInfo();return serverInfo?_servicelocator.itemRepository.getLibraryItems(serverInfo.Id,options).then(function(_ref6){_ref6=_ref6.Items;return _ref6.forEach(function(item){adjustGuidProperties(item)}),Promise.resolve(_ref6)}):Promise.resolve([])}},{key:"getImageUrl",value:function(itemId,options){var serverInfo,id;return isLocalId(itemId)||options&&options.itemid&&isLocalId(options.itemid)?(serverInfo=this.serverInfo(),id=stripLocalPrefix(itemId),_localassetmanager.default.getImageUrl(serverInfo.Id,id,options)):babelHelpers.get(babelHelpers.getPrototypeOf(ApiClientEx.prototype),"getImageUrl",this).apply(this,arguments)}},{key:"updateFavoriteStatus",value:function(userId,itemIds,isFavorite){return babelHelpers.get(babelHelpers.getPrototypeOf(ApiClientEx.prototype),"updateFavoriteStatus",this).apply(this,arguments).then(function(response){var serverInfo,promises;return 0<(itemIds=itemIds.filter(isLocalId)).length&&(serverInfo=this.serverInfo())&&(promises=itemIds.map(function(itemId){return function(serverId,itemId,isFavorite){return _servicelocator.itemRepository.getLibraryItem(serverId,stripLocalPrefix(itemId)).then(function(item){var libraryItem=item.Item;return libraryItem.UserData=libraryItem.UserData||{},libraryItem.UserData.IsFavorite=isFavorite,_servicelocator.itemRepository.updateLibraryItem(item.ServerId,item.Id,item).then(function(){return Promise.resolve()})})}(serverInfo.Id,itemId,isFavorite)}),promises=Promise.all(promises)),(promises||Promise.resolve()).then(function(){return response})})}},{key:"markPlayed",value:function(userId,itemIds,date){return babelHelpers.get(babelHelpers.getPrototypeOf(ApiClientEx.prototype),"markPlayed",this).apply(this,arguments).then(function(response){var serverInfo,promises;return 0<(itemIds=itemIds.filter(isLocalId)).length&&(serverInfo=this.serverInfo())&&(promises=itemIds.map(function(itemId){return function(serverId,itemId){return _servicelocator.itemRepository.getLibraryItem(serverId,stripLocalPrefix(itemId)).then(function(item){var libraryItem=item.Item;return libraryItem.UserData=libraryItem.UserData||{},libraryItem.UserData.Played=!0,_servicelocator.itemRepository.updateLibraryItem(item.ServerId,item.Id,item).then(function(){return Promise.resolve()})})}(serverInfo.Id,itemId)}),promises=Promise.all(promises)),(promises||Promise.resolve()).then(function(){return response})})}},{key:"markUnplayed",value:function(userId,itemIds){return babelHelpers.get(babelHelpers.getPrototypeOf(ApiClientEx.prototype),"markUnplayed",this).apply(this,arguments).then(function(response){var serverInfo,promises;return 0<(itemIds=itemIds.filter(isLocalId)).length&&(serverInfo=this.serverInfo())&&(promises=itemIds.map(function(itemId){return function(serverId,itemId){return _servicelocator.itemRepository.getLibraryItem(serverId,stripLocalPrefix(itemId)).then(function(item){var libraryItem=item.Item;return libraryItem.UserData=libraryItem.UserData||{},libraryItem.UserData.Played=!1,_servicelocator.itemRepository.updateLibraryItem(item.ServerId,item.Id,item).then(function(){return Promise.resolve()})})}(serverInfo.Id,itemId)}),promises=Promise.all(promises)),(promises||Promise.resolve()).then(function(){return response})})}},{key:"reportPlaybackStart",value:function(options){if(options)return isLocalId(options.ItemId)?Promise.resolve():babelHelpers.get(babelHelpers.getPrototypeOf(ApiClientEx.prototype),"reportPlaybackStart",this).apply(this,arguments);throw new Error("null options")}},{key:"reportPlaybackProgress",value:function(options){var serverInfo;if(options)return isLocalId(options.ItemId)?(serverInfo=this.serverInfo())?_servicelocator.itemRepository.getLibraryItem(serverInfo.Id,stripLocalPrefix(options.ItemId)).then(function(item){var libraryItem=item.Item;return"Video"===libraryItem.MediaType?(libraryItem.UserData=libraryItem.UserData||{},libraryItem.UserData.PlaybackPositionTicks=options.PositionTicks,libraryItem.UserData.PlayedPercentage=Math.min(libraryItem.RunTimeTicks?(options.PositionTicks||0)/libraryItem.RunTimeTicks*100:0,100),libraryItem.UserData.PlaybackPositionTicks&&libraryItem.RunTimeTicks&&libraryItem.UserData.PlaybackPositionTicks>=.9*libraryItem.RunTimeTicks&&(libraryItem.UserData.Played=!0,libraryItem.UserData.PlaybackPositionTicks=0,libraryItem.UserData.PlayedPercentage=0),_servicelocator.itemRepository.updateLibraryItem(item.ServerId,item.Id,item)):Promise.resolve()}):Promise.resolve():babelHelpers.get(babelHelpers.getPrototypeOf(ApiClientEx.prototype),"reportPlaybackProgress",this).apply(this,arguments);throw new Error("null options")}},{key:"reportPlaybackStopped",value:function(options){var serverInfo,instance;if(options)return isLocalId(options.ItemId)?(serverInfo=this.serverInfo())?(instance=this,_servicelocator.itemRepository.getLibraryItem(serverInfo.Id,stripLocalPrefix(options.ItemId)).then(function(item){var libraryItem=item.Item;if("Video"===libraryItem.MediaType)return libraryItem.UserData=libraryItem.UserData||{},libraryItem.UserData.PlaybackPositionTicks=options.PositionTicks,libraryItem.UserData.PlayedPercentage=Math.min(libraryItem.RunTimeTicks?(options.PositionTicks||0)/libraryItem.RunTimeTicks*100:0,100),libraryItem.UserData.PlaybackPositionTicks&&libraryItem.RunTimeTicks&&libraryItem.UserData.PlaybackPositionTicks>=.9*libraryItem.RunTimeTicks&&(libraryItem.UserData.Played=!0,libraryItem.UserData.PlaybackPositionTicks=0,libraryItem.UserData.PlayedPercentage=0),_servicelocator.itemRepository.updateLibraryItem(item.ServerId,item.Id,item).then(function(){var d,action={Date:Date.now(),ItemId:stripLocalPrefix(options.ItemId),PositionTicks:options.PositionTicks,ServerId:serverInfo.Id,Type:0,UserId:instance.getCurrentUserId(),Id:(d=Date.now(),window.performance&&"function"==typeof window.performance.now&&(d+=performance.now()),"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c){var r=(d+16*Math.random())%16|0;return d=Math.floor(d/16),("x"===c?r:3&r|8).toString(16)}))};return _servicelocator.userActionRepository.addUserAction(action.Id,action)})})):Promise.resolve():babelHelpers.get(babelHelpers.getPrototypeOf(ApiClientEx.prototype),"reportPlaybackStopped",this).apply(this,arguments);throw new Error("null options")}},{key:"getLiveTvPrograms",value:function(){var options=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};return options&&options.LibrarySeriesId&&isLocalId(options.LibrarySeriesId)?Promise.resolve({Items:[],TotalRecordCount:0}):babelHelpers.get(babelHelpers.getPrototypeOf(ApiClientEx.prototype),"getLiveTvPrograms",this).apply(this,arguments)}},{key:"getItemDownloadUrl",value:function(itemId){var serverInfo;return isLocalId(itemId)?(serverInfo=this.serverInfo())?_servicelocator.itemRepository.getLibraryItem(serverInfo.Id,stripLocalPrefix(itemId)).then(function(_ref7){_ref7=_ref7.LocalPath;return Promise.resolve(_ref7)}):Promise.reject():babelHelpers.get(babelHelpers.getPrototypeOf(ApiClientEx.prototype),"getItemDownloadUrl",this).apply(this,arguments)}},{key:"deleteItems",value:function(items){var itemIds,instance;if(items)return itemIds=items.map(mapToId).filter(isLocalId),instance=this,babelHelpers.get(babelHelpers.getPrototypeOf(ApiClientEx.prototype),"deleteItems",this).apply(instance,arguments).then(function(){return Promise.all(itemIds.map(function(itemId){return _servicelocator.itemRepository.getLibraryItem(instance.serverId(),stripLocalPrefix(itemId)).then(function(item){return item?_localassetmanager.default.removeLocalItem(item).then(syncNow):Promise.resolve()})}))});throw new Error("null itemId")}},{key:"getPrefixes",value:function(userId,options){return isLocalId(options.ParentId)||isLocalId(options.GenreIds)||isLocalId(options.ArtistIds)||isLocalId(options.StudioIds)?Promise.resolve([]):babelHelpers.get(babelHelpers.getPrototypeOf(ApiClientEx.prototype),"getPrefixes",this).apply(this,arguments)}}]),ApiClientEx}(_apiclient.default);_exports.default=_apiclient});