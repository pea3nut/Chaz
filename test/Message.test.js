const Sinon =require('sinon');
const Assert = require('chai').assert;
const {Message,Utility} =require('../dist/Chaz.node.js');



describe('Message test:',function(){
    it('Message#constructor',function(){
        Assert.throws(function(){
            new Message({});
        });
        Assert.throws(function(){
            new Message({
                from :'background',
                to   :'content',
            });
        });
        Assert.throws(function(){
            new Message({
                from :'background',
                eventType:'test',
            });
        });
        Assert.throws(function(){
            new Message({
                from :'background',
                to   :'conten',
                eventType:'test',
            });
        });

        var info ={
            from :'background',
            to :'content',
            eventType :'test',
            data :['a','b'],
            tabId :'*',
        };
        var message =new Message(info);
        Assert.deepEqual(
            message,
            {
                chaz    :true,
                from    :Utility.parseScriptType(info.from),
                to      :Utility.parseScriptType(info.to),
                tab_id  :info.tabId,
                event_type:info.eventType,
                data    :info.data,
            }
        );
    });
    it('Message.is',function(){
        var message =new Message({
            to :'content',
            from :'background',
            eventType :'test',
        });
        Assert.isOk(Message.is(message));
        Assert.isOk(Message.is(JSON.parse(JSON.stringify(message))));
        Assert.isOk(Message.is({
            to   :Utility.parseScriptType('background'),
            from :Utility.parseScriptType('content'),
            event_type :'hello',
            chaz :true
        }));
        Assert.isNotOk(Message.is({}));
    });
});
