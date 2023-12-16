define(["exports","./../modules/common/globalize.js","./../modules/loading/loading.js","./../modules/tabbedview/basetab.js","./../modules/formhelper.js","./../modules/emby-elements/emby-checkbox/emby-checkbox.js","./../modules/emby-elements/emby-button/emby-button.js","./../modules/emby-elements/emby-button/paper-icon-button-light.js","./../modules/emby-elements/emby-select/emby-select.js","./../modules/emby-elements/emby-scroller/emby-scroller.js","./../modules/emby-elements/emby-itemscontainer/emby-itemscontainer.js"],function(_exports,_globalize,_loading,_basetab,_formhelper,_embyCheckbox,_embyButton,_paperIconButtonLight,_embySelect,_embyScroller,_embyItemscontainer){function triggerChange(select){var evt=document.createEvent("HTMLEvents");evt.initEvent("change",!1,!0),select.dispatchEvent(evt)}function renderMediaFolders(page,user,mediaFolders){html=(html="")+'<h3 class="checkboxListLabel">'+_globalize.default.translate("Libraries")+'</h3><div class="checkboxList>';for(var i=0,length=mediaFolders.length;i<length;i++)var folder=mediaFolders[i],folderId=folder.Guid||folder.Id,isChecked=user.Policy.EnableAllFolders||user.Policy.EnabledFolders.includes(folderId),html=(html=(html+='<div class="checkboxList" style="margin:0 0 1.5em;">')+('<label><input type="checkbox" is="emby-checkbox" class="chkFolder" data-id="'+folderId+'" '+(isChecked?' checked="checked"':"")+(!1===folder.IsUserAccessConfigurable?" disabled":"")+'><span><h3 style="margin:0;">'+folder.Name+"</h3></span></label>"))+function(user,folder,subFolders,folderEnabled){for(var html="",excludedSubFolders=user.Policy.ExcludedSubFolders||[],folderId=folder.Guid||folder.Id,hide=0<subFolders.length,i=0,length=subFolders.length;i<length;i++)if(!1!==subFolders[i].IsUserAccessConfigurable){hide=!1;break}for(var _i=0,_length=subFolders.length;_i<_length;_i++){var subFolder=subFolders[_i],idValue=folderId+"_"+subFolder.Id,altIdValue=folderId+"_"+(subFolder.Guid||subFolder.Id);html+='<label style="margin: .5em 0 .5em 2.5em;"'+(hide?' class="hide"':"")+'><input type="checkbox" is="emby-checkbox" class="chkSubFolder" data-folderid="'+folderId+'" data-id="'+idValue+'" '+(user.Policy.EnableAllFolders||folderEnabled&&!excludedSubFolders.includes(idValue)&&!excludedSubFolders.includes(altIdValue)?' checked="checked"':"")+(!1===subFolder.IsUserAccessConfigurable?" disabled":"")+"><span>"+subFolder.Path+"</span></label>"}return html}(user,folder,folder.SubFolders||[],isChecked)+"</div>";html+="</div>",page.querySelector(".folderAccess").innerHTML=html;page=page.querySelector(".chkEnableAllFolders");page.checked=user.Policy.EnableAllFolders,triggerChange(page)}function saveUser(user,page){user.Policy.EnableAllFolders=page.querySelector(".chkEnableAllFolders").checked,user.Policy.EnabledFolders=user.Policy.EnableAllFolders?[]:Array.prototype.filter.call(page.querySelectorAll(".chkFolder"),function(c){return c.checked}).map(function(c){return c.getAttribute("data-id")}),user.Policy.ExcludedSubFolders=user.Policy.EnableAllFolders?[]:Array.prototype.filter.call(page.querySelectorAll(".chkSubFolder"),function(c){return!c.checked}).map(function(c){return c.getAttribute("data-id")}),user.Policy.EnableAllChannels=page.querySelector(".chkEnableAllChannels").checked,user.Policy.EnabledChannels=user.Policy.EnableAllChannels?[]:Array.prototype.filter.call(page.querySelectorAll(".chkChannel"),function(c){return c.checked}).map(function(c){return c.getAttribute("data-id")}),user.Policy.EnableAllDevices=page.querySelector(".chkEnableAllDevices").checked,user.Policy.EnabledDevices=user.Policy.EnableAllDevices?[]:Array.prototype.filter.call(page.querySelectorAll(".chkDevice"),function(c){return c.checked}).map(function(c){return c.getAttribute("data-id")}),user.Policy.BlockedChannels=null,user.Policy.BlockedMediaFolders=null,ApiClient.updateUserPolicy(user.Id,user.Policy).then(function(){_loading.default.hide(),_formhelper.default.handleConfigurationSavedResponse()})}function onFolderChange(e){var e=e.target,view=this.view;if(e.classList.contains("chkFolder"))for(var page=view,folderId=e.getAttribute("data-id"),checked=e.checked,elems=page.querySelectorAll('.chkSubFolder[data-folderid="'+folderId+'"]'),i=0,length=elems.length;i<length;i++)elems[i].checked=checked;else e.classList.contains("chkSubFolder")&&!function(page,folderId){var elem=page.querySelector('.chkFolder[data-id="'+folderId+'"]');if(elem){var elems=page.querySelectorAll('.chkSubFolder[data-folderid="'+folderId+'"]');if(elems.length){for(var numChecked=0,numUnchecked=0,i=0,length=elems.length;i<length;i++)elems[i].checked?numChecked++:numUnchecked++;numChecked||numChecked===elems.length?elem.checked=!0:numUnchecked===elems.length&&(elem.checked=!1)}}}(view,e.getAttribute("data-folderid"))}function AccessTab(view,params,options){_basetab.default.apply(this,arguments),this.apiClient=ApiClient,view.querySelector(".chkEnableAllDevices").addEventListener("change",function(){this.checked?view.querySelector(".deviceAccess").classList.add("hide"):view.querySelector(".deviceAccess").classList.remove("hide")}),view.querySelector(".chkEnableAllChannels").addEventListener("change",function(){this.checked?view.querySelector(".channelAccess").classList.add("hide"):view.querySelector(".channelAccess").classList.remove("hide")}),view.querySelector(".folderAccess").addEventListener("change",onFolderChange.bind(this)),view.querySelector(".chkEnableAllFolders").addEventListener("change",function(){this.checked?view.querySelector(".folderAccessListContainer").classList.add("hide"):view.querySelector(".folderAccessListContainer").classList.remove("hide")}),view.querySelector(".userLibraryAccessForm").addEventListener("submit",function(e){var view=this.view,userId=(_loading.default.show(),this.params.userId);return ApiClient.getUser(userId,!1).then(function(result){saveUser(result,view)}),e.preventDefault(),e.stopPropagation(),!1}.bind(this));for(var userId=params.userId,btns=view.querySelectorAll(".userEditTabButton"),i=0,length=btns.length;i<length;i++)btns[i].href=btns[i].getAttribute("data-href")+"?userId="+userId+"&serverId="+ApiClient.serverId()}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,Object.assign(AccessTab.prototype,_basetab.default.prototype),AccessTab.prototype.onResume=function(options){_basetab.default.prototype.onResume.apply(this,arguments),_loading.default.show();var userId=this.params.userId,page=this.view,userId=userId?ApiClient.getUser(userId,!1):Promise.resolve({Configuration:{}}),promise5=ApiClient.getJSON(ApiClient.getUrl("Channels")),promise6=ApiClient.getJSON(ApiClient.getUrl("Devices"));Promise.all([userId,promise5,promise6]).then(function(responses){var user=responses[0];!function(page,user,channels){for(var html="",i=0,length=channels.length;i<length;i++){var folder=channels[i],folderId=folder.Guid||folder.Id;html+='<label><input type="checkbox" is="emby-checkbox" class="chkChannel" data-id="'+folderId+'" '+(user.Policy.EnableAllChannels||user.Policy.EnabledChannels.includes(folderId)?' checked="checked"':"")+"><span>"+folder.Name+"</span></label>"}page.querySelector(".channelAccess").innerHTML=html,channels.length?page.querySelector(".channelAccessContainer").classList.remove("hide"):page.querySelector(".channelAccessContainer").classList.add("hide"),page.querySelector(".chkEnableAllChannels").checked=user.Policy.EnableAllChannels,triggerChange(page.querySelector(".chkEnableAllChannels"))}(page,user,responses[1].Items),function(page,user,devices){for(var html="",i=0,length=devices.length;i<length;i++){var device=devices[i],deviceId=device.ReportedDeviceId||device.Id;html+='<label><input type="checkbox" is="emby-checkbox" class="chkDevice" data-id="'+deviceId+'" '+(user.Policy.EnableAllDevices||(user.Policy.EnabledDevices||[]).includes(deviceId)?' checked="checked"':"")+"><span>"+device.Name+" - "+device.AppName+"</span></label>"}page.querySelector(".deviceAccess").innerHTML=html,page.querySelector(".chkEnableAllDevices").checked=user.Policy.EnableAllDevices,triggerChange(page.querySelector(".chkEnableAllDevices")),user.Policy.IsAdministrator?page.querySelector(".deviceAccessContainer").classList.add("hide"):page.querySelector(".deviceAccessContainer").classList.remove("hide")}(page,user,responses[2].Items),function(page,user){ApiClient.getJSON(ApiClient.getUrl("Library/SelectableMediaFolders")).then(function(mediaFolders){renderMediaFolders(page,user,mediaFolders)})}(page,user),_loading.default.hide()})},AccessTab.prototype.destroy=function(){_basetab.default.prototype.destroy.apply(this,arguments),this.apiClient=null};_exports.default=AccessTab});