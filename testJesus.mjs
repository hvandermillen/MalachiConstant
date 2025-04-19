// test-jesus.js
import dotenv from 'dotenv';
dotenv.config();

import handler from './api/jesusSays.js';

const mockReq = {
  body: {
    action: 'buy',         // or 'sell'
    input: 'MSF'           // or an array like ['AAPL', 'TSLA'] if selling
  }
};

const mockRes = {
  status(code) {
    return {
      json(data) {
        console.log(`\n✨ Status: ${code}`);
        console.log('📜 AI Jesus says:\n');
        console.log(data.message || JSON.stringify(data, null, 2));
      }
    };
  }
};

handler(mockReq, mockRes);
