import React, { useState } from 'react';
import { runSimulation } from '../api';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultUrl = await runSimulation(file);
    setImgSrc(resultUrl);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Run Simulation</button>
      </form>
      {imgSrc && <img src={imgSrc} alt="Result" style={{ width: '80%', marginTop: '1rem' }} />}
    </div>
  );
}

export default UploadForm;
