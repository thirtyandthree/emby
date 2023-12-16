define(["exports","./../modules/viewmanager/baseview.js","./../modules/loading/loading.js","./../modules/approuter.js","./../modules/formhelper.js","./../modules/emby-elements/emby-input/emby-input.js","./../modules/emby-elements/emby-button/emby-button.js","./../modules/emby-elements/emby-checkbox/emby-checkbox.js","./../modules/emby-elements/emby-select/emby-select.js"],function(_exports,_baseview,_loading,_approuter,_formhelper,_embyInput,_embyButton,_embyCheckbox,_embySelect){function loadUser(page){page.querySelector(".txtUserName").value="",_loading.default.show();var promise4=ApiClient.getJSON(ApiClient.getUrl("Library/SelectableMediaFolders",{IsHidden:!1})),promise5=ApiClient.getJSON(ApiClient.getUrl("Channels"));Promise.all([promise4,promise5]).then(function(responses){!function(page,mediaFolders){for(var html="",i=0,length=mediaFolders.length;i<length;i++){var folder=mediaFolders[i],containerClassName="",disabledAttribute=!1===folder.IsUserAccessConfigurable?" disabled":"",folderId=(!1===folder.IsUserAccessConfigurable&&(containerClassName+=' class="hide"'),folder.Guid||folder.Id);html+="<label"+containerClassName+'><input type="checkbox" is="emby-checkbox" class="chkFolder" data-id="'+folderId+'" checked="checked"'+disabledAttribute+"/><span>"+folder.Name+"</span></label>"}page.querySelector(".folderAccess").innerHTML=html,page.querySelector(".chkEnableAllFolders").checked=!0,page.querySelector(".chkEnableAllFolders").dispatchEvent(new CustomEvent("change",{bubbles:!0,cancelable:!1}))}(page,responses[0]),function(page,channels){for(var html="",i=0,length=channels.length;i<length;i++){var folder=channels[i];html+='<label><input type="checkbox" is="emby-checkbox" class="chkChannel" data-id="'+(folder.Guid||folder.Id)+'" checked="checked"/><span>'+folder.Name+"</span></label>"}var channelAccessList=page.querySelector(".channelAccess");channelAccessList.innerHTML=html,channelAccessList.classList.remove("hide"),channels.length?page.querySelector(".channelAccessContainer").classList.add("channelAccessContainer-hasChannels"):page.querySelector(".channelAccessContainer").classList.remove("channelAccessContainer-hasChannels"),page.querySelector(".chkEnableAllChannels").checked=!0,page.querySelector(".chkEnableAllChannels").dispatchEvent(new CustomEvent("change",{bubbles:!0,cancelable:!1}))}(page,responses[1].Items),page.querySelector(".selectCopyFromUser").setValues([],!0,[{Id:"",Name:""}]),_loading.default.hide()})}function saveUser(page){var createOptions={Name:page.querySelector(".txtUserName").value},copyFromUserId=page.querySelector(".selectCopyFromUser").value,userCopyOptions=[];page.querySelector(".chkCopyUserPolicy").checked&&userCopyOptions.push("UserPolicy"),page.querySelector(".chkCopyUserConfiguration").checked&&userCopyOptions.push("UserConfiguration"),copyFromUserId&&(createOptions.CopyFromUserId=copyFromUserId,createOptions.UserCopyOptions=userCopyOptions),ApiClient.createUser(createOptions).then(function(user){user.Policy.IsAdministrator=page.querySelector(".chkIsAdmin").checked,copyFromUserId||(user.Policy.EnableSubtitleManagement=user.Policy.IsAdministrator,user.Policy.EnableContentDeletion=user.Policy.IsAdministrator,user.Policy.EnableAllFolders=page.querySelector(".chkEnableAllFolders").checked,user.Policy.EnabledFolders=user.Policy.EnableAllFolders?[]:Array.prototype.filter.call(page.querySelectorAll(".chkFolder"),function(i){return i.checked}).map(function(i){return i.getAttribute("data-id")}),user.Policy.EnableAllChannels=page.querySelector(".chkEnableAllChannels").checked,user.Policy.EnabledChannels=user.Policy.EnableAllChannels?[]:Array.prototype.filter.call(page.querySelectorAll(".chkChannel"),function(i){return i.checked}).map(function(i){return i.getAttribute("data-id")})),ApiClient.updateUserPolicy(user.Id,user.Policy).then(function(){!function(user){_approuter.default.show("users/user?userId="+user.Id)}(user)})},function(response){if(_loading.default.hide(),400!==response.status)return _formhelper.default.handleErrorResponse(response);var options;options={text:page.querySelector(".labelNewUserNameHelp").innerHTML},Emby.importModule("./modules/common/dialogs/alert.js").then(function(alert){return alert(options)})})}function onSubmit(e){var page=this.closest(".page");return _loading.default.show(),saveUser(page),e.preventDefault(),e.stopPropagation(),!1}function loadUsers(context,apiClient){context.querySelector(".selectCopyFromUser").getItems=function(query){return(query=Object.assign({SortBy:"SortName",SortOrder:"Ascending",EnableImages:!1},query)).StartIndex&&query.StartIndex--,this.getUsersQueryResult(query).then(function(result){return!query.StartIndex&&query.Limit&&result.Items.unshift({Name:"",Id:""}),!1!==query.EnableTotalRecordCount&&result.TotalRecordCount++,result})}.bind(apiClient)}function View(view,params){_baseview.default.apply(this,arguments),view.querySelector(".btnCancel").addEventListener("click",function(){_approuter.default.back()}),view.querySelector(".chkEnableAllChannels").addEventListener("change",function(){this.checked?view.querySelector(".channelAccess").classList.add("hide"):view.querySelector(".channelAccess").classList.remove("hide")}),view.querySelector(".chkEnableAllFolders").addEventListener("change",function(){this.checked?view.querySelector(".folderAccess").classList.add("hide"):view.querySelector(".folderAccess").classList.remove("hide")}),view.querySelector(".selectCopyFromUser").addEventListener("change",function(){var channelAccessContainer=view.querySelector(".channelAccessContainer");this.value?(view.querySelector(".folderAccessContainer").classList.add("hide"),channelAccessContainer.classList.add("hide"),view.querySelector(".copyOptionsContainer").classList.remove("hide")):(view.querySelector(".folderAccessContainer").classList.remove("hide"),view.querySelector(".copyOptionsContainer").classList.add("hide"),channelAccessContainer.classList.contains("channelAccessContainer-hasChannels")?channelAccessContainer.classList.remove("hide"):channelAccessContainer.classList.add("hide"))}),view.querySelector(".newUserProfileForm").addEventListener("submit",onSubmit),loadUsers(this.view,ApiClient)}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,Object.assign(View.prototype,_baseview.default.prototype),View.prototype.onResume=function(options){_baseview.default.prototype.onResume.apply(this,arguments),loadUser(this.view)};_exports.default=View});