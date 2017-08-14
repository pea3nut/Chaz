class Chaz{
    constructor(target){
        if(Chaz.selfType===null){
            throw new Error('you must called Chaz.init() before new Chaz');
        };
        this.sender =new Sender(Chaz.selfType ,target);
        this.reseiver =new Receiver(Chaz.selfType ,target);
    };
    send(){
        return this.sender.send(...arguments);
    };
    on(){
        return this.reseiver.on(...arguments);
    };
    wait(){
        return this.reseiver.wait(...arguments);
    };
    one(){
        return this.reseiver.one(...arguments);
    };
    static init(self){
        Chaz.selfType =Utility.parseScriptType(self);
        Message.defaultFrom =self;
        return Receiver.init(self);
    };
    static get Utility(){
        return Utility;
    };
    static get QuickData(){
        return Utility.QuickData;
    };
};
Chaz.selfType =null;