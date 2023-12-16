define(["exports","./../layoutmanager.js","./../common/appsettings.js","./../common/servicelocator.js","./../common/usersettings/usersettings.js","./../common/datetime.js"],function(_exports,_layoutmanager,_appsettings,_servicelocator,_usersettings,_datetime){function BaseSettingsContainer(view){this.view=view,this.view.addEventListener("change",function(e){var _e$detail,elem,instance;!1!==(null==(_e$detail=e.detail)?void 0:_e$detail.isUserChange)&&(elem=e.target.closest(".autoSetting.autoSave"))&&(instance=this,"true"===elem.getAttribute("data-changedelay")?setTimeout(function(){instance.saveAutoSetting(elem)},0):instance.saveAutoSetting(elem))}.bind(this))}function getListId(elem){return elem.getAttribute("data-id")}function getSettingMemberInfo(elem,isGet){var method,field=elem.getAttribute("data-settingfield");return field?{type:"field",member:field}:(method=(method=isGet?elem.getAttribute("data-getsettingmethod"):method)||elem.getAttribute("data-settingmethod"))?{type:"method",member:method}:(field=elem.getAttribute("data-usersettingsfield"))?{type:"usersettingsfield",member:field}:null}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,BaseSettingsContainer.prototype.settingsOnResume=function(options){null!=options&&options.refresh&&this.loadSettings(options)},BaseSettingsContainer.prototype.loadSettings=function(options){var instance=this;return this.loadSettingsInternal().then(function(){options.autoFocus&&instance.autoFocus({skipIfNotEnabled:!0})})},BaseSettingsContainer.prototype.getSettingValueFromOwner=function(owner,memberInfo){switch(memberInfo.type){case"field":return owner[memberInfo.member];case"usersettingsfield":return this.getNamedSettingsOwner("usersettings").get(memberInfo.member);case"method":return owner[memberInfo.member]();default:throw new Error("unknown member type: "+memberInfo.type)}},BaseSettingsContainer.prototype.setFieldValue=function(elem,value,triggerChange){var joinDelimiter;"checkbox"===elem.type?elem.checked=!0===value:elem.classList.contains("checkboxList")?function(elem,value){Array.isArray(value)||(value=value.split(function(elem){return elem.getAttribute("data-delimiter")||","}(elem)));for(var checkboxes=elem.querySelectorAll('input[type="checkbox"]'),i=0,length=checkboxes.length;i<length;i++){var current=checkboxes[i];current.checked=value.includes(getListId(current))}}(elem,value):(null==value&&(value=""),"SELECT"===elem.tagName?elem.hasAttribute("multiple")?("string"==typeof value&&(value?(joinDelimiter=elem.getAttribute("data-joindelimiter"))&&(value=value.split(joinDelimiter)):value=[]),elem.values=Array.isArray(value)?value:[value]):elem.value=value.toString():elem.value=value),triggerChange&&elem.dispatchEvent(new CustomEvent("change",{detail:{isUserChange:!1},bubbles:!0}))},BaseSettingsContainer.prototype.loadAutoSetting=function(elem){var memberInfo,owner=this.getSettingsOwner(elem);owner&&(memberInfo=getSettingMemberInfo(elem,!0))&&(owner=this.getSettingValueFromOwner(owner,memberInfo),this.setFieldValue(elem,owner,"true"===elem.getAttribute("data-triggerchange")))},BaseSettingsContainer.prototype.getSettingsOwner=function(elem){var owner=elem.getAttribute("data-settingowner");return this.getNamedSettingsOwner(owner,elem)},BaseSettingsContainer.prototype.getNamedSettingsOwner=function(owner,elem){switch(owner){case"layoutmanager":return _layoutmanager.default;case"appsettings":return _appsettings.default;case"usersettings":return _usersettings.default;case"subtitleappearancesettings":return this.getNamedSettingsOwner("usersettings",elem).getSubtitleAppearanceSettings();default:var objects;return owner?(objects=this.autoSettingsObjects)?objects[owner]:null:null}},BaseSettingsContainer.prototype.saveAutoSetting=function(elem){var value,joinDelimiter,owner=this.getSettingsOwner(elem);owner&&("checkbox"===elem.type?value=elem.checked:elem.classList.contains("checkboxList")?value=Array.prototype.map.call(elem.querySelectorAll('input[type="checkbox"]:checked'),getListId):"SELECT"===elem.tagName&&elem.hasAttribute("multiple")?(value=elem.getValues(),(joinDelimiter=elem.getAttribute("data-joindelimiter"))&&(value=value.join(joinDelimiter))):value=elem.value,joinDelimiter=getSettingMemberInfo(elem))&&this.saveAutoSettingIntoOwner(elem,owner,joinDelimiter,value)},BaseSettingsContainer.prototype.getUserConfigurationUserId=function(){return this.getApiClient().getCurrentUserId()},BaseSettingsContainer.prototype.saveAutoSettingIntoOwner=function(elem,owner,memberInfo,value){var obj,apiClient,userId,ownerName=elem.getAttribute("data-settingowner");if("userconfiguration"===ownerName)apiClient=this.getApiClient(),userId=this.getUserConfigurationUserId(),(obj={})[memberInfo.member]=value,apiClient.updatePartialUserConfiguration(userId,obj);else if("serverconfiguration"===ownerName)apiClient=this.getApiClient(),(userId={})[memberInfo.member]=value,apiClient.updatePartialServerConfiguration(userId);else{switch(memberInfo.type){case"field":owner[memberInfo.member]=value;break;case"usersettingsfield":owner.set(memberInfo.member,value);break;case"method":owner[memberInfo.member](value);break;default:throw new Error("unknown member type: "+memberInfo.type)}"subtitleappearancesettings"===ownerName&&this.getNamedSettingsOwner("usersettings",elem).setSubtitleAppearanceSettings(owner)}},BaseSettingsContainer.prototype.getAutoSettingsObjectsPromises=function(){return[]},BaseSettingsContainer.prototype.loadAutoSettingsObjects=function(){var instance=this;return Promise.all(this.getAutoSettingsObjectsPromises()).then(function(responses){for(var objects={},i=0,length=responses.length;i<length;i++){var response=responses[i];response.key&&(objects[response.key]=response.value)}instance.autoSettingsObjects=objects})};var SupportsCssVariables=CSS.supports("color","var(--fake-var)"),SupportsCalc=CSS.supports("width","min(45.2%,calc(100% - .65em))"),SupportsMin=CSS.supports("width","min(10em, 5vw)");function isCssFeatureSupported(feature){switch(feature){case"calc":return SupportsCalc;case"min":return SupportsMin;case"cssvars":return SupportsCssVariables;default:return!1}}function isAppHostFeatureSupported(feature){return _servicelocator.appHost.supports(feature)}BaseSettingsContainer.prototype.showHideFieldsFeatureChecks=function(){for(var elems=this.view.querySelectorAll(".autoSetting-autohide"),i=0,length=elems.length;i<length;i++){var elem=elems[i];!function(instance,elem){var cssFeatures=elem.getAttribute("data-cssfeatures");if(!cssFeatures||(cssFeatures=cssFeatures.split(",")).length===cssFeatures.filter(isCssFeatureSupported).length){cssFeatures=elem.getAttribute("data-minserverversion");if(cssFeatures){var apiClient=instance.getApiClient();if(!apiClient||!apiClient.isMinServerVersion(cssFeatures))return}apiClient=elem.getAttribute("data-notminserverversion");if(apiClient){cssFeatures=instance.getApiClient();if(cssFeatures&&cssFeatures.isMinServerVersion(apiClient))return}instance=elem.getAttribute("data-apphostsupports");if((!instance||(instance=instance.split(",")).length===instance.filter(isAppHostFeatureSupported).length)&&("true"!==elem.getAttribute("data-datetimesupportslocalization")||_datetime.default.supportsLocalization())){switch(elem.getAttribute("data-layoutmode")){case"tv":if(_layoutmanager.default.tv)break;return}return 1}}}(this,elem)?elem.classList.add("hide"):elem.classList.remove("hide")}},BaseSettingsContainer.prototype.loadAutoSettings=function(){var instance=this,elems=(this.showHideFieldsFeatureChecks(),instance.view.querySelectorAll(".autoSetting"));return instance.loadAutoSettingsObjects().then(function(){for(var i=0,length=elems.length;i<length;i++){var elem=elems[i];instance.loadAutoSetting(elem)}})},BaseSettingsContainer.prototype.saveAutoSettings=function(){for(var elems=this.view.querySelectorAll(".autoSetting"),i=0,length=elems.length;i<length;i++){var elem=elems[i];this.saveAutoSetting(elem)}return Promise.resolve()},BaseSettingsContainer.prototype.loadSettingsInternal=function(){return Promise.resolve()},BaseSettingsContainer.prototype.destroy=function(){this.view=null};_exports.default=BaseSettingsContainer});