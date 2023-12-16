define(["exports","./../modules/tabbedview/basetab.js","./../modules/emby-elements/emby-itemscontainer/emby-itemscontainer.js","./../modules/emby-elements/emby-button/emby-button.js","./../modules/emby-elements/emby-scroller/emby-scroller.js","./../modules/common/datetime.js","./../modules/emby-apiclient/connectionmanager.js","./../modules/emby-apiclient/events.js","./../modules/imageloader/imageloader.js","./../modules/cardbuilder/cardbuilder.js","./../modules/common/input/api.js"],function(_exports,_basetab,_embyItemscontainer,_embyButton,_embyScroller,_datetime,_connectionmanager,_events,_imageloader,_cardbuilder,_api){function LiveTvScheduleTab(view,params){_basetab.default.apply(this,arguments),this.view=view,this.params=params,this.apiClient=_connectionmanager.default.getApiClient(params.serverId),this.activeRecordingsItemsContainer=view.querySelector(".activeRecordings .itemsContainer"),this.activeRecordingsItemsContainer.fetchData=function(){var apiClient=this.apiClient;return apiClient.getLiveTvRecordings({UserId:apiClient.getCurrentUserId(),IsInProgress:!0,Fields:this.getRequestedItemFields()+",PrimaryImageAspectRatio",EnableTotalRecordCount:!1,EnableImageTypes:"Primary,Thumb,Backdrop"})}.bind(this),this.activeRecordingsItemsContainer.getListOptions=function(){return{renderer:_cardbuilder.default,options:{shape:"autooverflow",cardLayout:!1,fields:["ParentNameOrName","ChannelName","AirTime"],showAirEndTime:!0,preferThumb:"auto",centerText:!0,multiSelect:!1},virtualScrollLayout:"horizontal-grid"}}.bind(this),this.activeRecordingsItemsContainer.parentContainer=this.activeRecordingsItemsContainer.closest(".verticalSection")}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,Object.assign(LiveTvScheduleTab.prototype,_basetab.default.prototype),LiveTvScheduleTab.prototype.onResume=function(options){_basetab.default.prototype.onResume.apply(this,arguments),this.serverNotificationHandler||(serverNotificationHandler=function(){this.paused?this.needsRefresh=!0:this.onResume({refresh:!0})}.bind(this),_events.default.on(_api.default,"TimerCreated",serverNotificationHandler),_events.default.on(_api.default,"TimerCancelled",serverNotificationHandler),_events.default.on(_api.default,"RecordingStarted",serverNotificationHandler),_events.default.on(_api.default,"RecordingEnded",serverNotificationHandler),this.serverNotificationHandler=serverNotificationHandler);var serverNotificationHandler=this.apiClient,promises=[],view=this.view,autoFocus=(options=options||{}).autoFocus||view.contains(document.activeElement),instance=(this.needsRefresh&&(options.refresh=!0,this.needsRefresh=!1),promises.push(this.activeRecordingsItemsContainer.resume(options)),options.refresh&&(promises.push(serverNotificationHandler.getLiveTvTimers({IsActive:!1,IsScheduled:!0})),promises[1].then(function(result){return function(view,timers){for(var items=timers.map(function(t){return t.Type="Timer",t}),groups=[],currentGroupName="",currentGroup=[],timers=_imageloader.default.getPrimaryImageAspectRatio(items)||1,i=0,length=items.length;i<length;i++){var item=items[i],dateText="";if(item.StartDate)try{var premiereDate=_datetime.default.parseISO8601Date(item.StartDate,!0),dateText=_datetime.default.toLocaleDateString(premiereDate,{weekday:"long",month:"short",day:"numeric"})}catch(err){}dateText!==currentGroupName?(currentGroup.length&&groups.push({name:currentGroupName,items:currentGroup}),currentGroupName=dateText,currentGroup=[item]):currentGroup.push(item)}currentGroup.length&&groups.push({name:currentGroupName,items:currentGroup});var html="";for(i=0,length=groups.length;i<length;i++)html=(html=(html=(html+='<div class="verticalSection verticalSection-cards">')+('<h2 class="sectionTitle sectionTitle-cards padded-left padded-left-page">'+groups[i].name+"</h2>")+'<div is="emby-scroller" class="padded-top-focusscale padded-bottom-focusscale" data-framesize="matchgrandparent" data-focusscroll="true" data-mousewheel="false">')+'<div is="emby-itemscontainer" data-focusabletype="nearest" class="itemsContainer scrollSlider focusable focuscontainer-x padded-left padded-left-page padded-right">'+"</div>")+"</div>"+"</div>";var view=view.querySelector(".upcomingRecordings"),itemsContainers=(html?view.classList.remove("hide"):view.classList.add("hide"),view.innerHTML=html,view.querySelectorAll(".itemsContainer")),cardLayout=1.5<=timers;for(i=0,length=groups.length;i<length;i++)_cardbuilder.default.buildCards(groups[i].items,{itemsContainer:itemsContainers[i],shape:"autooverflow",fields:["ParentNameOrName","ChannelName","AirTime"],showAirEndTime:!0,cardLayout:cardLayout,centerText:!cardLayout,action:"edit",cardFooterAside:!1,showChannelLogo:cardLayout,preferThumb:cardLayout||null,multiSelect:!1})}(view,result.Items),Promise.resolve()})),this);Promise.all(promises).then(function(responses){autoFocus&&instance.autoFocus()})},LiveTvScheduleTab.prototype.onPause=function(){_basetab.default.prototype.onPause.apply(this,arguments),this.activeRecordingsItemsContainer.pause()},LiveTvScheduleTab.prototype.destroy=function(){_basetab.default.prototype.destroy.apply(this,arguments);var serverNotificationHandler=this.serverNotificationHandler;serverNotificationHandler&&(_events.default.off(_api.default,"TimerCreated",serverNotificationHandler),_events.default.off(_api.default,"TimerCancelled",serverNotificationHandler),_events.default.off(_api.default,"RecordingStarted",serverNotificationHandler),_events.default.off(_api.default,"RecordingEnded",serverNotificationHandler),this.serverNotificationHandler=null),this.view=null,this.params=null,this.apiClient=null,this.activeRecordingsItemsContainer=null};_exports.default=LiveTvScheduleTab});