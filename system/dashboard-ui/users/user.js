define(["exports","./../modules/common/globalize.js","./../modules/tabbedview/tabbedview.js"],function(_exports,_globalize,_tabbedview){function UserView(view,params){_tabbedview.default.apply(this,arguments),this.apiClient=ApiClient}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,Object.assign(UserView.prototype,_tabbedview.default.prototype),UserView.prototype.getTabs=function(){return[{name:_globalize.default.translate("Profile"),id:"profile"},{name:_globalize.default.translate("TabAccess"),id:"access"},{name:_globalize.default.translate("TabParentalControl"),id:"parentalcontrol"},{name:_globalize.default.translate("Password"),id:"password"}]},UserView.prototype.getItem=function(){var params=this.params;return this.apiClient.getUser(params.userId,!1)},UserView.prototype.getTitle=function(){return this.item.Name},UserView.prototype.loadTabController=function(id){return Emby.importModule("./users/"+id+"tab.js")},UserView.prototype.destroy=function(){_tabbedview.default.prototype.destroy.apply(this,arguments),this.apiClient=null};_exports.default=UserView});