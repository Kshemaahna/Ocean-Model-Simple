from flask import Flask, request, jsonify, send_file
from ocean_model import run_simulation
import os

app = Flask(__name__)

@app.route('/simulate', methods=['POST'])
def simulate():
    uploaded_file = request.files.get('file')
    if uploaded_file:
        filepath = os.path.join('data', 'GEBCO_2024.nc')
        os.makedirs('data', exist_ok=True)
        uploaded_file.save(filepath)
    else:
        filepath = None

    output_path = run_simulation(filepath)
    return send_file(output_path, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)
