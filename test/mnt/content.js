console.log('content.js');


var iframe =document.createElement('iframe');
iframe.src =browser.extension.getURL('popup.html');
document.body.appendChild(iframe);

browser.runtime.onMessage.addListener(function(data){
    if(data==='to_content'){
        return Promise.resolve('content 123');
    }
});
