class Utility{};

Utility.develop =false;
Utility.allowScriptType =['background','content','privileged'];
Utility.matchAddress =function(target ,address){
    return Array.isArray(target) 
        && Array.isArray(address) 
        && address.every((item,index)=>{
            return item ===target[index];
        })
    ;
};
Utility.parseScriptType =function(str){
    if(Array.isArray(str))return str;
    var arr =str.split('.').reverse();
    if(
        !Utility.allowScriptType.includes(arr[0])
    ){
        throw new Error(`type "${arr[0]}" is not allow`);
    };
    return arr;
};
Utility.log =function(){
    this.develop && console.warn(...arguments);
};
Utility.QuickData =null;
Utility.setDefaultTabId =function(message){
    if('tab_id' in message)return;
    if(Utility.QuickData===null){
        throw new Error('Utility.QuickData is null');
    }
    message['tab_id']=this.QuickData.tabId;
};
Utility.getActivatedTabId =async function(){
    var tabs =await browser.tabs.query({active:true});
    return tabs[0].id;
};