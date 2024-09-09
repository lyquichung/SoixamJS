# SoixamJS
**SoixamJS** is a lightweight, open-source JavaScript library created by Lý Quí Chung. SoixamJS simplifies DOM element manipulation and makes website layout building more straightforward.

## Introducing

In recent years, new libraries and frameworks have emerged more frequently, offering many notable benefits. However, they have also caused inconvenience for developers who must constantly learn to use new tools to avoid becoming outdated. I, too, have tried to keep up with the times by updating my knowledge. But over time, I realized that chasing after these new trends doesn't provide significant personal benefits beyond consuming time and effort.

That's why I decided to create SoixamJS – a simple, easy-to-use, and flexible JavaScript library. SoixamJS doesn't compete with anyone; it simply follows its own path. It provides basic but effective tools, allowing developers to get the job done without relying on heavy, complicated tools.

Let's stop making web development a burden or a nightmare. Let's bring back the simplicity and purity this work once had, so that everyone can enjoy the process of coding without worrying about someone out there trying to make things more complicated.

SoixamJS is certainly not the mainstream choice for everyone. But I believe it will be useful for those looking for a small, complete, and easy-to-use library. I hope that those who find value in SoixamJS will join me in making it even better.

## Download

**[SoixamJS.js](https://raw.githubusercontent.com/lyquichung/SoixamJS/main/SoixamJS.js)**.


## Installation guide
SoixamJS is a DOM library (similar to jQuery) that includes features such as Loader, Dialog, and more. These features require CSS to function properly. Therefore, if you don't need to use these functionalities, you can simply include SoixamJS.js. Otherwise, add SoixamJS.css above it in your HTML file.

```html
<head>
<!-- Code -->
<script src="path/to/SoixamJS.js" async></script>
<script>
SXInit=window.SXInit || [],SXReady=window.SXReady || [],SXLoaded=window.SXLoaded || [];
</script>
<!-- Code -->
</head>
```

```html
<head>
<!-- Code -->
<link href='path/to/SoixamJS.css' type='text/css' rel='stylesheet'/>
<script src='path/to/SoixamJS.js' async></script>
<script>
SXInit=window.SXInit || [],SXReady=window.SXReady || [],SXLoaded=window.SXLoaded || [];
</script>
<!-- Code -->
</head>
```

## Getting Started

SoixamJS provides three execution points for running code:
- **SXInit**: When SoixamJS is successfully loaded
- **SXReady**: When the DOM document is ready
- **SXLoaded**: When the entire page is fully loaded

To execute code at a specific timing, use the `push()` method on the corresponding timing object:

```javascript
SXInit.push(function(e){
    console.log('SoixamJS Loaded');
});
SXReady.push(function(e){
    console.log('Document Ready');
});
SXLoaded.push(function(e){
    console.log('Page Loaded');
});
```

## Structure
The SoixamJS library is defined by the SX variable, which includes the following components:

### SX(selector) or SX.Node(selector)
A function to initialize an SXNode object in a concise manner by using the syntax: new SX.Node(string selector). SX itself is also an object, containing its own set of methods and functions.
Example: Adding a <span> with content "World" at the end and a <span> with content "Hello" at the beginning of the <body> tag.

```javascript
SXReady.push(function(){
    SX('body').appendChild('<span>World</span>').prependChild('<span>Hello</span><span>World</span>');
    /*Output: <body><span>Hello</span><span>World</span></body>*/
});
```
### SX.Library
SX.Library is used to store classes
Example: Creating an Alert Box by instantiating an SX.Library.Dialog object.
```javascript
SXReady.push(function(){
    new SX.Library.Dialog({
        closable:false,
        title:'Alert',
        message:'This is an Alert Box created using SX.Library.Dialog.',
        buttons:[
            {
                text:'Ok',
                type:'button',
                callback:function(){
                    console.log('Your choice: OK'); 
                    this.hide();
                }
            }
        ]
    });
});
```

Example: Creating an Confirmation Box by instantiating an SX.Library.Dialog object.
```javascript
new SX.Library.Dialog({
    closable:false,
    message:'Please confirm',
    buttons:[
        {
            text:'Yes',
            type:'button',
            callback:function(){
                console.log('Your choice: Yes'); 
                this.hide();
            }
        },
        {
            text:'No',
            type:'button',
            callback:function(){
                console.log('Your choice: No'); 
                this.hide();
            }
        }
    ]
});
```

Example: Creating an Prompt Box by instantiating an SX.Library.Dialog object.
```javascript
new SX.Library.Dialog({
    closable:false,
    message:'Enter your password',
    input:{
        type:'password',
        placeholder:'Your password here'
    },
    buttons:[
        {
            text:'Submit',
            type:'button',
            callback:function(value){
                console.log('Your password: '+value);
                this.hide();
            }
        }
    ]
});
```

In this example, you'll notice that after entering the password into the input field and pressing the Enter key, nothing happens. This is because the type of the "Submit" button is set to "button". You simply need to change it to "submit".
```javascript
new SX.Library.Dialog({
    closable:false,
    message:'Enter your password',
    input:{
        type:'password',
        placeholder:'Your password here'
    },
    buttons:[
        {
            text:'Submit',
            type:'submit',
            callback:function(value){
                console.log('Your password: '+value);
                this.hide();
            }
        }
    ]
});
```
You can also add your custom classes to SX.Library by using the SX.Library.add() method (supports function data types only):
```javascript
SX.Library.add('GetSetClass',function(){
    this.data={};
    this.get=function(name){
        return (typeof name === 'string') && this.data[name] !== undefined ? this.data[name] : null;
    };
    this.set=function(name,value){
        if(typeof name!=='string'){return false;}
        this.data[name]=value;
    }
});

let obj=new SX.Library.GetSetClass();
obj.set('message','Hello World!');
console.log(obj.get('message'));
```

### SX.Config
SX.Config is used to store configuration variables (supports all data types for values).
The SX.Config object extracts and stores configuration values from attributes with the prefix "data-sx-" in the <html> tag. You can use the SX.Config.get(string) method to retrieve stored configuration values. Additionally, you can override configuration values by using the SX.Config.set(object) method.
```javascript
<!doctype html>
<html lang='en' data-sx-csrf-token='0000000000'>
<head>
    <script src='SoixamJS.js' async></script>
    <script>
    SXInit=window.SXInit || [],SXReady=window.SXReady || [],SXLoaded=window.SXLoaded || [];
    </script>
    <script>
    SXReady.push(function(){
        console.log(SX.Config.get('csrf-token'));
        /* Output: 0000000000 */
        SX.Config.set({
            'csrf-token':'9999999999',
            'hello':'world'
        });
        console.log(SX.Config.get('csrf-token'));
        /* Output: 9999999999 */
        console.log(SX.Config.get('hello'));
        /* Output: world */
    });
    </script>
</head>
<body></body>
</html>
```

### SX.Temp
SX.Config is used to store temporary data in a key-value format (supports all data types for values)
```javascript
SX.Temp.set('mode','dark');
console.log(SX.Temp.get('mode'))
/* Output: dark */
```

### SX.System
Operates similarly to SX.Temp, but the data stored in SX.System is hidden (even when using Developer Tools in the browser). It can only be accessed if you know the key name.
```javascript
SX.System.add('secretFunc',function(){
    return 'SecretKey';
});
console.log(SX.System.get('secretFunc')());
/* Output: SecretKey */
```

### SX.Loader 
This is the most distinct object compared to all the objects listed above. This object is created by the anonymous SXLoader class and is used to display a loading screen while processing is not yet complete.
The usage is simple, with just two functions: show() and hide().
```javascript
(async function(){
    await SX.Loader.show();
    await SX.sleep(5000);
    await SX.Loader.hide();
})();
```

### SX.Storage
SX.Storage provides a simple interface to interact with the browser's localStorage, allowing you to store, retrieve, and manage persistent data
```javascript
(async function(){
    SX.Storage.set('username','JohnDoe').set({
        'user_id': 123,
        'theme': 'dark'
    });

    let username = SX.Storage.get('username');
    console.log(username); /* Outputs: 'JohnDoe' */

    /* Deletes the specified key from localStorage */
    SX.Storage.remove('username');
    
    /* Clears all data from localStorage */
    SX.Storage.clear();
})();
```

### SX.Session 
SX.Session provides a similar interface to SX.Storage, but interacts with the browser's sessionStorage, which stores data for the duration of the page session
```javascript
(async function(){
SX.Session.set('username','JohnDoe').set({
'user_id': 123,
'theme': 'dark'
});

let username = SX.Session.get('username');
console.log(username); /* Outputs: 'JohnDoe' */

/* Deletes the specified key from sessionStorage */
SX.Session.remove('username');

/* Clears all data from sessionStorage */
SX.Session.clear();
})();
```

### SX Functions
Some pre-written functions are designed to handle data processing more effectively, making tasks quicker and easier:

- SX.add(string name,string obj):void: Create custom objects in SX. Objects like SX.Node, SX.Library, SX.Config, SX.Temp, and SX.System are created using this method
- SX.createElement(string html):SXNode: Create an SXNode from HTML code
- SX.invert():void: Switch between dark and light modes by inverting the colors of the entire page using CSS [Demo]
- SX.range(number min, number max):Array: Create an array of numbers from min to max
- SX.rand(int min, int max):Number: Generate a random number between min to max, inclusive of both min and max
- SX.randFloat(float min, float max):Number: Generate a random decimal number between min to max, inclusive of both min and max
- SX.randText(int length):String: Generate a random string with a user-defined length
- SX.shuffle(array data,string seed):Array: Shuffle the order of an array with an optional seed
- SX.sleep(int miliseconds):Promise: Wait for user-defined miliseconds
- SX.hash(string algo,string str):Promise: Generate a hash string for the input string "str" using the "algo" algorithm.
- SX.chance(float percent):Boolean: Return true if there is a "percent"% chance of occurring; otherwise, return false (Note: The result will vary each time the function is called)
- SX.ajax(object options):Promise: Create an AJAX request based on the provided "options" parameters. You can pass data into options.data as either FormData or Object. If the data type of options.data is Object, the SX.ajax() function will send the request with the header Content-Type: application/json.
```javascript
/* Send a GET request to the current URL */
let response=await SX.ajax({});

/* Send a request based on the provided options parameters */
let response=await SX.ajax({
    url:'/api/user/add',
    method:'POST',
    header:{
        'CSRF-Key':'123456789'
    },
    data:{
        'username':'test',
        'password':'123456789'
    },
    progress:function(default_progress_event,percent){
        console.log('Progressing: '+percent+'%');
    }
});
```
Additionally, SX provides several functions to simplify the use of the SX.Library.Dialog:
- SX.alert(string message):Promise Displays an Alert Box with the content specified by the message parameter
```javascript
(async function(){
    await SX.alert('This is a alert box!');
    console.log('Closed');
})();
```
- SX.confirm(string message):Promise Displays a Confirmation Box with the content specified by the message parameter
```javascript
(async function(){
let choose=await SX.confirm('Please choose Yes or No');
console.log('Your choose: '+choose);
})();
```
SX.prompt(string message):Promise Displays a Prompt Box with the content specified by the message parameter
```javascript
(async function(){
    let name=await SX.prompt('Please enter your name:');
    console.log('Your name is: '+name);
})();
```

### SXNode Prototype Function
Here is how to use some methods for the SXNode object:
```javascript
/* Select all elements using selectors (In this case, span elements with class 'sx') */
let listSpan=SX('span.sx');

/* Get the number of elements found */
let spanCount=SX('span.sx').length;

/* Get the first SXNode */
let node=SX('span.sx').first();

/* Get the last SXNode */
let node=SX('span.sx').last();

/* Get the 10th SXNode (index 9) */
let node=SX('span.sx').get(9);

/* Get the first original Element */
let originalElement=SX('span.sx')[0];
let originalElement=SX('span.sx').first()[0];

/* Get the last original Element */
let originalElement=SX('span.sx').last()[0];

/* Create an SXNode from HTML code */
let node=SX('HelloWorld');

/* Show SXNode */
/*
The show(optionalDisplayValue) method makes an element visible again by restoring its previous display value or setting a new one.
This will display the element by setting its display value to the previously saved one, or default to "block" if no previous value was stored.
*/
node.show();
/* 
With optional display value:
This sets the element's display to the specified value ('inline-block' in this case) and saves it for future use.
*/
node.show('inline-block');

/* Hide SXNode */
/* 
The hide() method hides the element by setting its display to "none" and saves its current display value to restore later.
This will hide the element by setting its display to "none", while saving its current display value for future restoration when show() is called.
*/
node.hide();

/* Add classes to the SXNode */
node.addClass('class_1 class_2 class_3 class_4 class_5');

/* Toggle classes to the SXNode */
node.toggle('class_1 class_2 class_3 class_4 class_5');

/* Remove classes from the SXNode */
node.removeClass('class_1 class_5');

/* Add attributes to the SXNode */
node.setAttribute('custom-attribute-1','custom-value-1');
node.setAttribute('custom-attribute-2','custom-value-2');

/* Remove an attribute from the SXNode */
node.removeAttribute('custom-attribute-1');

/* Append the created SXNode to the end of the body tag */
node.appendTo(SX('body'));

/* Prepend the created SXNode to the beginning of the body tag */
node.prependTo(SX('body'));

/* Copy the created SXNode to the end of the body tag */
node.prependTo(SX('body'),true);

/* Add Event */
let clickFunction=function(){
    alert('Clicked!');
};
SX('a').on('click',clickFunction,false,'optionalEventId');

/* Remove Event */
SX('a').off('click',clickFunction);

/* or Remove by Event Id */
SX('a').offId('optionalEventId');
```

## CSS Framework
SoixamJS is not a CSS framework. While JavaScript alone may not be sufficient for complete web development, using a large CSS framework like Bootstrap might be overkill for some projects. Instead, SoixamJS offers a modest set of essential CSS, including a 12-column grid system similar to Bootstrap, along with a few useful components such as Loader, Dialog, and Controls.

```html
<div class='sx_container_full'>
    <div class='sx_row'>
        <div class='sx_column sx_column_xxl_1 sx_column_xl_2 sx_column_l_3 sx_column_m_4 sx_column_s_6' style='background:#D2691E'> </div>
        <div class='sx_column sx_column_xxl_1 sx_column_xl_2 sx_column_l_3 sx_column_m_4 sx_column_s_6' style='background:#A52A2A'> </div>
        <div class='sx_column sx_column_xxl_1 sx_column_xl_2 sx_column_l_3 sx_column_m_4 sx_column_s_6' style='background:#8A2BE2'> </div>
        <div class='sx_column sx_column_xxl_1 sx_column_xl_2 sx_column_l_3 sx_column_m_4 sx_column_s_6' style='background:#FFD700'> </div>
        <div class='sx_column sx_column_xxl_1 sx_column_xl_2 sx_column_l_3 sx_column_m_4 sx_column_s_6' style='background:#008000'> </div>
        <div class='sx_column sx_column_xxl_1 sx_column_xl_2 sx_column_l_3 sx_column_m_4 sx_column_s_6' style='background:#FF69B4'> </div>
        <div class='sx_column sx_column_xxl_1 sx_column_xl_2 sx_column_l_3 sx_column_m_4 sx_column_s_6' style='background:#CD5C5C'> </div>
        <div class='sx_column sx_column_xxl_1 sx_column_xl_2 sx_column_l_3 sx_column_m_4 sx_column_s_6' style='background:#4B0082'> </div>
        <div class='sx_column sx_column_xxl_1 sx_column_xl_2 sx_column_l_3 sx_column_m_4 sx_column_s_6' style='background:#FF00FF'> </div>
        <div class='sx_column sx_column_xxl_1 sx_column_xl_2 sx_column_l_3 sx_column_m_4 sx_column_s_6' style='background:#00BFFF'> </div>
        <div class='sx_column sx_column_xxl_1 sx_column_xl_2 sx_column_l_3 sx_column_m_4 sx_column_s_6' style='background:#2F4F4F'> </div>
        <div class='sx_column sx_column_xxl_1 sx_column_xl_2 sx_column_l_3 sx_column_m_4 sx_column_s_6' style='background:#FF8C00'> </div>
    </div>
</div>
```

## License

SoixamJS is licensed under the **[GNU General Public License (GPL)](https://www.gnu.org/licenses/gpl-3.0.html)**.
