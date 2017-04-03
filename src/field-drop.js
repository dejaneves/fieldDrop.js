import Ajax from './ajax';

class FieldDrop {

  constructor(container,options) {

    this.containerDragAndDrop = null;
    this.inputFile = null;
    this.ajax = new Ajax;

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
      this.sendFile(event.target.files);
    });
  }

  dragAndDropEvent() {
    let dragDrop = this.containerDragAndDrop;

    dragDrop.addEventListener('dragover', ( event ) => {
      event.stopPropagation();
      event.preventDefault();
    }, false);

    dragDrop.addEventListener('dragenter', function( event ) {
      dragDrop.classList.add('dragenter');
    }, false);

    dragDrop.addEventListener('dragleave', function( event ) {
      dragDrop.classList.remove('dragenter');
    }, false);

    dragDrop.addEventListener('drop', ( event ) => {
      event.stopPropagation();
      event.preventDefault();

      let dataFile = event.dataTransfer.files;
      this.sendFile(dataFile);

    }, false);
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
