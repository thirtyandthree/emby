define(["exports","./../emby-apiclient/connectionmanager.js","./../layoutmanager.js","./../common/globalize.js","./../common/datetime.js","./../common/textencoding.js","./../common/dataformatter.js","./../mediainfo/mediainfo.js","./../focusmanager.js","./../common/itemmanager/itemmanager.js","./../imageloader/imageloader.js","./../shortcuts.js","./../common/playback/playbackmanager.js","./../emby-elements/userdatabuttons/emby-ratingbutton.js","./../emby-elements/userdatabuttons/emby-playstatebutton.js","./../emby-elements/emby-button/emby-button.js","./../dom.js","./../browser.js"],function(_exports,_connectionmanager,_layoutmanager,_globalize,_datetime,_textencoding,_dataformatter,_mediainfo,_focusmanager,_itemmanager,_imageloader,_shortcuts,_playbackmanager,_embyRatingbutton,_embyPlaystatebutton,_embyButton,_dom,_browser){Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,require(["css!modules/datagrid/datagrid.css"]);var supportsNativeLazyLoading="loading"in HTMLImageElement.prototype,decodingAttribute=_dom.default.supportsAsyncDecodedImages()?' decoding="async"':"",supportsObjectFit=CSS.supports("object-fit","contain")&&!_browser.default.edge;function getTextActionButton(options,item,text,serverId,parentId,isSameItemAsCard){return text=text||_itemmanager.default.getDisplayName(item,{includeIndexNumber:!1}),!_layoutmanager.default.tv&&!1!==options.textLinks&&(item.Id||isSameItemAsCard)?'<button title="'+(text=_textencoding.default.htmlEncode(text))+'" title="'+text+'" '+(isSameItemAsCard?"":_shortcuts.default.getShortcutAttributesHtml(item,{serverId:serverId,parentId:parentId}))+' type="button"'+(!options.anyDraggable||isSameItemAsCard?"":' draggable="true"')+' class="itemAction textActionButton dataGridItem-textActionButton emby-button button-link" data-action="link">'+text+"</button>":_textencoding.default.htmlEncode(text)}function getTextLinks(items,linkedType,item,options){return items.map(function(i){return i.Type=linkedType,i.IsFolder=!0,getTextActionButton(options,i,null,item.ServerId)}).join(",")}function getColumnInnerHtml(item,itemController,column,options){var _item$UserData;switch(column.id){case"Name":return getTextActionButton(options,item,null,null,null,!0);case"Number":return item.Number||item.IndexNumber;case"ProductionYear":return item.ProductionYear;case"Filename":return item.FileName||item.Filename;case"Path":return item.Path;case"SortName":return _textencoding.default.htmlEncode(item.SortName||"");case"OriginalTitle":return _textencoding.default.htmlEncode(item.OriginalTitle||"");case"Overview":return _textencoding.default.htmlEncode(item.Overview||"");case"Tagline":return _textencoding.default.htmlEncode((item.Taglines||[])[0]||"");case"Runtime":return item.RunTimeTicks?_datetime.default.getHumanReadableRuntime(item.RunTimeTicks):null;case"PremiereDate":return item.PremiereDate?_datetime.default.toLocaleDateString(new Date(Date.parse(item.PremiereDate))):null;case"StartDate":return item.StartDate?_datetime.default.toLocaleString(new Date(Date.parse(item.StartDate))):null;case"DatePlayed":return null!=(_item$UserData=item.UserData)&&_item$UserData.LastPlayedDate?_datetime.default.toLocaleDateString(new Date(Date.parse(null==(_item$UserData=item.UserData)?void 0:_item$UserData.LastPlayedDate))):null;case"CommunityRating":return item.CommunityRating?_mediainfo.default.getCommunityRating(item,{outerClass:"dataGridMediaInfoItem"}):null;case"OfficialRating":return item.OfficialRating;case"EpisodeNumber":return function(item){var season,number=item.IndexNumber;return null==number?null:(null!=item.ParentIndexNumber&&(season="S"+item.ParentIndexNumber,number=(season=item.SeasonId?getTextActionButton({},{Id:item.SeasonId,Type:"Season",ServerId:item.ServerId,Name:season,IsFolder:!0}):season)+":E"+number),null!=item.IndexNumberEnd&&(number+="-"+item.IndexNumberEnd),number)}(item);case"SeriesName":return item.SeriesId&&"Episode"===item.Type?getTextActionButton(options,{Id:item.SeriesId,Type:"Series",ServerId:item.ServerId,Name:item.SeriesName,IsFolder:!0}):item.SeriesName;case"Album":return item.AlbumId?getTextActionButton(options,{Id:item.AlbumId,Type:"MusicAlbum",ServerId:item.ServerId,Name:item.Album,IsFolder:!0}):item.Album;case"IndexNumber":return item.IndexNumber;case"Genres":return getTextLinks(item.GenreItems||[],"Genre",item,options);case"Studios":return getTextLinks(item.Studios||[],"Studio",item,options);case"Tags":return getTextLinks(item.TagItems||[],"Tag",item,options);case"Artist":return getTextLinks(item.ArtistItems||[],"MusicArtist",item,options);case"AlbumArtist":return getTextLinks(item.AlbumArtists||[],"MusicArtist",item,options);case"Composer":return getTextLinks(item.Composers||[],"MusicArtist",item,options);case"ParentIndexNumber":return item.ParentIndexNumber;case"Video3DFormat":return item.Video3DFormat?'<i class="md-icon">&#xe5ca;</i>':null;case"CriticRating":return item.CriticRating?_mediainfo.default.getCriticRating(item,{outerClass:"dataGridMediaInfoItem"}):null;case"PlayCount":return null==(_item$UserData=item.UserData)?void 0:_item$UserData.PlayCount;case"Resolution":return item.Width&&item.Height?_dataformatter.default.getResolutionText(item):null;case"IsDisabled":return null!=(_item$UserData=item.Policy)&&_item$UserData.IsDisabled?'<i title="'+_globalize.default.translate("Disabled")+'" class="dataGridItemCell-icon md-icon secondaryText">&#xe510;</i>':"";case"EnableRemoteAccess":return null!=(_item$UserData=item.Policy)&&_item$UserData.EnableRemoteAccess?'<i title="'+_globalize.default.translate("RemoteAccess")+'" class="dataGridItemCell-icon md-icon secondaryText">&#xe5ca;</i>':"";case"IsAdministrator":return null!=(_item$UserData=item.Policy)&&_item$UserData.IsAdministrator?'<i title="'+_globalize.default.translate("Admin")+'" class="dataGridItemCell-icon md-icon secondaryText">&#xef3d;</i>':"";case"HasPassword":return item.HasConfiguredPassword?'<i title="'+_globalize.default.translate("Password")+'" class="dataGridItemCell-icon md-icon secondaryText">&#xe897;</i>':"";case"HasProfilePin":return null!=(_item$UserData=item.Configuration)&&_item$UserData.ProfilePin?'<i title="'+_globalize.default.translate("TitleProfilePin")+'" class="dataGridItemCell-icon md-icon secondaryText">&#xe5ca;</i>':"";case"Image":return function(item,options){var imageClass,itemShape,imageContainerClass,styleRules,imageItem=options.showCurrentProgramImage?item.CurrentProgram||item:item.ProgramInfo||item,apiClient=_connectionmanager.default.getApiClient(item),apiClient=_imageloader.default.getImageUrl(imageItem,apiClient,{width:80,showChannelLogo:"channel"===options.imageSource,uiAspect:options.aspectInfo.aspect}),imgUrl=options.preferIcon?null:apiClient.imgUrl,html="",enableHoverPlayButton=!_layoutmanager.default.tv&&!1!==options.hoverPlayButton&&_playbackmanager.default.canPlay(item);return imgUrl&&(imageContainerClass="dataGridItemImageContainer dataGridItemImageContainer-"+options.shape,imageClass="dataGridItemCell-img",itemShape=apiClient.aspect?_imageloader.default.getShapeFromAspect(apiClient.aspect):_imageloader.default.getShape([item],options)||"square","square"===options.shape&&"MusicArtist"===item.Type&&(imageClass+=" dataGridItemCell-img-round"),(styleRules=[]).push("aspect-ratio:"+options.aspectInfo.aspectCss),html+='<div class="'+imageContainerClass+'"'+(styleRules.length?' style="'+styleRules.join(";")+'"':"")+">",imageContainerClass=_imageloader.default.getAspectFromShape(itemShape,options),imageClass+=" dataGridItemImage-"+itemShape,(styleRules=_imageloader.default.getCoveredImageClass(imageItem,apiClient.aspect,imageContainerClass.aspect))&&(imageClass+=styleRules),2===options.lazy?html+=supportsObjectFit?'<img draggable="false" class="'+imageClass+'"'+decodingAttribute+' style="aspect-ratio:'+imageContainerClass.aspectCss+';" src="'+imgUrl+'" />':'<div class="'+imageClass+'" style="aspect-ratio:'+imageContainerClass.aspectCss+";background-image:url("+imgUrl+');">':html+=supportsNativeLazyLoading&&supportsObjectFit?'<img draggable="false" class="'+imageClass+'" loading="lazy"'+decodingAttribute+' style="aspect-ratio:'+imageContainerClass.aspectCss+';" src="'+imgUrl+'" />':'<div class="'+imageClass+' lazy" style="aspect-ratio:'+imageContainerClass.aspectCss+";background-image:url("+imgUrl+');">',html+="</div>"),enableHoverPlayButton&&(html+='<button tabindex="-1" type="button" is="paper-icon-button-light" class="dataGridItemOverlayButton-hover dataGridItemOverlayButton-imagehover itemAction" data-action="'+(item.IsFolder?"resume":options.playAction||"play")+'"><i class="md-icon dataGridItemOverlayButtonIcon autortl">&#xE037;</i></button>'),html}(item,options);case"ContextMenu":return'<button title="'+_globalize.default.translate("More")+'" aria-label="'+_globalize.default.translate("More")+'" type="button" is="paper-icon-button-light" class="dataGridItemCell-button dataGridItemContextMenuButton itemAction md-icon" data-action="menu">&#xE5D3;</button>';case"IsFavorite":return _itemmanager.default.canRate(item)?_embyRatingbutton.default.getHtml(item.UserData.IsFavorite,"dataGridItemCell-button paper-icon-button-light itemAction"):"";case"Played":return _itemmanager.default.canMarkPlayed(item)?_embyPlaystatebutton.default.getHtml(item.UserData.Played,"dataGridItemCell-button paper-icon-button-light itemAction"):"";case"Play":return _playbackmanager.default.canPlay(item)?'<button title="'+_globalize.default.translate("Play")+'" aria-label="'+_globalize.default.translate("Play")+'" type="button" is="paper-icon-button-light" class="dataGridItemCell-button itemAction md-icon autortl secondaryText" data-action="playallfromhere">&#xe1c4;</button>':"";default:return itemController.resolveField(item,column.id)}}var columnSizes=[2,3,4,5,6,7,8,9,10,12,15,18,20,25,30,40,80];function getColumnHtml(item,itemController,column,options,isHeader){var html="",columnClass="dataGridItemCell";if(column.center&&(columnClass+=" dataGridItemCell-centered"),column.center)switch(column.gridColumnType){case"button":case"icon":columnClass+=" dataGridItemCell-nopadding"}var innerHTML,sortValues=options.sortValues,interactiveHeader=(15<=column.renderSize&&(columnClass+=" dataGridItemCell-fill"),!_layoutmanager.default.tv);return html+='<div class="'+(columnClass+=" dataGridItemCell-"+column.renderSize)+' dataGridItemCell-fillheight">',isHeader?(isHeader="dataGridHeaderText",column.center&&(isHeader+=" dataGridHeaderText-centered"),column.sortBy&&interactiveHeader?(innerHTML='<button title="'+(interactiveHeader=_globalize.default.translate("SortByValue",column.name))+'" aria-label="'+interactiveHeader+'" type="button" is="emby-linkbutton" class="'+isHeader+' button-link button-inherit-color btnGridHeaderColumnSort" data-sortvalue="'+column.sortBy+'">',innerHTML+=column.gridDisplayName||column.name,column.sortBy===(null==sortValues?void 0:sortValues.sortBy)&&(innerHTML+='<i class="md-icon dataGridSortIndicator">',"Descending"===sortValues.sortOrder?innerHTML+="&#xe5db;":innerHTML+="&#xe5d8;",innerHTML+="</i>"),innerHTML+="</button>"):innerHTML=(innerHTML='<div class="'+isHeader+'">')+(column.gridDisplayName||column.name)+"</div>"):null==(innerHTML=getColumnInnerHtml(item,itemController,column,options))&&(innerHTML="&nbsp;"),html+innerHTML+"</div>"}function getListItemHtml(item,index,options){for(var attributes,tagName=options.tagName,action=options.action,html="",itemController=(options.multiSelect&&(html+='<label title="'+options.multiSelectTitle+'" data-action="multiselect" class="secondaryText chkDataGridItemSelectContainer chkItemSelectContainer itemAction emby-checkbox-label"><input tabindex="-1" class="chkListItemSelect chkItemSelect emby-checkbox emby-checkbox-notext" is="emby-checkbox" type="checkbox" data-classes="true" /><span class="checkboxLabel chkListItemSelect-checkboxLabel"></span></label>'),html+='<div class="'+options.contentWrapperClass+'">',_itemmanager.default.getItemController(item.Type)),columns=(options.columnSelector&&(html+=getColumnHtml(item,itemController,{gridColumnType:"icon",id:"Image",size:5,renderSize:5,name:" ",center:!0},options)),options.columns),i=0,length=columns.length;i<length;i++)html+=getColumnHtml(item,itemController,columns[i],options);return html+="</div>",options.listItemParts?(attributes=_shortcuts.default.getShortcutAttributes(item,options),action&&attributes.push({name:"data-action",value:action}),options.isVirtualList||attributes.push({name:"data-index",value:index}),{attributes:attributes,html:html}):(attributes=_shortcuts.default.getShortcutAttributesHtml(item,options),action&&(attributes+=' data-action="'+action+'"'),options.isVirtualList||(attributes+=' data-index="'+index+'"'),(action=options.fixedAttributes)&&(attributes+=" "+action),"<"+tagName+' class="'+options.className+'"'+attributes+">"+html+"</"+tagName+">")}function setListOptions(items,options){options.shape=_imageloader.default.getShape(items,options)||"square",options.aspectInfo=_imageloader.default.getAspectFromShape(options.shape,options),"banner"===options.shape&&(options.shape="backdrop"),options.columnSelector=!_layoutmanager.default.tv&&!1!==options.columnSelector,null==options.isBoundListItem&&(options.isBoundListItem=!0),options.itemSelector=".dataGridItem",options.enableScrollX=!_layoutmanager.default.tv,options.enableFixedPositionHeader=options.enableScrollX,options.dataGridItemContentClass="dataGridItem-content",options.contextMenu=!1!==options.contextMenu,options.enableUserDataButtons=!1!==options.enableUserDataButtons,options.moreButton=options.contextMenu&&!1!==options.moreButton&&!_layoutmanager.default.tv,options.moreButton&&options.columns.push({gridColumnType:"button",name:" ",gridDisplayName:" ",id:"ContextMenu",size:5,center:!0});for(var i=0,length=options.columns.length;i<length;i++)options.columns[i].renderSize=function(column,options){if(size=column.size){_column$name="button"===column.gridColumnType||"icon"===column.gridColumnType?size:Math.ceil(.8*((null==(_column$name=column.name)?void 0:_column$name.length)||0));var _column$name,options=null==(options=options.sortValues)?void 0:options.sortBy;options&&column.sortBy===options&&(_column$name+=2);for(var size=Math.max(size,_column$name),i=0,length=columnSizes.length;i<length;i++){var columnSize=columnSizes[i];if(size<=columnSize)return columnSize}}return columnSizes[columnSizes.length-1]}(options.columns[i],options);if(options.enableScrollX){for(var scrollXWidth=0,_i=0,_length=options.columns.length;_i<_length;_i++)scrollXWidth+=options.columns[_i].renderSize;options.scrollXWidth=scrollXWidth+60,scrollXWidth||(options.enableScrollX=!1)}else options.dataGridItemContentClass+=" dataGridItem-content-noscroll";options.contentWrapperClass=options.dataGridItemContentClass,options.fields||(options.fields=[]);for(var fieldMap={},_i2=0,_length2=options.fields.length;_i2<_length2;_i2++)fieldMap[options.fields[_i2]]=!0;options.fieldMap=fieldMap,options.clickEntireItem=_layoutmanager.default.tv?!fieldMap.ItemCheckbox:!(options.mediaInfo||options.moreButton||options.enableUserDataButtons||fieldMap.ItemCheckbox),options.action=options.action||"link",options.tagName=options.clickEntireItem?"button":"div",options.multiSelectTitle=_globalize.default.translate("MultiSelect"),options.multiSelect=!1!==options.multiSelect&&!_layoutmanager.default.tv,options.enableUserData=!1!==options.enableUserData;for(var items="dataGridItem",innerHTML=(_layoutmanager.default.tv||(options.contentWrapperClass+=" dataGridItem-content-touchzoom",_browser.default.iOS)||_browser.default.osx||(items+=" dataGridItem-autoactive"),(options.clickEntireItem||options.action&&"none"!==options.action)&&(items+=" itemAction"),"div"===options.tagName?(items+=" focusable",options.addTabIndex=!0):"button"===options.tagName&&(items+=" dataGridItem-button"),"none"===options.action&&!options.clickEntireItem||(items+=" dataGridItemCursor"),_layoutmanager.default.tv?items+=" dataGridItem-focusscale":items+=" dataGridItem-hoverable",_layoutmanager.default.tv?options.draggable=!1:options.draggable=!1!==options.draggable,options.anyDraggable=options.draggable,options.itemClass&&(items+=" "+options.itemClass),options.dragHandle&&options.draggable?items+=" drop-target ordered-drop-target-y":options.dropTarget&&!_layoutmanager.default.tv&&(items+=" drop-target full-drop-target"),options.className=items,""),columns=(innerHTML+='<div class="'+options.contentWrapperClass+'">',options.columns),item={},itemController=_itemmanager.default.getItemController(item.Type),_i3=0,_length3=columns.length;_i3<_length3;_i3++)innerHTML+=getColumnHtml(item,itemController,columns[_i3],options);innerHTML+="</div>";items="";options.addTabIndex&&(items+=' tabindex="0"'),options.anyDraggable&&(items+=' draggable="true"'),options.clickEntireItem,options.fixedAttributes=items.trim(),options.templateInnerHTML=innerHTML}function getItemsHtml(items,options){setListOptions(items,options);for(var html="",i=0,length=items.length;i<length;i++)html+=getListItemHtml(items[i],i,options);return html}_exports.default={getItemsHtml:getItemsHtml,setListOptions:setListOptions,getItemParts:function(item,index,options){return options.listItemParts=!0,getListItemHtml(item,index,options)},buildItems:function(items,options){var itemsContainer=options.itemsContainer;if(document.body.contains(itemsContainer)){var parentContainer=options.parentContainer;if(parentContainer){if(!items.length)return void parentContainer.classList.add("hide");parentContainer.classList.remove("hide")}parentContainer=getItemsHtml(items,options);itemsContainer.innerHTML=parentContainer,itemsContainer.items=items,options.multiSelect&&(itemsContainer.enableMultiSelect?itemsContainer.enableMultiSelect(!0):itemsContainer.setAttribute("data-multiselect","true")),options.contextMenu&&(itemsContainer.enableContextMenu?itemsContainer.enableContextMenu(!0):itemsContainer.setAttribute("data-contextmenu","true")),parentContainer&&_imageloader.default.lazyChildren(itemsContainer),options.autoFocus&&_focusmanager.default.autoFocus(itemsContainer)}},virtualChunkSize:30,setListClasses:function(elem){(elem=elem.classList).remove("vertical-wrap"),elem.add("vertical-list")},renderHeader:function(itemsContainer,headerElement,options){headerElement.classList.add("dataGridHeader"),options.enableScrollX&&headerElement.classList.add("scrollX","hiddenScrollX");for(var html="",contentAttr="",columns=(html=html+("<div"+(contentAttr=options.enableScrollX?' style="width:'+options.scrollXWidth+'ch;"':contentAttr)+' class="dataGridHeader-content padded-left padded-right '+options.dataGridItemContentClass+'">')+'<div class="dataGridHeader-content-inner">',options.columnSelector&&(html+=getColumnHtml(null,null,{gridColumnType:"button",id:"ColumnSelector",size:5,renderSize:5,name:" ",center:!0,gridDisplayName:'<button title="'+_globalize.default.translate("HeaderSelectColumns")+'" aria-label="'+_globalize.default.translate("HeaderSelectColumns")+'" type="button" is="paper-icon-button-light" class="dataGridItemCell-button btnConfigureGridColumns itemAction md-icon secondaryText">&#xf1be;</button>'},options,!0)),options.columns),i=0,length=columns.length;i<length;i++)html+=getColumnHtml(null,null,columns[i],options,!0);headerElement.innerHTML=html=html+"</div>"+"</div>"},onMultiSelectActive:function(itemsContainer,header){header&&header.classList.add("multi-select-active")},onMultiSelectInactive:function(itemsContainer,header){header&&header.classList.remove("multi-select-active")}}});