const Sinon =require('sinon');
const Assert = require('chai').assert;
require =function(origin){
    return function(path){
        var absolute =origin.resolve(path);
        delete origin.cache[absolute];
        return origin(path);
    };
}(require);
const {Sender,Utility,Message} =require('../dist/Chaz.node.js');
const W =(global||window);

function initBrowser(){
    W.browser={
        runtime:{
            sendMessage(){},
        },
        tabs:{
            sendMessage(){},
            query(){},
        },
    };
};

describe('Sender test:',function(){
    it('privileged -> content auto tab_id' ,function(){
        Utility.QuickData ={tabId:'233'};
        initBrowser();
        var spy =Sinon.spy(W.browser.tabs,'sendMessage');
        const Content =new Sender('privileged','content');
        Content.send('test',{a:1});
        Assert(spy.withArgs(
            +Utility.QuickData.tabId,
            new Message({
                eventType:'test',
                from :'privileged',
                to   :'content',
                data :{a:1},
                tabId:Utility.QuickData.tabId,
            })
        ).called);
        spy.restore();
    });
    it('content -> privileged auto tab_id' ,function(){
        Utility.QuickData ={tabId:'39'};
        initBrowser();
        var spy =Sinon.spy(W.browser.runtime,'sendMessage');
        const Content =new Sender('content','privileged');
        Content.send('miao',{b:2});
        Assert(spy.withArgs(
            new Message({
                eventType:'miao',
                from :'content',
                to   :'privileged',
                data :{b:2},
                tabId:Utility.QuickData.tabId,
            })
        ).called);
        spy.restore();
    });
    it('background -> privileged' ,function(done){
        initBrowser();
        var spy =Sinon.spy(W.browser.tabs,'sendMessage');
        var stub =Sinon.stub(W.browser.tabs,'query');
        stub.withArgs({}).returns(Promise.resolve([{id:'7'},{id:'9'},{id:'8'}]));
        const Content =new Sender('background','privileged');
        Content.send('biu',{c:3});
        var message =new Message({
            eventType:'biu',
            from :'background',
            to   :'privileged',
            data :{c:3},
        });

        Promise.resolve().then(()=>{
            Assert(spy.withArgs('7',message).calledOnce);
            Assert(spy.withArgs('9',message).calledOnce);
            Assert(spy.withArgs('8',message).calledOnce);
            spy.restore();
            stub.restore();
            done();
        });
    });
    it('privileged -> background specified tab_id' ,function(){
        initBrowser();
        var spy =Sinon.spy(W.browser.runtime,'sendMessage');
        const Content =new Sender('privileged','background');
        Content.send('wang',{b:2},222);
        Assert(spy.withArgs(
            new Message({
                eventType:'wang',
                from :'privileged',
                to   :'background',
                data :{b:2},
                tabId:'222',
            })
        ).called);
        spy.restore();
    });
});
