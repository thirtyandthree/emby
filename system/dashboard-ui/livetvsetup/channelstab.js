define(["exports","./../modules/tabbedview/itemstab.js","./../modules/emby-elements/emby-input/emby-input.js","./../modules/emby-elements/emby-button/emby-button.js","./../modules/emby-elements/emby-checkbox/emby-checkbox.js","./../modules/emby-elements/emby-select/emby-select.js","./../modules/layoutmanager.js","./../modules/commandprocessor.js"],function(_exports,_itemstab,_embyInput,_embyButton,_embyCheckbox,_embySelect,_layoutmanager,_commandprocessor){function LiveTVSetupView(view,params){params.serverId=ApiClient.serverId(),this.supportsViewSettings=!1,this.enableTotalRecordCountDisplay=!1,_itemstab.default.apply(this,arguments)}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,Object.assign(LiveTVSetupView.prototype,_itemstab.default.prototype),LiveTVSetupView.prototype.onResume=function(options){_itemstab.default.prototype.onResume.apply(this,arguments)},LiveTVSetupView.prototype.onPause=function(){_itemstab.default.prototype.onPause.apply(this,arguments)},LiveTVSetupView.prototype.getApiClientQueryMethodName=function(){return"getLiveTvChannelsForManagement"},LiveTVSetupView.prototype.getBaseListRendererOptions=function(){var options=_itemstab.default.prototype.getBaseListRendererOptions.apply(this,arguments);return options.action=_layoutmanager.default.tv?"menu":"custom",options.multiSelect=!1,options},LiveTVSetupView.prototype.getListViewOptions=function(items,settings){var options=_itemstab.default.prototype.getListViewOptions.apply(this,arguments),enableDragReordering=!this.getQueryInfo().hasFilters;return Object.assign(options,{fields:["Name","ItemCheckbox","MappedChannelInfo"],draggable:enableDragReordering,dragHandle:enableDragReordering,image:!0,roundCheckbox:!0,checkboxAction:"togglechanneldisabled"})},LiveTVSetupView.prototype.getCardOptions=function(items,settings){var options=_itemstab.default.prototype.getCardOptions.apply(this,arguments);return Object.assign(options,{draggable:!1,fields:["Name"]})},LiveTVSetupView.prototype.getSettingsKey=function(){return"managechannels"},LiveTVSetupView.prototype.getSortMenuOptions=function(){return[]},LiveTVSetupView.prototype.getDefaultSorting=function(){return{sortBy:"DefaultChannelOrder",sortOrder:"Ascending"}},LiveTVSetupView.prototype.getVisibleFilters=function(){return["ChannelMappingStatus"]},LiveTVSetupView.prototype.getItemTypes=function(){return["ChannelManagementInfo"]},LiveTVSetupView.prototype.setTitle=function(){},LiveTVSetupView.prototype.getViewSettingDefaults=function(){var viewSettings=_itemstab.default.prototype.getViewSettingDefaults.apply(this,arguments);return viewSettings.imageType="list",viewSettings},LiveTVSetupView.prototype.loadTemplate=function(){return this.loadItemsTemplate()},LiveTVSetupView.prototype.onTemplateLoaded=function(){_itemstab.default.prototype.onTemplateLoaded.apply(this,arguments);var itemsContainer=this.itemsContainer;itemsContainer.setAttribute("data-monitor","ChannelManagementInfoUpdated"),itemsContainer.addEventListener("action-null",function(e){var item=e.detail.item;item.Disabled||_commandprocessor.default.executeCommand("edit",[item],{}).then(function(){e.target.closest(".itemsContainer").notifyRefreshNeeded(!0)})}.bind(this))};_exports.default=LiveTVSetupView});