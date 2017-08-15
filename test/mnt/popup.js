console.log('popup.js');

browser.runtime.onMessage.addListener(function(data){
    console.log('popup receive');
    return window.parent.Promise.resolve('iframe 789');
});