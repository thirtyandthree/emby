define(["exports","./../modules/emby-apiclient/connectionmanager.js","./../modules/tabbedview/basetab.js","./../modules/common/globalize.js","./../modules/emby-elements/emby-itemscontainer/emby-itemscontainer.js","./../modules/emby-elements/emby-button/emby-button.js","./../modules/emby-elements/emby-scroller/emby-scroller.js","./../modules/common/usersettings/usersettings.js","./../modules/cardbuilder/cardbuilder.js"],function(_exports,_connectionmanager,_basetab,_globalize,_embyItemscontainer,_embyButton,_embyScroller,_usersettings,_cardbuilder){function LiveTvSuggestionsTab(view,params){_basetab.default.apply(this,arguments),this.view=view,this.params=params,this.apiClient=_connectionmanager.default.getApiClient(params.serverId),function(view,params){[].forEach.call(view.querySelectorAll(".sectionTitleTextButton-programs"),function(link){var href=link.getAttribute("data-href");href&&(link.href=href+"&serverId="+params.serverId)})}(view,params),view.addEventListener("click",onViewClick),this.onNowItemsContainer=view.querySelector(".activePrograms .itemsContainer"),this.onNowItemsContainer.fetchData=function(query){var apiClient=this.apiClient;return query=Object.assign({UserId:apiClient.getCurrentUserId(),IsAiring:!0,ImageTypeLimit:1,EnableImageTypes:"Primary,Thumb,Backdrop",Fields:"ProgramPrimaryImageAspectRatio",EnableUserData:!1,SortBy:"ChannelNumber,SortName"},query),_usersettings.default.addLiveTvChannelSortingToQuery(query,_globalize.default),apiClient.getLiveTvChannels(query)}.bind(this),this.onNowItemsContainer.getListOptions=function(items){return getListOptions(items,"play",{fields:["CurrentProgramName","CurrentProgramParentName","CurrentProgramTime"],showCurrentProgramImage:!0,defaultShape:"portrait",action:"programlink",programsAsSeries:!1},{createRecording:!1})}.bind(this),this.onNowItemsContainer.parentContainer=this.onNowItemsContainer.closest(".verticalSection"),this.tagsItemsContainer=view.querySelector(".tagsSection .itemsContainer"),this.tagsItemsContainer.fetchData=function(query){var apiClient=this.apiClient;return apiClient.getLiveTvChannelTags({Fields:"PrimaryImageAspectRatio,ChannelImageIfNoImage",EnableImageTypes:"Primary,Thumb",Recursive:!0,UserId:apiClient.getCurrentUserId(),SortBy:"SortName",Limit:30})}.bind(this),this.tagsItemsContainer.getListOptions=function(items){return{renderer:_cardbuilder.default,options:{overlayPlayButton:!1,sideFooter:!0,smallSideFooter:!0,multiSelect:!1,image:!1,imageFallback:!1,imageContainer:!1,hoverMenu:!1,contextMenu:!1,centerText:!0,fields:["Name"],draggable:!1,autoWidth:!0,cardBoxClass:"buttonCardBox"},virtualScrollLayout:"horizontal-grid"}}.bind(this),this.tagsItemsContainer.parentContainer=this.tagsItemsContainer.closest(".verticalSection"),this.newEpisodeItemsContainer=view.querySelector(".newEpisodes .itemsContainer"),this.newEpisodeItemsContainer.fetchData=function(query){var apiClient=this.apiClient;return apiClient.getItems(apiClient.getCurrentUserId(),Object.assign({HasAired:!1,IsSports:!1,IsKids:!1,IsNews:!1,IsSeries:!0,Fields:"PrimaryImageAspectRatio,ChannelImageIfNoImage",EnableImageTypes:"Primary,Thumb",IncludeItemTypes:"Program",Recursive:!0,SortBy:"StartDate",GroupProgramsBySeries:!0,IsNewOrPremiere:!0},query))}.bind(this),this.newEpisodeItemsContainer.getListOptions=function(items){return getListOptions(items,null,{showAirDateTime:!0,fields:["ParentName","Name","AirTime"]})}.bind(this),this.newEpisodeItemsContainer.parentContainer=this.newEpisodeItemsContainer.closest(".verticalSection"),this.episodeItemsContainer=view.querySelector(".upcomingEpisodes .itemsContainer"),this.episodeItemsContainer.fetchData=function(query){var apiClient=this.apiClient;return apiClient.getItems(apiClient.getCurrentUserId(),Object.assign({HasAired:!1,IsSports:!1,IsKids:!1,IsNews:!1,IsSeries:!0,Fields:"PrimaryImageAspectRatio,ChannelImageIfNoImage",EnableImageTypes:"Primary,Thumb",IncludeItemTypes:"Program",Recursive:!0,SortBy:"StartDate",GroupProgramsBySeries:!0},query))}.bind(this),this.episodeItemsContainer.getListOptions=function(items){return getListOptions(items,null,{showAirDateTime:!0,fields:["ParentName","Name","AirTime"]})}.bind(this),this.episodeItemsContainer.parentContainer=this.episodeItemsContainer.closest(".verticalSection"),this.movieItemsContainer=view.querySelector(".upcomingTvMovies .itemsContainer"),this.movieItemsContainer.fetchData=function(query){var apiClient=this.apiClient;return apiClient.getItems(apiClient.getCurrentUserId(),Object.assign({HasAired:!1,IsMovie:!0,IsKids:!1,Fields:"PrimaryImageAspectRatio,ProductionYear,ChannelImageIfNoImage",EnableImageTypes:"Primary,Thumb",IncludeItemTypes:"Program",Recursive:!0,SortBy:"StartDate",GroupProgramsBySeries:!0},query))}.bind(this),this.movieItemsContainer.getListOptions=function(items){return getListOptions(items,null,{shape:"portrait",preferThumb:null,fields:["Name","ProductionYear","AirTime"],showAirDateTime:!0})}.bind(this),this.movieItemsContainer.parentContainer=this.movieItemsContainer.closest(".verticalSection"),this.sportsItemsContainer=view.querySelector(".upcomingSports .itemsContainer"),this.sportsItemsContainer.fetchData=function(query){var apiClient=this.apiClient;return apiClient.getItems(apiClient.getCurrentUserId(),Object.assign({HasAired:!1,IsSports:!0,Fields:"PrimaryImageAspectRatio,ChannelImageIfNoImage",EnableImageTypes:"Primary,Thumb",IncludeItemTypes:"Program",Recursive:!0,SortBy:"StartDate"},query))}.bind(this),this.sportsItemsContainer.getListOptions=function(items){return getListOptions(items,null,{programsAsSeries:!1,fields:["ParentName","Name","AirTime"],showAirDateTime:!0})}.bind(this),this.sportsItemsContainer.parentContainer=this.sportsItemsContainer.closest(".verticalSection"),this.kidsItemsContainer=view.querySelector(".upcomingKids .itemsContainer"),this.kidsItemsContainer.fetchData=function(query){var apiClient=this.apiClient;return apiClient.getItems(apiClient.getCurrentUserId(),Object.assign({HasAired:!1,IsKids:!0,Fields:"PrimaryImageAspectRatio,ChannelImageIfNoImage",EnableImageTypes:"Primary,Thumb",IncludeItemTypes:"Program",Recursive:!0,SortBy:"StartDate",GroupProgramsBySeries:!0},query))}.bind(this),this.kidsItemsContainer.getListOptions=function(items){return getListOptions(items,null,{showAirDateTime:!0,fields:["ParentName","Name","AirTime"]})}.bind(this),this.kidsItemsContainer.parentContainer=this.kidsItemsContainer.closest(".verticalSection"),this.newsItemsContainer=view.querySelector(".upcomingNews .itemsContainer"),this.newsItemsContainer.fetchData=function(query){var apiClient=this.apiClient;return apiClient.getItems(apiClient.getCurrentUserId(),Object.assign({HasAired:!1,IsNews:!0,Fields:"PrimaryImageAspectRatio,ChannelImageIfNoImage",EnableImageTypes:"Primary,Thumb",IncludeItemTypes:"Program",Recursive:!0,SortBy:"StartDate",GroupProgramsBySeries:!0},query))}.bind(this),this.newsItemsContainer.getListOptions=function(items){return getListOptions(items,null,{showAirDateTime:!0,fields:["ParentName","Name","AirTime"]})}.bind(this),this.newsItemsContainer.parentContainer=this.newsItemsContainer.closest(".verticalSection")}function onViewClick(e){e=e.target.closest(".textButtonCard");e&&e.closest(".verticalSection").querySelector(".btnMore").click()}function isNotName(n){return"Name"!==n}function isNotParentName(n){return"ParentName"!==n}function isNotAirTime(n){return"AirTime"!==n}function getListOptions(items,overlayButton,options,commandOptions){return options=Object.assign({preferThumb:"auto",inheritThumb:!1,shape:"autooverflow",centerText:!0,overlayPlayButton:"play"===overlayButton,multiSelect:!1,programsAsSeries:!0,focusTransformTitleAdjust:!0},options),items.length&&items[0].AsSeries&&(options.progress=!1,options.showAirDateTime=!1,options.fields=options.fields.filter(isNotName).filter(isNotParentName).filter(isNotAirTime),options.fields.push("ParentNameOrName")),{renderer:_cardbuilder.default,options:options,virtualScrollLayout:"horizontal-grid",commandOptions:commandOptions}}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,Object.assign(LiveTvSuggestionsTab.prototype,_basetab.default.prototype),LiveTvSuggestionsTab.prototype.onResume=function(options){_basetab.default.prototype.onResume.apply(this,arguments);var promises=[],instance=(promises.push(this.onNowItemsContainer.resume(options)),promises.push(this.tagsItemsContainer.resume(options)),promises.push(this.newEpisodeItemsContainer.resume(options)),promises.push(this.episodeItemsContainer.resume(options)),promises.push(this.movieItemsContainer.resume(options)),promises.push(this.sportsItemsContainer.resume(options)),promises.push(this.kidsItemsContainer.resume(options)),promises.push(this.newsItemsContainer.resume(options)),this);Promise.all(promises).then(function(){options.autoFocus&&instance.autoFocus()})},LiveTvSuggestionsTab.prototype.onPause=function(){_basetab.default.prototype.onPause.apply(this,arguments),this.onNowItemsContainer.pause(),this.tagsItemsContainer.pause(),this.newEpisodeItemsContainer.pause(),this.episodeItemsContainer.pause(),this.movieItemsContainer.pause(),this.sportsItemsContainer.pause(),this.kidsItemsContainer.pause(),this.newsItemsContainer.pause()},LiveTvSuggestionsTab.prototype.destroy=function(){_basetab.default.prototype.destroy.apply(this,arguments),this.view=null,this.params=null,this.apiClient=null,this.onNowItemsContainer=null,this.tagsItemsContainer=null,this.newEpisodeItemsContainer=null,this.episodeItemsContainer=null,this.movieItemsContainer=null,this.sportsItemsContainer=null,this.kidsItemsContainer=null,this.newsItemsContainer=null};_exports.default=LiveTvSuggestionsTab});