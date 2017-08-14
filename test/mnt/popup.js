console.log('popup.js');

browser.runtime.onMessage.addListener(function(){
    console.log('popup.js',...arguments);
});
window.addEventListener('message',function(){
    console.log('popup.js',...arguments);
});

setInterval(function(){
    window.parent.postMessage('123','*');
},1000);