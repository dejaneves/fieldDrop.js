export default class Ajax {

  constructor(options) {

    this.defaults = {
      json:false
    };

    if (typeof options === 'object') {
      this.options = Object.assign({}, this.defaults, options);
    } else {
      this.options = this.defaults;
    }

  }

  get(url, callback) {
    let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('GET', url);
    xhr.onreadystatechange = () => {
      if (xhr.readyState > 3 && xhr.status === 200) {
          callback(xhr.responseText);
      }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();

    return xhr;
  }

  post(url, data, callback) {
    let params = typeof data == 'string' ? data : Object.keys(data).map((k) => {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
    }).join('&');

    let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
      if (xhr.readyState > 3 && xhr.status === 200) {
        callback(xhr.responseText);
      }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(data);

    return xhr;
  }

  upload(url, data, callback) {
    let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
        progress = document.querySelector('progress'), options = this.options;

    xhr.open('POST', url);

    xhr.onreadystatechange = function() {
      if (xhr.readyState > 3 && xhr.status === 200) {
        if(options.json)
          callback(JSON.parse(xhr.responseText));
        else
          callback(xhr.responseText);

      } else {
        callback(xhr);
      }
    };

    xhr.onprogress = function (event) {
      if (event.lengthComputable) {
        var complete = (event.loaded / event.total * 100 | 0);
        progress.value = progress.innerHTML = complete;
      }
    };

    xhr.onload = function() {
      progress.value = progress.innerHTML = 100;
    };

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send(data);

    return xhr;
  }
}
