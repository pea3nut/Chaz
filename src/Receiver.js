class Receiver extends ChazEvent{
    constructor(self ,target){
        super();
        this.self   =Utility.parseScriptType(self);
        this.target =Utility.parseScriptType(target);
        this.listen();
    }
    static init(type){
        if(Receiver.called){
            throw new Error('you called init().');
        };

        type =Utility.parseScriptType(type);
        Receiver.called =true;

        switch(type[0]){
            case 'background':
                return this.backgroundInit(type);
            case 'content':
                return this.contentInit(type);
            case 'privileged':
                return this.privilegedInit(type);
            default:
                throw new Error(`could not init used ${type[0]}`);
        }
    };
};

Receiver.prototype.listen =function(){
    browser.runtime.onMessage.addListener((message ,sender ,sendResponse)=>{
        if(InsideMessage.is(message))return false;
        if(
            !Message.is(message)
            || !Utility.matchAddress(message.to ,this.self)
            || !Utility.matchAddress(message.from ,this.target)
        ){
            Utility.log(
                this.self,
                '->',
                this.target,
                'ignore message',
                message,
                {
                    match_from:Utility.matchAddress(message.from ,this.target),
                    match_to:Utility.matchAddress(message.to ,this.self),
                    is:Message.is(message),
                }
            );
            return false;
        }
        switch(`${message.from[0]} -> ${message.to[0]}`){
            case 'content -> content':
                if('sender' in message){
                    sender =message.sender;
                }
            case 'content -> privileged':
            case 'privileged -> content':
            case 'privileged -> privileged':
                if(//校验tab_id决定是否消费这个报文 tab
                    message['tab_id'] !== '*'
                    && message['tab_id'] !== Utility.QuickData.tabId
                ){
                    Utility.log(
                        this.self,'->',this.target,
                        `tab id is ${Utility.QuickData.tabId} but message`,
                        message
                    );
                    return false;
                };
        };
        if(this.has(message['event_type'])===0){
            Utility.log(this.self,'no listener',message);
            return false;
        };
        // Firefox bug
        // return this.execEventAll(
        //     message['event_type'],
        //     [message.data ,sender ,message]
        // );
        this.execEventAll(
            message['event_type'],
            [message.data ,sender ,message]
        ).then(sendResponse);
        return true;
    });
};

Receiver.called =false;

Receiver.backgroundInit =async function(type){
    browser.runtime.onMessage.addListener(function(message,sender){
        if(
                !InsideMessage.is(message)
                || !Utility.matchAddress(message.to ,Utility.parseScriptType('background'))
        )return;
        switch(message['event_type']){
            case 'hello':
                return async function (){
                    var tabId =null;
                    if(!('tab' in sender)){
                        tabId =await Utility.getActivatedTabId();
                    }else{
                        tabId =sender.tab.id;
                    };
                    return {tabId};
                }();
                break;
            case 'transfer':
                message.data.sender =sender;//用于劫持sender
                Utility.log('transfer message',message);
                return Sender.sendMessageUseTabs(message.data);
            default:
                Utility.log(Receiver.self,'ignore isInsideMessage',message);
                break;
        };
    });
};
Receiver.contentInit =async function(type){
    return Utility.QuickData =await Sender.sendMessage(new InsideMessage({
        eventType :'hello',
        to :'background',
        from :type,
    }));
};
/**@alias ChazCommunication.contentInit*/
Receiver.privilegedInit =function(){
    return this.contentInit(...arguments);
};
