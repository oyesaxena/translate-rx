import express from 'express';

const healthCheckController = express.Router();

healthCheckController.get('/', (req, res) => {
  res.json({ success: true });
});

export default healthCheckController;
