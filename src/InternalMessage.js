class InternalMessage extends Message{//todo: internal
    constructor(info){
        if(!InternalMessage.allowType.includes(info.eventType)){
            throw new Error(`event_type "${info.eventType}" is not support in InternalMessage."`)
        };
        super(...arguments);
        this.inside =true;
    };
};
InternalMessage.allowType =['hello','transfer'];
/**@param {ChazCommunication.InternalMessage} message*/
InternalMessage.is =function(message){
    return Message.is(message)
        && 'inside' in message
        && message.inside===true
        && InternalMessage.allowType.includes(message.event_type)
    ;
};