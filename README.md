# FieldDrop.js

[![BCH compliance](https://bettercodehub.com/edge/badge/dejaneves/fieldDrop.js?branch=master)](https://bettercodehub.com/)

**FieldDrop.js** is an JavaScript library that provides files upload.

## Install

### Bower

```
bower install fieldDrop.js --save
```
### NPM

```
npm install field-drop.js --save
```

## Usage

First, include the script located on the `dist` folder.

```html
<script src="dist/field-drop.min.js"></script>
```

## Examples

### Basic Input File

```html
<progress value="" max=""></progress>
<input type="file" multiple>
<button type="button">Send</button>
```

```javascript

// Instance FieldDrop
var fieldDrop = new FieldDrop('',{ url:'/uploads'}),
    formData  = new FormData();

document.querySelector('input[type="file"]')
  .addEventListener('change',function() {
    event.preventDefault();
    var files = event.target.files;

    for (var i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }
},false);

document.querySelector('button[type="button"]')
  .addEventListener('click',function(event) {
    fieldDrop.sendFile(formData).then(function(res){
      var data = JSON.parse(res);
      console.log(data);
    });
},false);

```


## License

[MIT License](http://jaimeneves.mit-license.org/) © Jaime Neves
