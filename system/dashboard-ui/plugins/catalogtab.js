define(["exports","./../modules/tabbedview/basetab.js","./../modules/loading/loading.js","./../modules/common/globalize.js","./../modules/emby-elements/emby-input/emby-input.js","./../modules/emby-elements/emby-button/emby-button.js","./../modules/emby-elements/emby-checkbox/emby-checkbox.js","./../modules/emby-elements/emby-select/emby-select.js","./../modules/emby-elements/emby-scroller/emby-scroller.js","./../modules/emby-elements/emby-itemscontainer/emby-itemscontainer.js","./../modules/cardbuilder/cardbuilder.js"],function(_exports,_basetab,_loading,_globalize,_embyInput,_embyButton,_embyCheckbox,_embySelect,_embyScroller,_embyItemscontainer,_cardbuilder){Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,require(["css!plugins/catalogtab.css"]);var _availablePlugins,query={TargetSystems:"Server",IsAdult:!1,PackageType:"UserInstalled"};function getAvailablePlugins(instance){var apiClient,promise2;return _availablePlugins?Promise.resolve(_availablePlugins):(instance=(apiClient=instance.getApiClient()).getAvailablePlugins(query),promise2=apiClient.getInstalledPlugins(),Promise.all([instance,promise2]).then(function(responses){var availablePlugins=responses[0],responses=responses[1];return function(availablePlugins,installedPlugins){for(var i=0,length=installedPlugins.length;i<length;i++){var installedPlugin=installedPlugins[i],availablePlugin=function(availablePlugins,installedPlugin){return availablePlugins.filter(function(ap){return(installedPlugin.Id||"").toLowerCase()===(ap.guid||"").toLowerCase()})[0]}(availablePlugins,installedPlugin);availablePlugin&&(availablePlugin.InstalledVersion=installedPlugin.Version)}}(availablePlugins,responses),function(plugins,apiClient){for(var i=0,length=plugins.length;i<length;i++){var plugin=plugins[i];plugin.category=plugin.category||"General",plugin.Type="PluginCatalogItem",plugin.Id=plugin.guid,plugin.Name=plugin.name,plugin.ServerId=apiClient.serverId(),plugin.PrimaryImageAspectRatio=16/9,plugin.ImageUrl=plugin.thumbImage}}(availablePlugins,apiClient),availablePlugins=availablePlugins.sort(function(a,b){var aName=a.category,bName=b.category;return bName<aName?1:aName<bName?-1:(aName=a.name,(bName=b.name)<aName?1:aName<bName?-1:0)}),_availablePlugins=availablePlugins}))}function getCategories(plugins){var list=[];if(plugins.length){list.push({Name:_globalize.default.translate("HeaderTopPlugins"),Id:"top"});for(var categories={},i=0,length=plugins.length;i<length;i++){var category=plugins[i].category;categories[category]||(categories[category]=!0,list.push({Name:function(category){"Channel"===category?category="Channels":"Theme"===category?category="Themes":"LiveTV"===category?category="LiveTV":"ScreenSaver"===category&&(category="HeaderScreenSavers");return _globalize.default.translate(category)}(category),Id:category}))}}return list}function getCategoryHtml(category){var html="";return(html+='<div class="verticalSection">')+('<h2 class="sectionTitle sectionTitle-cards padded-left padded-right padded-left-page">'+category.Name+"</h2>")+'<div is="emby-scroller" class="padded-top-focusscale padded-bottom-focusscale padded-left padded-left-page padded-right" data-mousewheel="false" data-focusscroll="true">'+('<div is="emby-itemscontainer" data-focusabletype="nearest" class="scrollSlider itemsContainer focuscontainer-x focusable" data-category="'+category.Id+'">')+"</div>"+"</div>"+"</div>"}function getCategoryItems(){var itemsContainer=this.itemsContainer,instance=this.instance,category=itemsContainer.getAttribute("data-category");return getAvailablePlugins(instance).then(function(plugins){return"top"===category?function(plugins){return(plugins=plugins.slice(0).sort(function(a,b){return a.installs>b.installs?-1:b.installs>a.installs||(a=a.name,(b=b.name)<a)?1:a<b?-1:0}).filter(isUserInstalledPlugin)).length=Math.min(plugins.length,15),plugins}(plugins):plugins.filter(function(p){return p.category===category})})}function getCategoryListOptions(){return{renderer:_cardbuilder.default,options:{shape:"auto",fields:["Name","InstalledVersion"],centerText:!0,overlayPlayButton:!1,cardLayout:!1,multiSelect:!1,contextMenu:!1,draggable:!1},virtualScrollLayout:"horizontal-grid"}}function onUpgraded(){this.resume({refresh:!0})}function isUserInstalledPlugin(plugin){return-1===["02528C96-F727-44D7-BE87-9EEF040758C3","0277E613-3EC0-4360-A3DE-F8AF0AABB5E9","4DCB591C-0FA2-4C5D-A7E5-DABE37164C8B","18CFFD2C-74F5-4EDE-8DAD-BE339443AFE4","C25B3C85-1880-4827-9C72-0FA74314F428","8C6DDB20-18B1-4131-9285-796179A71C0F","96FA50A4-69CE-42AC-B6A3-EF6B3388CCB7"].indexOf(plugin.guid)}function PluginCatalog(view,params){_basetab.default.apply(this,arguments)}Object.assign(PluginCatalog.prototype,_basetab.default.prototype),PluginCatalog.prototype.onResume=function(options){var instance;_basetab.default.prototype.onResume.apply(this,arguments),options.refresh&&(instance=this,_availablePlugins=null,_loading.default.show(),getAvailablePlugins(instance).then(function(availablePlugins){for(var availablePlugins=getCategories(availablePlugins),parentElem=instance.view.querySelector(".catalogMain"),itemsContainers=(parentElem.innerHTML=availablePlugins.map(getCategoryHtml).join(""),parentElem.querySelectorAll(".itemsContainer")),i=0,length=itemsContainers.length;i<length;i++){var itemsContainer=itemsContainers[i];itemsContainer.fetchData=getCategoryItems.bind({itemsContainer:itemsContainer,instance:instance}),itemsContainer.getListOptions=getCategoryListOptions.bind(itemsContainer),itemsContainer.resume?onUpgraded.call(itemsContainer):itemsContainer.addEventListener("upgraded",onUpgraded)}_loading.default.hide()}))},PluginCatalog.prototype.loadTemplate=function(){return require(["text!plugins/catalogtab.html"])};_exports.default=PluginCatalog});