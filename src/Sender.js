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
        default:
            throw new Error('unknown message',message);
    };
};

Sender.sendTransferMessage =function(message){
    var im =new InternalMessage({
        to :'background',
        from :message.from,
        data :message,
        eventType :'transfer'
    });
    return Sender.sendMessage(im);
};
Sender.sendMessageUseTabs =async function(message){
    if(!Number.isNaN(+message['tab_id'])){
        return browser.tabs.sendMessage(+message['tab_id'],message);
    }else{//广播发送
        var tabs =await browser.tabs.query({});
        // 广播发送情况略复杂
        // 由于有可能有的tab没有listener，导致reject
        // 所以这里当所有tabs均reject则reject，但有任何一个tab resolve则resolve
        return new Promise(function(resolve ,reject){
            var rejectContent =0;
            var rejectMap ={};
            var rejectCallback =function(error,tabId){
                rejectContent++;
                if(error instanceof Error){
                    rejectMap[tabId] =error.toString();
                }
                if(rejectContent===tabs.length){
                    if(Object.keys(rejectMap)===0){
                        resolve();//没有任何一个标签响应
                    }else{
                        reject(`some tabs throw error:${JSON.stringify(rejectMap,null,4)}`);
                    };
                };
            };
            var resolveCallback =function(data){
                if(typeof data !==undefined){
                    resolve(data);
                }else{
                    rejectCallback();
                }
            };
            tabs.forEach(
                tab=>(
                    browser.tabs.sendMessage(tab.id,message)
                    .then(resolveCallback)
                    .catch(e=>rejectCallback(e,tab.id))
                )
            );
        });
    };
};
Sender.sendMessageUseRuntime =async function(message){
    return browser.runtime.sendMessage(message);
};
