class Message{
    constructor({from=Message.defaultFrom,to,eventType,data,tabId}={}){
        this.chaz =true;

        this.from =Utility.parseScriptType(from);
        this.to   =Utility.parseScriptType(to);
        this.event_type =eventType;
        this.tab_id = (typeof tabId==='number') ?String(tabId) :tabId;
        this.data =data;

        this.sender =undefined;//用于路由过程保存原始sender

        if(
            ! this.event_type
            || this.from.length===0
            || this.to.length===0
        )throw new Error('abnormal message init:'+JSON.stringify(arguments[0]));

        // 删除值为undefined的属性
        // 并没有什么依赖，只是想增强可读性
        for(let key of Object.keys(this)){
            if(this[key]===undefined)delete this[key];
        }
    };
};
Message.defaultFrom =null;
Message.is =function(message){
    return message
        && typeof message ==='object'
        && 'chaz' in message
        && message.chaz===true
        && 'from' in message
        && Array.isArray(message.from)
        && 'to'   in message
        && Array.isArray(message.to)
        && 'event_type'   in message
        && typeof message['event_type'] ==='string'
    ;
};