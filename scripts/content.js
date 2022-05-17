function addButtonOnThreads() {
    var threadsCard = document.querySelectorAll("c-wiz[data-topic-id][data-local-topic-id]")
    threadsCard.forEach(thread => {
        setPinButtonOnEveryThread(thread)
    })
}

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function createPinButtonElement(threadId, thread) {
    var pinButton = document.createElement("div")
    pinButton.className = "gchat-btn-pin"
    pinButton.innerHTML = "Pin Thread"
    pinButton.addEventListener('click', function () {
        var threadName = prompt('Thread name')
        let threadLink
        // TODO get the thread link and room id from parent of "e.target" received from click event
        if (inIframe()) {
            // The new mail.google.com/chat application uses iframes that point to chat.google.com
            // Rooms are now renamed to spaces. Getting the space id from an attribute in the element
            const roomId = thread.getAttribute('data-p').match(/space\/([^\\"]*)/)[1];
            threadLink = `https://mail.google.com/chat/#chat/space/${roomId}/${threadId}`;
        } else {
            const roomId = window.location.pathname.match(/\/room\/([^\?\/]*)/)[1];
            threadLink = `https://chat.google.com/room/${roomId}/${threadId}`;
        }
        var roomName = document.querySelector('c-wiz[role="main"]').ariaLabel;
        sendPinnedThread({threadName, threadLink, roomName})
        pinButton.setAttribute('data-tooltip', 'Pined');
        setTimeout(function () {
            pinButton.removeAttribute('data-tooltip');
        }, 1000);

        
    })

    return pinButton
}


function sendPinnedThread(pinnedThread) {
    var context = getBrowserContext()
    context.storage.local.get(["pinnedThreads"])
    .then((storage)=> {
        var pinnedThreads = storage.pinnedThreads;
        if (pinnedThreads && pinnedThreads.length > 0) {
            pinnedThreads.push(pinnedThread)    
        } else {
            pinnedThreads = [pinnedThread]
        }
        chrome.storage.local.set({pinnedThreads})
    }).catch(()=> {
        console.log("error saving", pinnedThread.threadName);        
    })
}

function getBrowserContext() {
    return window.msBrowser ||
      window.browser ||
      window.chrome;
}

function setPinButtonOnEveryThread(thread) {
    const threadId = thread.getAttribute("data-topic-id")
    if (threadId && !thread.querySelector(".gchat-btn-pin")) {
        const pinButton = createPinButtonElement(threadId, thread)
        var buttonContainer = thread.querySelector('div[aria-label="Follow"] > span:first-of-type');
        if (
            buttonContainer &&
            buttonContainer.children.length === 2 &&
            buttonContainer.children[0].tagName === 'SPAN' &&
            buttonContainer.children[1].tagName === 'SPAN'
        ) {
            turnButtonContainerVisible(buttonContainer);
            buttonContainer.style = 'display: inline-block;';
            buttonContainer.parentElement.style = 'display: inline-block; width: unset; opacity: 1;';
            buttonContainer.parentElement.parentElement.appendChild(pinButton);
            buttonContainer.parentElement.parentElement.parentElement.parentElement.style = 'padding-top: 56px;';
        }
    }
}

function turnButtonContainerVisible(parent) {
    parent.parentElement.parentElement.parentElement.style += '; display: block;';
}

function debounce(fn, delay) {
    var timeout = null;
    return function () {
        if (timeout) {
            return;
        } else {
            timeout = setTimeout(function () {
                fn();
                timeout = null;
            }, delay);
        }
    }
}

var parent = document.documentElement
var el = document.documentElement;
el.addEventListener('DOMSubtreeModified', debounce(addButtonOnThreads, 2000));