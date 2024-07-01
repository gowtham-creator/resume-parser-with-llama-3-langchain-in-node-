const fs = require('fs');
const axios = require('axios');

const filePath = './candidates.json';

fs.readFile(filePath, 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  try {
    const candidates = JSON.parse(data);

    for (const candidate of candidates) {
      const text = candidate.text;

      try {
        const response = await axios.post('http://localhost:11434/api/generate', {
        model:"llama2",
        prompt: `Identify the jobs which require the following skills: ${text}`
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const jobs = response.data.jobs;
        console.log(`Jobs for candidate ${candidate.name}:`, jobs);
      } catch (apiErr) {
        console.error('Error calling Ollama API:', apiErr.response ? apiErr.response.data : apiErr.message);
      }
    }
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});
