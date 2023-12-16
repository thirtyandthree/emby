define(["exports","./../emby-apiclient/connectionmanager.js","./../common/globalize.js","./../layoutmanager.js","./../dialoghelper/dialoghelper.js","./../emby-elements/emby-scroller/emby-scroller.js","./../emby-elements/emby-select/emby-select.js","./../emby-elements/emby-input/emby-input.js","./../emby-elements/emby-button/paper-icon-button-light.js","./../emby-elements/emby-dialogclosebutton/emby-dialogclosebutton.js","./../common/servicelocator.js","./../focusmanager.js","./../common/appsettings.js","./../registrationservices/registrationservices.js","./../approuter.js"],function(_exports,_connectionmanager,_globalize,_layoutmanager,_dialoghelper,_embyScroller,_embySelect,_embyInput,_paperIconButtonLight,_embyDialogclosebutton,_servicelocator,_focusmanager,_appsettings,_registrationservices,_approuter){var currentDialogOptions;function submitJob(dlg,apiClient,userId,syncOptions,form){if(!userId)throw new Error("userId cannot be null");if(!syncOptions)throw new Error("syncOptions cannot be null");var target,selectSyncTarget;if(form)return selectSyncTarget=form.querySelector(".selectSyncTarget"),(target=selectSyncTarget?selectSyncTarget.value:null)?(setJobValues(selectSyncTarget={userId:userId,TargetId:target,ParentId:syncOptions.ParentId,Category:syncOptions.Category},form),syncOptions.items&&syncOptions.items.length&&(selectSyncTarget.ItemIds=(syncOptions.items||[]).map(function(i){return i.Id||i}).join(",")),apiClient.createSyncJob(selectSyncTarget).then(function(){_dialoghelper.default.close(dlg),showSubmissionToast(syncOptions.mode),"download"===syncOptions.mode&&syncNow()}),!0):(function(options){Emby.importModule("./modules/common/dialogs/alert.js").then(function(alert){return alert(options)})}(_globalize.default.translate("PleaseSelectDeviceToSyncTo")),!1);throw new Error("form cannot be null")}function showSubmissionToast(mode){var options,mode="convert"===mode?_globalize.default.translate("ConvertingDots"):_globalize.default.translate("DownloadingDots");options=mode,Emby.importModule("./modules/toast/toast.js").then(function(toast){return toast(options)})}function syncNow(){require(["localsync"],function(localSync){localSync.sync()})}function setJobValues(job,form){var txtBitrate=form.querySelector(".txtBitrate"),txtBitrate=(txtBitrate=txtBitrate?txtBitrate.value:null)&&1e6*parseFloat(txtBitrate),txtBitrate=(job.Bitrate=txtBitrate,form.querySelector(".selectQuality")),txtBitrate=(txtBitrate&&(job.Quality=txtBitrate.value,_appsettings.default.set("sync-lastquality",job.Quality||"")),form.querySelector(".selectProfile")),txtBitrate=(txtBitrate&&(job.Profile=txtBitrate.value),form.querySelector(".selectJobContainer")),txtBitrate=(txtBitrate&&(job.Container=txtBitrate.value),form.querySelector(".selectVideoCodec")),txtBitrate=(txtBitrate&&(job.VideoCodec=txtBitrate.value),form.querySelector(".selectAudioCodec")),txtBitrate=(txtBitrate&&(job.AudioCodec=txtBitrate.value),form.querySelector(".txtItemLimit")),txtBitrate=(txtBitrate&&(job.ItemLimit=txtBitrate.value||null),form.querySelector(".chkSyncNewContent")),txtBitrate=(txtBitrate&&(job.SyncNewContent=txtBitrate.checked),form.querySelector(".chkUnwatchedOnly"));txtBitrate&&(job.UnwatchedOnly=txtBitrate.checked)}function renderForm(options){return new Promise(function(resolve,reject){require(["emby-checkbox","emby-input","emby-select"],function(){!function(options,defaultTargetId,resolve){var elem=options.elem,dialogOptions=options.dialogOptions,targets=dialogOptions.Targets,html="",mode=options.mode,targetContainerClass="download"===mode?" hide":"",syncTargetLabel="convert"===mode?_globalize.default.translate("LabelConvertTo"):_globalize.default.translate("LabelDownloadTo");"download"===mode&&(targets=targets.filter(function(t){return defaultTargetId===t.Id}));options.readOnlySyncTarget?html=(html+='<div class="inputContainer'+targetContainerClass+'">')+'<input is="emby-input" type="text" class="selectSyncTarget" readonly label="'+syncTargetLabel+'"/></div>':(html+='<div class="selectContainer'+targetContainerClass+'">',targetContainerClass=targets.length?"":" required",html=(html+='<select is="emby-select" class="selectSyncTarget"'+targetContainerClass+' label="'+syncTargetLabel+'">')+targets.map(function(t){return"<option"+(defaultTargetId===t.Id?" selected":"")+' value="'+t.Id+'">'+t.Name+"</option>"}).join("")+"</select>",targets.length||(html+='<div class="fieldDescription">'+_globalize.default.translate("LabelSyncNoTargetsHelp")+"</div>"),_servicelocator.appHost.supports("externallinks")&&(html+='<div class="fieldDescription"><a is="emby-linkbutton" class="button-link lnkLearnMore" href="'+("convert"===mode?"https://support.emby.media/support/solutions/articles/44001849018-convert-media":"https://support.emby.media/support/solutions/articles/44001162174-sync")+'" target="_blank">'+_globalize.default.translate("LearnMore")+"</a></div>"),html+="</div>");targetContainerClass=!1;options.readOnlySyncTarget&&-1===dialogOptions.Options.indexOf("UnwatchedOnly")&&-1===dialogOptions.Options.indexOf("SyncNewContent")&&-1===dialogOptions.Options.indexOf("ItemLimit")&&(targetContainerClass=!0);html=(html=(html=(html=(html=(html=(html=(html=(html=(html+='<div class="fldProfile selectContainer hide">')+'<select is="emby-select" class="selectProfile" '+(targetContainerClass?"disabled":"")+'  label="'+_globalize.default.translate("LabelProfile")+'"></select>')+'<div class="fieldDescription profileDescription"></div></div>')+'<div class="customProfileOptions hide"><div class="selectContainer">')+'<select is="emby-select" class="selectJobContainer" required '+(targetContainerClass?"disabled":"")+'  label="'+_globalize.default.translate("LabelContainer")+'"><option value="mkv">mkv</option>')+'<option value="mp4">mp4</option><option value="ts">ts</option>')+'</select><div class="fieldDescription containerDescription"></div>')+'</div><div class="selectContainer">')+'<select is="emby-select" class="selectVideoCodec" required '+(targetContainerClass?"disabled":"")+'  label="'+_globalize.default.translate("LabelVideoCodec")+'">')+'<option value="h264">h264</option><option value="hevc">hevc</option>',html+='<option value="h264,hevc">h264, hevc</option><option value="hevc,h264">hevc, h264</option>';html=(html=(html=(html+='</select><div class="fieldDescription videoCodecDescription"></div>')+'</div><div class="selectContainer">')+'<select is="emby-select" class="selectAudioCodec" required '+(targetContainerClass?"disabled":"")+'  label="'+_globalize.default.translate("LabelAudioCodec")+'">')+'<option value="aac">aac</option><option value="mp3">mp3</option>',html+='<option value="aac,mp3">aac, mp3</option><option value="aac,mp3,ac3">aac, mp3, ac3</option>';html=(html=(html=(html=(html=(html=(html+="</select>")+'<div class="fieldDescription audioCodecDescription"></div></div>')+'</div><div class="fldQuality selectContainer hide">')+'<select is="emby-select" class="selectQuality" required '+(targetContainerClass?"disabled":"")+'  label="'+_globalize.default.translate("LabelQuality")+'">')+'</select><div class="fieldDescription qualityDescription"></div>')+'</div><div class="fldBitrate inputContainer hide">')+'<input is="emby-input" type="number" inputmode="decimal" step=".1" min=".1" '+(targetContainerClass?"readonly":"")+' class="txtBitrate" label="'+_globalize.default.translate("LabelBitrateMbps")+'"/></div>',-1!==dialogOptions.Options.indexOf("UnwatchedOnly")&&(html=(html=(html=(html+='<div class="checkboxContainer checkboxContainer-withDescription">')+'<label><input is="emby-checkbox" type="checkbox" class="chkUnwatchedOnly"/>')+("convert"===mode?"<span>"+_globalize.default.translate("ConvertUnwatchedVideosOnly")+"</span>":"<span>"+_globalize.default.translate("SyncUnwatchedVideosOnly")+"</span>")+"</label>")+("convert"===mode?'<div class="fieldDescription checkboxFieldDescription">'+_globalize.default.translate("ConvertUnwatchedVideosOnlyHelp")+"</div>":'<div class="fieldDescription checkboxFieldDescription">'+_globalize.default.translate("SyncUnwatchedVideosOnlyHelp")+"</div>")+"</div>");-1!==dialogOptions.Options.indexOf("SyncNewContent")&&(html=(html=(html=(html+='<div class="checkboxContainer checkboxContainer-withDescription">')+'<label><input is="emby-checkbox" type="checkbox" class="chkSyncNewContent"/>')+("convert"===mode?"<span>"+_globalize.default.translate("AutomaticallyConvertNewContent")+"</span>":"<span>"+_globalize.default.translate("AutomaticallySyncNewContent")+"</span>")+"</label>")+("convert"===mode?'<div class="fieldDescription checkboxFieldDescription">'+_globalize.default.translate("AutomaticallyConvertNewContentHelp")+"</div>":'<div class="fieldDescription checkboxFieldDescription">'+_globalize.default.translate("AutomaticallySyncNewContentHelp")+"</div>")+"</div>");-1!==dialogOptions.Options.indexOf("ItemLimit")&&(html=(html=(html+='<div class="inputContainer">')+'<input is="emby-input" type="number" inputmode="numeric" step="1" min="1" class="txtItemLimit" label="'+_globalize.default.translate("LabelItemLimit")+'"/>')+("convert"===mode?'<div class="fieldDescription">'+_globalize.default.translate("ConvertItemLimitHelp")+"</div>":'<div class="fieldDescription">'+_globalize.default.translate("DownloadItemLimitHelp")+"</div>")+"</div>");elem.innerHTML=html;syncTargetLabel=elem.querySelector(".selectSyncTarget");syncTargetLabel&&(syncTargetLabel.addEventListener("change",function(){var form,targetId;form=elem,targetId=this.value,(0,options.dialogOptionsFn)(targetId).then(function(options){return function(form,options){currentDialogOptions=options;var fldProfile=form.querySelector(".fldProfile"),selectProfile=form.querySelector(".selectProfile");options.ProfileOptions.length&&-1!==options.Options.indexOf("Profile")?(fldProfile&&fldProfile.classList.remove("hide"),selectProfile&&selectProfile.setAttribute("required","required")):(fldProfile&&fldProfile.classList.add("hide"),selectProfile&&selectProfile.removeAttribute("required"));setQualityFieldVisible(form,0<options.QualityOptions.length),selectProfile&&(selectProfile.innerHTML=options.ProfileOptions.map(function(o){var selectedAttribute=o.IsDefault?" selected":"";return'<option value="'+o.Id+'"'+selectedAttribute+">"+o.Name+"</option>"}).join(""),selectProfile.dispatchEvent(new CustomEvent("change",{bubbles:!0})));fldProfile=form.querySelector(".selectQuality");{var lastQuality;fldProfile&&(fldProfile.innerHTML=options.QualityOptions.map(function(o){var selectedAttribute=o.IsDefault?" selected":"";return'<option value="'+o.Id+'"'+selectedAttribute+">"+o.Name+"</option>"}).join(""),(lastQuality=_appsettings.default.get("sync-lastquality"))&&options.QualityOptions.filter(function(i){return i.Id===lastQuality}).length&&(fldProfile.value=lastQuality),fldProfile.dispatchEvent(new CustomEvent("change",{bubbles:!0})))}}(form,options)}).then(resolve)}),syncTargetLabel.dispatchEvent(new CustomEvent("change",{bubbles:!0})));targets=elem.querySelector(".selectProfile");targets&&(targets.addEventListener("change",function(){var form=elem,profileId=this.value,options=currentDialogOptions||{},option=(options.ProfileOptions||[]).filter(function(o){return o.Id===profileId})[0],qualityOptions=options.QualityOptions||[];option?(form.querySelector(".profileDescription").innerHTML=option.Description||"",setQualityFieldVisible(form,0<qualityOptions.length&&option.EnableQualityOptions&&-1!==options.Options.indexOf("Quality"))):(form.querySelector(".profileDescription").innerHTML="",setQualityFieldVisible(form,0<qualityOptions.length&&-1!==options.Options.indexOf("Quality")));var customProfileSelects=(option=form.querySelector(".customProfileOptions")).querySelectorAll("select"),customProfileSelectsRequired=!1;"custom"===profileId?(option.classList.remove("hide"),customProfileSelectsRequired=!0):option.classList.add("hide");for(var i=0,length=customProfileSelects.length;i<length;i++)customProfileSelectsRequired?customProfileSelects[i].setAttribute("required","required"):customProfileSelects[i].removeAttribute("required")}),dialogOptions.ProfileOptions.length)&&targets.dispatchEvent(new CustomEvent("change",{bubbles:!0}));targetContainerClass=elem.querySelector(".selectQuality");targetContainerClass&&(targetContainerClass.addEventListener("change",function(){onQualityChange(elem,this.value)}),targetContainerClass.dispatchEvent(new CustomEvent("change",{bubbles:!0})));mode=elem.querySelector(".selectJobContainer");mode&&(mode.addEventListener("change",onContainerChange),mode.dispatchEvent(new CustomEvent("change",{bubbles:!0})));html=elem.querySelector(".selectVideoCodec");html&&(html.addEventListener("change",onVideoCodecChange),html.dispatchEvent(new CustomEvent("change",{bubbles:!0})));syncTargetLabel=elem.querySelector(".selectAudioCodec");syncTargetLabel&&(syncTargetLabel.addEventListener("change",onAudioCodecChange),syncTargetLabel.dispatchEvent(new CustomEvent("change",{bubbles:!0})));setTimeout(function(){_focusmanager.default.autoFocus(elem)},100)}(options,_connectionmanager.default.deviceId(),resolve)})})}function showWifiMessage(){var options={title:_globalize.default.translate("HeaderWaitingForWifi"),text:_globalize.default.translate("WifiRequiredToDownload")},items=[];items.push({name:options.confirmText||_globalize.default.translate("ButtonOk"),id:"ok",type:"submit"}),items.push({name:options.cancelText||_globalize.default.translate("HeaderDownloadSettings"),id:"downloadsettings",type:"cancel"}),options.buttons=items,function(options){return Emby.importModule("./modules/dialog/dialog.js").then(function(dialog){return dialog(options)})}(options).then(function(result){return"ok"===result?Promise.resolve():"downloadsettings"===result?(_approuter.default.show(_approuter.default.getRouteUrl("downloadsettings")),Promise.resolve()):Promise.reject()})}function setQualityFieldVisible(form,visible){var fldQuality=form.querySelector(".fldQuality"),selectQuality=form.querySelector(".selectQuality");visible?(fldQuality&&fldQuality.classList.remove("hide"),selectQuality&&(selectQuality.removeAttribute("required"),onQualityChange(form,selectQuality.value))):(fldQuality&&fldQuality.classList.add("hide"),selectQuality&&selectQuality.removeAttribute("required"),onQualityChange(form,""))}function onContainerChange(){this.closest(".selectContainer").querySelector(".fieldDescription").innerHTML=_globalize.default.translate("VideoFilesWillBeConvertedTo",this.value)}function onVideoCodecChange(){var description=this.closest(".selectContainer").querySelector(".fieldDescription"),value=this.value,values=value.split(",");1<values.length?description.innerHTML=_globalize.default.translate("VideoWillBeConvertedToOrCopied",values[0],value):description.innerHTML=_globalize.default.translate("VideoWillBeConvertedTo",value)}function onAudioCodecChange(){var description=this.closest(".selectContainer").querySelector(".fieldDescription"),value=this.value,values=value.split(",");1<values.length?description.innerHTML=_globalize.default.translate("AudioWillBeConvertedToOrCopied",values[0],value):description.innerHTML=_globalize.default.translate("AudioWillBeConvertedTo",value)}function onQualityChange(form,qualityId){var option=((currentDialogOptions||{}).QualityOptions||[]).filter(function(o){return o.Id===qualityId})[0],qualityDescription=form.querySelector(".qualityDescription"),qualityDescription=(qualityDescription.innerHTML=option&&option.Description||"",form.querySelector(".fldBitrate")),option=form.querySelector(".txtBitrate");"custom"===qualityId?(qualityDescription&&qualityDescription.classList.remove("hide"),option&&option.setAttribute("required","required")):(qualityDescription&&qualityDescription.classList.add("hide"),option&&option.removeAttribute("required"))}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,require(["formDialogStyle"]);_exports.default={showMenu:function(options){return"download"===options.mode&&_appsettings.default.syncOnlyOnWifi()&&!function(){switch(navigator.connection?navigator.connection.type:null){case"cellular":case"bluetooth":return showWifiMessage(),0;default:return 1}}()?Promise.reject():_registrationservices.default.validateFeature("sync").then(function(){return function(options){var apiClient=_connectionmanager.default.getApiClient(options.items[0]),userId=apiClient.getCurrentUserId();if(function(options){if("download"!==options.mode)return;options=(options.items||[])[0]||{};return"Audio"===options.Type||"Photo"===options.Type||"MusicAlbum"===options.Type||"MusicArtist"===options.Type||"MusicGenre"===options.Type||"Playlist"===options.Type&&"Audio"===options.MediaType}(options))return function(apiClient,userId,targetId,syncOptions){if(!userId)throw new Error("userId cannot be null");if(!syncOptions)throw new Error("syncOptions cannot be null");if(targetId)return userId={userId:userId,TargetId:targetId,ParentId:syncOptions.ParentId,Category:syncOptions.Category,Quality:syncOptions.Quality,Bitrate:syncOptions.Bitrate},syncOptions.items&&syncOptions.items.length&&(userId.ItemIds=(syncOptions.items||[]).map(function(i){return i.Id||i}).join(",")),apiClient.createSyncJob(userId).then(function(){showSubmissionToast(syncOptions.mode),"download"===syncOptions.mode&&syncNow()});throw new Error("targetId cannot be null")}(apiClient,userId,apiClient.deviceId(),{items:options.items,Quality:"custom",Bitrate:_appsettings.default.maxStaticMusicBitrate()});var dialogOptionsFn=function(apiClient,query){return function(targetId){return query.TargetId=targetId,apiClient.getJSON(apiClient.getUrl("Sync/Options",query))}}(apiClient,{UserId:userId,ItemIds:(options.items||[]).map(function(i){return i.Id||i}).join(","),ParentId:options.ParentId,Category:options.Category,IncludeProviders:"convert"===options.mode?"ConvertSyncProvider":null,ExcludeProviders:"convert"===options.mode?null:"ConvertSyncProvider"});return dialogOptionsFn().then(function(dialogOptions){currentDialogOptions=dialogOptions;var dlgElementOptions={removeOnClose:!0,scrollY:!1,autoFocus:!1},dlg=(_layoutmanager.default.tv?dlgElementOptions.size="fullscreen":dlgElementOptions.size="small",_dialoghelper.default.createDialog(dlgElementOptions)),dlgElementOptions=(dlg.classList.add("formDialog"),""),syncButtonLabel=(dlgElementOptions=(dlgElementOptions+='<div class="formDialogHeader">')+'<button type="button" is="emby-dialogclosebutton"></button>'+'<h3 class="formDialogHeaderTitle">',"convert"===options.mode?_globalize.default.translate("Convert"):_globalize.default.translate("Download")),submitted=(dlgElementOptions=dlgElementOptions+syncButtonLabel+"</h3>",_servicelocator.appHost.supports("externallinks")&&(dlgElementOptions+='<a is="emby-linkbutton" href="'+("convert"===options.mode?"https://support.emby.media/support/solutions/articles/44001849018-convert-media":"https://support.emby.media/support/solutions/articles/44001162174-sync")+'" target="_blank" class="paper-icon-button-light noautofocus btnHelp flex align-items-center dialogHeaderButton button-help"><i class="md-icon">&#xe887;</i></a>'),dlg.innerHTML=dlgElementOptions=(dlgElementOptions=(dlgElementOptions=(dlgElementOptions=(dlgElementOptions=(dlgElementOptions+="</div>")+'<div is="emby-scroller" data-horizontal="false" data-forcescrollbar="true" data-focusscroll="true" class="formDialogContent">'+'<div class="scrollSlider">')+'<form class="dialogContentInner dialog-content-centered formSubmitSyncRequest padded-left padded-right">'+'<div class="formFields"></div>')+'<div class="formDialogFooter">'+('<button is="emby-button" type="submit" class="raised button-submit block formDialogFooterItem"><span>'+syncButtonLabel+"</span></button>"))+"</div>"+"</form>")+"</div>"+"</div>",!1),syncButtonLabel=(dlg.querySelector("form").addEventListener("submit",function(e){return submitted=submitJob(dlg,apiClient,userId,options,this),e.preventDefault(),!1}),_dialoghelper.default.open(dlg));return renderForm({elem:dlg.querySelector(".formFields"),dialogOptions:dialogOptions,dialogOptionsFn:dialogOptionsFn,mode:options.mode}),syncButtonLabel.then(function(){return submitted?Promise.resolve():Promise.reject()})})}(options)})},renderForm:renderForm,setJobValues:setJobValues}});