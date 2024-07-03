
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Serve your Tetris HTML file here
  fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Error: File not found");
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
});

const PORT = 3000; // You can use any port number
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
