const Sinon =require('sinon');
const Assert = require('chai').assert;
const {InternalMessage,Message,Utility} =require('../dist/Chaz.node.js');



describe('InternalMessage test:',function(){
    it('InternalMessage#constructor',function(){
        var info ={
            from :'background',
            to :'content',
            eventType :'test',
            data :['a','b'],
            tabId :'*',
        };
        Assert.throws(function(){
            InternalMessage(info);
        });
        info.eventType ='hello';
        var message =new InternalMessage(info);
    });
    it('InternalMessage.is',function(){
        var info ={
            from :'background',
            to :'content',
            eventType :'hello',
            data :['a','b'],
            tabId :'*',
        };
        Assert.isNotOk(InternalMessage.is(new Message(info)));
        Assert.isOk(InternalMessage.is(new InternalMessage(info)));
    });
});
