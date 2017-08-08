import Ajax from './ajax';
import Emitter from 'tiny-emitter';

class FieldDrop extends Emitter {

  constructor(element,options) {
    super();

    this.element = !element ? null : element;
    this.trigger = null;
    this.ajax = new Ajax;
    this.defaults = {
      url : '',
      selector: 'input[type="file"]',
      eventListener : 'change',
      deleteOptions : {
        htmlText:'Delete'
      }
    };

    // Element
    this.divItems = document.createElement('div');
    this.divProgress = document.createElement('progress');
    this.fieldDrop_content = '.field-drop--content';
    this.fieldDrop_uploads = '.field-drop--uploads';

    if(typeof this.element === 'string') {
      this.element = document.querySelector(this.element);
    }

    if (typeof options === 'object') {
      this.options = Object.assign({}, this.defaults, options);
    } else {
      this.options = this.defaults;
    }

    if (this.element) {
      this.mountTemplate(this.element);
      this.bindEvent();
    }
  }

  createActionDelete(filename,responseServer) {
    this.emit('delete',filename,responseServer);
  }

  createActionSend(files) {
    this.emit('send',files);
  }

  setAttrItem(filename,value) {
    let query = "div[data-name='"+filename+"']",
        item = document.querySelector(query);

    item.setAttribute('data-response',value);
  }

  /**
   * Mounts all HTML inside the element
   * @param  {Element} element
   */
  mountTemplate(element) {

    let divContent  = document.createElement('div'),
        divUpload   = document.createElement('div');

    // Div Contents
    divContent.setAttribute('class',this.fieldDrop_content.replace('.',''));
    divContent.innerHTML = '' +
    '<div class="drag-and-drop-info"><span class="title">Drop files here</span><span class="icon"></span></div>'+
    '<input type="button" id="fake-button" onclick="document.getElementById(\'file-input\').click();" value="Select File ..."> ' +
    '<input type="file" name="file" id="file-input" style="display:none">';

    // Div Uploads
    divUpload.setAttribute('class',this.fieldDrop_uploads.replace('.',''));

    // Div Progress
    this.divProgress.setAttribute('id','upload-progress');
    this.divProgress.setAttribute('min',0);
    this.divProgress.setAttribute('max',100);
    this.divProgress.setAttribute('value',0);
    this.divProgress.setAttribute('class','hide');
    this.divProgress.innerHTML = '0';

    // render
    element.appendChild(divContent);
    element.appendChild(divUpload);
    //element.appendChild(this.divProgress);

    // Get Element
    this.trigger = element.querySelector(this.options.selector);
  }

  EventDelete() {
    let btnDelete = this.element.querySelector('.field-drop--uploads .uploads__item .delete');

    btnDelete.addEventListener('click',(event) => {
      event.preventDefault();

      let item = event.target.parentNode.parentNode.parentNode;
          item.remove();

      let filename = item.getAttribute('data-name'),
          responseServer = item.getAttribute('data-response');

      this.element.querySelector(this.fieldDrop_content).classList.remove('hide');
      this.createActionDelete(filename,responseServer);

    });
  }

  bindEvent() {
    let dragDrop = this.element;

    this.trigger.addEventListener('change',(event) => {
      this.workPhoto(event.target.files);
    });

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
    this.renderPhoto(files);
  }

  renderPhoto(files) {
    let imageType = /image.*/,
        reader = new FileReader(),
        img = new Image(),
        uploads = this.element.querySelector(this.fieldDrop_uploads),
        fileSize = this.humanFileSize(files[0].size),
        self = this;

    this.divItems.setAttribute('class','uploads__item');
    this.divItems.setAttribute('data-name',files[0].name);

    let templateItem = ('' +
    '<div class="item--image"></div>' +
    '<div class="item--info">' +
      '<div class="info--name">' + files[0].name + '</div>' +
      '<div class="info--size">' + fileSize + '</div>' +
      '<div class="info--actions"> ' +
        '<a href="#" class="delete" title="Delete"> ' + this.options.deleteOptions.htmlText + ' </a> ' +
      '</div>' +
    '</div>');

    this.divItems.innerHTML = "";
    this.divItems.innerHTML = templateItem;

    if (files[0].type.match(imageType)) {
      reader.onload = function(e) {
        img.src = reader.result;

        self.divItems.querySelector('.item--image').innerHTML = "";
        self.divItems.querySelector('.item--image').appendChild(img);

        // Uploads
        uploads.appendChild(self.divItems);
        self.EventDelete();
        self.createActionSend(files);
      }
    }
    reader.readAsDataURL(files[0]);
    this.hideContenContainer();

  }

  hideContenContainer() {
    this.element.querySelector(this.fieldDrop_content).classList.add('hide');
  }

  sendFile(formData,cb) {
    let xhr = this.ajax.upload(this.options.url,formData,(res) => {
      cb(res);
    });
  }

  humanFileSize(size) {
    let i = Math.floor( Math.log(size) / Math.log(1024) );
    return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  }

}

module.exports = FieldDrop;
