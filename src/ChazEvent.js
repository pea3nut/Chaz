class ChazEvent{
    constructor(){
        this._events ={};
    };
    /**
     * @param {string} eventType
     * @param {function} listener
     * @param {boolean} once
     * */
    on(eventType,listener,{once}={}){
        var event =new ChazEvent.Event(listener);
        this.addEvent(eventType,event);

        if(once ===true){
            let that =this;
            event.execFn =function(){
                that.off(eventType ,listener);
                listener(arguments);
            };
        };
    };
    /**
     * @param {string} eventType
     * @param {function} listener
     * @param {Object} [options]
     * */
    one(eventType,listener,options={}){
        var args =Array.from(arguments);
        args[2]=arguments[2]||{};
        args[2].once =true;
        return this.on(...args);
    };
    /**
     * @param {string} eventType
     * @param {function} listener
     * */
    off(eventType,listener){
        var event =new ChazEvent.Event(listener);
        return this.removeEvent(eventType,event);
    };
    /**
     * 等待一个事件发生
     * 可以添加一个验证器，来验证这个事件是否是自己等待的，
     * 若checker返回false继续等待，若返回true则resolved
     * @param {string} eventType
     * @param {function} [checker] - 验证器
     * */
    wait(eventType ,checker=()=>true){
        return new Promise(resolve=>{
            var symbol =Symbol(`${eventType}.waiter`);
            var event =new ChazEvent.Event(symbol,(...args)=>{
                if(checker(...args)){
                    this.off(eventType,symbol);
                    resolve();
                };
            });
            this.addEvent(eventType,event);
        });
    };
    /**
     * 返回当前事件的监听器数量
     * @return {Number}
     * */
    has(eventType){
        if(eventType in this._events){
            return this._events[eventType];
        }else{
            return 0;
        }
    }
};

// 以下是内部方法

/**
 * @param {string} type
 * @param {ChazEvent.Event} event
 * */
ChazEvent.prototype.addEvent =function(type,event){
    if(!(type in this._events)){
        this._events[type] =[];
    };
    // 检测重复添加
    if(
        this._events[type].findIndex(
            e=>e.originFn===event.originFn
        ) ===-1
    ){
        this._events[type].push(event);
    };
};
/**
 * @param {string} type
 * @param {ChazEvent.Event} event
 * */
ChazEvent.prototype.removeEvent =function(type,event){
    if(!(type in this._events)){
        return false;
    };
    var index =this._events[type].findIndex(e=>e.originFn===event.originFn);
    if(index !==-1){
        this._events[type].splice(index,1);
        return true;
    };
    return false;
};
ChazEvent.prototype.execEventAll =function(type,argn){
    if(!(type in this._events)){
        return false;
    };
    var promises =this._events[type]
        .map(ce=>{
            var val =this.execEvent(ce.execFn,argn);
            if([undefined,null].includes(val)){
                return null;
            }else{
                return val;
            };
        })
        .filter(v=>v!==null)
    ;
    if(promises.length===0)return Promise.resolve();
    else                   return Promise.race(promises);
};
ChazEvent.prototype.execEvent =function(fn,args=[]){
    return fn(...args);
};




ChazEvent.Event =class{
    constructor(originFn,execFn=originFn){
        this.originFn =originFn;
        this.execFn   =execFn;
    };
};

