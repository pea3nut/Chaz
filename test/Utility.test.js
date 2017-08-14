const Sinon =require('sinon');
const Assert = require('chai').assert;


require =function(origin){
    return function(path){
        var absolute =origin.resolve(path);
        delete origin.cache[absolute];
        return origin(path);
    };
}(require);

const {Utility,Message} =require('../dist/Chaz.node.js');


describe('Utility test:',function(){
    it('Utility.parseScriptType' ,function(done){
        Assert.deepEqual(Utility.parseScriptType('popup.privileged') ,['privileged' ,'popup']);
        Assert.deepEqual(Utility.parseScriptType('content') ,['content']);
        Assert.deepEqual(Utility.parseScriptType(['content']) ,['content']);
        Assert.throws(function(){
            Utility.parseScriptType('contnet');
        });
        done();
    });
    it('Utility.matchAddress' ,function(){
        Assert.isOk(Utility.matchAddress(
            Utility.parseScriptType('background') ,
            Utility.parseScriptType('background')
        ));
        Assert.isOk(Utility.matchAddress(
            Utility.parseScriptType('iframe.privileged') ,
            Utility.parseScriptType('privileged')
        ));
        Assert.isNotOk(Utility.matchAddress(
            Utility.parseScriptType('privileged') ,
            Utility.parseScriptType('iframe.privileged')
        ));
    });
    it('Utility.log' ,function(){
        var spy =Sinon.spy(console ,'warn');
        Utility.develop =false;
        Utility.log('abc');
        Assert(spy.notCalled);
        Utility.develop =true;
        Utility.log('');
        Assert(spy.called);
        spy.restore();
    });
    it('Utility.setDefaultTabId' ,function(){
        var message =new Message({
            to   :'background',
            from :'content',
            eventType :'hello',
        });
        Assert.throws(function(){
            Utility.setDefaultTabId(message);
        });
        Utility.QuickData ={tabId:'233'};
        Utility.setDefaultTabId(message);
        Assert.equal(message['tab_id'] ,Utility.QuickData.tabId);
    });
});
