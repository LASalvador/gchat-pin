function addButtonOnThreads() {
    var threadsCard = document.querySelectorAll("c-wiz[data-topic-id][data-local-topic-id]")
    threadsCard.forEach(thread => {
        setPinButtonOnEveryThread(thread)
        setPinIconOnEveryIconMessageContainer(thread)
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
        if (inIframe()) {
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
    var roomNameContainerSelector = getRoomSelector(roomId);
    var roomNameContainer = document.querySelector(roomNameContainerSelector)
    var roomNameElement = roomNameContainer.querySelector('span[role="presentation"]')
    return roomNameElement.textContent;
}

function getRoomSelector(roomId) {
    if (roomId.match('dm/')) {
        return 'div[data-soft-view-id="/'+ roomId +'"]'
    }
    return 'div[data-soft-view-id="/room/'+ roomId +'"]'
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


function setPinIconOnEveryIconMessageContainer(thread) {
    var messages = thread.querySelectorAll('div[jscontroller="VXdfxd"]');
    var roomData = thread.getAttribute('data-p').match(/dm\/([^\\"]*)/);
    var messageId = thread.getAttribute('data-topic-id');
    messages.forEach(messageElement => {
        iconsContainer = messageElement.parentElement.parentElement
        if (
            iconsContainer.querySelectorAll('[data-tooltip*="Pin Message"').length > 0 || // Pin Button already exists
            iconsContainer.children.length === 1  ||
            roomData === null// Add reaction button next to existing emoji reactions to a message
        ) {
            return
        }
        var roomId = roomData[0];
        var pinElement = createPinIconElement(messageElement, roomId, messageId);
        iconsContainer.appendChild(pinElement)
    })
}

function createPinIconElement(parent, roomId, messageId) {
    const container = document.createElement("div")
    container.innerHTML = `
    <svg style="width:24px;height:24px;margin-top: 4px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12M8.8,14L10,12.8V4H14V12.8L15.2,14H8.8Z" />
    </svg>`
    container.className = parent.className
    container.setAttribute('data-tooltip', 'Pin Message')
    const pinSvg = container.children[0]
    // copy classes from another svg icon
    const svgOnParent = parent.querySelector('svg')
    svgOnParent.classList.forEach(c => pinSvg.classList.add(c))

    container.onclick = function(){
        var threadName = prompt('Give a name to this saved message!');
        var threadLink = `https://mail.google.com/chat/#chat/${roomId}/${messageId}`
        var roomName = getRoomName(roomId)
        sendPinnedThread({threadName, threadLink, roomName});
    }

    return container
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