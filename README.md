# Chaz.js

A communication library for WebExtensions.

English document is [here](./README-English.md).

# Chaz.js 可以做什么？

Chaz.js是为[WebExtensions](https://developer.mozilla.org/zh-CN/Add-ons/WebExtensions)打造的通信库，可以极大的简化WebExtensions不同类型的脚本传递消息。

Chaz提供了一套更亲近与人类逻辑而不是底层实现的消息借口。

```js
// background.js

(async function(){

    await Chaz.init('background');//等待初始化完成
    const Content =new Chaz('content');//要与之通信的目标

    Content.on('loaded',function(data ,url){
        console.log('you opened '+data.url);
    });

}());

```

```js
// content.js
(async function(){

    await Chaz.init('content');//等待初始化完成
    const Background =new Chaz('background');//要与之通信的目标

    Background.send('loaded',{url:document.URL});

}());
```

详细的使用可以参考项目中`/test/extensions`文件夹。

# 使用

你**必须**要在background script中引入Chaz库，并调用`Chaz.init('background')`。否则Chaz库将不会正常工作。

# APIs

## Chaz.init(selfType)

## Chaz#on(type ,listener)

- type：监听的事件类型
- listener：监听器

当事件发生，监听器将会被传入：

- data：被发送的数据
- sender：有关发送方的信息
- callback：响应这个事件并返回值

## Chaz#one(type ,listener)

类似于#on，但listener仅会被触发一次

## Chaz#wait(type ,filter)

返回一个Promise，等待一个事件的发生。

它在异步函数中格外有用，并且语义更好。

使用on

```js
var listener =null;
iFrame.on('loaded' ,listener =function(data ,sender){
    Chaz.Utility.getActivatedTabId().then(function(tabId){

        // do sth

        iFrame.off('loaded',listener);
    });
});
```

使用wait

```js
(async function(){
    await iFrame.wait('loaded');

    // do sth

})();
```

并且，你可以添加一个过滤器返回true/false来觉得是否不再继续等待。

@@ 未完成，下面的别看。。。

## Chaz#send(eventType ,data ,tabId=null)

- eventType：发送的事件类型
- data：发送的消息

该方法返回一个Promise对象，对应`Chaz#on`的callback
