// test-check.js
import handler from './api/checkStock.js';
import dotenv from 'dotenv';
dotenv.config();

// simulate a request and response
const mockReq = {
  query: {
    symbol: 'ul' // you can change this to any keyword
  }
};

const mockRes = {
  status(code) {
    return {
      json(data) {
        console.log(`Status: ${code}`);
        console.log('Response:', JSON.stringify(data, null, 2));
      }
    };
  }
};

// run the handler
handler(mockReq, mockRes);
