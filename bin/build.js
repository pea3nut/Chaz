const Fs =require('fs');
const Path =require('path');
const FileList =[
    '../src/Utility.js',
    '../src/ChazEvent.js',
    '../src/Message.js',
    '../src/InternalMessage.js',
    '../src/Sender.js',
    '../src/Receiver.js',
    '../src/Chaz.js',
];
const NoteFilePath =Path.join(__dirname,'../dist/Chaz.node.js');
const BrowserFilePath =Path.join(__dirname,'../dist/Chaz.js');
const TestFilePath =Path.join(__dirname,'../test/extension/Chaz.js');

var exportFile =function(){
    var content =[];
    for(let path of FileList){
        content.push(
            Fs.readFileSync(Path.join(__dirname,path)).toString()
        );
    };
    content =content.join('\n');

    var nodeContent =[content];
    for(let path of FileList){
        let className =Path.basename(path ,'.js');
        nodeContent.push(
            `exports.${className} =${className};`
        );
    };
    nodeContent =nodeContent.join('\n');

    Fs.writeFileSync(NoteFilePath,nodeContent);
    console.log(`export ${NoteFilePath} ${(new Date).toString()}`);

    var browserContent =`
const Chaz =function(W){
${content}



return Chaz;
}(window);
    `;
    Fs.writeFileSync(BrowserFilePath,browserContent);
    console.log(`export ${BrowserFilePath} ${(new Date).toString()}`);
    Fs.writeFileSync(TestFilePath,browserContent);
    console.log(`export ${TestFilePath} ${(new Date).toString()}`);

};

Fs.watch(Path.join(__dirname,'../src'),exportFile);
exportFile();