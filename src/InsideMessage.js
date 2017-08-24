class InsideMessage extends Message{//todo: internal
    constructor(info){
        if(!InsideMessage.allowType.includes(info.eventType)){
            throw new Error(`event_type "${info.eventType}" is not support in InsideMessage."`)
        };
        super(...arguments);
        this.inside =true;
    };
};
InsideMessage.allowType =['hello','transfer'];
/**@param {ChazCommunication.InsideMessage} message*/
InsideMessage.is =function(message){
    return Message.is(message)
        && 'inside' in message
        && message.inside===true
        && InsideMessage.allowType.includes(message.event_type)
    ;
};