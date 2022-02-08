function processMessage(request, port) {
    chrome.storage.sync.get(["pinnedThreads"], function (storage) {
        var pinnedThreads = storage.pinnedThreads;
        if (pinnedThreads.length > 0) {
            pinnedThreads.push(request)    
        } else {
            pinnedThreads = [request]
        }
        chrome.storage.sync.set({pinnedThreads})
    })
}

chrome.runtime.onConnect.addListener(port=> {
    if(port.name === "pin_thread"){
        port.onMessage.addListener(processMessage)
    }
})

