const express = require('express');
const serveStatic = require('serve-static');
const multer = require('multer');
const app = express();

const client = '/';
const port = process.env.PORT || 8081;
app.use(serveStatic(__dirname + client));

app.listen(port,function(){
  console.log("http://localhost:" + port);
});


/**
 * Uploads
 */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/server/public/uploads/')
  },
  filename: function (req, file, cb) {
    var ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
    cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
  }
}); const upload = multer({ storage: storage });

// Route
app.post('/upload', upload.single('file'), function (req, res, next) {
  console.log(req.file);
  res.send(req.file.filename);
});

//app.post('/upload_delete')
