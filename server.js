const express = require('express');
const axios = require('axios');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const app = express();

const jobsFilePath = path.join(__dirname, 'data', 'jobs.json');
const candidatesFilePath = path.join(__dirname, 'data', 'candidates.json');

// Middleware to handle JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to read JSON data
const readJSONFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return data ? JSON.parse(data) : [];  // Return an empty array if the file is empty
    }
    return [];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

// Helper function to write JSON data
const writeJSONFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Function to fetch resume PDF content from URL and parse
const fetchAndParseResume = async (resumeUrl) => {
  try {
    const response = await axios.get(resumeUrl, {
      responseType: 'arraybuffer' // Ensure response is treated as binary data
    });

    const dataBuffer = Buffer.from(response.data, 'binary');
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text; // Extracted text from PDF
  } catch (error) {
    console.error('Error fetching or parsing PDF:', error);
    throw new Error('Failed to fetch or parse PDF from URL.');
  }
};

// Endpoint to upload a resume from URL
app.post('/upload-resume', async (req, res) => {
  const { resumeUrl } = req.body;

  if (!resumeUrl) {
    return res.status(400).send('Resume URL is required.');
  }

  try {
    // Fetch and parse resume from URL
    const resumeText = await fetchAndParseResume(resumeUrl);

    // Read existing candidates
    const candidates = readJSONFile(candidatesFilePath);

    // Add the parsed resume to the candidates list
    const candidateId = candidates.length + 1;
    candidates.push({
      id: candidateId,
      name: `Candidate ${candidateId}`, // You may modify this based on actual data available
      text: resumeText
    });

    // Write updated candidates to file
    writeJSONFile(candidatesFilePath, candidates);

    res.json({ 
      message: 'Resume from URL uploaded and parsed successfully.',
      candidateId,
      resumeText
    });
  } catch (error) {
    console.error('Error uploading and parsing resume from URL:', error.message);
    res.status(500).send('Error uploading and parsing resume from URL.');
  }
});

// Endpoint to post a job (unchanged from original implementation)
app.post('/post-job', (req, res) => {
  const jobDescription = req.body.description;
  if (!jobDescription) {
    return res.status(400).send('Job description is required.');
  }

  // Read existing jobs
  const jobs = readJSONFile(jobsFilePath);

  // Add job description to the job list
  const jobId = jobs.length + 1;
  jobs.push({
    id: jobId,
    description: jobDescription
  });

  // Write updated jobs to file
  writeJSONFile(jobsFilePath, jobs);

  res.send(`Job posted successfully with ID: ${jobId}`);
});

// Endpoint to get candidate recommendations for a job (unchanged from original implementation)
app.get('/recommend-candidates/:jobId', (req, res) => {
  const jobId = parseInt(req.params.jobId);
  const jobs = readJSONFile(jobsFilePath);
  const job = jobs.find(j => j.id === jobId);

  if (!job) {
    return res.status(404).send('Job not found.');
  }

  // Read existing candidates
  const candidates = readJSONFile(candidatesFilePath);

  // Placeholder logic for candidate recommendation
  const recommendedCandidates = candidates.map(c => ({
    id: c.id,
    name: c.name
  }));

  res.json({
    jobId,
    jobDescription: job.description,
    recommendedCandidates
  });
});

// Endpoint to get job recommendations for a candidate (unchanged from original implementation)
app.get('/recommend-jobs/:candidateId', (req, res) => {
  const candidateId = parseInt(req.params.candidateId);
  const candidates = readJSONFile(candidatesFilePath);
  const candidate = candidates.find(c => c.id === candidateId);

  if (!candidate) {
    return res.status(404).send('Candidate not found.');
  }

  // Read existing jobs
  const jobs = readJSONFile(jobsFilePath);

  // Placeholder logic for job recommendation
  const recommendedJobs = jobs.map(j => ({
    id: j.id,
    description: j.description
  }));

  res.json({
    candidateId,
    candidateName: candidate.name,
    recommendedJobs
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
