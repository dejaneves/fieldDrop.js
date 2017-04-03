(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FieldDrop = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * https://gist.github.com/hsnaydd/0d6061a8801222ccf0e6
 */
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ajax = require('./ajax');

var _ajax2 = _interopRequireDefault(_ajax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FieldDrop = function () {
  function FieldDrop(container, options) {
    _classCallCheck(this, FieldDrop);

    this.containerDragAndDrop = null;
    this.inputFile = null;
    this.ajax = new _ajax2.default();

    this.trigger = {
      selector: 'input[type="file"]',
      eventListener: 'change'
    };

    if (typeof container == 'string') {
      this.containerDragAndDrop = document.querySelector(container);
      this.inputFile = this.containerDragAndDrop.querySelector('input[type="file"]');
    }

    if (!container) {
      throw new Error('error');
    }

    this.trigger.selector = document.querySelector(this.trigger.selector);
    this.init();
  }

  _createClass(FieldDrop, [{
    key: 'init',
    value: function init() {
      this.dragAndDropEvent();
      this.inputFileEvent();
    }
  }, {
    key: 'inputFileEvent',
    value: function inputFileEvent() {
      var _this = this;

      this.inputFile.addEventListener('change', function (event) {
        _this.sendFile(event.target.files);
      });
    }
  }, {
    key: 'dragAndDropEvent',
    value: function dragAndDropEvent() {
      var _this2 = this;

      var dragDrop = this.containerDragAndDrop;

      dragDrop.addEventListener('dragover', function (event) {
        event.stopPropagation();
        event.preventDefault();
      }, false);

      dragDrop.addEventListener('dragenter', function (event) {
        dragDrop.classList.add('dragenter');
      }, false);

      dragDrop.addEventListener('dragleave', function (event) {
        dragDrop.classList.remove('dragenter');
      }, false);

      dragDrop.addEventListener('drop', function (event) {
        event.stopPropagation();
        event.preventDefault();

        var dataFile = event.dataTransfer.files;
        _this2.sendFile(dataFile);
      }, false);
    }
  }, {
    key: 'sendFile',
    value: function sendFile(files) {
      var formData = new FormData(),
          progress = document.querySelector('progress');

      formData.append("file", files[0]);

      var xhr = this.ajax.postUpload('/upload', formData, function (res) {
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
  }]);

  return FieldDrop;
}();

module.exports = FieldDrop;

},{"./ajax":1}]},{},[2])(2)
});