console.log('content.js');


var iframe =document.createElement('iframe');
iframe.src =browser.extension.getURL('popup.html');

document.body.appendChild(iframe);

browser.runtime.onMessage.addListener(function(){
    console.log('content.js',...arguments);
});

window.addEventListener('message',function(){
    console.log('content.js',...arguments);
});

setInterval(function(){
    iframe.contentWindow.postMessage('abc','*');
},1000);