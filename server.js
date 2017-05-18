const express = require('express');
const serveStatic = require('serve-static');
const multer = require('multer');
const fs = require('fs');
const app = express();


const client = '/';
const port = process.env.PORT || 8081;
app.use(serveStatic(__dirname + client));

app.listen(port,function(){
  console.log("http://localhost:" + port);
});


// Uploads
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/server/public/uploads/')
  },
  filename: function (req, file, cb) {
    var ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
    cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
  }
}); const upload = multer({ storage: storage });

// Route file upload
app.post('/upload', upload.single('file'), function (req, res, next) {
  console.log(req.file);
  res.send(req.file.filename);
});

// Route file delete
app.get('/deleteFile/:filename',function(req, res) {
  var filename = req.params.filename;

  fs.unlink(__dirname + '/server/public/uploads/' + filename, function(err) {
    if(err)
      return res.send(false);

    return res.send(true);

  });
});
