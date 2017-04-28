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
    key: 'postUpload',
    value: function postUpload(url, data, callback) {
      var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
      xhr.open('POST', url);
      xhr.onreadystatechange = function () {
        if (xhr.readyState > 3 && xhr.status === 200) {
          callback(xhr.responseText);
        } else {
          callback(xhr);
        }
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
      eventListener: 'change'
    };

    // Element Class
    this.classImageContainer = '.drag-and-drop__image';
    this.classImageBody = '.drag-and-drop__image__body';
    this.classContentContainer = '.drag-and-drop__content';
    this.classContainerUploads = '.drag-and-drop__uploads';

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

    console.log(this.options);

    this.trigger = this.element.querySelector(this.options.selector);
    this.init();
  }

  _createClass(FieldDrop, [{
    key: 'init',
    value: function init() {
      this.bindEvent();
    }
  }, {
    key: 'bindEvent',
    value: function bindEvent() {
      var _this = this;

      var dragDrop = this.element,
          btnDelete = this.element.querySelector('.uploads-item__actions');

      this.trigger.addEventListener('change', function (event) {
        _this.workPhoto(event.target.files);
      });

      btnDelete.addEventListener('click', function (event) {
        event.preventDefault();
        var el = event.target;
        el.parentNode.parentNode.querySelector('.uploads-item__file--name').innerHTML = '';
        el.parentNode.parentNode.querySelector('.uploads-item__file--info').innerHTML = '';
        el.parentNode.parentNode.querySelector('.uploads-item__actions').innerHTML = '';
        dragDrop.querySelector(_this.classImageContainer).querySelector('img').remove();
        dragDrop.querySelector(_this.classContentContainer).classList.remove('hide');
      });

      // Drag and Drop Events

      this.element.addEventListener('dragover', function (event) {
        event.stopPropagation();
        event.preventDefault();
        dragDrop.classList.add('selected-area');
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
          imageContainer = this.element.querySelector(this.classImageContainer),
          imageBody = this.element.querySelector(this.classImageBody),
          containerUploads = this.element.querySelector(this.classContainerUploads),
          fileSize = this.humanFileSize(file.size);

      if (file.type.match(imageType)) {
        reader.onload = function (e) {
          img.src = reader.result;
          imageBody.innerHTML = "";
          imageBody.appendChild(img);
          // Uploads
          containerUploads.querySelector('.uploads-item__file--name').innerHTML = file.name;
          containerUploads.querySelector('.uploads-item__file--info').innerHTML = fileSize;
          containerUploads.setAttribute('id', file.name);
        };
      }
      reader.readAsDataURL(file);
      this.hideContenContainer();
    }
  }, {
    key: 'hideContenContainer',
    value: function hideContenContainer() {
      this.element.querySelector(this.classContentContainer).classList.add('hide');
    }
  }, {
    key: 'sendFile',
    value: function sendFile(files) {
      var _this2 = this;

      var formData = new FormData(),
          progress = document.querySelector('progress');

      formData.append("file", files[0]);

      var xhr = this.ajax.postUpload(this.options.url, formData, function (res) {
        var btnDelete = _this2.element.querySelector('.uploads-item__actions > .delete');
        btnDelete.setAttribute('id', res);
        return res;
      });

      // readyState will be 3
      xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
          var complete = event.loaded / event.total * 100 | 0;
          progress.value = progress.innerHTML = complete;
        }
      };

      // readyState will be 4
      xhr.onload = function () {
        progress.value = progress.innerHTML = 100;
      };
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