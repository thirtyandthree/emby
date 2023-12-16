define(["exports","./../modules/tabbedview/videostab.js","./../modules/approuter.js","./../modules/common/globalize.js"],function(_exports,_videostab,_approuter,_globalize){function TrailersTab(view,params,options){(options=options||{}).itemType="Trailer",_videostab.default.call(this,view,params,options)}function getDefaultEmptyListMessage(){return Promise.resolve(_globalize.default.translate("NoTrailersMessage","",""))}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,Object.assign(TrailersTab.prototype,_videostab.default.prototype),TrailersTab.prototype.getBaseQuery=function(){var query=_videostab.default.prototype.getBaseQuery.apply(this,arguments),premiereDate=new Date;return premiereDate.setTime(premiereDate.getTime()-10368e6),query.MinPremiereDate=premiereDate.toISOString(),query},TrailersTab.prototype.isGlobalQuery=function(){return!0},TrailersTab.prototype.getSettingsKey=function(){return _videostab.default.prototype.getSettingsKey.call(this)+"-trailers"},TrailersTab.prototype.getItemTypes=function(){return["Trailer"]},TrailersTab.prototype.getEmptyListMessage=function(){return this.apiClient.getCurrentUser().then(function(user){var pluginCatalogRouteUrl=_approuter.default.getRouteUrl("PluginCatalog");return user.Policy.IsAdministrator&&_approuter.default.getRouteInfo(pluginCatalogRouteUrl)?"<div>"+_globalize.default.translate("NoTrailersMessage",'<a is="emby-linkbutton" class="button-link" href="'+pluginCatalogRouteUrl+'">',"</a></div>"):getDefaultEmptyListMessage()},getDefaultEmptyListMessage)};_exports.default=TrailersTab});