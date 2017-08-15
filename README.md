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

@@ 待补完

# APIs

## Chaz#constructor(selfType,targetType)

- selfType：当前运行的脚本类型
- targetType：想与之通信的脚本类型

## Chaz#on(type ,listener)

- type：监听的事件类型
- listener：监听器

当事件发生，监听器将会被传入：

- data：被发送的数据
- sender：有关发送方的信息
- callback：响应这个事件并返回值

### callback

A function to call, at most once, to send a response to the message. The function takes a single argument, which may be any JSON-ifiable object. This argument is passed back to the message sender.

If you have more than one onMessage listener in the same document, then only one may send a response.

To send a response synchronously, call sendResponse before the listener function returns. To send a response asynchronously:


- either keep a reference to the sendResponse argument and return true from the listener function. You will then be able to call sendResponse after the listener function has returned.
- or return a Promise from the listener function and resolve the promise when the response is ready.

## Chaz#send(eventType ,data ,tabId=null)

- eventType：发送的事件类型
- data：发送的消息

该方法返回一个Promise对象，对应`Chaz#on`的callback
