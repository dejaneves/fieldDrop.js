# FieldDrop.js

[![BCH compliance](https://bettercodehub.com/edge/badge/dejaneves/fieldDrop.js?branch=master)](https://bettercodehub.com/)

**FieldDrop.js** is an JavaScript library that provides drag and drop file uploads with image previews

## Usage

First, include the script located on the `dist` folder.

```html
<script src="dist/field-drop.min.js"></script>
```

## Examples

### Input File Basic

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
