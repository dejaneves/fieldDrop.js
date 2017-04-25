import Ajax from './ajax';

class FieldDrop {

  constructor(container,options) {

    this.DragAndDrop = null;
    this.trigger = null;
    this.ajax = new Ajax;
    this.defaults = {
      urlUpload : '',
      selector: 'input[type="file"]',
      eventListener: 'change'
    };

    // Element Class
    this.classImageContainer    = '.drag-and-drop__image';
    this.classImageBody         = '.drag-and-drop__image__body';
    this.classContentContainer  = '.drag-and-drop__content';
    this.classContainerUploads  = '.drag-and-drop__uploads';

    if(!container) {
      throw new Error('error');
    }

    if(typeof container == 'string') {
      this.DragAndDrop = document.querySelector(container);
    }

    if (typeof options === 'object') {
      this.defaults = Object.assign({}, this.defaults, options)
    }

    this.trigger = this.DragAndDrop.querySelector(this.defaults.selector);
    this.init();

  }

  init() {
    this.dragAndDropEvent();
    this.bindEvent();
  }

  bindEvent() {
    let containerDragAndDrop = this.DragAndDrop,
        btnDelete = this.DragAndDrop.querySelector('.uploads-item__actions');

    this.trigger.addEventListener('change',(event) => {
      this.workPhoto(event.target.files);
    });

    btnDelete.addEventListener('click',(event) => {
      event.preventDefault();
      let el = event.target;
      el.parentNode.parentNode.querySelector('.uploads-item__file--name').innerHTML = '';
      el.parentNode.parentNode.querySelector('.uploads-item__file--info').innerHTML = '';
      el.parentNode.parentNode.querySelector('.uploads-item__actions').innerHTML = '';
      containerDragAndDrop.querySelector(this.classImageContainer).querySelector('img').remove();
    });
  }

  dragAndDropEvent() {
    let dragDrop = this.DragAndDrop;

    dragDrop.addEventListener('dragover', ( event ) => {
      event.stopPropagation();
      event.preventDefault();
      dragDrop.classList.add('selected-area');
    }, false);

    dragDrop.addEventListener('dragleave', ( event ) => {
      dragDrop.classList.remove('selected-area');
    }, false);

    dragDrop.addEventListener('drop', ( event ) => {
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
        imageContainer = this.DragAndDrop.querySelector(this.classImageContainer),
        imageBody = this.DragAndDrop.querySelector(this.classImageBody),
        containerUploads = this.DragAndDrop.querySelector(this.classContainerUploads),
        fileSize = this.humanFileSize(file.size);

    if (file.type.match(imageType)) {
      reader.onload = function(e) {
        img.src = reader.result;
        imageBody.innerHTML = "";
        imageBody.appendChild(img);
        // Uploads
        containerUploads.querySelector('.uploads-item__file--name').innerHTML = file.name;
        containerUploads.querySelector('.uploads-item__file--info').innerHTML = fileSize;
        containerUploads.setAttribute('id',file.name);
      }
    }
    reader.readAsDataURL(file);
    this.hideContenContainer();
  }

  hideContenContainer() {
    this.DragAndDrop.querySelector(this.classContentContainer).classList.add('hide');
  }

  sendFile(files) {
    let formData = new FormData(),
        progress = document.querySelector('progress');

    formData.append("file", files[0]);

    var xhr = this.ajax.postUpload(this.defaults.urlUpload,formData,(res) => {
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
