export async function runSimulation(file) {
  const formData = new FormData();
  if (file) formData.append('file', file);

  const res = await fetch('http://localhost:5000/simulate', {
    method: 'POST',
    body: formData
  });
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
