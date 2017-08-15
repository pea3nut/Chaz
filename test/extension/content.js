console.log('content.js');



~async function(){
    //await Chaz.init('content');
    //const Popup =new Chaz('popup.privileged');
    //const Background =new Chaz('background');


    await Chaz.init('iframe.content');
    const Background = new Chaz('background');
    Background.on('test',function(){
        return 'ok';
    });

    // await Chaz.init('page.content');
    // var elt =document.createElement('iframe');
    // elt.src=browser.extension.getURL('popup.html');
    // document.body.appendChild(elt);

    // const iFrame =new Chaz('iframe.content');
    // await iFrame.wait('loaded');
    //
    // var data =await iFrame.send('getTime');
    // console.log('getTime:',data);



    /**A content -> background

    console.log('content loaded',Chaz.QuickData);
    console.log('content send()');
    var response =await Background.send('test','abc');
    console.log('content get',response);

    */


    /**B background wait content

    Background.on('push_number',function(data ,sender){
        console.log('number',data);
    });
    Background.send('ready');

    */


    /** C popup -> content

    Popup.on('say',function(data){
        console.log('receive popup',data);
        return 'OK';
    });

    */

    /** D content wait iframe
     var elt =document.createElement('iframe');
     elt.src=browser.extension.getURL('popup.html');
     document.body.appendChild(elt);

     const iFrame =new Chaz('iframe.content');
     await iFrame.wait('load');
     iFrame.send('init',{body_msg:'Goodbye world.'});
    */

    /** F iframe -> content
     var elt =document.createElement('iframe');
     elt.src=browser.extension.getURL('popup.html');
     document.body.appendChild(elt);
     const iFrame =new Chaz('iframe.content');
     iFrame.on('load',function(){
        return {
            time :(new Date).toString(),
            tab  :Chaz.QuickData.tabId,
        };
    });
    */
    /** G content -> iframe
     const iFrame =new Chaz('iframe.content');
     iFrame.on('load',function(){
        return {
            time :(new Date).toString(),
            tab  :Chaz.QuickData.tabId,
        };
    });
     console.log('add event');
     var elt =document.createElement('iframe');
     elt.src=browser.extension.getURL('popup.html');
     document.body.appendChild(elt);
    */



}();





