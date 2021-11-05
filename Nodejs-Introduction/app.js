const http = require("http");

function requestHandler(request, response) {
  if (request.url === "/current-time") {
    response.end("<h1>" + new Date().toISOString() + "</h1>");
  } else if (request.url === "/") {
    response.end("<h1>Hello World</h1>");
  } else {
    response.statusCode = 404;
    response.end("<h1>Nothing Found!</h1>");
  }
  response.statusCode = 200;
}

const server = http.createServer(requestHandler);

server.listen(3000);
