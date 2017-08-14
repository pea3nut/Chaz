const Sinon =require('sinon');
const Assert = require('chai').assert;
const {Sender,Utility} =require('../dist/Chaz.node.js');
require =function(origin){
    return function(path){
        var absolute =origin.resolve(path);
        delete origin.cache[absolute];
        return origin(path);
    };
}(require);
const {Receiver,Message,InsideMessage} =require('../dist/Chaz.node.js');
const W =(global||window);

function initBrowser(){
    W.browser={
        runtime:{
            onMessage:{
                addListener(){},
            },
            sendMessage(){},
        },
    };
};

describe('Receiver . *',function(){
    it('Receiver.init() -> xxxInit()' ,function(){
        const {Receiver} =require('../dist/Chaz.node.js');
        Receiver.backgroundInit =Sinon.spy();
        Receiver.contentInit    =Sinon.spy();
        Receiver.init('background');
        Assert(Receiver.backgroundInit.calledOnce);
        Assert.throws(function(){
            Receiver.init('privileged');
        });
        Receiver.called =false;
        Assert.throws(function(){
            Receiver.init('privileg');
        });
        Receiver.init('privileged');
        Assert(Receiver.contentInit.calledOnce);
    });
    it('Receiver.init(background)' ,async function(){
        const {Receiver} =require('../dist/Chaz.node.js');
        var listener =null;
        initBrowser();

        W.browser.runtime.onMessage.addListener =fn=>listener=fn;
        Receiver.init('background');
        Assert.instanceOf(listener,Function);

        var promise =listener(new InsideMessage({
            eventType :'hello',
            to        :'background',
            from      :'content',
        }),{tab:{id:'3344'}});
        Assert.instanceOf(promise ,Promise);
        var qd =await promise;
        Assert.deepEqual(qd,{tabId:'3344'});

        var value =listener(new Message({
            eventType :'hello',
            to        :'background',
            from      :'content',
        }),{tab:{id:'3344'}});
        Assert.typeOf(value,'undefined');

    });
    it('Receiver.init(privileged)' ,async function(){
        const {Receiver} =require('../dist/Chaz.node.js');
        var listener =null;
        var origin =Sender.sendMessage;

        initBrowser();
        W.browser.runtime.sendMessage =Sinon.spy(async function(){
            return {tabId:'369'}
        });
        var qd =await Receiver.init('privileged');
        Assert(W.browser.runtime.sendMessage.called);
        Assert(W.browser.runtime.sendMessage.withArgs(new InsideMessage({
            to:'background',
            from:'privileged',
            eventType:'hello'
        })).called);
        Assert.deepEqual(qd ,{tabId:'369'});
    });
});
describe('Receiver # *',function(){
    var runListeners =function(listeners ,args){
        var promises =listeners.
            map(listener=>{
                var value =listener(...args);
                if([null,undefined].includes(value)){
                    return null;
                }else{
                    return value;
                };
            })
            .filter(v=>v!==null)
        ;
        if(promises.length===0)return Promise.resolve();
        else                   return Promise.race(promises);
    };
    it('self:background#on <- target:content' ,async function(){
        const {Receiver} =require('../dist/Chaz.node.js');
        var listeners =[];
        W.browser.runtime.onMessage.addListener =listener=>listeners.push(listener);

        Receiver.init('background');
        var Content =new Receiver('background','content');

        var listener =Sinon.spy(function(data ,sender){
            Assert.deepEqual(data ,{a:1});
            return {b:2};
        });
        Content.on('test',listener);

        var data =await runListeners(
            listeners,
            [new Message({
                from :'content',
                to :'background',
                data :{a:1},
                eventType :'test',
            })]
        );

        Assert.deepEqual(data ,{b:2});

        await runListeners(
            listeners,
            [new Message({
                from :'content',
                to :'privileged',
                data :{a:1},
                eventType :'test',
            })]
        );
        await runListeners(
            listeners,
            [new Message({
                from :'content',
                to :'background',
                data :{a:1},
                eventType :'hello',
            })]
        );

        Assert(listener.calledOnce);

    });
    it('self:content#wait <- target:popup.privileged' ,async function(){
        const {Receiver} =require('../dist/Chaz.node.js');
        var listeners =[];
        W.browser.runtime.onMessage.addListener =listener=>listeners.push(listener);

        Receiver.init('content');
        var Popup =new Receiver('content','popup.privileged');

        setTimeout(function(){
            runListeners(
                listeners,
                [new Message({
                    from :'popup.privileged',
                    to :'content',
                    eventType :'test',
                    tabId :'*',
                })]
            );
        });


        await Popup.wait('test');


    });
});


