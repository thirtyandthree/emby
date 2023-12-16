define(["exports","./../../layoutmanager.js","./../../common/globalize.js","./../../common/usersettings/usersettings.js","./../../shortcuts.js","./../../emby-apiclient/connectionmanager.js","./../../indicators/indicators.js","./../../skinmanager.js"],function(_exports,_layoutmanager,_globalize,_usersettings,_shortcuts,_connectionmanager,_indicators,_skinmanager){Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0;var supportsCssVariables=CSS.supports("color","var(--fake-var)");function parseDates(program){if(!program.StartDateLocalMs)try{program.StartDateLocalMs=Date.parse(program.StartDate)}catch(err){}if(!program.EndDateLocalMs)try{program.EndDateLocalMs=Date.parse(program.EndDate)}catch(err){}return null}var insetInlineStartProp=CSS.supports("inset-inline-start","0")?"inset-inline-start":"left";function getShadedMediaInfoItem(text,itemClass){return'<div class="mediaInfoItem '+("mediaInfoItem-shaded "+(itemClass||"")).trim()+'"><span class="mediaInfoItem-shaded-text">'+text+"</span></div>"}function getProgramHtml(program,options,totalGridMs){var html="",startMs=options.startMs,endMs=options.endMs,startDateLocalMs=(parseDates(program),program.StartDateLocalMs),endDateLocalMs=program.EndDateLocalMs,renderStartMs=Math.max(startDateLocalMs,startMs),startDateLocalMs=(startDateLocalMs-startMs)/totalGridMs,startDateLocalMs=(startDateLocalMs*=100,Math.max(startDateLocalMs,0)),startMs=(Math.min(endDateLocalMs,endMs)-renderStartMs)/totalGridMs,endDateLocalMs="programCell itemAction",endMs=null,renderStartMs=!0,totalGridMs=options.displayMovieContent,displaySportsContent=options.displaySportsContent,displayNewsContent=options.displayNewsContent,displayKidsContent=options.displayKidsContent,displaySeriesContent=options.displaySeriesContent,enableColorCodedBackgrounds=options.enableColorCodedBackgrounds,totalGridMs=(program.IsKids?(renderStartMs=displayKidsContent,endMs="kids"):program.IsSports?(renderStartMs=displaySportsContent,endMs="sports"):program.IsNews?(renderStartMs=displayNewsContent,endMs="news"):program.IsMovie?(renderStartMs=totalGridMs,endMs="movie"):renderStartMs=(program.IsSeries||totalGridMs&&displayNewsContent&&displaySportsContent&&displayKidsContent)&&displaySeriesContent,_layoutmanager.default.tv&&(endDateLocalMs+=" programCell-tv"),"");program.TimerId&&(totalGridMs+=' data-timerid="'+program.TimerId+'"'),program.Status&&(totalGridMs+=' data-status="'+program.Status+'"'),program.SeriesTimerId&&(totalGridMs+=' data-seriestimerid="'+program.SeriesTimerId+'"');var text,displayNewsContent="programCellInner epgCellInner mediaInfoItems programMediaInfoItems";return enableColorCodedBackgrounds&&endMs&&(displayNewsContent+=" programCellInner-"+endMs),html=html+("<button"+(2<=(startMs*=100)?' is="emby-programcell"':"")+"  "+_shortcuts.default.getShortcutAttributesHtml(program,{})+' data-action="'+options.clickAction+'"'+totalGridMs+' class="'+endDateLocalMs+'" style="'+insetInlineStartProp+":"+startDateLocalMs+"%;width:"+startMs+'%;">')+('<div class="'+displayNewsContent+'">'),html=(html=renderStartMs&&(html+='<i class="guideProgramNameCaretIcon secondaryText hide md-icon">&#xE314;</i>',(displaySportsContent=program.EpisodeTitle&&options.showEpisodeTitle&&(!options.conditionalEhowTitle||program.IsSports))&&(html+='<div><div class="mediaInfoItems programMediaInfoItems">'),html=(html+='<div class="guideProgramNameText mediaInfoItem">'+program.Name)+"</div>"+function(item){var status;if("SeriesTimer"===item.Type)return'<i class="md-icon programIcon seriesTimerIcon mediaInfoItem">&#xE062;</i>';if(item.TimerId||item.SeriesTimerId)status=item.Status||"Cancelled";else{if("Timer"!==item.Type)return"";status=item.Status}return item.SeriesTimerId?"Cancelled"!==status?'<i class="md-icon programIcon seriesTimerIcon mediaInfoItem">&#xE062;</i>':'<i class="md-icon programIcon seriesTimerIcon seriesTimerIcon-inactive mediaInfoItem">&#xE062;</i>':'<i class="md-icon programIcon timerIcon mediaInfoItem">&#xE061;</i>'}(program),program.IsLive&&options.showLiveIndicator?html+=getShadedMediaInfoItem(_globalize.default.translate("Live"),"mediaInfoProgramAttribute guideProgramIndicator liveTvProgram"):program.IsPremiere&&options.showPremiereIndicator?html+=getShadedMediaInfoItem(_globalize.default.translate("Premiere"),"mediaInfoProgramAttribute guideProgramIndicator premiereTvProgram"):options.showNewIndicator&&program.IsNew?html+=getShadedMediaInfoItem(_globalize.default.translate("AttributeNew"),"mediaInfoProgramAttribute guideProgramIndicator newTvProgram"):program.IsRepeat&&options.showRepeatIndicator&&(html+=getShadedMediaInfoItem(_globalize.default.translate("Repeat"),"mediaInfoProgramAttribute guideProgramIndicator repeatTvProgram")),(options.showHdIcon||options.show4kIcon)&&program.Width&&1200<=program.Width&&(program.Width&&3800<=program.Width?options.show4kIcon&&(text="4K"):options.showHdIcon&&(text="HD"),html+=getShadedMediaInfoItem(text,"mediaInfoProgramAttribute guideProgramIndicator")),displaySportsContent)?(html+="</div>")+'<div class="guideProgramSecondaryInfo secondaryText">'+program.EpisodeTitle+"</div></div>":html)+"</div>"+"</button>"}function getEpgRowHtml(instance,item,index,options){for(var guideChannelImageClass,apiClient=_connectionmanager.default.getApiClient(item),html="",channel=item.Channel,apiClient=options.showChannelImage?apiClient.getLogoImageUrl(channel,{maxHeight:220},_skinmanager.default.getPreferredLogoImageTypes()):null,title=[],cssClass=(channel.Name&&title.push(channel.Name),channel.ChannelNumber&&title.push(channel.ChannelNumber),options.channelCellClass),title=title.join(" "),title=(html+='<button type="button" '+_shortcuts.default.getShortcutAttributesHtml(channel,{})+' data-action="'+options.channelAction+'" title="'+title+'" aria-label="'+title+'" class="'+cssClass+' itemAction">',options.channelCellInnerClass),cssClass=(html+='<div class="'+title+'">',supportsCssVariables?" secondaryText":""),title=options.showChannelName||options.showChannelNumber,programs=(apiClient&&(guideChannelImageClass=options.guideChannelImageClass,title&&(guideChannelImageClass+=" guideChannelImage-withtext"),html+='<div class="'+guideChannelImageClass+'" style="background-image:url('+apiClient+');"></div>'),!title&&apiClient||(html+='<div class="'+("guideChannelText "+cssClass)+'">',options.showChannelNumber&&channel.ChannelNumber&&(html=(html+='<div class="guideChannelNumber">')+channel.ChannelNumber+"</div>"),!options.showChannelName&&apiClient||!channel.Name||(html=(html+='<div class="guideChannelName">')+channel.Name+"</div>"),html+="</div>"),item.Programs),totalGridMs=(html=(html+="</div>")+"</button>"+'<div class="channelPrograms flex-grow flex">',options.endMs-options.startMs),i=0,length=programs.length;i<length;i++)html+=getProgramHtml(programs[i],options,totalGridMs);return html+="</div>",options.parts?{attributes:_shortcuts.default.getShortcutAttributes(item,options),html:html}:(guideChannelImageClass=_shortcuts.default.getShortcutAttributesHtml(item,options),title=options.tagName,(cssClass=options.fixedAttributes)&&(guideChannelImageClass+=" "+cssClass),"<"+title+guideChannelImageClass+' class="'+options.className+'">'+html+"</"+title+">")}function GridRowRenderer(options){this.options=options}GridRowRenderer.prototype.getItemParts=function(item,index,options){return options.parts=!0,getEpgRowHtml(0,item,0,options)},GridRowRenderer.prototype.getItemsHtml=function(items,options){this.setListOptions(items,options);for(var html="",i=0,length=items.length;i<length;i++)html+=getEpgRowHtml(0,items[i],0,options);return html},GridRowRenderer.prototype.setListOptions=function(items,options){null==options.isBoundListItem&&(options.isBoundListItem=!0),options.itemSelector=".epgRow";var guideChannelStyle=_usersettings.default.guideChannelStyle(),guideChannelStyle=(options.showChannelImage="name"!==guideChannelStyle,options.showChannelName="image"!==guideChannelStyle,options.showChannelNumber=_usersettings.default.showChannelNumberInGuide(),options.tagName="div",options.className="epgRow flex flex-shrink-zero flex-direction-row focuscontainer-x focusable",_layoutmanager.default.tv&&(options.className+=" epgRow-tv"),"channelCellInner epgCellInner"),guideChannelImageClass="guideChannelImage",guideChannelStyle=(options.channelCellClass="channelCell",_layoutmanager.default.tv&&(options.channelCellClass+=" channelCell-tv"),options.showChannelName&&options.showChannelImage&&(options.className+=" epgRow-twoline"),options.showChannelImage&(options.showChannelName||options.showChannelNumber)&&(options.className+=" epgRow-portraittwoline"),(!options.showChannelName||!options.showChannelImage)&&(options.showChannelName&&options.showChannelImage||options.showChannelNumber)||(guideChannelStyle+=" channelCellInner-twoline",guideChannelImageClass+=" guideChannelImage-twoline"),options.showChannelImage&&(!options.showChannelNumber||options.showChannelImage&&options.showChannelName)||(options.showChannelName?options.channelCellClass+=" channelCell-wide2":options.channelCellClass+=" channelCell-wide"),options.showChannelName||options.showChannelNumber||(guideChannelStyle+=" channelCellInner-notext"),options.channelCellInnerClass=guideChannelStyle,options.guideChannelImageClass=guideChannelImageClass,'<div class="'+options.channelCellClass+'"></div><div class="channelPrograms flex-grow flex"></div>'),guideChannelImageClass=(options.templateInnerHTML=guideChannelStyle,options.clickAction="linkdialog",options.startMs=options.startDateMs,options.endMs=options.endDateMs,options.categories||[]),guideChannelStyle=(options.displayMovieContent=!guideChannelImageClass.length||-1!==guideChannelImageClass.indexOf("movies"),options.displaySportsContent=!guideChannelImageClass.length||-1!==guideChannelImageClass.indexOf("sports"),options.displayNewsContent=!guideChannelImageClass.length||-1!==guideChannelImageClass.indexOf("news"),options.displayKidsContent=!guideChannelImageClass.length||-1!==guideChannelImageClass.indexOf("kids"),options.displaySeriesContent=!guideChannelImageClass.length||-1!==guideChannelImageClass.indexOf("series"),options.enableColorCodedBackgrounds="true"===_usersettings.default.get("guide-colorcodedbackgrounds"),options.conditionalEhowTitle=!0,options.showHdIcon="true"===_usersettings.default.get("guide-indicator-hd"),options.show4kIcon="false"!==_usersettings.default.get("guide-indicator-4k"),options.showLiveIndicator="false"!==_usersettings.default.get("guide-indicator-live"),options.showPremiereIndicator="false"!==_usersettings.default.get("guide-indicator-premiere"),options.showNewIndicator="false"!==_usersettings.default.get("guide-indicator-new"),options.showRepeatIndicator="true"===_usersettings.default.get("guide-indicator-repeat"),'data-focusabletype="nearest"');return options.addTabIndex&&(guideChannelStyle+=' tabindex="0"'),options.fixedAttributes=guideChannelStyle.trim(),options},GridRowRenderer.prototype.setListClasses=function(elem){},GridRowRenderer.parseDates=parseDates,GridRowRenderer.getProgramHtml=getProgramHtml,GridRowRenderer.virtualChunkSize=30;_exports.default=GridRowRenderer});