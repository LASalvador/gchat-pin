getPinnedThreadsAndRun(addPinnedThreads)

function addPinnedThreads(pinnedThreads) {
    var listParent = document.getElementById("threadList")
    // Cleaning parent
    listParent.children = []
    listParent.innerHTML = ""
    pinnedThreads.forEach(pinnedThread => {
        var li = document.createElement("li")
        // Creating link element
        var link = document.createElement("a")
        link.innerHTML = pinnedThread.roomName + " - " + pinnedThread.threadName
        link.setAttribute("href", pinnedThread.threadLink)
        link.setAttribute("target", "_blank")
        // Create "close" button
        var span = document.createElement("span")
        var txt = document.createTextNode("\u00D7")
        span.className = "close"
        span.appendChild(txt)
        span.addEventListener("click", removeThread)

        li.appendChild(link)
        li.appendChild(span)

        listParent.appendChild(li)
    });
}

function removeThread(e) {
  const parent = e.target.parentElement
  const threadElement = parent.children[0]
  const threadObject = {
      threadName: threadElement.innerText,
      threadLink: threadElement.href
  }
  
  getPinnedThreadsAndRun(pinnedThreads => {
      var newPinnedThreads = pinnedThreads.filter(item => {
          return item.threadName !== threadObject.threadName && item.threadLink !== threadObject.threadLink
      })
      addPinnedThreads(newPinnedThreads)
      var context = getBrowserContext()
      context.storage.local.set({pinnedThreads: newPinnedThreads})
  })
}



function getPinnedThreadsAndRun(callback) {
    var context = getBrowserContext()
    context.storage.local.get(["pinnedThreads"])
    .then(function (storage) {
        if(storage.pinnedThreads.length > 0) {
            callback(storage.pinnedThreads) 
        }
    })
    .catch(()=> {
        console.log("error getting pinned threads");
    })
}

function getBrowserContext() {
    return window.msBrowser ||
      window.browser ||
      window.chrome;
}