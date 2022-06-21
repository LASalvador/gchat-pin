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
    pinButton.textContent = "Pin Thread"
    pinButton.addEventListener('click', function () {
        var threadName = prompt('Give a name to this saved thread!');
        let threadLink;
        let roomId;
        // TODO get the thread link and room id from parent of "e.target" received from click event
        if (inIframe()) {
            // The new mail.google.com/chat application uses iframes that point to chat.google.com
            // Rooms are now renamed to spaces. Getting the space id from an attribute in the element
            roomId = thread.getAttribute('data-p').match(/space\/([^\\"]*)/)[1];
            threadLink = `https://mail.google.com/chat/#chat/space/${roomId}/${threadId}`;
        } else {
            roomId = window.location.pathname.match(/\/room\/([^\?\/]*)/)[1];
            threadLink = `https://chat.google.com/room/${roomId}/${threadId}`;
        }
        var roomName = getRoomName(roomId)
        sendPinnedThread({threadName, threadLink, roomName});
        pinButton.setAttribute('data-tooltip', 'Pined');
        setTimeout(function () {
            pinButton.removeAttribute('data-tooltip');
        }, 1000);

        
    })

    return pinButton
}

function getRoomName(roomId) {
    var roomNameContainerSelector = 'div[data-soft-view-id="/room/'+ roomId +'"]'
    var roomNameContainer = document.querySelector(roomNameContainerSelector)
    var roomNameElement = roomNameContainer.querySelector('span[role="presentation"]')
    return roomNameElement.textContent;
}


function sendPinnedThread(pinnedThread) {
    var context = getBrowserContext();
    context.storage.local.get(["pinnedThreads"])
    .then((storage)=> {
        var pinnedThreads = storage.pinnedThreads;
        if (pinnedThreads && pinnedThreads.length > 0) {
            pinnedThreads.push(pinnedThread)    
        } else {
            pinnedThreads = [pinnedThread]
        }
        context.storage.local.set({pinnedThreads})
    }).catch(()=> {
        console.log("error saving", pinnedThread.threadName);        
    })
}

function getBrowserContext() {
    return (typeof browser == 'object') ? browser : chrome;
}

function getButtonContainer(thread) {
    var arialLabelList = ['Follow', 'Seguir'];
    var buttonContainer;
    for (const arialLabel of arialLabelList) {
        var buttonContainerSelector = `div[aria-label="${arialLabel}"] > span:first-of-type`;
        buttonContainer = thread.querySelector(buttonContainerSelector);
        if (buttonContainer) {
            return buttonContainer;
        }
    }
    return buttonContainer;
}

function setPinButtonOnEveryThread(thread) {
    const threadId = thread.getAttribute("data-topic-id")
    if (threadId && !thread.querySelector(".gchat-btn-pin")) {
        var buttonContainer = getButtonContainer(thread);
        if (
            buttonContainer &&
            buttonContainer.children.length === 2 &&
            buttonContainer.children[0].tagName === 'SPAN' &&
            buttonContainer.children[1].tagName === 'SPAN'
        ) {
            turnButtonContainerVisible(buttonContainer);
            const pinButton = createPinButtonElement(threadId, thread)
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