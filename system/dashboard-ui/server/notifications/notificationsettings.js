define(["exports","./../../modules/viewmanager/baseview.js","./../../modules/loading/loading.js","./../../modules/emby-elements/emby-button/emby-button.js","./../../modules/emby-elements/emby-scroller/emby-scroller.js","./../../modules/listview/listview.js"],function(_exports,_baseview,_loading,_embyButton,_embyScroller,_listview){function View(view,params){_baseview.default.apply(this,arguments)}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,Object.assign(View.prototype,_baseview.default.prototype),View.prototype.onResume=function(options){var instance,apiClient,page;_baseview.default.prototype.onResume.apply(this,arguments),instance=this,_loading.default.show(),apiClient=instance.getApiClient(),page=instance.view,apiClient.getJSON(apiClient.getUrl("Notifications/Types")).then(function(list){var html="",lastCategory="";html+=list.map(function(i){var itemHtml="";return i.Category!==lastCategory&&((lastCategory=i.Category)&&(itemHtml+="</div></div>"),itemHtml=(itemHtml+='<div class="verticalSection verticalSection-extrabottompadding"><div class="sectionTitleContainer" style="margin-bottom:1em;"><h2 class="sectionTitle">')+i.Category+"</h2></div><div>"),itemHtml=itemHtml+('<a class="listItem listItem-border" is="emby-linkbutton" data-ripple="false" href="server/notifications/notificationsetting.html?type='+i.Type+'">')+'<div class="listItemImageContainer listItemImageContainer-square defaultCardBackground" style="aspect-ratio:1;">',i.Enabled?itemHtml+='<i class="listItemIcon md-icon listItemIcon-transparent">notifications_active</i>':itemHtml+='<i class="listItemIcon md-icon listItemIcon-transparent secondaryText">notifications_off</i>',itemHtml=(itemHtml=(itemHtml=itemHtml+"</div>"+'<div class="listItemBody">')+('<div class="listItemBodyText">'+i.Name+"</div>")+"</div>")+'<button type="button" is="paper-icon-button-light"><i class="md-icon autortl">&#xe3c9;</i></button>'+"</a>"}).join(""),list.length&&(html+="</div></div>"),page.querySelector(".notificationList").innerHTML=html,_loading.default.hide()})};_exports.default=View});