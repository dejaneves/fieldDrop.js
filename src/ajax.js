export default class Ajax {

  constructor(options) {

    this.defaults = {};

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

  upload(url, data) {
    return new Promise((resolve,reject) => {
      let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
      let progress = document.querySelector('progress');

      xhr.open('POST', url);

      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          var complete = (event.loaded / event.total * 100 | 0);
          progress.value = progress.innerHTML = complete;
        }
      };

      xhr.onload = () => {
        progress.value = progress.innerHTML = 100;

        if(xhr.status === 200)
          resolve(xhr.responseText);
        else
          reject(Error(xhr.statusText));
      };

      xhr.onerror = () => reject(xhr.statusText);

      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.send(data);
      return xhr;
    });
  }

}
