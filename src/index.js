const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Bullfrog Demo App',
    version: '1.0.0',
    description: 'This is a demo application showcasing Bullfrog security features'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/data', (req, res) => {
  res.json({
    data: [
      { id: 1, name: 'Item 1', description: 'First demo item' },
      { id: 2, name: 'Item 2', description: 'Second demo item' },
      { id: 3, name: 'Item 3', description: 'Third demo item' }
    ]
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Bullfrog Demo App listening on port ${PORT}`);
  });
}

module.exports = app;
