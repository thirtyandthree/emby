define(["exports","./../modules/approuter.js","./../modules/loading/loading.js","./../modules/cardbuilder/cardbuilder.js","./../modules/common/servicelocator.js","./../modules/common/globalize.js","./../modules/common/input/api.js","./../modules/emby-apiclient/events.js","./../modules/emby-apiclient/connectionmanager.js","./../modules/emby-elements/emby-button/emby-button.js","./../modules/emby-elements/emby-itemscontainer/emby-itemscontainer.js","./../modules/viewmanager/baseview.js","./../components/activitylog.js"],function(_exports,_approuter,_loading,_cardbuilder,_servicelocator,_globalize,_api,_events,_connectionmanager,_embyButton,_embyItemscontainer,_baseview,_activitylog){function showConfirm(options){return Emby.importModule("./modules/common/dialogs/confirm.js").then(function(confirm){return confirm(options)})}function showActionSheet(options){return Emby.importModule("./modules/actionsheet/actionsheet.js").then(function(ActionSheet){return ActionSheet.show(options)})}function buttonEnabled(elem,enabled){enabled?(elem.setAttribute("disabled",""),elem.removeAttribute("disabled")):elem.setAttribute("disabled","disabled")}function showEditServerNameDialog(page){var options;options={label:_globalize.default.translate("LabelFriendlyServerName"),description:_globalize.default.translate("LabelFriendlyServerNameHelp"),value:page.querySelector(".serverNameHeader").innerHTML,confirmText:_globalize.default.translate("Save")},Emby.importModule("./modules/prompt/prompt.js").then(function(prompt){return prompt(options)}).then(function(value){_loading.default.show(),ApiClient.getServerConfiguration().then(function(config){config.ServerName=value,ApiClient.updateServerConfiguration(config).then(function(){page.querySelector(".serverNameHeader").innerHTML=value,_loading.default.hide()})})})}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,require(["flexStyles","css!dashboard/dashboard.css"]);var DashboardPage={startInterval:function(apiClient){apiClient.startMessageListener("Sessions","0,1500,0,true,true"),apiClient.startMessageListener("ScheduledTasksInfo","0,1000")},stopInterval:function(apiClient){apiClient.stopMessageListener("Sessions"),apiClient.stopMessageListener("ScheduledTasksInfo")},systemUpdateTaskKey:"SystemUpdateTask",renderUrls:function(page,systemInfo){var localAccessHtml,localUrlElem=page.querySelector(".localUrl"),page=page.querySelector(".externalUrl");systemInfo.LocalAddress?(localAccessHtml=_globalize.default.translate("LabelLocalAccessUrl",'<a is="emby-linkbutton" class="button-link" href="'+systemInfo.LocalAddress+'" target="_blank">'+systemInfo.LocalAddress+"</a>"),localUrlElem.innerHTML=localAccessHtml,localUrlElem.classList.remove("hide")):localUrlElem.classList.add("hide"),systemInfo.WanAddress?(localAccessHtml=systemInfo.WanAddress,localUrlElem=_globalize.default.translate("LabelRemoteAccessUrl",'<a is="emby-linkbutton" class="button-link" href="'+localAccessHtml+'" target="_blank">'+localAccessHtml+"</a>"),page.innerHTML=localUrlElem,page.classList.remove("hide")):page.classList.add("hide")},renderSupporterIcon:function(page,pluginSecurityInfo){page=page.querySelector(".supporterIconContainer");pluginSecurityInfo.IsMBSupporter?(page.classList.remove("hide"),page.innerHTML='<a is="emby-linkbutton" class="button-link imageLink supporterIcon" href="'+_approuter.default.getRouteUrl("premiere")+'" title="Emby Premiere" aria-label="Emby Premiere"><img src="css/images/supporter/supporterbadge.png" style="height:2em;" /></a>'):page.classList.add("hide")},installPluginUpdate:function(button){buttonEnabled(button,!1);var name=button.getAttribute("data-name"),guid=button.getAttribute("data-guid"),version=button.getAttribute("data-version"),button=button.getAttribute("data-classification");_loading.default.show(),ApiClient.installPlugin(name,guid,button,version).then(function(){_loading.default.hide()})},restartServer:function(){require(["serverRestartDialog"],function(ServerRestartDialog){new ServerRestartDialog({apiClient:ApiClient}).show()})},restart:function(btn){showConfirm({title:_globalize.default.translate("Restart"),text:_globalize.default.translate("MessageConfirmRestart"),confirmText:_globalize.default.translate("Restart"),primary:"cancel"}).then(function(){DashboardPage.restartServer()})},shutdown:function(btn){showConfirm({title:_globalize.default.translate("Shutdown"),text:_globalize.default.translate("MessageConfirmShutdown"),confirmText:_globalize.default.translate("Shutdown"),primary:"cancel"}).then(function(){ApiClient.shutdownServer()})}};function getServerInfoRow(name,value){var html="";return html+"<tr>"+'<th class="secondaryText text-align-end" style="font-weight:500;margin:0;padding:0 .5em 0 0;vertical-align:top;">'+_globalize.default.translate(name)+"</th>"+'<td class="text-align-start" style="margin:0;padding:0;vertical-align:top;">'+value+"</td>"+"</tr>"}function showServerInfo(){ApiClient.getSystemInfo().then(function(systemInfo){var options,html="",html=(html=(html=(html=(html=(html=(html=(html+='<table style="margin:0 auto;">')+getServerInfoRow(_globalize.default.translate("Version"),systemInfo.Version))+function(name){var html="";return html+"<tr>"+'<th class="text-align-end" style="font-weight:normal;margin: 0;padding: 0 .5em 0 0;vertical-align:top;">'+('<h3 style="margin:.5em 0;font-weight:500;">'+_globalize.default.translate(name)+"</h3>")+"</th>"+'<td class="text-align-start" style="margin:0;padding:0;vertical-align:top;">'+"</td>"+"</tr>"}(_globalize.default.translate("Folders")))+getServerInfoRow(_globalize.default.translate("HeaderProgramData"),systemInfo.ProgramDataPath))+getServerInfoRow(_globalize.default.translate("Cache"),systemInfo.CachePath))+getServerInfoRow(_globalize.default.translate("Metadata"),systemInfo.InternalMetadataPath))+getServerInfoRow(_globalize.default.translate("Logs"),systemInfo.LogPath))+getServerInfoRow(_globalize.default.translate("HeaderTranscodingTemporaryFiles"),systemInfo.TranscodingTempPath);options={html:html+="</table>",title:systemInfo.ServerName},Emby.importModule("./modules/common/dialogs/alert.js").then(function(alert){return alert(options)})})}function onShowServerMenuClick(e){var btn=e.target,e=[];return e.push({name:_globalize.default.translate("ChangeServerDisplayName"),id:"editname",icon:"edit"}),e.push({name:_globalize.default.translate("HeaderViewServerInfo"),id:"serverinfo",icon:"insights"}),showActionSheet({items:e,positionTo:btn,positionY:"center",positionX:"right",transformOrigin:"left top",hasItemIcon:!0}).then(function(id){switch(id){case"editname":showEditServerNameDialog(btn.closest(".page"));break;case"restart":DashboardPage.restart(btn);break;case"shutdown":DashboardPage.shutdown(btn);break;case"serverinfo":showServerInfo()}},function(){})}function onUpdateServerClick(){var page=this.closest(".page");buttonEnabled(page.querySelector(".btnUpdateApplication"),!1),_loading.default.show(),ApiClient.getScheduledTasks().then(function(tasks){tasks=tasks.filter(function(t){return t.Key===DashboardPage.systemUpdateTaskKey})[0];ApiClient.startScheduledTask(tasks.Id).then(function(){pollScheduledTasks(page,ApiClient),_loading.default.hide()})})}function onPowerMenuClick(e){ApiClient.getSystemInfo().then(function(systemInfo){var btn=e.target,menuItems=[];return systemInfo.CanSelfRestart&&menuItems.push({name:_globalize.default.translate("RestartServer"),id:"restart",icon:"&#xE5D5;"}),menuItems.push({name:_globalize.default.translate("ShutdownServer"),id:"shutdown",icon:"&#xE8AC;"}),showActionSheet({items:menuItems,positionTo:btn,positionY:"center",positionX:"right",transformOrigin:"left top",hasItemIcon:!0}).then(function(id){switch(id){case"editname":showEditServerNameDialog(btn.closest(".page"));break;case"restart":DashboardPage.restart(btn);break;case"shutdown":DashboardPage.shutdown(btn)}})})}function getActiveRecordingsListOptions(items){return{renderer:_cardbuilder.default,options:{shape:"auto",defaultShape:"backdrop",fields:["ParentName","Name","ChannelName","AirTime"],coverImage:!0,cardLayout:!1,centerText:!0,preferThumb:"auto",multiSelect:!1,showAirEndTime:!0},virtualScrollLayout:"vertical-grid"}}function sortSessions(a,b){return a.NowPlayingItem&&!b.NowPlayingItem?-1:b.NowPlayingItem&&!a.NowPlayingItem?1:0}function filterSessions(sessions,apiClient){for(var list=[],serverId=apiClient.serverId(),i=0,length=sessions.length;i<length;i++){var session=sessions[i];session.NowPlayingItem&&(session.ServerId=serverId,session.Type="ActiveSession",list.push(session))}return list.sort(sortSessions),list}function getActiveSessionsListOptions(items){return{renderer:_cardbuilder.default,options:{shape:"auto",fields:["SessionNowPlayingInfo"],preferThumb:"auto",multiSelect:!1,contextMenu:!1,cardClass:"activeSession",overlayPlayButton:!1,sideFooter:!0,centerText:!1,draggable:!1,action:"session_shownowplayingitem"},virtualScrollLayout:"vertical-grid"}}function renderHasPendingRestart(view,apiClient,serverName,hasPendingRestart,isShuttingDown,hasUpdateAvailable){hasUpdateAvailable?view.querySelector(".pUpToDate").classList.add("hide"):view.querySelector(".pUpToDate").classList.remove("hide"),hasPendingRestart&&!isShuttingDown?view.querySelector(".restartInfoBanner").classList.remove("hide"):view.querySelector(".restartInfoBanner").classList.add("hide"),!hasPendingRestart&&hasUpdateAvailable?apiClient.getAvailableApplicationUpdate().then(function(packageInfo){packageInfo=packageInfo[0];packageInfo?(view.querySelector(".pUpdateNow").classList.remove("hide"),view.querySelector(".newVersionText").innerHTML=_globalize.default.translate("NewVersionOfXAvailableForY","Emby Server "+packageInfo.versionStr,serverName)):view.querySelector(".pUpdateNow").classList.add("hide")}):view.querySelector(".pUpdateNow").classList.add("hide")}function reloadSystemInfo(view,apiClient){apiClient.getSystemInfo().then(function(systemInfo){view.querySelector(".serverNameHeader").innerHTML=systemInfo.ServerName;var versionText=systemInfo.Version,versionText=_globalize.default.translate("VersionNumber",'<a is="emby-linkbutton" class="button-link" href="dashboard/releasenotes.html?version='+versionText+'">'+versionText+"</a>");systemInfo.SystemUpdateLevel&&"Release"!==systemInfo.SystemUpdateLevel?(versionText+=" "+_globalize.default.translate("Option"+systemInfo.SystemUpdateLevel).toLowerCase(),view.querySelector(".betaInfo").classList.remove("hide")):view.querySelector(".betaInfo").classList.add("hide"),view.querySelector(".appVersionNumber").innerHTML=versionText,systemInfo.SupportsHttps?view.querySelector(".ports").innerHTML=_globalize.default.translate("LabelRunningOnPorts",systemInfo.HttpServerPortNumber,systemInfo.HttpsPortNumber):view.querySelector(".ports").innerHTML=_globalize.default.translate("LabelRunningOnPort",systemInfo.HttpServerPortNumber),DashboardPage.renderUrls(view,systemInfo),systemInfo.CanSelfUpdate?(view.querySelector(".btnUpdateApplication").classList.remove("hide"),view.querySelector(".btnManualUpdateContainer").classList.add("hide")):(view.querySelector(".btnUpdateApplication").classList.add("hide"),view.querySelector(".btnManualUpdateContainer").classList.remove("hide")),"synology"===systemInfo.PackageName?view.querySelector(".btnManualUpdateContainer").innerHTML=_globalize.default.translate("SynologyUpdateInstructions"):view.querySelector(".btnManualUpdateContainer").innerHTML='<a is="emby-linkbutton" class="button-link" href="https://emby.media/download" target="_blank">'+_globalize.default.translate("PleaseUpdateManually")+"</a>",renderHasPendingRestart(view,apiClient,systemInfo.ServerName,systemInfo.HasPendingRestart,systemInfo.IsShuttingDown,systemInfo.HasUpdateAvailable)})}function pollScheduledTasks(view,apiClient){apiClient.getScheduledTasks().then(function(tasks){renderRunningTasks(view,tasks)})}function renderRunningTasks(view,tasks){var html="";(tasks=tasks.filter(function(t){return"Idle"!==t.State&&!t.IsHidden})).length?view.querySelector(".runningTasksContainer").classList.remove("hide"):view.querySelector(".runningTasksContainer").classList.add("hide"),tasks.filter(function(t){return t.Key===DashboardPage.systemUpdateTaskKey}).length?buttonEnabled(view.querySelector(".btnUpdateApplication"),!1):buttonEnabled(view.querySelector(".btnUpdateApplication"),!0);for(var i=0,length=tasks.length;i<length;i++){var progress,task=tasks[i];html=(html+="<div>")+("<div>"+task.Name+"</div>")+'<div class="flex align-items-center">',"Running"===task.State?html=(html=(html+='<div class="itemProgressBar itemProgressBarRound flex-grow" title="'+(progress=(task.CurrentProgressPercentage||0).toFixed(1))+'%" aria-label="'+progress+'%" style="height:.4em;width:5em;">')+'<div class="itemProgressBarForeground itemProgressBarForegroundRound" style="width:'+progress+'%;"></div></div>')+'<button type="button" is="paper-icon-button-light" title="'+_globalize.default.translate("Stop")+'" aria-label="'+_globalize.default.translate("Stop")+'" onclick="window.stopDashboardTask(this, \''+task.Id+'\');" class="autoSize"><i class="md-icon">cancel</i></button>':"Cancelling"===task.State&&(html+='<span style="color:#cc0000;">'+_globalize.default.translate("LabelStopping")+"</span>"),html=html+"</div>"+"</div>"}view.querySelector(".divRunningTasks").innerHTML=html}function ServerDashboardView(view,params){_baseview.default.apply(this,arguments);var self=this,serverId=ApiClient.serverId();function onRestartRequired(e,apiClient){var serverName;apiClient.serverId()===serverId&&(serverName=view.querySelector(".serverNameHeader").innerHTML,renderHasPendingRestart(view,apiClient,serverName,!0))}function onServerShuttingDown(e,apiClient){var serverName;apiClient.serverId()===serverId&&(serverName=view.querySelector(".serverNameHeader").innerHTML,renderHasPendingRestart(view,apiClient,serverName,!0,!0))}function onServerRestarting(e,apiClient){var serverName;apiClient.serverId()===serverId&&(serverName=view.querySelector(".serverNameHeader").innerHTML,renderHasPendingRestart(view,apiClient,serverName,!0,!0))}function onPackageInstalling(e,apiClient){apiClient.serverId()===serverId&&(pollScheduledTasks(view,apiClient),reloadSystemInfo(view,apiClient))}function onPackageInstallationCompleted(e,apiClient){apiClient.serverId()===serverId&&(pollScheduledTasks(view,apiClient),reloadSystemInfo(view,apiClient))}function setNowPlayingItems(items){var itemsContainer=self.nowPlayingSessionsItemsContainer;if(function(itemsContainer,items){for(var lookup={},i=0,length=items.length;i<length;i++){var item=items[i];if(lookup[item.Id]=!0,-1===itemsContainer.indexOfItemId(item.Id))return 1}for(var currentItems=itemsContainer.getItems()||[],_i=0,_length=currentItems.length;_i<_length;_i++)if(!lookup[currentItems[_i].Id])return 1}(itemsContainer,items))self._activeSessions=items,itemsContainer.resume(Object.assign({},{refresh:!0}));else for(var i=0,length=items.length;i<length;i++){var item=items[i],index=itemsContainer.indexOfItemId(item.Id);-1!==index&&itemsContainer.onItemUpdated(index,item)}}function onSessionsUpdate(e,apiClient,info){apiClient.serverId()===serverId&&(self.paused?(self._activeSessions=null,self.nowPlayingSessionsItemsContainer.notifyRefreshNeeded()):setNowPlayingItems(filterSessions(info,apiClient)))}function onScheduledTasksUpdate(e,apiClient,info){apiClient.serverId()===serverId&&renderRunningTasks(view,info)}_servicelocator.appHost.supports("externallinks")?view.querySelector(".dashboardFooter").classList.remove("hide"):view.querySelector(".dashboardFooter").classList.add("hide"),this.activeRecordingsItemsContainer=view.querySelector(".activeRecordingItems"),this.nowPlayingSessionsItemsContainer=view.querySelector(".nowPlayingSessions"),this.activeRecordingsItemsContainer.fetchData=function(){var apiClient=ApiClient;return apiClient.getLiveTvRecordings({UserId:apiClient.getCurrentUserId(),IsInProgress:!0,Fields:this.getRequestedItemFields()+",PrimaryImageAspectRatio",EnableTotalRecordCount:!1,EnableImageTypes:"Primary,Thumb,Backdrop"})}.bind(this),this.activeRecordingsItemsContainer.getListOptions=getActiveRecordingsListOptions,this.activeRecordingsItemsContainer.parentContainer=this.activeRecordingsItemsContainer.closest(".activeRecordingsSection"),this.nowPlayingSessionsItemsContainer.fetchData=function(){var apiClient;return this._activeSessions?Promise.resolve({Items:this._activeSessions,TotalRecordCount:this._activeSessions.length}):(apiClient=ApiClient).getSessions({IncludeAllSessionsIfAdmin:!0,IsPlaying:!0}).then(function(sessions){return{Items:sessions=filterSessions(sessions,apiClient),TotalRecordCount:sessions.length}})}.bind(this),this.nowPlayingSessionsItemsContainer.getListOptions=getActiveSessionsListOptions,this.nowPlayingSessionsItemsContainer.parentContainer=this.nowPlayingSessionsItemsContainer.closest(".dashboardSection"),view.querySelector(".btnServerMoreMenu").addEventListener("click",onShowServerMenuClick),view.querySelector(".btnRestartMenu").addEventListener("click",onPowerMenuClick),view.querySelector(".btnUpdateServer").addEventListener("click",onUpdateServerClick),view.addEventListener("viewshow",function(e){var page=this,apiClient=ApiClient;apiClient&&(pollScheduledTasks(page,apiClient),DashboardPage.startInterval(apiClient),_events.default.on(_api.default,"RestartRequired",onRestartRequired),_events.default.on(_api.default,"ServerShuttingDown",onServerShuttingDown),_events.default.on(_api.default,"ServerRestarting",onServerRestarting),_events.default.on(_api.default,"PackageInstalling",onPackageInstalling),_events.default.on(_api.default,"PackageInstallationCompleted",onPackageInstallationCompleted),_events.default.on(_api.default,"Sessions",onSessionsUpdate),_events.default.on(_api.default,"ScheduledTasksInfo",onScheduledTasksUpdate),function(){var apiClient=window.ApiClient;return apiClient?_connectionmanager.default.getRegistrationInfo("themes",apiClient,{viewOnly:!0}).then(function(result){return{IsMBSupporter:!0}},function(){return{IsMBSupporter:!1}}):Promise.reject()}().then(function(pluginSecurityInfo){DashboardPage.renderSupporterIcon(page,pluginSecurityInfo);var supporterPromotionElem=page.querySelector(".supporterPromotion"),pluginSecurityInfo=pluginSecurityInfo.IsMBSupporter;supporterPromotionElem?pluginSecurityInfo&&supporterPromotionElem.parentNode.removeChild(supporterPromotionElem):pluginSecurityInfo||(supporterPromotionElem='<div class="supporterPromotionContainer"><div class="supporterPromotion">',supporterPromotionElem+='<a is="emby-linkbutton" href="https://emby.media/premiere" target="_blank" class="raised block" style="background-color:#52B54B;color:#fff;"><div>'+_globalize.default.translate("HeaderSupportTheTeam")+'</div><div style="font-weight:normal;margin-top:.35em;">'+_globalize.default.translate("TextEnjoyBonusFeatures")+"</div></a></div></div>",page.querySelector(".dashboardContainer").insertAdjacentHTML("afterbegin",supporterPromotionElem))}),reloadSystemInfo(page,ApiClient))}),view.querySelector(".betaInfoBanner").innerHTML=_globalize.default.translate("BetaTesterMessage",'<a is="emby-linkbutton" class="button-link" href="https://emby.media/community/index.php?/forum/101-testing-area" target="_blank">',"</a>"),view.addEventListener("viewbeforehide",function(){_events.default.off(_api.default,"RestartRequired",onRestartRequired),_events.default.off(_api.default,"ServerShuttingDown",onServerShuttingDown),_events.default.off(_api.default,"ServerRestarting",onServerRestarting),_events.default.off(_api.default,"PackageInstalling",onPackageInstalling),_events.default.off(_api.default,"PackageInstallationCompleted",onPackageInstallationCompleted),_events.default.off(_api.default,"Sessions",onSessionsUpdate),_events.default.off(_api.default,"ScheduledTasksInfo",onScheduledTasksUpdate)})}window.stopDashboardTask=function(btn,id){var page=btn.closest(".page");ApiClient.stopScheduledTask(id).then(function(){pollScheduledTasks(page,ApiClient)})},Object.assign(ServerDashboardView.prototype,_baseview.default.prototype),ServerDashboardView.prototype.onResume=function(options){_baseview.default.prototype.onResume.apply(this,arguments),this.activeRecordingsItemsContainer.resume(options),this.nowPlayingSessionsItemsContainer.resume(Object.assign(options,{refresh:!0}));var apiClient=ApiClient;apiClient&&(this.userActivityLog?this.userActivityLog.resume(options):this.userActivityLog=new _activitylog.default({serverId:apiClient.serverId(),element:this.view.querySelector(".userActivityItems")}),this.serverActivityLog?this.serverActivityLog.resume(options):this.serverActivityLog=new _activitylog.default({serverId:apiClient.serverId(),element:this.view.querySelector(".serverActivityItems")}),function(view,apiClient){var swaggerUrl="https://swagger.emby.media";swaggerUrl=(swaggerUrl+="?api_key="+apiClient.accessToken())+"&url="+encodeURIComponent(apiClient.getUrl("openapi",{serverUrl:apiClient.serverAddress()})),(apiClient=view.querySelector(".swaggerLink")).setAttribute("href",swaggerUrl),_servicelocator.appHost.supports("externallinks")?apiClient.classList.remove("hide"):apiClient.classList.add("hide")}(this.view,apiClient),options.autoFocus)&&this.autoFocus()},ServerDashboardView.prototype.onPause=function(){_baseview.default.prototype.onPause.apply(this,arguments);var apiClient=ApiClient;apiClient&&DashboardPage.stopInterval(apiClient),this.activeRecordingsItemsContainer.pause(),this.nowPlayingSessionsItemsContainer.pause(),this.userActivityLog&&this.userActivityLog.pause(),this.serverActivityLog&&this.serverActivityLog.pause()},ServerDashboardView.prototype.destroy=function(){_baseview.default.prototype.destroy.apply(this,arguments);var userActivityLog=this.userActivityLog,userActivityLog=(userActivityLog&&(userActivityLog.destroy(),this.userActivityLog=null),this.serverActivityLog);userActivityLog&&(userActivityLog.destroy(),this.serverActivityLog=null),this.activeRecordingsItemsContainer=null,this.nowPlayingSessionsItemsContainer=null,this._activeSessions=null};_exports.default=ServerDashboardView});