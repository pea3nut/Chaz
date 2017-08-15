console.log('background.js');

setInterval(async function(){
    var tabs =await browser.tabs.query({});

    for(let tab of tabs){
        console.log('send',tab.id);
        browser.tabs.sendMessage(tab.id,'to_content').then(function(){
            console.log('receive content response',...arguments);
        });
        browser.tabs.sendMessage(tab.id,'to_iframe').then(function(){
            console.log('receive iframe response',...arguments);
        });
    }
},2000);