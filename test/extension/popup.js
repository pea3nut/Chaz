console.log('popup.js');

~async function(){


    /** C popup -> content
    await Chaz.init('popup.privileged');
    const Content = new Chaz('content');
    const Background = new Chaz('background');

    var response =await Content.send('say','miaomiaomiao?');
    console.log('popup get',response);

    */

    /** D content wait iframe
     await Chaz.init('iframe.content');
     const Content = new Chaz('content');
     console.log(browser.tabs);

     Content.send('load');
     Content.on('init',function(data,sender){
        console.log('init event');
        document.body.innerHTML =`
            ${data['body_msg']}
            <pre>${JSON.stringify(sender,null,'    ')}</pre>
        `;
    });
    */

    /** F iframe -> content
     await Chaz.init('iframe.content');
     const Content = new Chaz('content');
     setInterval(async function (){
        var data =await Content.send('load');
        document.body.innerHTML =JSON.stringify(data);
    },5000);
    */

    /** G content -> iframe
     await Chaz.init('iframe.content');
     const Content = new Chaz('content');
     var data =await Content.send('load');
     document.body.innerHTML =JSON.stringify(data);
    */

}();