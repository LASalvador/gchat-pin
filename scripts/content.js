var EXTESION_ID = "nmoijimccdmgdfcolbbihkmamplnlolk"

function addButtonOnThreads() {
    var threadsCard = document.querySelectorAll("c-wiz[data-topic-id][data-local-topic-id]")
    threadsCard.forEach(thread => {
        setPinIconOnEveryIconMessageContainer(thread)
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
        if (inIframe()) {
            // The new mail.google.com/chat application uses iframes that point to chat.google.com
            // Rooms are now renamed to spaces. Getting the space id from an attribute in the element
            const roomId = thread.getAttribute('data-p').match(/space\/([^\\"]*)/)[1];
            threadLink = `https://mail.google.com/chat/#chat/space/${roomId}/${threadId}`;
        } else {
            const roomId = window.location.pathname.match(/\/room\/([^\?\/]*)/)[1];
            threadLink = `https://chat.google.com/room/${roomId}/${threadId}`;
        }
        sendPinnedThread({threadName, threadLink})
        pinButton.setAttribute('data-tooltip', 'Pined');
        setTimeout(function () {
            pinButton.removeAttribute('data-tooltip');
        }, 1000);

        
    })

    return pinButton
}


function sendPinnedThread(pinnedThread) {
    console.log("sending message");
    var port = chrome.runtime.connect(EXTESION_ID, {name: "pin_thread"})
    port.postMessage(pinnedThread)
    port.onDisconnect.addListener(() => {
        console.log('disconnected port');
    })
}


function setPinButtonOnEveryThread(thread) {
    const threadId = thread.getAttribute("data-topic-id")
    if (threadId && !thread.querySelector(".gchat-btn-pin")) {
        const pinButton = createPinButtonElement(threadId, thread)
        turnButtonContainerVisible(thread)
        var buttonContainer = thread.querySelector('div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1)');
        if (
            buttonContainer &&
            buttonContainer.children.length === 2 &&
            buttonContainer.children[0].tagName === 'SPAN' &&
            buttonContainer.children[1].tagName === 'SPAN'
        ) {
            buttonContainer.style = 'display: inline-block;';
            buttonContainer.parentElement.style = 'display: inline-block; width: unset; opacity: 1;';
            buttonContainer.parentElement.parentElement.appendChild(pinButton);
            buttonContainer.parentElement.parentElement.parentElement.parentElement.style = 'padding-top: 56px;';
        }
    }
}

function turnButtonContainerVisible(parent) {
    // If the button container is currently hidden, we want to unhide it, and remove the Following button (as that's not required when the room is set to "Always Notify")
  // eLNT1d appears to be the class used to hide elements
  var buttonContainer = parent.querySelector(
    "div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1)"
  );

  if (buttonContainer) {
    buttonContainer.style = "";
    var buttonContainer1 = parent.querySelector(
      "div:nth-of-type(2) > div:nth-of-type(1)"
    );
    if (buttonContainer1 && buttonContainer1.classList.contains("eLNT1d")) {
      buttonContainer1.classList.remove("eLNT1d");

      buttonContainer.style = "display:none";
    }
  }
}

function setPinIconOnEveryIconMessageContainer(parent) {
    var messages = parent.querySelectorAll('div[jscontroller="VXdfxd"]')
    messages.forEach(messageElement => {
        iconsContainer = messageElement.parentElement.parentElement
        if (
            iconsContainer.querySelectorAll('[data-tooltip*="Pin Message"').length > 0 || // Pin Button already exists
            iconsContainer.children.length === 1 // Add reaction button next to existing emoji reactions to a message
        ) {
            return
        }
        var pinElement = createPinIconElement(messageElement)
        iconsContainer.appendChild(pinElement)
    })
}

function createPinIconElement(parent) {
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