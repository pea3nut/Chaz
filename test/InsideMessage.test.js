const Sinon =require('sinon');
const Assert = require('chai').assert;
const {InsideMessage,Message,Utility} =require('../dist/Chaz.node.js');



describe('InsideMessage test:',function(){
    it('InsideMessage#constructor',function(){
        var info ={
            from :'background',
            to :'content',
            eventType :'test',
            data :['a','b'],
            tabId :'*',
        };
        Assert.throws(function(){
            InsideMessage(info);
        });
        info.eventType ='hello';
        var message =new InsideMessage(info);
    });
    it('InsideMessage.is',function(){
        var info ={
            from :'background',
            to :'content',
            eventType :'hello',
            data :['a','b'],
            tabId :'*',
        };
        Assert.isNotOk(InsideMessage.is(new Message(info)));
        Assert.isOk(InsideMessage.is(new InsideMessage(info)));
    });
});
