console.log('background.js');

Chaz.init('background');
//const Content =new Chaz('content');



/**A content -> background

Content.on('test',function(){
    console.log('bg reserve content\'test',...arguments);
    return 'OK';
});

*/



/**B background wait content

~async function(){
    await Content.wait('ready',function(data,sender){
        if(sender.tab.id%2===0){
            console.log(`allow ${sender.tab.id}`);
            return true;
        }else{
            console.log(`deny ${sender.tab.id}`);
            return false;
        }
    });
    Content.send('push_number',Math.PI);
    Content.send('push_number',Math.E);
}();

*/
