import React, { useState, useEffect } from "react";
import "./App.css"; // Import custom CSS
const App = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState("Waiting for comparison....");
  
  useEffect(() => {
    // Simulating a result on page load
    setResult("Upload a resume and job description to compare.");
  }, []);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };
  const handleSubmit = async () => {
    if (!resumeFile || !jobDescription) {
      alert("Please upload a resume in pdf and enter a job description.");
      return;
    }
  
    setResult("Processing... Please wait.");
  
    // Read PDF as base64
    const reader = new FileReader();
    reader.readAsDataURL(resumeFile);
    reader.onload = async () => {
      const base64Pdf = reader.result.split(",")[1]; // Remove prefix
  
      const payload = {
        job_description: jobDescription,
        resume_file: base64Pdf,
      };
  
      try {
        const response = await fetch("https://vzquvi1l1f.execute-api.eu-central-1.amazonaws.com/sandbox/profilecheck", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
  
        const data = await response.json();
        setResult(data.body || "No match result returned.");
      } catch (error) {
        console.error("Error in API call:", error);
        setResult(`Error: ${error.message || "Unknown error"}`);
      }
    };
  };
  
  return (
    <div className="container">
      <div className="form-box">
        <h1>Resume & Job Matcher</h1>
        <div className="input-group">
          <label>Candidate Resume (PDF):</label>
          <div className="file-upload">
            <input type="file" accept=".pdf" id="resume-upload" onChange={handleFileChange} />
            <label htmlFor="resume-upload" className="file-label">
              {resumeFile ? resumeFile.name : "Click to upload a PDF"}
            </label>
          </div>
        </div>
        <div className="input-group">
          <label>Job Description:</label>
          <textarea
            placeholder="Paste job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="button-container">
          <button onClick={handleSubmit}>Compare Resume & Job</button>
        </div>
        <div className="result-box">
          <h2>Comparison Result:</h2>
          <p>{result}</p>
        </div>
      </div>
    </div>
  );
};
export default App;
