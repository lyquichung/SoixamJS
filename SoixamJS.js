/**
 * SoixamJS - A lightweight, open-source JavaScript library
 * Filename: SoixamJS.js
 * Author: Lý Quí Chung
 * License: GNU General Public License (GPL)
 * SoixamJS simplifies DOM element manipulation and makes website layout building more straightforward.
 * This library is designed to provide basic yet effective tools for developers, without relying on heavy frameworks.
 * Repository: https://github.com/lyquichung/SoixamJS
 * Contributions are welcome to help improve SoixamJS.
 */
(function(){
    Object.defineProperty(window,'SX',{writable:false,configuration:false,value:function SX(selector,options){
        if(typeof selector==='string'){
            return new SX.Node(selector,options);
        }else if(typeof selector==='object'){
            if(selector instanceof NodeList){
                return new SX.Node(selector,options);
            }else if(selector instanceof HTMLElement){
                return new SX.Node([selector],options);
            }else if(selector instanceof Array){
                return new SX.Node(selector,options);
            }else{
                return new SX.Node([]);
            }
        }else{
            return new SX.Node([]);
        }
    }});

    SX.add=function(name,obj){
        if(typeof name !== 'string'){return false;}
        name=name.trim();
        if(!/^([a-zA-Z\$]([a-zA-Z0-9\$]*))$/.test(name)){
            console.warn(`The SX Plugin name "${name}" has an incorrect syntax`);
            return false;
        }
        if(this[name] !== undefined){
            console.warn(`A property named "${name}" already exists in the SX library`);
            return false;
        }
        if(typeof obj!=='object'){
            console.warn('The SX.add method is only used to add objects');
            return false;
        }
    
        Object.defineProperty(this,name,{writable:false,configuration:false,value:obj});
    };

    SX.createElement=function(html){
        if(typeof html!=='string'){return SX([]);}
        let div=document.createElement('div');
        div.innerHTML=html;
        return SX([div]).children('*');
    }

    SX.invert=function(){
        let html=SX('html');
        if(html.hasClass('sx_invert')){
            html.removeClass('sx_invert');
        }else{
            html.addClass('sx_invert');
        }
        return true;
    };

    SX.range=function(min,max){
        if((min===undefined) || isNaN(min=parseInt(min.toString().trim()))){
            min=0;
        }
        if((max===undefined) || isNaN(max=parseInt(max.toString().trim()))){
            max=0;
        }
        if(min===max){return [min];}else{
            let temp_min=Math.min(min,max);
            let temp_max=Math.max(min,max);
            let data=[];
            for(let i=temp_min;i<=temp_max;i++){
                data.push(i);
            }
            return data;
        }
    };

    SX.rand=function(min,max){
        if((min===undefined) || isNaN(min=parseInt(min.toString().trim()))){
            min=0;
        }
        if((max===undefined) || isNaN(max=parseInt(max.toString().trim()))){
            max=0;
        }
        let temp_min=Math.ceil(Math.min(min,max));
        let temp_max=Math.floor(Math.max(min,max));
        if(temp_min===temp_max){return temp_min;}else{
            return Math.floor(Math.random() * (temp_max - temp_min + 1) + temp_min);
        }
    };

    SX.randFloat=function(min,max){
        if((min===undefined) || isNaN(min=parseFloat(min.toString().trim()))){
            min=0;
        }
        if((max===undefined) || isNaN(max=parseFloat(max.toString().trim()))){
            max=0;
        }
        let temp_min=Math.min(min,max);
        let temp_max=Math.max(min,max);
        return Math.random() * (temp_max - temp_min) + temp_min;
    };

    SX.randText=function(length){
        if((length===undefined) || isNaN(length=parseInt(length.toString().trim()))){
            length=SX.rand(78,91);
        }
        length=Math.abs(length);

        let text='';
        for(let i=0;i<length;i++){
            if(SX.rand(0,1)){
                text+=String.fromCharCode(SX.rand(65,90));
            }else{
                text+=String.fromCharCode(SX.rand(97,122));
            }
        }
        return text;
    };

    SX.shuffle=function(data,seed){
        if(!(data instanceof Array)){
            return data;
        }
        if((seed===undefined) || (seed.toString === undefined)){
            seed=Math.floor(Math.random() * 1000000000);
        }else{
            let seed_string=seed.toString().trim();
            if(!seed_string.length){
                seed=Math.floor(Math.random() * 1000000000);
            }else{
                seed=0;
                for(let i=0,j=seed_string.length;i<j;i++){
                    seed+=parseInt(seed_string.charCodeAt(i));
                }
            }
        }

        let current_index=data.length;
        let step=0;
        while(current_index){
            step++;
            let random_number=parseInt((Math.sqrt(seed * step * current_index)*1000000000));
            random_number=random_number.toString().split('').reverse().join('');

            let random_index=random_number % current_index;
            current_index--;

            let tmp=data[current_index];
            data[current_index]=data[random_index];
            data[random_index]=tmp;
        }
        return data;
    };

    SX.sleep=async function(miliseconds){
        miliseconds=!isNaN(miliseconds) ? miliseconds : 0;
        miliseconds=miliseconds>0 ? miliseconds : 0;
        return new Promise(resolve => setTimeout(resolve, miliseconds));
    };

    SX.hash=async function(algo,str){
        try{
            const buffer = new TextEncoder().encode(str);
            const hash = await crypto.subtle.digest(algo,buffer);
            const byteArray = Array.from(new Uint8Array(hash));
            const hexString = byteArray.map(x => ('00' + x.toString(16)).slice(-2)).join('');
            return hexString;
        }catch(e){
            return false;
        }
    };

    SX.chance=function(percent){
        percent=parseFloat(percent);
        if(isNaN(percent)){
            return false;
        }

        let intPart=(percent+'').split('.')[0];
        let fracPart=(percent+'').split('.')[1];

        let fracLength=(fracPart+'').length;
        let multipleNumber=parseInt('1'+('').padEnd(fracLength,'0'));

        let min=1;
        let max=100 * multipleNumber;
        let acceptNumber=percent * multipleNumber;

        let randNumber=SX.rand(1,max);
        return randNumber <= acceptNumber ? true : false;
    };

    SX.ajax=async function(option){
        return new Promise((function(option,resolve,reject){
            option['url']=typeof option['url'] === 'string' ? option['url'].trim() : window.location.href;
    
            option['method']=typeof option['method'] === 'string' ? option['method'].trim().toUpperCase() : 'GET';
    
            if(typeof option['header']==='object'){
                if(option['header'] instanceof Object){
                    let header={};
                    for(var key in option['header']){
                        if(typeof option['header'][key] !== 'string'){continue;}
                        header[key.toLowerCase()]=option['header'][key].trim();
                    }
                    option['header']=header;
                }else{
                    let header={};
                    for(let i=0,j=option['header'].length;i<j;i++){
                        if(typeof option['header'][i] === 'string'){
                            let header_line=option['header'][i].split(':');
                            let header_name=header_line[0].trim().toLowerCase();
                            let header_value=header_line[1]!== undefined ? header_line.slice(1).join(':').trim() : '';
                            if((header_name==='') || (header_value==='')){
                                continue;
                            }
                            header[header_name]=header_value;
                        }
                    }
                    option['header']=header;
                }
            }else{
                option['header']={};
            }
    
            if(typeof option['data'] !== 'undefined'){
                if(option['data'] instanceof FormData){
                    delete header['content-type'];
                }else if(typeof option['data'] === 'object'){
                    header['content-type']='application/json;charset=utf-8';
                    option['data']=JSON.stringify(option['data']);
                }
            }
            
            if(option['method']!=='GET'){
                option['header']['CSRF-Token']=SX.System.get('getBeautifulCSRFKey')();
            }
    
            let xhr=new XMLHttpRequest();
            xhr.open(option['method'],option['url']);
    
            if(typeof option['progress'] === 'function'){
                xhr.addEventListener('progress',(function(progress,e){
                    let percent=0;
                    if(e.lengthComputable){
                        percent=Math.round(e.loaded / e.total * 10000 | 0) / 100;
                    }
                    progress.call(this,e,percent);
                }).bind(xhr,option['progress']),false);
            }
    
            xhr.addEventListener('load',(function(resolve,reject,e){
                if(this.readyState===4){
                    let response_data=this.response || this.responseText || null;
                    if(response_data !== null){
                        if(/^application\/json/i.test(this.getResponseHeader('Content-Type'))){
                            try{
                                response_data=JSON.parse(response_data);
                            }catch(e){
                                reject('Invalid JSON Data.');
                            }
                        }
                        if(typeof option['complete'] === 'function'){
                            option['complete'](response_data,this.status,this.statusText);
                        }
                        resolve(response_data,this.status,this.statusText);
                    }else{
                        let error='Failed to receive a response from the server';
                        if(typeof option['error'] === 'function'){
                            option['error'](error);
                        }
                        reject(error);
                    }
                }else{
                    let state=['UNSENT','OPENED','HEADERS_RECEIVED','LOADING','DONE'];
                    state=state[this.readyState];
                    let error='[' + state + '] Something wrong with this connection.';
                    if(typeof option['error'] === 'function'){
                        option['error'](error);
                    }
                    reject(error);
                }
            }).bind(xhr,resolve,reject),false);
    
            for(let key in option['header']){
                xhr.setRequestHeader(key,option['header'][key].trim());
            }
    
            if(typeof option['data'] !== 'undefined'){
                xhr.send(option['data']);
            }else{
                xhr.send();
            }
        }).bind(null,option));
    };
})();

(function(){
    let SXSystem=function SXSystem(){
        let data={};
        this.set=function(key,value){
            if(typeof key!=='string'){return /*false*/this;}
            key=key.trim();
            if(!/^([a-zA-Z\$]([a-zA-Z0-9\$]*))$/.test(key)){
                console.warn(`The System Key "${key}" has an incorrect syntax`);
                return /*false*/this;
            }
            data[key]=value;
        };

        this.get=function(key){
            return typeof data[key] !== undefined ? data[key] : null;
        };

        this.remove=function(listKey){
            return this.delete(listKey);
        };
        this.delete=function(listKey){
            if(typeof listKey === 'string'){listKey=[listKey];}
            if(!(listKey instanceof Array)){return /*false*/this;}
            for(let i=0,j=listKey.length;i<j;i++){
                let key=listKey[i];
                key=key.trim();if(key===''){continue;}
                delete data[key];
            }
            return this;
        };
        this.clear=function(){
            data={};
            return this;
        };
    };
    
    Object.defineProperty(SXSystem.prototype,Symbol.toStringTag,{
        get:function(){
            return "SXSystem";
        }
    });

    SX.add('System',new SXSystem());

    SX.System.set('selectorNameEncode',function(selectorName){
        let sListChar=SX.Temp.get('sListChar');
        let sKeyArray=SX.Temp.get('sKeyArray');
        if(!sListChar){
            sListChar='-_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if(!sKeyArray){
                let sKey=SX.Temp.get('sKey');
                if(!sKey){
                    sKey='24bed345078a3f2f91fc5841319c2f02';
                }

                sKey='00'+(sKey.replace(/([^\d]+)/g,'').trim());

                let split_index=Math.floor(sKey.length/2);
                let key_1=parseInt(sKey.substring(0,split_index));
                let key_2=parseInt(sKey.substring(sKey.length-split_index));
                sKeyArray=[key_1,key_2];
                sKeyArray[0]=sKeyArray[0] % sListChar.length;
                sKeyArray[1]=sKeyArray[1] % sListChar.length;
                
                SX.Temp.set('sKeyArray',sKeyArray);
            }

            sListChar=sListChar.split('');
            sListChar=SX.shuffle(sListChar,Math.abs((sKeyArray[0] - 7) + (sKeyArray[0] - 8) + 91));
            sListChar=sListChar.join('');
            SX.Temp.set('sListChar',sListChar);
        }

        let resultKey='sSelectorResult_'+selectorName;
        let result=SX.Temp.get(resultKey);
        if(!result){
            result='';
            selectorName=selectorName.split('').reverse().join('');
            for(let i=0,j=selectorName.length;i<j;i++){

                let charIndex=sListChar.indexOf(selectorName[i]);
                let encodeCharIndex=(charIndex + (sKeyArray[1] % sListChar.length)) % sListChar.length;
                let encodeChar=sListChar[encodeCharIndex];

                result+=encodeChar;
            }
            SX.Temp.set(resultKey,result);
        }
        return '_'+result;
    });

    SX.System.set('selectorEncode',function(selector){
        let obfuscateStatus=SX.Temp.get('obStatus') || 0;
        if(obfuscateStatus % 2 !== 1){
            /* Nếu là số lẻ thì không mã hoá */
            return selector;
        }

        let regex=/(([\#\.])([\-\_a-zA-Z]+)([\-\_a-zA-Z0-9]*))/g;
        let matches=selector.matchAll(regex);
        for(let match of matches){
            let replacement=match[2]+SX.System.get('selectorNameEncode')((match[3]+match[4]));
            selector=selector.replace(match[0],replacement);
        }
        return selector;
    });

    SX.System.set('getBeautifulCSRFKey',function(){
        let CSRFKey=SX.Temp.get('BeautifulCSRFKey');
        if(!CSRFKey){
            CSRFKey='';
            let uglyCSRFKey=SX.Config.get('CSRFKey') || '';
            for (var i=0;i<uglyCSRFKey.length;i+=5) {
                CSRFKey+=uglyCSRFKey.substring(i,i+5).split('').reverse().join('');
            }
        }
        return CSRFKey;
    });
})();

(function(){
    let SXLibrary=function SXLibrary(){
        this.add=function(name,callback){
            if(typeof name!=='string'){return false;}
            name=name.trim();
            if(!/^([a-zA-Z\$]([a-zA-Z0-9\$]*))$/.test(name)){
                console.warn(`The function name "${name}" has an incorrect syntax`);
                return false;
            }
            if(typeof this[name] === 'function'){
                console.warn(`You cannot override the "${name}" function`);
                return false;
            }
            if(typeof callback!=='function'){
                console.warn('The SX.Library.add method is only used to add functions');
                return false;
            }
            Object.defineProperty(this,name,{writable:false,configuration:false,value:callback});
        };
    };
    Object.defineProperty(SXLibrary.prototype,Symbol.toStringTag,{
        get:function(){
            return "SXLibrary";
        }
    });
    SX.add('Library',new SXLibrary());

    let SXDialog=function SXDialog(customOptions){
        let dialog=this;
        let dialogID='sx_dialog_'+(new Date()).getTime()+'_'+parseInt(Math.random()*1000000000);
        let dialogElement=null;
        let closeElemenet=null;
        let formElement=null;
        let inputElement=null;
        let options={};

        if(Object.prototype.toString.call(customOptions)!=='[object Object]'){
            customOptions={};
        }else{
            options=Object.assign(customOptions,options);
        }
        options['title']=typeof options['title'] === 'string' ? options['title'].trim() : '';
        options['message']=typeof options['message'] === 'string' ? options['message'].trim() : '';
        options['html']=typeof options['html'] === 'string' ? options['html'].trim() : '';

        if((typeof options['input'] === 'object') && (Object.prototype.toString.call(options['input']) === '[object Object]')){
            let input_type=(typeof options['input']['type'] === 'string' ? options['input']['type'] : 'text').trim().toLowerCase();
            input_type=input_type === '' ? 'text' : input_type;
            
            let input_placeholder=(typeof options['input']['placeholder'] === 'string' ? options['input']['placeholder'] : '').trim();
            let input_value=(typeof options['input']['value'] === 'string' ? options['value'] : '').trim();
            options['input']={
                type:input_type,
                placeholder:input_placeholder,
                value:input_value,
            };
        }else{
            options['input']=false;
        }

        if((typeof options['buttons'] === 'object') && (options['buttons'] instanceof Array)){
            let list_button=[];
            for(let i=0,j=options['buttons'].length;i<j;i++){
                let button=options['buttons'][i];
                if((typeof button === 'object') && (Object.prototype.toString.call(button) === '[object Object]')){
                    button={
                        type:(typeof button['type'] === 'string') && ['submit','button'].indexOf(button['type'].trim().toLowerCase())!==-1 ? button['type'].toLowerCase().trim() : 'button',
                        text:typeof button['text'] === 'string' ? button['text'].trim() : '[Nonamed]',
                        callback:typeof button['callback'] === 'function' ? button['callback'] : false,
                    };
                    list_button.push(button);
                }
            }
            options['buttons']=list_button;
        }else{
            options['buttons']=[];
        }
        options['buttons']=options['buttons'].length ? options['buttons'] : false;

        options['closable']=options['closable']!== undefined ? Boolean(options['closable']) : true;
        options['callback']=typeof options['callback']=== 'function' ? options['callback'] : null;

        let init=function(){
            dialogElement=SX(document.createElement('div'));
            dialogElement.setAttribute('id',dialogID);
            dialogElement.addClass('sx_dialog sx_visible');
            
            let html='';
            html+='<div class="sx_dialog_container">';
            html+='    <form class="sx_dialog_box">';
            html+='        <a class="sx_dialog_close"></a>';
            if(options['title']!==''){
            html+='        <div class="sx_dialog_row sx_dialog_title">'+options['title']+'</div>';
            }
            if(options['message']!==''){
            html+='        <div class="sx_dialog_row sx_dialog_content">'+options['message']+'</div>';
            }
            if(options['input']!==false){
            html+='        <div class="sx_dialog_row sx_dialog_input"></div>';
            }
            if(options['buttons']!==false){
            html+='        <div class="sx_dialog_row sx_dialog_command"></div>';
            }
            html+='    </form>';
            html+='</div>';
            SX.createElement(html).appendTo(dialogElement);
            dialogElement.appendTo(document.body);

            closeElemenet=dialogElement.find('.sx_dialog_close');
            closeElemenet.addEventListener('click',(function(dialog){
                dialog.hide();
            }).bind(closeElemenet,dialog),false);

            if(!options['closable']){
                closeElemenet.addClass('sx_hidden');
            }

            formElement=dialogElement.find('form.sx_dialog_box');



            if(options['input']!==false){
                inputElement=document.createElement('input');
                inputElement.setAttribute('type',options['input']['type']);
                inputElement.setAttribute('placeholder',options['input']['placeholder']);
                inputElement.setAttribute('value',options['input']['value']);
                inputElement.setAttribute('autocomplete','off');
                inputElement.setAttribute('spellcheck','false');

                dialogElement.find('.sx_dialog_input').html('<span class="sx_textbox"></span>');
                dialogElement.find('.sx_dialog_input .sx_textbox').appendChild(inputElement);
                inputElement.focus();
                
            }

            let formSubmitEventAdded=false;
            if(options['buttons']!==false){
                for(let i=0,j=options['buttons'].length;i<j;i++){
                    let button=options['buttons'][i];
                    let buttonElement=SX(document.createElement('button'));
                    buttonElement.setAttribute('type',button['type']);
                    buttonElement.addClass('sx_button');
                    buttonElement.html('<span>'+button['text']+'</span>');

                    if(typeof button['callback']==='function'){
                        if(button['type']==='submit'){
                            formSubmitEventAdded=true;
                            formElement.addEventListener('submit',(function(dialog,inputElement,callback,e){
                                e.preventDefault();
                                callback.call(dialog,inputElement ? inputElement.value : '');
                            }).bind(formElement[0],dialog,inputElement,button['callback']),false);
                        }else{
                            buttonElement.addEventListener('click',(function(dialog,inputElement,callback,e){
                                callback.call(dialog,inputElement ? inputElement.value : '');
                            }).bind(buttonElement,dialog,inputElement,button['callback']),false);
                        }
                    }
                    buttonElement.appendTo(dialogElement.find('.sx_dialog_command'));
                }
            }

            if(!formSubmitEventAdded){
                formElement.addEventListener('submit',function(e){
                    e.preventDefault();
                },false);
            }
        };

        let destroy=function(){
            if(!dialogElement){return;}
            dialogElement.remove();
            dialogElement=null;
            containerElement=null;
            formElement=null;
        };

        this.hide=async function(){
            if(!dialogElement){return;}
            dialogElement.removeClass('sx_visible').addClass('sx_invisible');
            setTimeout((function(destroy){
                destroy();
            }).bind(this,destroy),200);
            await SX.sleep(200);
        };

        this.show=async function(){
            destroy();
            init();
            dialogElement.addClass('sx_visible');
            await SX.sleep(200);
        };

        init();
    };
    Object.defineProperty(SXDialog.prototype,Symbol.toStringTag,{
        get:function(){
            return "SXDialog";
        }
    });

    SX.Library.add('Dialog',SXDialog);
    
    SX.alert=async function(message){
        return new Promise(function(resolve,reject){
            new SX.Library.Dialog({
                closable:false,
                title:'Alert',
                message:typeof message === 'string' ? message : '',
                buttons:[
                    {
                        text:'Ok',
                        type:'button',
                        callback:function(value){
                            this.hide();
                            resolve();
                        }
                    }
                ]
            });
        });
    };
    
    SX.confirm=async function(message){
        return new Promise(function(resolve,reject){
            new SX.Library.Dialog({
                closable:false,
                message:typeof message === 'string' ? message : 'Vui lòng xác nhận',
                buttons:[
                    {
                        text:'Yes',
                        type:'button',
                        callback:function(value){
                            this.hide();
                            resolve(true);
                        }
                    },
                    {
                        text:'No',
                        type:'button',
                        callback:function(value){
                            this.hide();
                            resolve(false);
                        }
                    }
                ]
            });
        });
    };

    SX.prompt=async function(message,placeholder,type){
        return new Promise(function(resolve,reject){
            new SX.Library.Dialog({
                closable:false,
                message:typeof message === 'string' ? message : 'Enter something:',
                input:{
                    type:typeof type === 'string' ? type : 'text',
                    placeholder:typeof placeholder==='string' ? placeholder : ''

                },
                buttons:[
                    {
                        text:'Ok',
                        type:'submit',
                        callback:function(value){
                            this.hide();
                            resolve(value);
                        }
                    }
                ]
            });
        });
    };
    
})();

(function(){
    let SXTemp=function SXTemp(){
        let data={};
        this.get=function(key){
            if(typeof key !== 'string'){return null;}
            key=key.trim();if(key===''){return null;}
            return data[key]!==undefined ? data[key] : null;
        };
        this.set=function(key,value){
            if(typeof key !== 'string'){return /*false*/this;}
            key=key.trim();if(key===''){return /*false*/this;}
            
            if(value===undefined){return /*false*/this;}
            data[key]=value;
            return this;
        };
        this.remove=function(listKey){
            return this.delete(listKey);
        };
        this.delete=function(listKey){
            if(typeof listKey === 'string'){listKey=[listKey];}
            if(!(listKey instanceof Array)){return /*false*/this;}
            for(let i=0,j=listKey.length;i<j;i++){
                let key=listKey[i];
                key=key.trim();if(key===''){continue;}
                delete data[key];
            }
            return this;
        };
        this.clear=function(){
            data={};
            return this;
        };
    };
    
    Object.defineProperty(SXTemp.prototype,Symbol.toStringTag,{
        get:function(){
            return "SXTemp";
        }
    });

    SX.add('Temp',new SXTemp());
})();

(function(){
    let SXConfig=function SXConfig(){
        let configData={};
        let loadFromHTMLAttribute=function(){        
            let htmlTag=document.querySelector('html');
            let listAttribute=htmlTag.dataset;
            for(let attribute_name in listAttribute){
                if(!/^(sx)/.test(attribute_name)){continue;}
                let attribute_value=listAttribute[attribute_name];
                configData[attribute_name.toLowerCase().replace(/^(sx)/,'')]=attribute_value;
            }
        };
        loadFromHTMLAttribute();
        this.set=function(config){
            if(Object.prototype.toString.call(config)!=='[object Object]'){
                return false;
            }
            for(let key in config){
                let realKey=key.toLowerCase().replace(/([\-\_]+)/g,'');
                configData[realKey]=config[key];
            }
        };
        this.get=function(key){
            if(typeof key!=='string'){return false;}
            key=key.trim();if(key===''){return null;}
            key=key.toLowerCase().replace(/([\-\_]+)/g,'');
            return configData[key] !== undefined ? configData[key] : null;
        };
    };
    Object.defineProperty(SXConfig.prototype,Symbol.toStringTag,{
        get:function(){
            return "SXConfig";
        }
    });

    SX.add('Config',new SXConfig());
})();


(function(){
    let SXStorage=function SXStorage(){
        this.set=function(keyOrListKey,value){
            if(typeof keyOrListKey==='string'){
                keyOrListKey=keyOrListKey.trim();
                if(keyOrListKey===''){return false;}
                localStorage.setItem(keyOrListKey,JSON.stringify(value));
                return this;
            }else if(Object.prototype.toString.call(keyOrListKey)==='[object Object]'){
                for(let key in keyOrListKey){
                    localStorage.setItem(key,JSON.stringify(keyOrListKey[key]));
                }
                return this;
            }else{
                return this;
            }
        };

        this.get=function(key){
            if(typeof key!=='string'){return null;}
            key=key.trim();
            if(key===''){return null;}
            let value=localStorage.getItem(key);

            try{
                return JSON.parse(value);
            }catch(e){
                return value;
            }
        };

        this.remove=function(listKey){
            return this.delete(listKey);
        };

        this.delete=function(listKey){
            if(typeof listKey === 'string'){listKey=[listKey];}
            if(!(listKey instanceof Array)){return false;}
            for(let i=0,j=listKey.length;i<j;i++){
                let key=listKey[i];
                key=key.trim();if(key===''){continue;}
                localStorage.removeItem(key);
            }
            return this;
        };

        this.clear=function(){
            localStorage.clear();
            return this;
        };
    };

    SX.add('Storage',new SXStorage());
})();

(function(){
    let SXSession=function SXSession(){
        this.set=function(keyOrListKey,value){
            if(typeof keyOrListKey==='string'){
                keyOrListKey=keyOrListKey.trim();
                if(keyOrListKey===''){return false;}
                sessionStorage.setItem(keyOrListKey,JSON.stringify(value));
                return this;
            }else if(Object.prototype.toString.call(keyOrListKey)==='[object Object]'){
                for(let key in keyOrListKey){
                    sessionStorage.setItem(key,JSON.stringify(keyOrListKey[key]));
                }
                return this;
            }else{
                return this;
            }
        };

        this.get=function(key){
            if(typeof key!=='string'){return null;}
            key=key.trim();
            if(key===''){return null;}
            let value=sessionStorage.getItem(key);

            try{
                return JSON.parse(value);
            }catch(e){
                return value;
            }
        };

        this.remove=function(listKey){
            return this.delete(listKey);
        };

        this.delete=function(listKey){
            if(typeof listKey === 'string'){listKey=[listKey];}
            if(!(listKey instanceof Array)){return false;}
            for(let i=0,j=listKey.length;i<j;i++){
                let key=listKey[i];
                key=key.trim();if(key===''){continue;}
                sessionStorage.removeItem(key);
            }
            return this;
        };

        this.clear=function(){
            sessionStorage.clear();
            return this;
        };
    };

    SX.add('Session',new SXSession());
})();

(function(){
    let SXLoader=function SXLoader(){
        let dialogElement=null;
        let containerElement=null;
        let iElement=null;

        let init=function(){
            dialogElement=SX(document.createElement('div'));
            dialogElement.addClass('sx_dialog sx_loader');
    
            containerElement=SX(document.createElement('div'));
            containerElement.addClass('sx_dialog_container');
    
            iElement=SX(document.createElement('i'));
            iElement.addClass('sx_spinner');
    
            iElement.appendTo(containerElement);
            containerElement.appendTo(dialogElement);
    
            dialogElement.appendTo(document.body);
        };

        let destroy=function(){
            if(!dialogElement){return;}
            dialogElement.remove();
            dialogElement=null;
            containerElement=null;
            iElement=null;
        };

        this.hide=async function(){
            if(!dialogElement){return;}
            dialogElement.removeClass('sx_visible').addClass('sx_invisible');
            setTimeout((function(destroy){
                destroy();
            }).bind(this,destroy),200);
            await SX.sleep(200);
        };

        this.show=async function(){
            destroy();
            init();
            dialogElement.addClass('sx_visible');
            await SX.sleep(200);
        };
    };
    Object.defineProperty(SXLoader.prototype,Symbol.toStringTag,{
        get:function(){
            return "SXLoader";
        }
    });
    
    SX.add('Loader',new SXLoader());
})();

(function(){
    let SXEvent=function SXEvent(){
        let listEvent=new Map();
        let debounceFunction=function(listener,wait){
            let timeout;
            return function(...args){
                clearTimeout(timeout);
                timeout=setTimeout((function(){
                    listener.apply(this,args)
                }).bind(this),wait);
            };
        };
        let throttleFunction=function(listener,wait){
            let inThrottle;
            return function(...args){
                if(!inThrottle){
                    listener.apply(this,args);
                    inThrottle = true;
                    setTimeout(function(){
                        inThrottle=false;
                    },wait);
                }
            };
        };

        this.on=function(element,event,listener,options,eventId){
            if(!(element instanceof HTMLElement) || (typeof event!=='string') || (typeof listener!=='function')){return false;}

            event=event.trim();
            if(event===''){return false;}

            if(Object.prototype.toString.call(options)!=='[object Object]'){
                options=false;
            }

            if(typeof eventId!=='string'){
                eventId='';
            }else{
                eventId=eventId.trim();
            }

            if(!listEvent.has(element)){
                listEvent.set(element,[]);
            }

            listEvent.get(element).push({id:eventId,event:event,listener:listener});
            element.addEventListener(event,listener,options);
            return true;
        };

        this.off=function(element,event,listener){
            if(!(element instanceof HTMLElement) || (typeof event!=='string') || (typeof listener!=='function')){return false;}

            event=event.trim();
            if(event===''){return false;}

            element.removeEventListener(event,listener);

            if(listEvent.has(element)){
                let newListEvent=[];
                for(let i=0,j=listEvent.length;i<j;i++){
                    let e=listEvent[i];
                    if((e.event !== event) || (e.listener !== listener)){
                        newListEvent.push(e);
                    }
                }
                listEvent[element]=newListEvent;
            }
            return true;
        };

        this.offId=function(element,eventId){
            if(!(element instanceof HTMLElement) || (typeof event!=='string') || (typeof listener!=='function')){return false;}

            if(typeof eventId!=='string'){
                eventId='';
            }else{
                eventId=eventId.trim();
            }
            if(eventId===''){return false;}

            if(listEvent.has(element)){
                let newListEvent=[];
                for(let i=0,j=listEvent.length;i<j;i++){
                    let e=listEvent[i];
                    if(e.id === eventId){
                        element.removeEventListener(e.event,e.listener,e.options);
                    }else{
                        newListEvent.push(e);
                    }
                }
                listEvent[element]=newListEvent;
            }
            return true;
        };

        this.offAll=function(element){
            if(!(element instanceof HTMLElement)){return false;}
            if(!listEvent.has(element)){return false;}
            let list=listEvent.get(element);
            list.forEach(function(e){
                element.removeEventListener(e.event,e.listener,e.options);
            });
            listEvent.delete(element);
        };
    };

    Object.defineProperty(SXEvent.prototype,Symbol.toStringTag,{
        get:function(){
            return "SXEvent";
        }
    });
    SX.add('Event',new SXEvent());
})();

(function(){
    let SXNode=function SXNode(listNode,customOptions){
        this.length=0;

        if(Object.prototype.toString.call(customOptions)!=='[object Object]'){
            customOptions={};
        }

        if(typeof listNode==='string'){
            let selector=SX.System.get('selectorEncode')(listNode);
            listNode=document.querySelectorAll(selector);
        }

        for(let index=0,i=0,j=listNode.length;i<j;i++){
            if(listNode[i] instanceof HTMLElement){
                this[index]=listNode[i];
                index++;
                this.length++;
            }else if(listNode[i] instanceof SXNode){
                this[index]=listNode[i][0];
                index++;
                this.length++;
            }
        }

        if(!this.length){
            console.warn('The SX object does not own any elements');
        }

        this.options=new (function(customOptions){
            let options=customOptions;
            this.set=function(customOptions){
                if(Object.prototype.toString.call(customOptions)!=='[object Object]'){
                    customOptions={};
                }
                options=Object.assign(customOptions,options);
            };
        
            this.get=function(key){
                if(typeof key !== 'string'){return null;}
                key=key.trim();if(key===''){return null;}
                return options[key]!==undefined ? options[key] : null;
            };
        })(customOptions);

        
    };
    Object.defineProperty(SXNode.prototype,Symbol.toStringTag,{
        get:function(){
            return "SXNode";
        }
    });
    Object.defineProperty(SX,'Node',{writable:false,configuration:false,value:SXNode});

    SX.Node.prototype.get=function(index){
        index=index!==undefined ? parseInt(index) : 0;
        if(isNaN(index) || index<0){index=0;}
        return new this.constructor((this[index] === undefined) || !(this[index] instanceof HTMLElement) ? [] : [this[index]]);
    };

    SX.Node.prototype.first=function(){
        return this[0] === undefined ? null : new this.constructor([this[0]]);
    };

    SX.Node.prototype.last=function(){
        return this[this.length-1] === undefined ? null : new this.constructor([this[this.length-1]]);
    };
    SX.Node.prototype.forEach=function(callback){
        if(typeof callback!=='function'){return false;}
        for(let i=0,j=this.length;i<j;i++){
            callback.call(this[i]);
        }
        return true;
    };

    SX.Node.prototype.html=function(html){
        if(html===undefined){
            if(this.length!==1){
                return '';
            }
            return this[0].innerHTML;
        }
        if(typeof html.toString!=='function'){return this;}
        html=html.toString();
        for(let i=0,j=this.length;i<j;i++){
            this[i].innerHTML=html;
        }
        return this;
    };

    SX.Node.prototype.text=function(text){
        if(text===undefined){
            if(this.length!==1){
                return '';
            }
            return this[0].innerText;
        }
        if(typeof text.toString!=='function'){return this;}
        text=text.toString();
        
        for(let i=0,j=this.length;i<j;i++){
            this[i].innerText=text;
        }
        return this;
    };

    SX.Node.prototype.val=function(value){
        if(value===undefined){
            if(this.length!==1){
                return '';
            }
            if(!this[i].hasAttribute('value')){return '';}
            return this[0].value;
        }
        
        if(typeof value.toString!=='function'){return this;}
        value=value.toString();
        
        this.value=value;
        return this;
    };

    SX.Node.prototype.clone=function(deep){
        deep=deep!==undefined ? Boolean(deep) : true;
        let listNode=[];
        for(let i=0,j=this.length;i<j;i++){
            listNode.push(this[i].cloneNode(deep));
        }
        return SX(listNode);
    };

    SX.Node.prototype.setClass=function(name){
        if(typeof name!=='string'){return /*false*/this;}
        if(!this.length){return /*false*/this;}

        name=name.split(' ');
        let listClassName=[];
        for(let i=0,j=name.length;i<j;i++){
            let className=name[i].trim();
            if(className && listClassName.indexOf(className) === -1){
                listClassName.push(className);
            }
        }

        listClassName=listClassName.join(' ');

        for(let i=0,j=this.length;i<j;i++){
            this[i].className=listClassName;
        }
        return this;
    };

    SX.Node.prototype.hasClass=function(name){
        if(typeof name!=='string'){return false;}
        if(!this.length){return false;}
        if(!name.length){return false;}
        for(let i=0,j=this.length;i<j;i++){
            if(Object.values(this[i].classList).indexOf(name) === -1){
                return false;
            }
        }
        return true;
    };

    SX.Node.prototype.addClass=function(listClassName){
        if(typeof listClassName ==='object'){
            if(!(listClassName instanceof Array)){return /*false*/this;}
        }else if(typeof listClassName ==='string'){
            listClassName=listClassName.split(' ');
        }else{
            return /*false*/this;
        }
        if(!this.length){return /*false*/this;}

        for(let i=0,j=this.length;i<j;i++){
            for(let m=0,n=listClassName.length;m<n;m++){
                let className=listClassName[m];
                if(typeof className!=='string'){continue;}
                className=className.trim();
                if(className===''){continue;}
                this[i].classList.add(className);
            }
        }
        return this;
    };
    SX.Node.prototype.removeClass=function(listClassName){
        if(typeof listClassName ==='object'){
            if(!(listClassName instanceof Array)){return /*false*/this;}
        }else if(typeof listClassName ==='string'){
            listClassName=listClassName.split(' ');
        }else{
            return /*false*/this;
        }
        if(!this.length){return /*false*/this;}

        for(let i=0,j=this.length;i<j;i++){
            for(let m=0,n=listClassName.length;m<n;m++){
                let className=listClassName[m];
                if(typeof className!=='string'){continue;}
                className=className.trim();
                if(className===''){continue;}
                this[i].classList.remove(className);
            }
        }
        return this;
    };
    SX.Node.prototype.toggleClass=function(listClassName){
        if(typeof listClassName ==='object'){
            if(!(listClassName instanceof Array)){return /*false*/this;}
        }else if(typeof listClassName ==='string'){
            listClassName=listClassName.split(' ');
        }else{
            return /*false*/this;
        }
        if(!this.length){return /*false*/this;}

        for(let i=0,j=this.length;i<j;i++){
            for(let m=0,n=listClassName.length;m<n;m++){
                let className=listClassName[m];
                if(typeof className!=='string'){continue;}
                className=className.trim();
                if(className===''){continue;}
                this[i].classList.toggle(className);
            }
        }
        return this;
    };
    SX.Node.prototype.replaceClass=function(find,replace){
        if(typeof find!=='string'){
            return /*false*/this;
        }
        find=find.trim();
        if(typeof replace!=='string'){
            return /*false*/this;
        }
        replace=replace.trim();

        if((find==='') || (replace==='') || (find===replace)){
            return /*false*/this;
        }

        for(let i=0,j=this.length;i<j;i++){
            this[i].classList.replace(find,replace);
        }
        return this;
    };

    SX.Node.prototype.children=function(selector){
        let listAllNode=[];

        if(typeof selector !== 'string'){return listAllNode;}
        selector=selector.trim().split(',');
        selector=':scope>'+selector.join(',:scope>',selector);

        for(let i=0,j=this.length;i<j;i++){
            let listNode=this[i].querySelectorAll(selector);
            for(let m=0,n=listNode.length;m<n;m++){
                listAllNode.push(listNode[m]);
            }
        }
        return SX(listAllNode);
    };


    SX.Node.prototype.find=function(selector){
        if(typeof selector !== 'string'){return [];}
        let listAllNode=[];
        
        for(let i=0,j=this.length;i<j;i++){
            let listNode=this[i].querySelectorAll(selector);
            for(let m=0,n=listNode.length;m<n;m++){
                listAllNode.push(listNode[m]);
            }
        }
        return SX(listAllNode);
    };

    SX.Node.prototype.parent=function(selector){
        if(typeof selector !== 'string'){return [];}
        let listAllNode=[];
        
        for(let i=0,j=this.length;i<j;i++){
            let parentNode=this[i].closest(selector);
            listAllNode.push(parentNode);
        }
        return SX(listAllNode);
    };

    SX.Node.prototype.hasAttribute=function(name){
        if(typeof name!=='string'){return false;}
        if(!this.length){return false;}
        if(!name.length){return false;}
        for(let i=0,j=this.length;i<j;i++){
            if(this[i].hasAttribute(name)){
                return false;
            }
        }
        return true;
    }

    SX.Node.prototype.setAttribute=function(name,value){
        if(typeof name !== 'string'){return /*false*/this;}
        if(typeof value !== 'string'){return /*false*/this;}
        
        name=name.trim();
        if(name===''){return /*false*/this;}

        value=value.trim();
        
        for(let i=0,j=this.length;i<j;i++){
            try{
                this[i].setAttribute(name,value);
            }catch(e){/* Do nothing */}
        }
        return this;
    };

    SX.Node.prototype.removeAttribute=function(name){
        if(typeof name !== 'string'){return /*false*/this;}

        name=name.trim();
        if(name===''){return /*false*/this;}

        for(let i=0,j=this.length;i<j;i++){
            try{
                this[i].removeAttribute(name);
            }catch(e){/* Do nothing */}
        }
        return this;
    };

    SX.Node.prototype.remove=function(){
        this.forEach(function(){
            this.parentNode.removeChild(this);
        });
        return true;
    };

    SX.Node.prototype.appendChild=function(childNode,clone){
        clone=clone!==undefined ? Boolean(clone) : false;
        let parentNode=this;

        if(typeof childNode==='string'){
            childNode=SX.createElement(childNode);
        }

        if(childNode instanceof Node){
            let frag=document.createDocumentFragment();
            parentNode.forEach(function(){
                if(!clone){
                    frag.appendChild(childNode);
                }else{
                    frag.appendChild(childNode.cloneNode(true));
                }
            });
            this[0].appendChild(frag);
            return this;
        }else if(childNode instanceof SX.Node){
            parentNode.forEach(function(){
                let thisParentNode=this;
                let frag=document.createDocumentFragment();
                childNode.forEach(function(){
                    let thisChildNode=this;
                    if(!clone){
                        frag.appendChild(thisChildNode);
                    }else{
                        frag.appendChild(thisChildNode.cloneNode(true));
                    }
                });
                thisParentNode.appendChild(frag);
            });
            return this;
        }else{
            return /*false*/this;
        }
    }

    SX.Node.prototype.appendTo=function(parentNode,clone){
        clone=clone!==undefined ? Boolean(clone) : false;
        let childNode=this;
        if(parentNode instanceof HTMLElement){
            let frag=document.createDocumentFragment();
            this.forEach(function(){
                if(!clone){
                    frag.appendChild(this);
                }else{
                    frag.appendChild(this.cloneNode(true));
                }
            });
            parentNode.appendChild(frag);
            return this;
        }else if(parentNode instanceof SX.Node){
            parentNode.forEach(function(){
                let thisParentNode=this;
                let frag=document.createDocumentFragment();
                childNode.forEach(function(){
                    let thisChildNode=this;
                    if(!clone){
                        frag.appendChild(thisChildNode);
                    }else{
                        frag.appendChild(thisChildNode.cloneNode(true));
                    }
                });
                thisParentNode.appendChild(frag);
            });
            return this;
        }else{
            return /*false*/this;
        }
    }

    SX.Node.prototype.prependChild=function(childNode,clone){
        clone=clone!==undefined ? Boolean(clone) : false;
        let parentNode=this;

        if(typeof childNode==='string'){
            childNode=SX.createElement(childNode);
        }

        if(childNode instanceof Node){
            parentNode.forEach(function(){
                if(!clone){
                    this.insertBefore(childNode,this.firstChild);
                }else{
                    this.insertBefore(childNode.clone(true),this.firstChild);
                }
            });
            return this;
        }else if(childNode instanceof SX.Node){
            parentNode.forEach(function(){
                let thisParentNode=this;
                let frag=document.createDocumentFragment();
                for(let i=0,j=childNode.length;i<j;i++){
                    let thisChildNode=childNode[i];
                    if(!clone){
                        frag.appendChild(thisChildNode);
                    }else{
                        frag.appendChild(thisChildNode.cloneNode(true));
                    }
                }
                console.log(frag);
                thisParentNode.insertBefore(frag,thisParentNode.firstChild);
            });
            return this;
        }else{
            return /*false*/this;
        }
    }

    SX.Node.prototype.prependTo=function(parentNode,clone){
        clone=clone!==undefined ? Boolean(clone) : false;
        let childNode=this;
        if(parentNode instanceof HTMLElement){
            let frag=document.createDocumentFragment();
            for(let i=0,j=childNode.length;i<j;i++){
                let thisChildNode=childNode[i];
                if(!clone){
                    frag.appendChild(thisChildNode);
                }else{
                    frag.appendChild(thisChildNode.cloneNode(true));
                }
            }
            parentNode.insertBefore(childNode.cloneNode(true),parentNode.firstChild);
            return this;
        }else if(parentNode instanceof SX.Node){
            for(let m=0,n=parentNode.length;m<n;m++){
                let thisParentNode=parentNode[m];
                let frag=document.createDocumentFragment();
                for(let i=0,j=childNode.length;i<j;i++){
                    let thisChildNode=childNode[i];
                    if(!clone){
                        frag.appendChild(thisChildNode);
                    }else{
                        frag.appendChild(thisChildNode.cloneNode(true));
                    }
                }
                thisParentNode.insertBefore(frag,thisParentNode.firstChild);
            }
            return this;
        }else{
            return /*false*/this;
        }
    }

    SX.Node.prototype.hide=function(){
        this.forEach(function(){
            let display=window.getComputedStyle(this).display;
            if(display!=='none'){
                this.setAttribute('data-previous-display',display);
            }
            this.style.display='none';
        });
        return this;
    };

    SX.Node.prototype.show=function(optionalDisplayValue){
        this.forEach(function(){
            let currentDisplay=window.getComputedStyle(this).display;
            let previousDisplay=this.getAttribute('data-previous-display');
            optionalDisplayValue=typeof optionalDisplayValue==='string' ? optionalDisplayValue : null;
            if(currentDisplay!=='none'){
                /* This element is currently show */
                if(optionalDisplayValue!==null){
                    this.setAttribute('data-previous-display',optionalDisplayValue);
                }else{
                    this.setAttribute('data-previous-display',currentDisplay);
                }
            }else{
                /* This element is currently hidden */
                if(optionalDisplayValue!==null){
                    this.setAttribute('data-previous-display',optionalDisplayValue);
                    this.style.display=optionalDisplayValue;
                }else if(previousDisplay){
                    this.setAttribute('data-previous-display',previousDisplay);
                    this.style.display=previousDisplay;
                }else{
                    this.setAttribute('data-previous-display','block');
                    this.style.display='block';
                }
            }
        });
        return this;
    };

    SX.Node.prototype.addEventListener=function(type,listener,options){
        this.forEach(function(){
            this.addEventListener(type,listener,options);
        });
        return this;
    };
    SX.Node.prototype.removeEventListener=function(type,listener,options){
        this.forEach(function(){
            this.removeEventListener(type,listener,options);
        });
        return this;
    };
    SX.Node.prototype.dispatchEvent=function(event){
        this.forEach(function(){
            this.dispatchEvent(event);
        });
        return this;
    };

    SX.Node.prototype.on=function(event,listener,options,eventId){
        for(let i=0;i<this.length;i++){
            SX.Event.on(this[i],event,listener,options,eventId);
        }
        return this;
    };
    SX.Node.prototype.off=function(event,listener){
        for(let i=0;i<this.length;i++){
            SX.Event.off(this[i],event,listener);
        }
        return this;
    };
    SX.Node.prototype.offId=function(eventId){
        for(let i=0;i<this.length;i++){
            SX.Event.off(this[i],eventId);
        }
        return this;
    };

    
})();

(async function(){
    if(window.SXInit!==undefined){
        if(window.SXInit instanceof Array){
            for(let i=0,j=SXInit.length;i<j;i++){
                if(typeof SXInit[i] === 'function'){
                    SXInit[i].call(document);
                }
            }
            delete window.SXInit;
            let SXInitObject=function SXInit(){
                this.push=function(callback){
                    if(typeof callback==='function'){
                        callback.call(document);
                    }
                };
            };
            Object.defineProperty(SXInitObject.prototype,Symbol.toStringTag,{
                get:function(){
                    return "SXInit";
                }
            });
            Object.defineProperty(window,'SXInit',{writable:false,configuration:false,value:new SXInitObject()});
        }
    }
})();

(async function(){
    if(window.SXReady !== undefined){
        if(SXReady instanceof Array){
            for(let i=0,j=SXReady.length;i<j;i++){
                if(typeof SXReady[i] === 'function'){
                    if((document.readyState==='complete') || (document.readyState==='interactive')){
                        SXReady[i].call(document);
                    }else{
                        document.addEventListener('DOMContentLoaded',SXReady[i],{once:true});
                    }
                }
            }
            delete window.SXReady;
            let SXDocumentReadyEvent=function SXDocumentReadyEvent(){
                this.push=function(callback){
                    if(typeof callback==='function'){
                        if((document.readyState==='complete') || (document.readyState==='interactive')){
                            callback.call(document);
                        }else{
                            document.addEventListener('DOMContentLoaded',callback,{once:true});
                        }
                    }
                };
            };
            Object.defineProperty(SXDocumentReadyEvent.prototype,Symbol.toStringTag,{
                get:function(){
                    return "SXDocumentReadyEvent";
                }
            });
            Object.defineProperty(window,'SXReady',{writable:false,configuration:false,value:new SXDocumentReadyEvent()});
        }
    }
})();

(async function(){
    if(window.SXLoaded !== undefined){
        if(SXLoaded instanceof Array){
            for(let i=0,j=SXLoaded.length;i<j;i++){
                if(typeof SXLoaded[i] === 'function'){
                    if(document.readyState==='complete'){
                        SXLoaded[i].call(document);
                    }else{
                        window.addEventListener('load',SXLoaded[i],{once:true});
                    }
                }
            }
            delete window.SXLoaded;
            let SXWindowLoadedEvent=function SXWindowLoadedEvent(){
                this.push=function(callback){
                    if(typeof callback==='function'){
                        if(document.readyState==='complete'){
                            callback.call(document);
                        }else{
                            window.addEventListener('load',callback,{once:true});
                        }
                    }
                };
            };
    
            Object.defineProperty(SXWindowLoadedEvent.prototype,Symbol.toStringTag,{
                get:function(){
                    return "SXWindowLoadedEvent";
                }
            });

            Object.defineProperty(window,'SXLoaded',{writable:false,configuration:false,value:new SXWindowLoadedEvent()});
        }
    }
})();
