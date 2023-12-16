define(["exports","./../common/globalize.js","./../loading/loading.js","./../emby-apiclient/connectionmanager.js","./../emby-elements/emby-checkbox/emby-checkbox.js","./../emby-elements/emby-button/emby-button.js","./../emby-elements/emby-input/emby-input.js","./../emby-elements/emby-select/emby-select.js","./../common/methodtimer.js"],function(_exports,_globalize,_loading,_connectionmanager,_embyCheckbox,_embyButton,_embyInput,_embySelect,_methodtimer){var currentItemId,currentServerId;function onStartTimeChanged(){var form=this.closest("form"),form=form.querySelector(".txtEndTime"),minTime=this.valueAsNumberUtc||Date.now();form.minDateTimeLocal=minTime+=6e4,(!form.valueAsNumberUtc||form.valueAsNumberUtc<=minTime)&&(minTime+=174e4,form.valueAsNumberUtc=Math.max(form.valueAsNumberUtc||minTime,minTime))}function onMinStartTimeTimer(){var minTime=Date.now(),txtStartTime=this.querySelector(".txtStartTime");txtStartTime!==document.activeElement&&(txtStartTime.minDateTimeLocal=minTime,txtStartTime.valueAsNumberUtc=Math.max(txtStartTime.valueAsNumberUtc||minTime,minTime),onStartTimeChanged.call(txtStartTime))}function renderTimer(context,item){context.querySelector(".txtPrePaddingMinutes").value=item.PrePaddingSeconds/60,context.querySelector(".txtPostPaddingMinutes").value=item.PostPaddingSeconds/60;var txtStartTime=context.querySelector(".txtStartTime"),txtEndTime=context.querySelector(".txtEndTime");"DateTime"===item.TimerType?(context.querySelector(".fldStartTime").classList.remove("hide"),context.querySelector(".fldEndTime").classList.remove("hide"),txtStartTime.setAttribute("required","required"),txtEndTime.setAttribute("required","required"),txtStartTime.valueAsNumberUtc=Date.parse(item.StartDate),txtEndTime.valueAsNumberUtc=Date.parse(item.EndDate)):(context.querySelector(".fldStartTime").classList.add("hide"),context.querySelector(".fldEndTime").classList.add("hide"),txtStartTime.removeAttribute("required"),txtEndTime.removeAttribute("required")),_loading.default.hide()}function onSubmit(e){var form=this,apiClient=_connectionmanager.default.getApiClient(currentServerId);return apiClient.getLiveTvTimer(currentItemId).then(function(item){var _form$querySelector$v;item.PrePaddingSeconds=60*form.querySelector(".txtPrePaddingMinutes").value,item.PostPaddingSeconds=60*form.querySelector(".txtPostPaddingMinutes").value,"DateTime"===item.TimerType&&(item.StartDate=null==(_form$querySelector$v=form.querySelector(".txtStartTime").valueAsDateUtc)?void 0:_form$querySelector$v.toISOString(),item.EndDate=null==(_form$querySelector$v=form.querySelector(".txtEndTime").valueAsDateUtc)?void 0:_form$querySelector$v.toISOString()),apiClient.updateLiveTvTimer(item)}),e.preventDefault(),!1}function init(context){context.querySelector(".txtStartTime").addEventListener("change",onStartTimeChanged),function(context){context.minStartTimeTimer=new _methodtimer.default({onInterval:onMinStartTimeTimer.bind(context),timeoutMs:3e4,type:"interval"})}(context),onMinStartTimeTimer.call(context),context.querySelector("form").addEventListener("submit",onSubmit)}function onFieldChange(e){this.querySelector(".btnSubmit").click()}function RecordingEditor(){}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,require(["css!modules/recordingcreator/recordingcreator.css","material-icons","flexStyles"]),RecordingEditor.prototype.embed=function(itemId,serverId,options){currentServerId=serverId,_loading.default.show(),options=options||{},this.options=options,require(["text!modules/recordingcreator/recordingeditor.template.html"],function(template){var dlg=options.context;dlg.innerHTML=_globalize.default.translateDocument(template,"sharedcomponents"),dlg.removeEventListener("change",onFieldChange),dlg.addEventListener("change",onFieldChange),dlg.classList.remove("hide"),_connectionmanager.default.getApiClient(serverId);init(dlg),function(context,id){var apiClient=_connectionmanager.default.getApiClient(currentServerId);_loading.default.show(),"string"==typeof id?(currentItemId=id,apiClient.getLiveTvTimer(id).then(function(result){renderTimer(context,result),_loading.default.hide()})):id&&(currentItemId=id.Id,renderTimer(context,id),_loading.default.hide())}(dlg,itemId)})},RecordingEditor.prototype.pause=function(){var options=this.options;options&&(options=options.context).minStartTimeTimer&&(options.minStartTimeTimer.destroy(),options.minStartTimeTimer=null)},RecordingEditor.prototype.destroy=function(){this.pause()};_exports.default=RecordingEditor});