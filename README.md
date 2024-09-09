# SoixamJS

**SoixamJS** is a lightweight, open-source JavaScript library created by Lý Quí Chung. It simplifies DOM element manipulation and makes website layout building easier. SoixamJS takes a simple yet effective approach, without following modern trends, but focusing on practicality.

## Features

- Easy DOM manipulation (similar to jQuery)
- Supports features like Loader and Dialog
- Includes a 12-column CSS Grid system
- Lightweight and easy to use, suitable for various projects

## Installation

You can include SoixamJS directly in your HTML file:

```html
<head>
    <script src="path/to/SoixamJS.js" async></script>
</head>
```

If you're using features that require CSS (such as Loader or Dialog), add `SoixamJS.css` as well:

```html
<head>
    <link href="path/to/SoixamJS.css" type="text/css" rel="stylesheet"/>
    <script src="path/to/SoixamJS.js" async></script>
</head>
```

## Getting Started

SoixamJS provides three execution points for running code:
- **SXInit**: When SoixamJS is successfully loaded
- **SXReady**: When the DOM document is ready
- **SXLoaded**: When the entire page is fully loaded

To execute code at a specific timing, use the `push()` method on the corresponding timing object:

```javascript
SXInit.push(function(){
    console.log('SoixamJS Loaded');
});
SXReady.push(function(){
    console.log('Document Ready');
});
SXLoaded.push(function(){
    console.log('Page Loaded');
});
```

## Example

Here's an example of how to use SoixamJS to manipulate the DOM:

```javascript
SXReady.push(function(){
    SX('body').appendChild('<span>World</span>').prependChild('<span>Hello</span><span>World</span>');
    console.log(SX('span'));
});
```

## License

SoixamJS is licensed under the **[GNU General Public License (GPL)](https://www.gnu.org/licenses/gpl-3.0.html)**.
