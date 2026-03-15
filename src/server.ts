import express from 'express';
import path from 'path';
import open from 'open';
import { getConfig, setConfig } from './config';

export async function launchUI() {
  const app = express();
  const port = 3042;
  
  app.use(express.json());

  const publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));

  // Config API endpoints
  app.get('/config', (req, res) => {
    res.json(getConfig());
  });

  app.post('/config', (req, res) => {
    setConfig(req.body);
    res.sendStatus(200);
  });

  app.listen(port, async () => {
    const url = `http://localhost:${port}`;
    console.log(`\n========================================`);
    console.log(`👀 Eye App Visualizer running at:`);
    console.log(`   ${url}`);
    console.log(`========================================\n`);
    console.log(`Press Ctrl+C in this terminal to stop the server.\n`);
    
    await open(url);
  });
}
