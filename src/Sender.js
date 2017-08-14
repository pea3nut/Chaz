class Sender{
    constructor(self ,target){
        this.target =Utility.parseScriptType(target);
        this.self   =Utility.parseScriptType(self);
    };
    send(eventType ,data ,tabId){
        var message =new Message({
            from :this.self,
            to   :this.target,
            eventType,
            tabId,
            data,
        });
        return Sender.sendMessage(message);
    };
};


Sender.sendMessage =async function(message){
    switch(`${message.from[0]} -> ${message.to[0]}`){
        case 'content -> content':
            Utility.setDefaultTabId(message);
            return this.sendTransferMessage(message);
        case 'privileged -> content':
            Utility.setDefaultTabId(message);
        case 'background -> content':
        case 'background -> privileged':
            return this.sendMessageUseTabs(message);


        case 'privileged -> privileged':
        case 'content -> privileged':
            Utility.setDefaultTabId(message);
        case 'content -> background':
        case 'privileged -> background':
            return this.sendMessageUseRuntime(message);
    };
};

Sender.sendTransferMessage =function(message){
    var im =new InsideMessage({
        to :'background',
        from :message.from,
        data :message,
        eventType :'transfer'
    });
    return Sender.sendMessage(im);
};
Sender.sendMessageUseTabs =async function(message){
    if(!Number.isNaN(+message['tab_id'])){
        return browser.tabs.sendMessage(message['tab_id'],message)
    }else{//广播发送
        var tabs =await browser.tabs.query({});
        return Promise.race(
            tabs.map(tab=>browser.tabs.sendMessage(tab.id,message))
        );
    };
};
Sender.sendMessageUseRuntime =async function(message){
    return browser.runtime.sendMessage(message);
};
