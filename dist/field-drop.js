(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FieldDrop = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ajax = function () {
  function Ajax() {
    _classCallCheck(this, Ajax);
  }

  _createClass(Ajax, [{
    key: 'get',
    value: function get(url, callback) {
      var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
      xhr.open('GET', url);
      xhr.onreadystatechange = function () {
        if (xhr.readyState > 3 && xhr.status === 200) {
          callback(xhr.responseText);
        }
      };
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.send();

      return xhr;
    }
  }, {
    key: 'post',
    value: function post(url, data, callback) {
      var params = typeof data == 'string' ? data : Object.keys(data).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
      }).join('&');

      var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
      xhr.open('POST', url);
      xhr.onreadystatechange = function () {
        if (xhr.readyState > 3 && xhr.status === 200) {
          callback(xhr.responseText);
        }
      };
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(data);

      return xhr;
    }
  }, {
    key: 'upload',
    value: function upload(url, data, callback) {
      var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
          progress = document.querySelector('progress');

      xhr.open('POST', url);

      xhr.onreadystatechange = function () {
        if (xhr.readyState > 3 && xhr.status === 200) {
          callback(xhr.responseText);
        } else {
          callback(xhr);
        }
      };

      xhr.onprogress = function (event) {
        if (event.lengthComputable) {
          var complete = event.loaded / event.total * 100 | 0;
          progress.value = progress.innerHTML = complete;
        }
      };

      xhr.onload = function () {
        progress.value = progress.innerHTML = 100;
      };

      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.send(data);

      return xhr;
    }
  }]);

  return Ajax;
}();

exports.default = Ajax;

},{}],2:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ajax = require('./ajax');

var _ajax2 = _interopRequireDefault(_ajax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FieldDrop = function () {
  function FieldDrop(element, options) {
    _classCallCheck(this, FieldDrop);

    this.element = element;
    this.trigger = null;
    this.ajax = new _ajax2.default();
    this.defaults = {
      url: '',
      selector: 'input[type="file"]',
      eventListener: 'change',
      deleteOptions: {
        htmlText: 'Delete'
      }
    };

    // Element
    this.divItems = document.createElement('div');
    this.divProgress = document.createElement('progress');
    this.fieldDrop_content = '.field-drop--content';
    this.fieldDrop_uploads = '.field-drop--uploads';

    if (!this.element) {
      throw new Error('error');
    }

    if (typeof this.element === 'string') {
      this.element = document.querySelector(this.element);
    }

    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
      this.options = Object.assign({}, this.defaults, options);
    } else {
      this.options = this.defaults;
    }

    this.init();
  }

  _createClass(FieldDrop, [{
    key: 'init',
    value: function init() {
      this.mountTemplate(this.element);
      this.bindEvent();
    }

    /**
     * Mounts all HTML inside the element
     * @param  {Element} element
     */

  }, {
    key: 'mountTemplate',
    value: function mountTemplate(element) {

      var divContent = document.createElement('div'),
          divUpload = document.createElement('div');

      // Div Contents
      divContent.setAttribute('class', this.fieldDrop_content.replace('.', ''));
      divContent.innerHTML = '' + '<div class="drag-and-drop-info"><span class="title">Drop files here</span><span class="icon"></span></div>' + '<input type="button" id="fake-button" onclick="document.getElementById("file-input").click();" value="Select File ..."> ' + '<input type="file" name="file" id="file-input" style="display:none">';

      // Div Uploads
      divUpload.setAttribute('class', this.fieldDrop_uploads.replace('.', ''));

      // Div Progress
      this.divProgress.setAttribute('id', 'upload-progress');
      this.divProgress.setAttribute('min', 0);
      this.divProgress.setAttribute('max', 100);
      this.divProgress.setAttribute('value', 0);
      this.divProgress.setAttribute('class', 'hide');
      this.divProgress.innerHTML = '0';

      // render
      element.appendChild(divContent);
      element.appendChild(divUpload);
      element.appendChild(this.divProgress);

      // Get Element
      this.trigger = element.querySelector(this.options.selector);
    }
  }, {
    key: 'actionsMovement',
    value: function actionsMovement(filename, type) {
      //let items = this.element.querySelector(this.fieldDrop_uploads).querySelectorAll('.uploads-item');

      // if(filename === items[0].getAttribute('id')) {
      //   if(type === 'show')
      //     items[0].querySelector('.uploads-item__actions .delete').classList.remove('hide')
      //   else if(type === 'hide')
      //     items[0].querySelector('.uploads-item__actions .delete').classList.add('hide')
      // }
    }
  }, {
    key: 'bindEvent',
    value: function bindEvent() {
      var _this = this;

      var dragDrop = this.element;
      //actions = this.element.querySelector('.uploads-item__actions'),
      //btnDelete = actions.querySelector('.delete');

      this.trigger.addEventListener('change', function (event) {
        _this.workPhoto(event.target.files);
        _this.actionsMovement(event.target.files[0].name, 'show');
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

      this.element.addEventListener('dragover', function (event) {
        event.stopPropagation();
        event.preventDefault();
        dragDrop.classList.add('selected-area');
      }, false);

      this.element.addEventListener('dragenter', function (event) {
        event.stopPropagation();
        event.preventDefault();
        dragDrop.classList.add('selected-area');
      }, false);

      this.element.addEventListener('dragend', function (event) {
        dragDrop.classList.remove('selected-area');
      }, false);

      this.element.addEventListener('dragleave', function (event) {
        dragDrop.classList.remove('selected-area');
      }, false);

      this.element.addEventListener('drop', function (event) {
        event.stopPropagation();
        event.preventDefault();
        _this.workPhoto(event.dataTransfer.files);
      }, false);
    }
  }, {
    key: 'workPhoto',
    value: function workPhoto(files) {
      this.renderPhoto(files[0]);
      this.sendFile(files);
    }
  }, {
    key: 'renderPhoto',
    value: function renderPhoto(file) {
      var imageType = /image.*/,
          reader = new FileReader(),
          img = new Image(),
          uploads = this.element.querySelector(this.fieldDrop_uploads),
          fileSize = this.humanFileSize(file.size),
          self = this;

      this.divItems.setAttribute('class', 'uploads__item');
      this.divItems.setAttribute('id', file.name);

      var templateItem = '' + '<div class="item--image"></div>' + '<div class="item--info">' + '<div class="info--name">' + file.name + '</div>' + '<div class="info--size">' + fileSize + '</div>' + '<div class="info--actions"> ' + '<a href="#" class="delete" title="Delete"> ' + this.options.deleteOptions.htmlText + ' </a> ' + '</div>' + '</div>';
      this.divItems.innerHTML = "";
      this.divItems.innerHTML = templateItem;

      if (file.type.match(imageType)) {
        reader.onload = function (e) {
          img.src = reader.result;

          self.divItems.querySelector('.item--image').innerHTML = "";
          self.divItems.querySelector('.item--image').appendChild(img);

          // Uploads
          uploads.appendChild(self.divItems);
          self.actionsMovement(file.name, 'show');
        };
      }
      reader.readAsDataURL(file);
      this.hideContenContainer();
    }
  }, {
    key: 'hideContenContainer',
    value: function hideContenContainer() {
      this.element.querySelector(this.fieldDrop_content).classList.add('hide');
    }
  }, {
    key: 'sendFile',
    value: function sendFile(files) {

      var formData = new FormData(),
          self = this;

      formData.append("file", files[0]);
      self.divProgress.classList.remove('hide');

      var xhr = this.ajax.upload(this.options.url, formData, function (res) {
        // let btnDelete = this.element.querySelector('.uploads-item__actions > .delete');
        // btnDelete.setAttribute('id',res);
        console.log(res);
        return res;
      });
    }
  }, {
    key: 'humanFileSize',
    value: function humanFileSize(size) {
      var i = Math.floor(Math.log(size) / Math.log(1024));
      return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    }
  }]);

  return FieldDrop;
}();

module.exports = FieldDrop;

},{"./ajax":1}]},{},[2])(2)
});