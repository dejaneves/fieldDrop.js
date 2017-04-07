import Ajax from './ajax';

class FieldDrop {

  constructor(container,options) {

    this.containerDragAndDrop = null;
    this.inputFile = null;
    this.ajax = new Ajax;
    this.classImageContainer = '.drag-and-drop__image';
    this.classImageBody = '.drag-and-drop__image__body';
    this.classContentContainer = '.drag-and-drop__content';

    this.trigger = {
      selector: 'input[type="file"]',
      eventListener: 'change'
    };

    if(typeof container == 'string') {
      this.containerDragAndDrop = document.querySelector(container);
      this.inputFile = this.containerDragAndDrop.querySelector('input[type="file"]');
    }

    if(!container) {
      throw new Error('error');
    }

    this.trigger.selector = document.querySelector(this.trigger.selector);
    this.init();

  }

  init() {
    this.dragAndDropEvent();
    this.inputFileEvent();
  }

  inputFileEvent(){
    this.inputFile.addEventListener('change',(event) => {
      this.workPhoto(event.target.files);
    });
  }

  dragAndDropEvent() {
    let dragDrop = this.containerDragAndDrop;

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
        imageContainer = this.containerDragAndDrop.querySelector(this.classImageContainer),
        imageBody = this.containerDragAndDrop.querySelector(this.classImageBody);


    if (file.type.match(imageType)) {
      reader.onload = function(e) {
        img.src = reader.result;
        imageBody.innerHTML = "";
        imageBody.appendChild(img);
      }
    }
    reader.readAsDataURL(file);
    this.hideContenContainer();
  }

  hideContenContainer(){
    this.containerDragAndDrop.querySelector(this.classContentContainer).classList.add('hide');
  }

  sendFile(files) {
    let formData = new FormData(),
        progress = document.querySelector('progress');

    formData.append("file", files[0]);

    var xhr = this.ajax.postUpload('/upload',formData,(res) => {
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

}

module.exports = FieldDrop;
