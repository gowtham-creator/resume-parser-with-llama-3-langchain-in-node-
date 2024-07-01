// Handle Job Posting Form Submission
document.getElementById('jobPostForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const jobDescription = document.getElementById('jobDescription').value;

  const response = await fetch('/post-job', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ description: jobDescription })
  });

  const result = await response.text();
  document.getElementById('jobPostResult').textContent = result;
  document.getElementById('jobDescription').value = '';
});

// Handle Resume Upload Form Submission
document.getElementById('resumeUploadForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const resumeFile = document.getElementById('resumeFile').files[0];

  const formData = new FormData();
  formData.append('resume', resumeFile);

  const response = await fetch('/upload-resume', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  document.getElementById('resumeUploadResult').textContent = result.message;
  document.getElementById('resumeFile').value = '';
});

// Handle Candidate Recommendations Form Submission
document.getElementById('candidateRecommendationsForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const jobId = document.getElementById('jobId').value;

  const response = await fetch(`/recommend-candidates/${jobId}`);
  const result = await response.json();

  const candidateList = document.getElementById('candidateList');
  candidateList.innerHTML = '';
  result.recommendedCandidates.forEach(candidate => {
    const li = document.createElement('li');
    li.textContent = `ID: ${candidate.id}, Name: ${candidate.name}`;
    candidateList.appendChild(li);
  });
});

// Handle Job Recommendations Form Submission
document.getElementById('jobRecommendationsForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const candidateId = document.getElementById('candidateId').value;

  const response = await fetch(`/recommend-jobs/${candidateId}`);
  const result = await response.json();

  const jobList = document.getElementById('jobList');
  jobList.innerHTML = '';
  result.recommendedJobs.forEach(job => {
    const li = document.createElement('li');
    li.textContent = `ID: ${job.id}, Description: ${job.description}`;
    jobList.appendChild(li);
  });
});
