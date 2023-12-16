define(["exports","./../layoutmanager.js","./../focusmanager.js","./../common/pluginmanager.js","./../common/usersettings/usersettings.js","./../emby-apiclient/events.js","./../common/appsettings.js"],function(_exports,_layoutmanager,_focusmanager,_pluginmanager,_usersettings,_events,_appsettings){Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0;var mainAnimatedPages,ViewClasses=[],CurrentViewStack=[];function removeViewInfoFromCurrentViews(viewInfo){var arr;viewInfo=viewInfo,-1<(viewInfo=(arr=CurrentViewStack).indexOf(viewInfo))&&arr.splice(viewInfo,1)}function disableRestoreOnCurrentViews(){for(var views=CurrentViewStack,i=0,length=views.length;i<length;i++){var viewInfo=views[i];"true"!==viewInfo.params.asDialog&&(viewInfo=viewInfo.view)&&(viewInfo.allowRestore=!1)}}function ensureWindowScrollOption(detail,view){var windowScroll=detail.windowScroll;return 3!==windowScroll||(windowScroll=detail.windowScroll=!view.classList.contains("scrollFrameY")&&!view.querySelector('.emby-scroller[data-bindheader="true"],.scrollFrameY[data-bindheader="true"]'))||(detail.adjustHeaderForEmbeddedScroll=!0),!0===windowScroll}function normalizeNewView(options,isPluginpage){var viewHtml=options.view,_options$params=(null!=(_options$params=options.params)&&_options$params.asDialog&&(viewHtml=viewHtml.replace('data-bindheader="true"','data-bindheader="false"')),!!isPluginpage&&viewHtml.includes("<script")),isPluginpage=function(html,hasScript){return hasScript&&(html=(html=html.replaceAll("\x3c!--<script","<script")).replaceAll("<\/script>--\x3e","<\/script>")),(hasScript=document.createElement("div")).innerHTML=html,hasScript.querySelector('.view,div[data-role="page"]')}(viewHtml,_options$params);options.view=isPluginpage}function getViewHideEventInfo(previousViewInfo,newViewInfo){previousViewInfo=Object.assign({},previousViewInfo);return previousViewInfo.newViewInfo=newViewInfo,{detail:previousViewInfo,bubbles:!0,cancelable:!1}}function onBeforeChange(previousViewInfo,newViewInfo,isRestored,isBack){previousViewInfo&&dispatchViewEvent(previousViewInfo.view,getViewHideEventInfo(previousViewInfo,newViewInfo),"viewbeforehide");var newView=newViewInfo.view,isRestored=getViewEventDetail(newViewInfo,isRestored,isBack,previousViewInfo),isBack=isRestored.detail.navMenuId;return isBack||"search"===(null==(previousViewInfo=isRestored.detail.params)?void 0:previousViewInfo.type)&&(isBack="search"),isBack=isBack||(isBack=window.location.href.toString()).substring(isBack.indexOf("#!")+2),isRestored.detail.navMenuId=isBack,newViewInfo.controllerFactory&&!newView.controller&&(newView.controller=new newViewInfo.controllerFactory(newView,isRestored.detail.params)),newViewInfo.controller&&newView.controller&&(previousViewInfo=function(urlOrPath){try{var pathname=new URL(urlOrPath).pathname;if(pathname)return pathname}catch(e){}return urlOrPath}(newViewInfo.controller),newView.controller.name=previousViewInfo.replaceAll(".js","").replaceAll(".","").replaceAll("/","-"),newView.classList.add("view-"+newView.controller.name)),dispatchViewEvent(newView,isRestored,"viewbeforeshow"),newView.controller}function onViewChange(previousViewInfo,newViewInfo,isRestore,isBack){previousViewInfo&&dispatchViewEvent(previousViewInfo.view,getViewHideEventInfo(previousViewInfo,newViewInfo),"viewhide"),isRestore&&removeViewInfoFromCurrentViews(newViewInfo),CurrentViewStack.push(newViewInfo);var controller,newView=newViewInfo.view;return"true"===(null==previousViewInfo?void 0:previousViewInfo.params.asDialog)?(onNewViewDisplayed(newViewInfo,isRestore,isBack,previousViewInfo),Promise.resolve(newView)):(((controller=newView.controller)?controller.transitionPromise:null)||Promise.resolve()).then(function(){return onNewViewDisplayed(newViewInfo,isRestore,isBack,previousViewInfo),newView})}function autoFocusView(view,options){var controller=view.controller;return controller&&controller.autoFocus?controller.autoFocus(options):_focusmanager.default.autoFocus(view,options)}function onNewViewDisplayed(viewInfo,isRestore,isBack,previousViewInfo){var newView=viewInfo.view,isBack=getViewEventDetail(viewInfo,isRestore,isBack,previousViewInfo);"true"===(null==previousViewInfo?void 0:previousViewInfo.params.asDialog)&&removeAndDestroy(previousViewInfo),isRestore?(previousViewInfo=viewInfo.activeElement)&&document.body.contains(previousViewInfo)&&_focusmanager.default.isCurrentlyFocusable(previousViewInfo)?_focusmanager.default.focus(previousViewInfo):autoFocusView(newView,{skipIfNotEnabled:!0}):!1!==viewInfo.autoFocus&&autoFocusView(newView,{skipIfNotEnabled:!0}),newView.dispatchEvent(new CustomEvent("viewshow",isBack)),newView.dispatchEvent(new CustomEvent("pageshow",isBack))}function dispatchViewEvent(view,eventInfo,eventName){view.dispatchEvent(new CustomEvent(eventName,eventInfo));view.dispatchEvent(new CustomEvent(eventName.replace("view","page"),eventInfo))}function getViewEventDetail(viewInfo,isRestore,isBack,previousViewInfo){var view=viewInfo.view;return viewInfo.isRestored=isRestore,viewInfo.isBack=isBack,viewInfo.previousViewInfo=previousViewInfo,null==viewInfo.title&&(viewInfo.title=view.getAttribute("data-title")||null),viewInfo.helpUrl||(viewInfo.helpUrl=view.getAttribute("data-helpurl")||null),ensureWindowScrollOption(viewInfo,view),{detail:viewInfo,bubbles:!0,cancelable:!1}}function removeAndDestroy(viewInfoToRemove,newViewToReplaceWith){removeViewInfoFromCurrentViews(viewInfoToRemove);var viewInfo,controller,viewToRemove=viewInfoToRemove.view;((viewInfo=viewInfoToRemove).activeElement=null)!=(controller=(viewInfo=viewInfo.view).controller)&&controller.destroy&&controller.destroy(),viewInfo.controller=null,"true"!==viewInfoToRemove.params.asDialog&&(newViewToReplaceWith?mainAnimatedPages.replaceChild(newViewToReplaceWith,viewToRemove):viewToRemove.remove())}function ViewManager(){}_events.default.on(_layoutmanager.default,"modechange",disableRestoreOnCurrentViews),_events.default.on(_usersettings.default,"change",function(e,name){switch(name){case"language":case"datetimelocale":case"tvhome":disableRestoreOnCurrentViews()}}),_events.default.on(_appsettings.default,"change",function(e,name){"name"===name&&disableRestoreOnCurrentViews()}),ViewManager.prototype.loadView=function(options,signal){var previousViewInfo=this.currentViewInfo(),isPluginpage=(previousViewInfo&&(previousViewInfo.activeElement=document.activeElement),options.isPluginPage),view=(normalizeNewView(options,isPluginpage),options.view),dependencies=view.getAttribute("data-require"),dependencyPromises=[];return(dependencies=dependencies?dependencies.split(","):[]).length&&dependencyPromises.push(require(dependencies)),isPluginpage&&(dependencyPromises.push(Emby.importModule("./legacy/dashboard.js")),dependencyPromises.push(require(["css!legacy/dashboard.css"]))),Promise.all(dependencyPromises).then(function(){var viewClassList=view.classList;return viewClassList.add("page"),viewClassList.add.apply(viewClassList,ViewClasses),ensureWindowScrollOption(options,view)&&viewClassList.add("page-windowScroll"),!mainAnimatedPages&&(mainAnimatedPages=document.querySelector(".mainAnimatedPages"),viewClassList=document.querySelector(".app-splash"))&&viewClassList.parentNode.removeChild(viewClassList),null!=(viewClassList=options.params)&&viewClassList.asDialog||((viewClassList=function(ignoreViewInfo){for(var candidates=[],views=CurrentViewStack,i=0,length=views.length;i<length;i++){var viewInfo=views[i];"true"!==viewInfo.params.asDialog&&candidates.push(viewInfo)}if(3<=candidates.length)for(var _i=0,_length=candidates.length;_i<_length;_i++){var _viewInfo=candidates[_i];if(_viewInfo!==ignoreViewInfo)return _viewInfo}return null}(previousViewInfo))?removeAndDestroy(viewClassList,view):mainAnimatedPages.appendChild(view)),function(view,options){return!options.controllerFactory&&(view=view.getAttribute("data-controller"))?(view.startsWith("__plugin/")&&(view=view.substring("__plugin/".length)),view=_pluginmanager.default.getConfigurationResourceUrl(view),require([view]).then(function(deps){options.controllerFactory=deps[0]})):Promise.resolve()}(view,options).then(function(){var viewInfo=options,controller=onBeforeChange(previousViewInfo,viewInfo,!1,options.isBack);if(previousViewInfo&&(controller&&controller.onBeginResume||null!=(controller=options.params)&&controller.asDialog||previousViewInfo.view.classList.add("hide"),previousViewInfo.params.asDialog&&(null==(controller=options.params)||!controller.asDialog)))for(var views=CurrentViewStack,i=0,length=views.length;i<length;i++){var _viewInfo2$params,_viewInfo2=views[i];null!=(_viewInfo2$params=_viewInfo2.params)&&_viewInfo2$params.asDialog||_viewInfo2.view.classList.add("hide")}return options.view=view,onViewChange(previousViewInfo,viewInfo,!1,options.isBack)})})},ViewManager.prototype.tryRestoreView=function(options,signal){var previousViewInfo=this.currentViewInfo(),url=(previousViewInfo&&(previousViewInfo.activeElement=document.activeElement),options.url),options=options.isBack,url=function(url){for(var views=CurrentViewStack,i=0,length=views.length;i<length;i++){var viewInfo=views[i];if(viewInfo.url===url)return viewInfo}return null}(url);if(url){var controller,view=null==url?void 0:url.view;if(view&&!1!==view.allowRestore)return(controller=onBeforeChange(previousViewInfo,url,!0,options))&&controller.onBeginResume||previousViewInfo&&(view.classList.remove("hide"),null!=(controller=url.params)&&controller.asDialog||previousViewInfo.view.classList.add("hide")),onViewChange(previousViewInfo,url,!0,options)}return Promise.reject()},ViewManager.prototype.canRestoreCurrentView=function(){var _this$currentView;return!1!==(null==(_this$currentView=this.currentView())?void 0:_this$currentView.allowRestore)},ViewManager.prototype.replaceCurrentUrl=function(url){var viewInfo=this.currentViewInfo();viewInfo&&(viewInfo.url=url)},ViewManager.prototype.onViewChange=onViewChange,ViewManager.prototype.currentView=function(){var _this$currentViewInfo;return null==(_this$currentViewInfo=this.currentViewInfo())?void 0:_this$currentViewInfo.view},ViewManager.prototype.currentViewController=function(){var _this$currentView2;return null==(_this$currentView2=this.currentView())?void 0:_this$currentView2.controller},ViewManager.prototype.currentViewInfo=function(){var views=CurrentViewStack,length=views.length;return length?views[length-1]:null},ViewManager.prototype.addViewClass=function(classes){for(var args=arguments,i=0,length=args.length;i<length;i++){var cls=args[i];ViewClasses.includes(cls)||ViewClasses.push(cls)}for(var views=CurrentViewStack,_i2=0,_length2=views.length;_i2<_length2;_i2++){var viewInfo=views[_i2],view=viewInfo.view;"true"!==viewInfo.params.asDialog&&view&&(viewInfo=view.classList).add.apply(viewInfo,arguments)}},ViewManager.prototype.removeViewClass=function(classes){for(var args=arguments,i=0,length=args.length;i<length;i++)!function(arr,value){for(var i=0;i<arr.length;)arr[i]===value?arr.splice(i,1):++i}(ViewClasses,args[i]);for(var views=CurrentViewStack,_i3=0,_length3=views.length;_i3<_length3;_i3++){var viewInfo=views[_i3];"true"!==viewInfo.params.asDialog&&(viewInfo=viewInfo.view)&&(viewInfo=viewInfo.classList).remove.apply(viewInfo,arguments)}},ViewManager.prototype.disableRestoreOnCurrentViews=disableRestoreOnCurrentViews,ViewManager.prototype.autoFocusCurrentView=function(options){var view=this.currentView();return view?autoFocusView(view,options):null},ViewManager.prototype.dispatchViewBeforeShow=function(viewInfo,isRestore,isBack,previousViewInfo){isRestore=getViewEventDetail(viewInfo,isRestore,isBack,previousViewInfo);dispatchViewEvent(viewInfo.view,isRestore,"viewbeforeshow")},ViewManager.prototype.dispatchViewBeforeHide=function(viewInfo,newViewInfo){dispatchViewEvent(viewInfo.view,getViewHideEventInfo(viewInfo,newViewInfo),"viewbeforehide")};_exports.default=new ViewManager});