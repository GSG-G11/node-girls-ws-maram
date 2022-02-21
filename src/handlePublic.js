const path = require("path")
const fs = require("fs")

const handlePublic = (url ,res)=>{
    const filePath = path.join(__dirname, "..",url);
    const extname = path.extname(filePath)
    const contentType = {
        ".html" : "text/html",
        ".css" : "text/css",
        ".js" : "text/javascript"
       
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("server error");
      } else {
        res.writeHead(200, { "content-type": contentType[extname]});
        res.end(data);
      }
    });
}
module.exports = handlePublic;