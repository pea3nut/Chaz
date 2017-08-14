const Sinon =require('sinon');
const Assert = require('chai').assert;
const {ChazEvent} =require('../dist/Chaz.node.js');

describe('ChazEvent test:',function(){
    it('ChazEvent#on ChazEvent#one ChazEvent#wait well add listener in _events property',function(){
        var ce =new ChazEvent();
        var listener =function(){};
        var eventType ='test';
        ce.on(eventType,function(){});
        Assert.lengthOf(ce._events[eventType],1);
        ce.one(eventType,listener);
        ce.on(eventType,listener);
        Assert.lengthOf(ce._events[eventType],2);
        ce.wait(eventType);
        Assert.lengthOf(ce._events[eventType],3);
    });
    it('ChazEvent#on add listener, use ChazEvent#execEventAll dispatch',function(){
        var ce =new ChazEvent();
        var eventType ='test';
        var argn =['a','b'];
        var listener =Sinon.spy();
        ce.on(eventType,listener);
        ce.execEventAll(eventType,argn);
        Assert(listener.withArgs(...argn).called);
        ce.execEventAll(eventType,argn);
        Assert.strictEqual(listener.callCount,2);
    });
    it('ChazEvent#on add listener, use ChazEvent#off remove listener',function(){
        var ce =new ChazEvent();
        var eventType ='test';
        var listener =Sinon.spy();
        ce.on(eventType,listener);
        ce.off(eventType,listener);
        ce.execEventAll(eventType);
        Assert(listener.notCalled);
    });
    it('ChazEvent#one listener should be run once',function(){
        var ce =new ChazEvent();
        var eventType ='test';
        var listener =Sinon.spy();
        ce.one(eventType,listener);
        ce.execEventAll(eventType);
        ce.execEventAll(eventType);
        Assert(listener.calledOnce);
    });
    it('ChazEvent#wait should wait a legal event',function(done){
        var ce =new ChazEvent();
        var eventType ='test';
        setTimeout(()=>ce.execEventAll(eventType));
        ~async function (){
            await ce.wait(eventType);
            Assert.lengthOf(ce._events[eventType],0);
            var args =['a','b'];
            setTimeout(()=>ce.execEventAll(eventType));
            setTimeout(()=>ce.execEventAll(eventType,args));
            var checker =Sinon.spy(function(){
                if(arguments.length ===2){
                    Assert.deepEqual(args,Array.from(arguments));
                    return true;
                }
                return false;
            });
            await ce.wait(eventType,checker);
            Assert.strictEqual(checker.callCount ,2);
            done();
        }();
    });
});
