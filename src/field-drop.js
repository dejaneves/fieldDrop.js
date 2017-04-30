import Ajax from './ajax';

class FieldDrop {

  constructor(element,options) {

    this.element = element;
    this.trigger = null;
    this.ajax = new Ajax;
    this.defaults = {
      url : '',
      selector: 'input[type="file"]',
      eventListener: 'change'
    };

    // Element Class
    this.fieldDrop_content    = '.field-drop--content';
    this.fieldDrop_uploads    = '.field-drop--uploads';

    if(!this.element) {
      throw new Error('error');
    }

    if(typeof this.element === 'string') {
      this.element = document.querySelector(this.element);
    }

    if (typeof options === 'object') {
      this.options = Object.assign({}, this.defaults, options);
    } else {
      this.options = this.defaults;
    }

    console.log(this.options);

    this.init();
  }

  init() {
    this.mountTemplate();
    this.bindEvent();
  }

  mountTemplate() {

    // Div Contents
    let divContent = document.createElement('div');
        divContent.setAttribute('class',this.fieldDrop_content.replace('.',''));

    divContent.innerHTML = '' +
    '<div class="drag-and-drop-info"><span class="title">Drop files here</span><span class="icon"></span></div>'+
    '<input type="button" id="fake-button" onclick="document.getElementById("file-input").click();" value="Select File ..."> ' +
    '<input type="file" name="file" id="file-input" style="display:none">';

    // Div Uploads
    let divUpload = document.createElement('div');
        divUpload.setAttribute('class',this.fieldDrop_uploads.replace('.',''));

    // Div Progress
    let divProgress = document.createElement('progress');
        divProgress.setAttribute('id','upload-progress');
        divProgress.setAttribute('min',0);
        divProgress.setAttribute('max',100);
        divProgress.setAttribute('value',0);
        divProgress.innerHTML = '0';

    // render
    this.element.appendChild(divContent);
    this.element.appendChild(divUpload);
    this.element.appendChild(divProgress);

    // Get Element
    this.trigger = this.element.querySelector(this.options.selector);
  }

  actionsMovement(filename,type) {
    //let items = this.element.querySelector(this.fieldDrop_uploads).querySelectorAll('.uploads-item');

    // if(filename === items[0].getAttribute('id')) {
    //   if(type === 'show')
    //     items[0].querySelector('.uploads-item__actions .delete').classList.remove('hide')
    //   else if(type === 'hide')
    //     items[0].querySelector('.uploads-item__actions .delete').classList.add('hide')
    // }
  }

  bindEvent() {
    let dragDrop = this.element;
        //actions = this.element.querySelector('.uploads-item__actions'),
        //btnDelete = actions.querySelector('.delete');

    this.trigger.addEventListener('change',(event) => {
      this.workPhoto(event.target.files);
      this.actionsMovement(event.target.files[0].name,'show');
    });

    // btnDelete.addEventListener('click',(event) => {
    //   event.preventDefault();
    //   let el = event.target,
    //       url = this.options.deleteOptions.url.replace(':filename', el.getAttribute('id'));
    //
    //   el.parentNode.parentNode.querySelector('.uploads-item__file--name').innerHTML = '';
    //   el.parentNode.parentNode.querySelector('.uploads-item__file--info').innerHTML = '';
    //   dragDrop.querySelector(this.classImageContainer).querySelector('img').remove();
    //
    //   console.log(el.parentNode.parentNode);
    //
    //
    //   // Send to file deletion
    //   this.ajax.get(url,(res) => {
    //     console.log('res ', res);
    //   });
    //
    // });

    // Events
    // Drag and Drop

    this.element.addEventListener('dragover', ( event ) => {
      event.stopPropagation();
      event.preventDefault();
      dragDrop.classList.add('selected-area');
    }, false);

    this.element.addEventListener('dragenter', ( event ) => {
      event.stopPropagation();
      event.preventDefault();
      dragDrop.classList.add('selected-area');
    }, false);

    this.element.addEventListener('dragend', ( event ) => {
      dragDrop.classList.remove('selected-area');
    }, false);

    this.element.addEventListener('dragleave', ( event ) => {
      dragDrop.classList.remove('selected-area');
    }, false);

    this.element.addEventListener('drop', ( event ) => {
      event.stopPropagation();
      event.preventDefault();
      this.workPhoto(event.dataTransfer.files);
    }, false);

  }

  workPhoto(files) {
    this.renderPhoto(files[0]);
    this.sendFile(files);
  }

  renderPhoto(file) {
    let imageType = /image.*/,
        reader = new FileReader(),
        img = new Image(),
        uploads = this.element.querySelector(this.fieldDrop_uploads),
        fileSize = this.humanFileSize(file.size),
        self = this;

    let divItem = document.createElement('div');
        divItem.setAttribute('class','uploads__item');
        divItem.setAttribute('id',file.name);

    let templateItem = ('' +
        '<div class="item--image"></div>' +
        '<div class="item--info">' +
          '<span class="info--name">' + file.name + '</span>' +
          '<span class="info--size">' + fileSize + '</span>' +
          '<span class="info--actions"> ' +
            '<a href="#" class="delete" title="Delete">Excluir</a> ' +
          '</span>' +
        '</div>');

    divItem.innerHTML = templateItem;

    if (file.type.match(imageType)) {
      reader.onload = function(e) {
        img.src = reader.result;

        divItem.querySelector('.item--image').innerHTML = "";
        divItem.querySelector('.item--image').appendChild(img);

        // Uploads
        uploads.appendChild(divItem);
        self.actionsMovement(file.name,'show');
      }
    }
    reader.readAsDataURL(file);
    this.hideContenContainer();
  }

  hideContenContainer() {
    this.element.querySelector(this.fieldDrop_content).classList.add('hide');
  }

  sendFile(files) {
    let formData = new FormData(),
        progress = document.querySelector('progress');

    formData.append("file", files[0]);

    var xhr = this.ajax.upload(this.options.url,formData,(res) => {
      //let btnDelete = this.element.querySelector('.uploads-item__actions > .delete');
      //btnDelete.setAttribute('id',res);
      return res;
    });

    // readyState will be 3
    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        var complete = (event.loaded / event.total * 100 | 0);
        progress.value = progress.innerHTML = complete;
      }
    };

    // readyState will be 4
    xhr.onload = function() {
      progress.value = progress.innerHTML = 100;
    };

  }

  humanFileSize(size) {
    let i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  }

}

module.exports = FieldDrop;
