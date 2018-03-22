
var fs = require('fs');
var iconv = require('iconv-lite'); 
var path = require('path');  
// fs.readFile('./desktop.ini', { encoding: 'binary' }, function(err, data){
//     // console.log(data);
//     // str = iconv.decode(new Buffer([0x68, 0x65, 0x6c, 0x6c, 0x6f]), 'win1251');

//     // Convert from js string to an encoded buffer.
//     // buf = iconv.encode("Sample input string", 'win1251');
//     // buf = iconv.encode(data, 'GBK');
    
//     // data = new Buffer(data); 
//     // str = iconv.decode(data, 'GBK');
//     // console.log(str)
//     var buf = new Buffer(data, 'binary');
//     var str = iconv.decode(buf, 'gbk');
//     console.log(str);
// });

function readFileTxt(filePath, filename,callback){
    var filedir = path.join(filePath, filename);
    // console.log(filedir)
    // 以二进制方式打开
    fs.readFile(filedir, { encoding: 'binary' }, function(err, data){
        if (err){
            console.warn(err)
        }
        // 放入二进制buffer
        var buf = new Buffer(data, 'binary');
        var str = iconv.decode(buf, 'gbk');
        callback(str);
    });
}

//记录次数使用 帮助判断最后完结状态
var calcnum = 0;

function fileDisplay(filePath,callback) {
    //根据文件路径读取文件，返回文件列表  
    fs.readdir(filePath, function (err, files) {
        if (err) {
            console.warn(err)
        } else {
            //遍历读取到的文件列表  
            files.forEach(function (filename) {
                //获取当前文件的绝对路径  
                var filedir = path.join(filePath, filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象  
                fs.stat(filedir, function (eror, stats) {
                    if (eror) {
                        console.warn('获取文件stats失败');
                    } else {
                        var isFile = stats.isFile();//是文件  
                        var isDir = stats.isDirectory();//是文件夹  
                        if (isFile) {
                            // console.log(filedir);
                        }
                        if (isDir) {
                            calcnum ++;//记录次数
                            callback(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件  
                        }
                    }
                })
            });
        }
    });
}  

var filePath = path.resolve(__dirname);  
var filePath = path.resolve(__dirname);  
var resultArry = []
fileDisplay(filePath, function (filedir){
    // console.log(filedir)
    fs.readdir(filedir, function (err, files) {
        if (err){
            calcnum--
            return ;
        }
        // console.log(files.indexOf('desktop.ini'))
        if (files.indexOf('desktop.ini')>=0){
            readFileTxt(filedir, 'desktop.ini', function (str) {
                // console.log.apply(console, [filedir,str])
                resultArry.push([filedir, str.replace('[\.ShellClassInfo]','').replace(/[\n\r]/g,'')+'\n'].join('---'))
                // console.log( [filedir,str].join('\n'))
                calcnum--
                // 全部完成
                if (calcnum==0){
                    console.log('over')
                    // console.log(resultArry)
                    // 写入数据
                    fs.writeFile('./input.txt', resultArry.join(''), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                        // fs.readFile('input.txt', function (err, data) {
                        //     if (err) {
                        //         return console.error(err);
                        //     }
                        //     console.log("异步读取文件数据: " + data.toString());
                        // });
                    });

                }
            })
        }else{
            calcnum--
        }
    })
})

