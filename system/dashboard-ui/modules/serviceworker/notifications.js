function executeAction(action,data,serverId){return"restartserver"===action&&globalThis.ConnectionManager.getApiClient(serverId).restartServer(),Promise.resolve()}globalThis.addEventListener("notificationclick",function(event){var notification=event.notification,notification=(notification.close(),notification.data),action=event.action;action?event.waitUntil(executeAction(action,notification,notification)):(clients.openWindow("/"),event.waitUntil(Promise.resolve()))},!1),globalThis.addEventListener("push",function(e){});