const fs = require("fs");
const path = require("path");
const queryString = require("querystring");
const handlePublic = require("./handlePublic")


const router = (req, res) => {
  const method = req.method;
  let url = req.url;
  if (url === "/") {
      handlePublic('/public/index.html',res)
  } else if (url.includes('public')) {
   handlePublic(url,res)
  }
//   } else if (url === "/public/script.js") {
//    handlePublic("script.js",res)
//   } else if (url === "/public/img/logo1.png") {
//     const filePath = path.join(__dirname, "..", "public", "img", "logo1.png");
//     fs.readFile(filePath, (err, data) => {
//       if (err) {
//         res.writeHead(500);
//         res.end("server error");
//       } else {
//         res.end(data);
//       }
//     });
//   }else if (url === "/public/img/logo2.png"){
//       const imgFile = path.join(__dirname , ".." ,"public","img","logo2.png")
//       fs.readFile(imgFile , (err ,data)=>{
//         if(err){
//             res.writeHead(500)
//             res.end("server error")
//         }else{
//             res.end(data)
//         }
//       })
//   }
  
  else if (url === "/posts" && method === 'GET')  {
    const postFile = path.join(__dirname, "posts.json");
    fs.readFile(postFile, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("server error");
      } else {
        res.writeHead(200 , {"content-type" :"application/json"});
        res.end(data);
      }
    });
  } else if (url === "/create-post" && method === 'POST') {
    let allData = "";
    req.on("data", (chunkOfData) => {
      allData += chunkOfData;
    });
    req.on("end", () => {
      const convertedData = queryString.parse(allData);
      const pathFile = path.join(__dirname, "posts.json");
      fs.readFile(pathFile, "utf-8", (err, data) => {
        if (err) {
          res.end("server error");
        } else {
          const obj = JSON.parse(data);
          obj[Date.now()] = convertedData.post;
          fs.writeFile(pathFile, JSON.stringify(obj), (err) => {
            if (err) {
              res.writeHead(500);
              res.end("server error");
            }
          });
        }
      });
      res.writeHead(307, { location: "/" });
      res.end();
    });
  } else {
    res.writeHead(404);
    res.end("page  not found");
  }
};

module.exports = router;
