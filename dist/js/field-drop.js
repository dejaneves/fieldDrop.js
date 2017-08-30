/*!
 * Field Drop Js v0.0.1-beta3 (August 30th 2017)
 * FieldDrop.js is an JavaScript library that provides drag and drop file uploads with image previews
 * 
 * https://github.com/dejaneves/fieldDrop.js#readme
 * 
 * Licensed MIT © Jaime Neves
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FieldDrop = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ajax = function () {
  function Ajax(options) {
    _classCallCheck(this, Ajax);

    this.defaults = {};

    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
      this.options = Object.assign({}, this.defaults, options);
    } else {
      this.options = this.defaults;
    }
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
    value: function upload(url, data) {
      return new Promise(function (resolve, reject) {
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        var progress = document.querySelector('progress');

        xhr.open('POST', url);

        xhr.onprogress = function (event) {
          if (event.lengthComputable) {
            var complete = event.loaded / event.total * 100 | 0;
            progress.value = progress.innerHTML = complete;
          }
        };

        xhr.onload = function () {
          progress.value = progress.innerHTML = 100;

          if (xhr.status === 200) resolve(xhr.responseText);else reject(Error(req.statusText));
        };

        xhr.onerror = function () {
          return reject(xhr.statusText);
        };

        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(data);
        return xhr;
      });
    }
  }]);

  return Ajax;
}();

exports.default = Ajax;

},{}],3:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ajax = require('./ajax');

var _ajax2 = _interopRequireDefault(_ajax);

var _tinyEmitter = require('tiny-emitter');

var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FieldDrop = function (_Emitter) {
  _inherits(FieldDrop, _Emitter);

  function FieldDrop(element, options) {
    _classCallCheck(this, FieldDrop);

    var _this = _possibleConstructorReturn(this, (FieldDrop.__proto__ || Object.getPrototypeOf(FieldDrop)).call(this));

    _this.element = !element ? null : element;
    _this.trigger = null;
    _this.defaults = {
      url: '',
      selector: 'input[type="file"]',
      eventListener: 'change',
      deleteOptions: {
        htmlText: 'Delete'
      }
    };

    // Element
    _this.divItems = document.createElement('div');
    _this.divProgress = document.createElement('progress');
    _this.fieldDrop_content = '.field-drop--content';
    _this.fieldDrop_uploads = '.field-drop--uploads';

    if (typeof _this.element === 'string') {
      _this.element = document.querySelector(_this.element);
    }

    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
      _this.options = Object.assign({}, _this.defaults, options);
    } else {
      _this.options = _this.defaults;
    }

    if (_this.element) {
      _this.mountTemplate(_this.element);
      _this.bindEvent();
    }

    return _this;
  }

  _createClass(FieldDrop, [{
    key: 'createActionDelete',
    value: function createActionDelete(filename, responseServer) {
      this.emit('delete', filename, responseServer);
    }
  }, {
    key: 'createActionSend',
    value: function createActionSend(files) {
      this.emit('send', files);
    }
  }, {
    key: 'setAttrItem',
    value: function setAttrItem(filename, value) {
      var query = "div[data-name='" + filename + "']",
          item = document.querySelector(query);

      item.setAttribute('data-response', value);
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
      divContent.innerHTML = '' + '<div class="drag-and-drop-info"><span class="title">Drop files here</span><span class="icon"></span></div>' + '<input type="button" id="fake-button" onclick="document.getElementById(\'file-input\').click();" value="Select File ..."> ' + '<input type="file" name="file" id="file-input" style="display:none">';

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
      //element.appendChild(this.divProgress);

      // Get Element
      this.trigger = element.querySelector(this.options.selector);
    }
  }, {
    key: 'EventDelete',
    value: function EventDelete() {
      var _this2 = this;

      var btnDelete = this.element.querySelector('.field-drop--uploads .uploads__item .delete');

      btnDelete.addEventListener('click', function (event) {
        event.preventDefault();

        var item = event.target.parentNode.parentNode.parentNode;
        item.remove();

        var filename = item.getAttribute('data-name'),
            responseServer = item.getAttribute('data-response');

        _this2.element.querySelector(_this2.fieldDrop_content).classList.remove('hide');
        _this2.createActionDelete(filename, responseServer);
      });
    }
  }, {
    key: 'bindEvent',
    value: function bindEvent() {
      var _this3 = this;

      var dragDrop = this.element;

      this.trigger.addEventListener('change', function (event) {
        _this3.workPhoto(event.target.files);
      });

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
        _this3.workPhoto(event.dataTransfer.files);
      }, false);
    }
  }, {
    key: 'workPhoto',
    value: function workPhoto(files) {
      this.renderPhoto(files);
    }
  }, {
    key: 'renderPhoto',
    value: function renderPhoto(files) {
      var imageType = /image.*/,
          reader = new FileReader(),
          img = new Image(),
          uploads = this.element.querySelector(this.fieldDrop_uploads),
          fileSize = this.humanFileSize(files[0].size),
          self = this;

      this.divItems.setAttribute('class', 'uploads__item');
      this.divItems.setAttribute('data-name', files[0].name);

      var templateItem = '' + '<div class="item--image"></div>' + '<div class="item--info">' + '<div class="info--name">' + files[0].name + '</div>' + '<div class="info--size">' + fileSize + '</div>' + '<div class="info--actions"> ' + '<a href="#" class="delete" title="Delete"> ' + this.options.deleteOptions.htmlText + ' </a> ' + '</div>' + '</div>';

      this.divItems.innerHTML = "";
      this.divItems.innerHTML = templateItem;

      if (files[0].type.match(imageType)) {
        reader.onload = function (e) {
          img.src = reader.result;

          self.divItems.querySelector('.item--image').innerHTML = "";
          self.divItems.querySelector('.item--image').appendChild(img);

          // Uploads
          uploads.appendChild(self.divItems);
          self.EventDelete();
          self.createActionSend(files);
        };
      }
      reader.readAsDataURL(files[0]);
      this.hideContenContainer();
    }
  }, {
    key: 'hideContenContainer',
    value: function hideContenContainer() {
      this.element.querySelector(this.fieldDrop_content).classList.add('hide');
    }
  }, {
    key: 'sendFile',
    value: function sendFile(formData, cb) {
      var _this4 = this;

      var ajax = new _ajax2.default();
      return new Promise(function (resolve, reject) {
        ajax.upload(_this4.options.url, formData).then(function (res) {
          resolve(res);
        }, function (error) {
          reject(error);
        });
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
}(_tinyEmitter2.default);

module.exports = FieldDrop;

},{"./ajax":2,"tiny-emitter":1}]},{},[3])(3)
});