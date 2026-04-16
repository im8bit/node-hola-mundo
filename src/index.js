const http = require('http');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3000;

const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hola Mundo - Node.js</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #e0e0e0;
    }

    .card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 48px 64px;
      text-align: center;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }

    .emoji {
      font-size: 64px;
      margin-bottom: 24px;
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 12px;
    }

    p {
      font-size: 1.1rem;
      color: #a0a0b0;
      margin-bottom: 8px;
    }

    .badge {
      display: inline-block;
      margin-top: 24px;
      padding: 6px 16px;
      background: rgba(83, 200, 120, 0.2);
      border: 1px solid rgba(83, 200, 120, 0.4);
      border-radius: 999px;
      font-size: 0.85rem;
      color: #53c878;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="emoji">🚀</div>
    <h1>¡Hola, Mundo!</h1>
    <p>Servidor corriendo con <strong>Node.js</strong> puro</p>
    <p>Sin frameworks — solo la API nativa de HTTP</p>
    <span class="badge">🐳 Corriendo en Docker</span>
  </div>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  // Health check endpoint (útil para Docker y orquestadores como Kubernetes)
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, HOST, () => {
  console.log(`✅ Servidor iniciado`);
  console.log(`🌐 URL: http://${HOST}:${PORT}`);
  console.log(`❤️  Health check: http://${HOST}:${PORT}/health`);
});
