const http = require('http');
const url = require('url');

const users = [];

const server = http.createServer(async (req, res) => {
  const reqUrl = url.parse(req.url).pathname;
  const reqMethod = req.method.toUpperCase();
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  const data = Buffer.concat(buffers).toString();

  if (reqUrl === '/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });

    if (reqMethod === 'GET') {
      res.end(JSON.stringify(users, null, 2));
    }

    if (reqMethod === 'POST') {
      const user = JSON.parse(data);
      const existingUser = users.find((u) => u.id === user.id);

      if (existingUser) {
        res.end(JSON.stringify({ error: 'User already exists' }, null, 2));
        return;
      }

      users.push(user);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    }

    if (reqMethod === 'DELETE') {
      users.length = 0;

      res.end(JSON.stringify(users));
    }
  }

  if (reqUrl.startsWith('/users/')) {
    const userId = reqUrl.split('/')[2];
    res.writeHead(200, { 'Content-Type': 'application/json' });

    if (reqMethod === 'GET') {
      const user = users.find((u) => u.id === userId);
      res.end(JSON.stringify(user));
    }

    if (reqMethod === 'PUT') {
      const user = JSON.parse(data);
      const index = users.findIndex((u) => u.id === userId);
      users[index] = user;

      res.end(JSON.stringify(user));
    }

    if (reqMethod === 'DELETE') {
      const index = users.findIndex((u) => u.id === userId);
      users.splice(index, 1);

      res.end(JSON.stringify(users));
    }
  }
});

server.listen(9000, () => {
  console.log('vanilla-node-server started');
});
