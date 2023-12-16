define(["exports","./../browser.js","./../dom.js","./../layoutmanager.js","./../focusmanager.js","./../dialoghelper/dialoghelper.js","./../common/inputmanager.js","./../cardbuilder/cardbuilder.js","./../common/servicelocator.js","./../common/itemmanager/itemmanager.js","./../emby-apiclient/events.js","./../emby-apiclient/connectionmanager.js","./../input/mouse.js","./../emby-elements/emby-scroller/emby-scroller.js","./../emby-elements/emby-dialogclosebutton/emby-dialogclosebutton.js","./../emby-elements/emby-itemscontainer/emby-itemscontainer.js"],function(_exports,_browser,_dom,_layoutmanager,_focusmanager,_dialoghelper,_inputmanager,_cardbuilder,_servicelocator,_itemmanager,_events,_connectionmanager,_mouse,_embyScroller,_embyDialogclosebutton,_embyItemscontainer){Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=function(options){var dlg,currentTimeout,currentIntervalMs,currentIndex,self=this;this.options=options,_browser.default.chromecast&&(options.interactive=!1);var scrollTimeout,resizeTimeout,resizeIndex;0 in document.documentElement;function onScrollTimeout(){self.scrolling=!1;var x,windowSize,isProgramScroll=self.isProgramScroll;self.isProgramScroll=!1,!isProgramScroll&&(isProgramScroll="smooth",x=(windowSize=_dom.default.getWindowSize()).innerWidth/2,windowSize=windowSize.innerHeight/2,x=(x=document.elementFromPoint(x,windowSize))&&x.closest(".card"))&&scrollToIndex(self.itemsContainer.indexOfElement(x),isProgramScroll,!1),self.dlg.classList.remove("slideshow-scrolling")}function onScroll(){var isProgramScroll=self.isProgramScroll;self.scrolling=!0,isProgramScroll||(restartInterval(),self.dlg.classList.add("slideshow-scrolling")),scrollTimeout&&clearTimeout(scrollTimeout),scrollTimeout=setTimeout(onScrollTimeout,400)}function onResizeTimeout(){scrollToIndex(resizeIndex,"instant",!1)}function stopResizeTimer(){resizeTimeout&&clearTimeout(resizeTimeout)}function onResize(){self.scrolling&&!self.isProgramScroll||(console.log("slideshow resize"),resizeIndex=currentIndex,stopResizeTimer(),resizeTimeout&&clearTimeout(resizeTimeout),resizeTimeout=setTimeout(onResizeTimeout,100))}function onItemsContainerUpgraded(){var instance=this;CSSPromise.then(function(){instance.itemsContainer.resume({refresh:!0}).then(function(){instance.scroller.addResizeObserver(onResize),showNextImage(instance.options.startIndex||0,"instant",!0)})})}function createElements(options){var btnDownload,apiClient=options.serverId?_connectionmanager.default.getApiClient(options.serverId):_connectionmanager.default.currentApiClient(),html=(dlg=_dialoghelper.default.createDialog({size:"fullscreen",autoFocus:!1,scrollY:!1,removeOnClose:!0}),(self.dlg=dlg).classList.add("slideshowDialog"),""),html=(html=(html=html+('<div is="emby-scroller" data-dynamicframesizing="true" data-scrollbuttons="false" data-mousewheel="false" data-forcesmoothscroll="'+(options.interactive&&!isNativeSmoothScrollSupported).toString()+'" data-horizontal="true" class="padded-top-focusscale padded-bottom-focusscale slideshowScroller">')+'<div is="emby-itemscontainer" class="itemsContainer scrollSlider focuscontainer-x slideshowItemsContainer" data-virtualscrolllayout="horizontal-grid" data-scrollresizeobserver="true">')+"</div>"+"</div>",options.interactive&&(html+='<div class="topActionButtons"><button type="button" is="emby-dialogclosebutton" class="slideshowButton btnSlideshowExit"></button></div>',_layoutmanager.default.tv?html+='<div class="slideshowBottomBar hide">':html+='<div class="slideshowBottomBar slideshow-largefont hide">',_layoutmanager.default.tv?html+=getIcon("&#xE045;","btnSlideshowPrevious slideshowButton",!0):html+=getIcon("&#xE045;","btnSlideshowPrevious slideshowButton btnSlideshow-autohide",!0),html+=getIcon("pause","btnSlideshowPause slideshowButton",!0),_layoutmanager.default.tv?html+=getIcon("&#xE044;","btnSlideshowNext slideshowButton",!0):html+=getIcon("&#xE044;","btnSlideshowNext slideshowButton btnSlideshow-autohide",!0),(_servicelocator.appHost.supports("filedownload")||_servicelocator.appHost.supports("sync"))&&(html+=getIcon("&#xe5db;","btnDownload slideshowButton hide",!0)),_servicelocator.appHost.supports("sharing")&&(html+=getIcon("share","btnShare slideshowButton",!0)),html+="</div>"),dlg.innerHTML=html,dlg.querySelector(".itemsContainer"));html.fetchData=options.getItems||function(query){query=query||{};var items=this.options.items,totalRecordCount=items.length,limit=query.Limit;items=items.slice(query.StartIndex||0),limit&&items.length>limit&&(items.length=limit);return Promise.resolve({Items:items,TotalRecordCount:totalRecordCount})}.bind(self),html.getListOptions=function(items){var fields=this.options.cardFields||["Name"],windowSize=_dom.default.getWindowSize(),cardFooterClass="slideshowCardFooter";this.options.interactive&&(cardFooterClass+=" slideshowCardFooter-interactive");_layoutmanager.default.tv?cardFooterClass+=" slideshow-largefont-tv":cardFooterClass+=" slideshow-largefont";return{renderer:_cardbuilder.default,options:{shape:"backdrop",preferBackdrop:!0,overlayText:!0,fields:fields,multiSelect:!1,hoverMenu:!1,cardClass:"slideshowCard",cardBoxClass:"slideshowCardBox",cardContentClass:"slideshowCardContent",innerCardFooterClass:cardFooterClass,cardTextClass:"slideshowCardText",centerText:!0,staticElement:!0,action:"none",contextMenu:!1,draggable:!1,ignoreUIAspect:!0},virtualScrollLayout:"horizontal-grid",minOverhang:5*Math.max(windowSize.innerHeight,windowSize.innerWidth)}}.bind(self),html.afterRefresh=function(result){this.TotalRecordCount=result.TotalRecordCount}.bind(self),html.updateVirtualElement=function(elem,item,index){var classList;_embyItemscontainer.default.prototype.updateVirtualElement.apply(this,arguments),elem&&(classList=elem.classList)&&(index===currentIndex?classList.add("slideshowCard-current"):classList.remove("slideshowCard-current"))}.bind(html),self.itemsContainer=html,self.scroller=dlg.querySelector(".slideshowScroller"),options.interactive&&(dlg.querySelector(".btnSlideshowNext").addEventListener("click",nextImage),dlg.querySelector(".btnSlideshowPrevious").addEventListener("click",previousImage),(html=dlg.querySelector(".btnSlideshowPause"))&&html.addEventListener("click",self.playPause.bind(self)),(btnDownload=dlg.querySelector(".btnDownload"))&&btnDownload.addEventListener("click",download),(options=dlg.querySelector(".btnShare"))&&options.addEventListener("click",share),apiClient.getCurrentUser().then(function(user){user.Policy.EnableContentDownloading&&btnDownload&&btnDownload.classList.remove("hide")})),setUserScalable(!0),_mouse.default.requestMouseListening("slideshow"),dlg.addEventListener("opened",function(){this.dlg.classList.add("slideshow-crossfade");var itemsContainer=this.itemsContainer;itemsContainer.resume?onItemsContainerUpgraded.call(this):_dom.default.addEventListener(itemsContainer,"upgraded",onItemsContainerUpgraded.bind(this),{once:!0}),this.scroller.addScrollEventListener(onScroll.bind(this),{})}.bind(self)),_dialoghelper.default.open(dlg).then(function(){_mouse.default.releaseMouseListening("slideshow"),setUserScalable(!1),stopInterval()}),document.activeElement&&document.activeElement.blur(),_inputmanager.default.on(dlg,onInputCommand),document.addEventListener(window.PointerEvent?"pointermove":"mousemove",onPointerMove),dlg.addEventListener("close",onDialogClosed)}function previousImage(){stopInterval(),showNextImage(currentIndex-1,!1)}function nextImage(){stopInterval(),showNextImage(currentIndex+1,!1)}function getImages(item){return{url:getImgUrl(item,!0),shareUrl:getImgUrl(item,!1)}}function getCurrentItem(){var index=currentIndex;if(null!=index&&-1!==index)return self.itemsContainer.getItem(index)}function download(){showOsd();var item=getCurrentItem();return(_servicelocator.appHost.supports("sync")?function(item){Emby.importModule("./modules/sync/sync.js").then(function(syncDialog){syncDialog.showMenu({items:[item],serverId:item.ServerId,mode:"download"})})}:function(item){Emby.importModule("./modules/multidownload.js").then(function(multiDownload){multiDownload([getImages(item).url])})})(item)}function share(){showOsd();var item=getCurrentItem(),shareTitle=_itemmanager.default.getDisplayName(item),shareText=shareTitle;item.Overview&&(shareText+=" - "+item.Overview),navigator.share({title:shareTitle,text:shareText,url:getImages(item).shareUrl})}function onDialogClosed(){_inputmanager.default.off(this,onInputCommand),document.removeEventListener(window.PointerEvent?"pointermove":"mousemove",onPointerMove),_events.default.trigger(self,"closed")}self.play=function(){var btnSlideshowPause=dlg.querySelector(".btnSlideshowPause i");btnSlideshowPause&&(btnSlideshowPause.innerHTML="&#xE034;"),self.paused=!1},self.pause=function(){var btnSlideshowPause=dlg.querySelector(".btnSlideshowPause i");btnSlideshowPause&&(btnSlideshowPause.innerHTML="&#xE037;"),self.paused=!0},self.playPause=function(){showOsd(),self.paused?self.play():self.pause()};var hideTimeout,lastMouseMoveData,_osdOpen=!1;function getOsdBottom(){return dlg.querySelector(".slideshowBottomBar")}function showOsd(){var elem,onFinish,bottom=getOsdBottom();bottom&&((elem=bottom).classList.contains("hide")&&(_osdOpen=!0,elem.classList.remove("hide"),onFinish=function(){_focusmanager.default.focus(elem.querySelector(".btnSlideshowPause"))},elem.animate?requestAnimationFrame(function(){var keyframes=[{transform:"translate3d(0,"+elem.offsetHeight+"px,0)",opacity:".3",offset:0},{transform:"translate3d(0,0,0)",opacity:"1",offset:1}];elem.animate(keyframes,{duration:300,iterations:1,easing:"ease-out"}).onfinish=onFinish}):onFinish()),hideTimeout&&(clearTimeout(hideTimeout),hideTimeout=null),hideTimeout=setTimeout(hideOsd,5e3))}function hideOsd(){var elem,onFinish,bottom=getOsdBottom();bottom&&!(elem=bottom).classList.contains("hide")&&(onFinish=function(){elem.classList.add("hide"),_osdOpen=!1},elem.animate?requestAnimationFrame(function(){var keyframes=[{transform:"translate3d(0,0,0)",opacity:"1",offset:0},{transform:"translate3d(0,"+elem.offsetHeight+"px,0)",opacity:".3",offset:1}];elem.animate(keyframes,{duration:300,iterations:1,easing:"ease-out"}).onfinish=onFinish}):onFinish())}function onPointerMove(e){e.pointerType;var eventX=e.screenX||0,e=e.screenY||0,obj=lastMouseMoveData;obj?Math.abs(eventX-obj.x)<10&&Math.abs(e-obj.y)<10||(obj.x=eventX,obj.y=e,showOsd()):lastMouseMoveData={x:eventX,y:e}}var currentElement,currentElementTimeout,lastRepeatingKeyTime=0;function throttleDirectional(e){var timeStamp=e.timeStamp||Date.now();return timeStamp&&(timeStamp-lastRepeatingKeyTime<240?(e.preventDefault(),e.stopPropagation(),1):void(lastRepeatingKeyTime=timeStamp))}function onInputCommand(e){switch(e.detail.command){case"left":_osdOpen||throttleDirectional(e)||(e.preventDefault(),e.stopPropagation(),("rtl"===document.dir?nextImage:previousImage)());break;case"right":_osdOpen||throttleDirectional(e)||(e.preventDefault(),e.stopPropagation(),("rtl"===document.dir?previousImage:nextImage)());break;case"up":case"down":case"select":case"menu":case"info":showOsd();break;case"play":self.options.interactive&&(e.preventDefault(),self.play(),showOsd());break;case"playpause":self.options.interactive&&(e.preventDefault(),self.playPause(),showOsd());break;case"pause":self.options.interactive&&(e.preventDefault(),self.pause(),showOsd());break;case"next":self.options.interactive&&(e.preventDefault(),nextImage());break;case"previous":self.options.interactive&&(e.preventDefault(),previousImage());break;default:showOsd()}}function scrollToIndex(index,behavior,enableCrossfade){currentIndex=index;var scrollOptions={};behavior&&(scrollOptions.behavior=behavior),currentElement&&(currentElement.classList.remove("slideshowCard-current"),currentElement=null),self.isProgramScroll="smooth"!==behavior,enableCrossfade||(behavior=self.itemsContainer.getElement(index))&&behavior.classList.add("slideshowCard-current"),enableCrossfade?self.dlg.classList.add("slideshow-crossfade"):self.dlg.classList.remove("slideshow-crossfade"),self.isProgramScroll?self.dlg.classList.remove("slideshow-scrolling"):self.dlg.classList.add("slideshow-scrolling"),self.itemsContainer.scrollToIndex(index,scrollOptions,!1),currentElementTimeout&&clearTimeout(currentElementTimeout),currentElementTimeout=setTimeout(function(){var elem=self.itemsContainer.getElement(index);elem&&(elem.classList.add("slideshowCard-current"),currentElement=elem)},100)}function showNextImage(index,scrollBehavior,enableCrossfade){scrollTimeout&&clearTimeout(scrollTimeout),stopResizeTimer(),scrollToIndex(index=(index=Math.max(0,index))>=self.TotalRecordCount?0:index,scrollBehavior,enableCrossfade),restartInterval()}function onInterval(){self.paused?restartInterval():showNextImage(currentIndex+1,"instant",!0)}function restartInterval(){stopInterval(),currentTimeout=setTimeout(onInterval,currentIntervalMs)}function stopInterval(){currentTimeout&&(clearTimeout(currentTimeout),currentTimeout=null)}self.show=function(){stopInterval(),createElements(self.options),currentIntervalMs=self.options.interval||1e4,!self.options.interactive||_layoutmanager.default.tv||self.options.autoplay?self.play():self.pause()},self.hide=function(){var dialog=dlg;dialog&&_dialoghelper.default.close(dialog)}};var CSSPromise=require(["css!modules/slideshow/style.css"]).then(function(){CSSPromise=Promise.resolve()});function getIcon(icon,cssClass,canFocus){return'<button is="paper-icon-button-light" class="'+cssClass+'"'+(canFocus?"":' tabindex="-1"')+'><i class="md-icon">'+icon+"</i></button>"}function setUserScalable(scalable){try{_servicelocator.appHost.setUserScalable(scalable)}catch(err){console.log("error in appHost.setUserScalable: "+err)}}function getImgUrl(item,original){var apiClient=_connectionmanager.default.getApiClient(item),imageOptions={};return original||(imageOptions.maxWidth=screen.availWidth),item.BackdropImageTags&&item.BackdropImageTags.length?function(item,options,apiClient){return(options=options||{}).type=options.type||"Backdrop",options.maxWidth||options.width||options.maxHeight||options.height||(options.quality=100),item.BackdropImageTags&&item.BackdropImageTags.length?(options.tag=item.BackdropImageTags[0],apiClient.getImageUrl(item.Id,options)):null}(item,imageOptions,apiClient):"Photo"===item.MediaType&&original?apiClient.getItemDownloadUrl(item.Id):(imageOptions.type="Primary",function(item,options,apiClient){return(options=options||{}).type=options.type||"Primary","string"==typeof item?apiClient.getImageUrl(item,options):item.ImageTags&&item.ImageTags[options.type]?(options.tag=item.ImageTags[options.type],apiClient.getImageUrl(item.Id,options)):"Primary"===options.type&&item.AlbumId&&item.AlbumPrimaryImageTag?(options.tag=item.AlbumPrimaryImageTag,apiClient.getImageUrl(item.AlbumId,options)):null}(item,imageOptions,apiClient))}var isNativeSmoothScrollSupported="scrollBehavior"in document.documentElement.style});