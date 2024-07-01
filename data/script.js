const fs = require('fs');
const axios = require('axios');

// Read the JSON file
const filePath = './candidates.json';

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  
  try {
    const candidates = JSON.parse(data);

    candidates.forEach(async candidate => {
      const text = candidate.text;
      
      // Send text to LLaMA 2 API for job identification
      try {
        const response = await axios.post('http://localhost:11434/api/generate', {
          prompt: `Identify the jobs which require the following skills: ${text}`
        });

        const jobs = response.data.jobs;
        console.log(`Jobs for candidate ${candidate.name}:`, jobs);
      } catch (apiErr) {
        console.error('Error calling LLaMA 2 API:', apiErr);
      }
    });
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});
