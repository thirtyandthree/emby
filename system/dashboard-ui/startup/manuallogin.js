define(["exports","./../modules/viewmanager/baseview.js","./../modules/loading/loading.js","./../modules/emby-elements/emby-input/emby-input.js","./../modules/emby-elements/emby-button/emby-button.js","./../modules/emby-elements/emby-checkbox/emby-checkbox.js","./../modules/emby-elements/emby-scroller/emby-scroller.js","./../modules/emby-apiclient/connectionmanager.js","./../modules/approuter.js","./../modules/focusmanager.js","./../modules/common/appsettings.js","./../modules/common/servicelocator.js","./../modules/common/textencoding.js","../modules/common/globalize.js"],function(_exports,_baseview,_loading,_embyInput,_embyButton,_embyCheckbox,_embyScroller,_connectionmanager,_approuter,_focusmanager,_appsettings,_servicelocator,_textencoding,_globalize){function setTitle(instance){var view=instance.view,instance=instance.getApiClient().serverName();view.querySelector(".viewTitle").innerHTML=instance?_globalize.default.translate("SignIntoServerName",_textencoding.default.htmlEncode(instance)):_globalize.default.translate("HeaderPleaseSignIn")}function View(view,params){_baseview.default.apply(this,arguments),view.querySelector(".buttonCancel").addEventListener("click",function(e){_approuter.default.back()}),view.querySelector(".btnForgotPassword").addEventListener("click",function(e){_approuter.default.showItem({Type:"ForgotPassword",ServerId:params.serverId})}),view.querySelector(".btnSelectServer").addEventListener("click",function(e){_approuter.default.showSelectServer()}),view.querySelector("form").addEventListener("submit",function(e){var username=this.querySelector(".txtUserName").value,password=this.querySelector(".txtPassword").value,serverId=(_loading.default.show(),params.serverId);return _appsettings.default.enableAutoLogin(view.querySelector(".chkRememberLogin").checked),_approuter.default.authenticateUser({username:username,password:password,serverId:serverId}),e.preventDefault(),!1}),_servicelocator.appHost.supports("multiserver")&&view.querySelector(".btnSelectServer").classList.remove("hide");var apiClient=_connectionmanager.default.getApiClient(params.serverId);!function(view,apiClient){_servicelocator.appHost.supports("multiserver")||apiClient.getJSON(apiClient.getUrl("Branding/Configuration")).then(function(options){var elem=view.querySelector(".disclaimer");options.LoginDisclaimer&&elem.classList.remove("hide"),elem.textContent=options.LoginDisclaimer||""})}(view,apiClient),view.querySelector(".chkRememberLogin").dispatchEvent(new CustomEvent("change",{bubbles:!0})),setTitle(this)}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,require(["material-icons"]),Object.assign(View.prototype,_baseview.default.prototype),View.prototype.onResume=function(options){_baseview.default.prototype.onResume.apply(this,arguments),setTitle(this);var view=this.view,params=this.params,txtUserName=(_loading.default.hide(),view.querySelector(".txtUserName")),txtPassword=(txtUserName.value=params.user||"",view.querySelector(".txtPassword"));txtPassword.value="",view.querySelector(".chkRememberLogin").checked=_appsettings.default.enableAutoLogin(),params.user?_focusmanager.default.focus(txtPassword):_focusmanager.default.focus(txtUserName)};_exports.default=View});