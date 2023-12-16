define(["exports","./../viewmanager/basesettingsview.js","./../emby-apiclient/connectionmanager.js","./../approuter.js","./../emby-elements/emby-scroller/emby-scroller.js","./../emby-elements/emby-select/emby-select.js","./../emby-elements/emby-button/emby-button.js","./../emby-elements/emby-input/emby-input.js","./../emby-elements/emby-textarea/emby-textarea.js","./../emby-elements/emby-checkbox/emby-checkbox.js","./../common/appsettings.js"],function(_exports,_basesettingsview,_connectionmanager,_approuter,_embyScroller,_embySelect,_embyButton,_embyInput,_embyTextarea,_embyCheckbox,_appsettings){function getPlayers(){return JSON.parse(_appsettings.default.get("externalplayers")||"[]")}function onMediaTypeChange(e){for(var mediaType=this.value,fields=this.closest(".view").querySelectorAll(".mediaTypeField"),i=0,length=fields.length;i<length;i++){var fld=fields[i];fld.getAttribute("data-mediatype")===mediaType?fld.classList.remove("hide"):fld.classList.add("hide")}}function renderSettings(instance){for(var view=instance.view,isNewPlayer=instance.isNewPlayer,player=instance.player,isNewPlayer=(isNewPlayer?view.querySelector(".btnSave").classList.remove("hide"):view.querySelector(".btnSave").classList.add("hide"),view.querySelector(".selectMediaType")),chkVideoTypes=(isNewPlayer.value=player.mediaType||"Video",onMediaTypeChange.call(isNewPlayer),view.querySelector(".txtPath").value=player.path||"",view.querySelector(".txtArguments").value=(player.arguments||[]).join("\n"),view.querySelectorAll(".videoType")),i=0,length=chkVideoTypes.length;i<length;i++){var chkVideoType=chkVideoTypes[i];"3d"===chkVideoType.getAttribute("data-type")?chkVideoType.checked=!0===player["videotype-"+chkVideoType.getAttribute("data-type")]:chkVideoType.checked=!1!==player["videotype-"+chkVideoType.getAttribute("data-type")]}!function(instance,value){var apiClient=_connectionmanager.default.currentApiClient(),view=instance.view,player=instance.player;apiClient.getItems(null,{EnableTotalRecordCount:!1,IncludeItemTypes:"GameSystem",Recursive:!0}).then(function(result){var selectGameSystem=view.querySelector(".selectGameSystem");selectGameSystem.innerHTML=result.Items.map(function(g){return'<option value="'+g.Id+'">'+g.Name+"</option>"}).join(""),value&&(selectGameSystem.value=player.gameSystem)})}(instance,player.gameSystem)}function save(instance){var view=instance.view,isNewPlayer=instance.isNewPlayer,player=instance.player,instance=(player.mediaType=view.querySelector(".selectMediaType").value,player.path=view.querySelector(".txtPath").value,view.querySelector(".txtArguments").value.trim()),chkVideoTypes=(player.arguments=instance?instance.split("\n"):[],view.querySelectorAll(".videoType"));for(i=0,length=chkVideoTypes.length;i<length;i++){var chkVideoType=chkVideoTypes[i];player["videotype-"+chkVideoType.getAttribute("data-type")]=chkVideoType.checked}var players=getPlayers();if(isNewPlayer)player.id=(new Date).getTime().toString(),players.push(player);else{for(var index=-1,i=0,length=players.length;i<length;i++)if(players[i].id===player.id){index=i;break}-1===index?players.push(player):players[i]=player}player.gameSystem=view.querySelector(".selectGameSystem").value,_appsettings.default.set("externalplayers",JSON.stringify(players)),isNewPlayer&&_approuter.default.back()}function View(view,params){_basesettingsview.default.apply(this,arguments);var instance=this;view.querySelector("form").addEventListener("submit",function(e){return save(instance),e.preventDefault(),!1}),view.querySelector(".selectMediaType").addEventListener("change",onMediaTypeChange)}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,Object.assign(View.prototype,_basesettingsview.default.prototype),View.prototype.loadSettingsInternal=function(){var instance,params;return(instance=this).player=null,(params=instance.params).id&&(instance.player=getPlayers().filter(function(p){return p.id===params.id})[0]),instance.player?instance.isNewPlayer=!1:(instance.isNewPlayer=!0,instance.player={},instance.player["videotype-stream"]=!1,instance.player["videotype-file"]=!1),renderSettings(this),Promise.resolve()},View.prototype.onPause=function(){_basesettingsview.default.prototype.onPause.apply(this,arguments),this.isNewPlayer||this.view.querySelector("form").checkValidity()&&save(this)};_exports.default=View});