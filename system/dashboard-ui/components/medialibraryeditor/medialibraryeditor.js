define(["exports","./../../modules/common/globalize.js","./../../modules/layoutmanager.js","./../../modules/loading/loading.js","./../../modules/dialoghelper/dialoghelper.js","./../libraryoptionseditor/libraryoptionseditor.js","./../../modules/formhelper.js","./../../modules/listview/listview.js","./../../modules/emby-elements/emby-scroller/emby-scroller.js","./../../modules/emby-elements/emby-button/emby-button.js","./../../modules/emby-elements/emby-button/paper-icon-button-light.js","./../../modules/emby-elements/emby-input/emby-input.js","./../../modules/emby-elements/emby-select/emby-select.js","./../../modules/emby-elements/emby-checkbox/emby-checkbox.js","./../../modules/emby-elements/emby-toggle/emby-toggle.js","./../../modules/emby-elements/emby-dialogclosebutton/emby-dialogclosebutton.js"],function(_exports,_globalize,_layoutmanager,_loading,_dialoghelper,_libraryoptionseditor,_formhelper,_listview,_embyScroller,_embyButton,_paperIconButtonLight,_embyInput,_embySelect,_embyCheckbox,_embyToggle,_embyDialogclosebutton){var currentResolve,currentOptions;function addMediaLocation(page,path,networkSharePath,username,password){var virtualFolder=currentOptions.library,refreshAfterChange=currentOptions.refresh;ApiClient.addMediaPath(virtualFolder,{Path:path,NetworkPath:networkSharePath,Username:username,Password:password},refreshAfterChange).then(function(){refreshLibraryFromServer(page)},function(){var options;options=_globalize.default.translate("ErrorAddingMediaPathToVirtualFolder"),Emby.importModule("./modules/common/dialogs/alert.js").then(function(alert){return alert(options)})})}function onRemoveClick(btnRemovePath,location){var options,button=btnRemovePath,virtualFolder=currentOptions.library;options={title:_globalize.default.translate("HeaderRemoveMediaLocation"),text:_globalize.default.translate("MessageConfirmRemoveMediaLocation"),confirmText:_globalize.default.translate("Delete"),primary:"cancel"},Emby.importModule("./modules/common/dialogs/confirm.js").then(function(confirm){return confirm(options)}).then(function(){var refreshAfterChange=currentOptions.refresh;ApiClient.removeMediaPath(virtualFolder,location,refreshAfterChange).then(function(){refreshLibraryFromServer(button.closest(".dlg-libraryeditor"))},_formhelper.default.handleErrorResponse)})}function onListItemClick(e){var pathInfos,index,listItem=e.target.closest(".listItem");listItem&&(index=parseInt(listItem.getAttribute("data-index")),pathInfos=(currentOptions.library.LibraryOptions||{}).PathInfos||[],index=(pathInfos=null!=index&&pathInfos[index]||{}).Path||(null==index?null:currentOptions.library.Locations[index]),(e=e.target.closest(".btnRemovePath"))?onRemoveClick(e,index):showDirectoryBrowser(listItem.closest(".dlg-libraryeditor"),index,pathInfos.NetworkPath))}function getFolderHtml(pathInfo,index){var html="",html=(html=(html+='<div class="listItem listItem-border lnkPath" data-index="'+index+'">')+('<div class="'+(pathInfo.NetworkPath?"listItemBody two-line listItemBody-noleftpadding":"listItemBody listItemBody-noleftpadding")+'">')+'<div class="listItemBodyText">')+pathInfo.Path+"</div>";return pathInfo.NetworkPath&&(html+='<div class="listItemBodyText listItemBodyText-secondary secondaryText">'+pathInfo.NetworkPath+"</div>"),html=(html+="</div>")+('<button type="button" is="paper-icon-button-light" class="listItemButton btnRemovePath" data-index="'+index+'"><i class="md-icon">remove_circle</i></button>')+"</div>"}function refreshLibraryFromServer(page){ApiClient.getVirtualFolders().then(function(result){result=result.Items.filter(function(f){return f.ItemId===currentOptions.library.ItemId})[0];result&&(currentOptions.library=result,renderLibrary(page,currentOptions))})}function renderLibrary(page,options){var pathInfos=(options.library.LibraryOptions||{}).PathInfos||[];pathInfos.length||(pathInfos=options.library.Locations.map(function(p){return{Path:p}})),"boxsets"===options.library.CollectionType||"playlists"===options.library.CollectionType?page.querySelector(".folders").classList.add("hide"):page.querySelector(".folders").classList.remove("hide"),page.querySelector(".folderList").innerHTML=pathInfos.map(getFolderHtml).join("")}function onAddButtonClick(){showDirectoryBrowser(this.closest(".dlg-libraryeditor"))}function showDirectoryBrowser(context,originalPath,networkPath){Emby.importModule("./modules/directorybrowser/directorybrowser.js").then(function(directoryBrowser){var picker=new directoryBrowser;picker.show({enableNetworkSharePath:!0,enableLoginCredentials:!0,pathReadOnly:null!=originalPath,path:originalPath,networkSharePath:networkPath,callback:function(path,networkSharePath,username,password){path&&(originalPath?function(page,path,networkSharePath,username,password){var virtualFolder=currentOptions.library;ApiClient.updateMediaPath(virtualFolder,{Path:path,NetworkPath:networkSharePath,Username:username,Password:password}).then(function(){refreshLibraryFromServer(page)},_formhelper.default.handleErrorResponse)}(context,originalPath,networkSharePath,username,password):addMediaLocation(context,path,networkSharePath,username,password)),picker.close()}})})}function onToggleAdvancedChange(){var dlg=this.closest(".dlg-libraryeditor");_libraryoptionseditor.default.setAdvancedVisible(dlg.querySelector(".libraryOptions"),this.checked)}function onDialogClosing(){var libraryOptions=_libraryoptionseditor.default.getLibraryOptions(this.querySelector(".libraryOptions")),libraryOptions=Object.assign(currentOptions.library.LibraryOptions||{},libraryOptions);ApiClient.updateVirtualFolderOptions(currentOptions.library.ItemId,libraryOptions)}function onDialogClosed(){_loading.default.hide(),currentResolve(!0)}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,require(["flexStyles","formDialogStyle"]);_exports.default=function(){this.show=function(options){return new Promise(function(resolve,reject){currentResolve=resolve,currentOptions=options,0;resolve=new XMLHttpRequest;resolve.open("GET","components/medialibraryeditor/medialibraryeditor.template.html",!0),resolve.onload=function(e){var template=this.response,dlg=_dialoghelper.default.createDialog({size:_layoutmanager.default.tv?"fullscreen":"medium-tall",modal:!1,removeOnClose:!0,scrollY:!1});dlg.classList.add("dlg-libraryeditor"),dlg.classList.add("ui-body-a"),dlg.classList.add("background-theme-a"),dlg.classList.add("formDialog"),dlg.innerHTML=_globalize.default.translateDocument(template),dlg.querySelector(".formDialogHeaderTitle").innerHTML=options.library.Name,function(dlg,options){renderLibrary(dlg,options),dlg.querySelector(".btnAddFolder").addEventListener("click",onAddButtonClick),dlg.querySelector(".folderList").addEventListener("click",onListItemClick),dlg.querySelector(".chkAdvanced").addEventListener("change",onToggleAdvancedChange),_libraryoptionseditor.default.embed(dlg.querySelector(".libraryOptions"),options.library.CollectionType,options.library.LibraryOptions).then(function(){onToggleAdvancedChange.call(dlg.querySelector(".chkAdvanced"))})}(dlg,options),dlg.addEventListener("closing",onDialogClosing),dlg.addEventListener("close",onDialogClosed),_dialoghelper.default.open(dlg),refreshLibraryFromServer(dlg)},resolve.send()})}}});