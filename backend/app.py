import os
import tempfile
import traceback

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

from pdf_processor import extract_text_from_pdf, validate_resume_text
from gemini_service import process_and_analyze_resume


# Initialize Flask App
app = Flask(__name__)

# Enable CORS
CORS(app)

# Max upload size = 16MB
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Allowed file types
ALLOWED_EXTENSIONS = {'pdf'}


# ----------------------------
# Helper Function
# ----------------------------
def allowed_file(filename):

    return (
        '.' in filename and
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
    )


# ----------------------------
# Health Route
# ----------------------------
@app.route('/health', methods=['GET'])
def health_check():

    return jsonify({
        "status": "ok",
        "message": "Resume Analyzer Backend Running"
    })


# ----------------------------
# Analyze Resume Route
# ----------------------------
@app.route('/analyze', methods=['POST'])
def analyze_resume():

    # Check file exists
    if 'resume' not in request.files:

        return jsonify({
            "error": "No resume file provided"
        }), 400

    file = request.files['resume']

    # Empty filename
    if file.filename == '':

        return jsonify({
            "error": "No selected file"
        }), 400

    # Validate file type
    if not allowed_file(file.filename):

        return jsonify({
            "error": "Invalid file type. Only PDF files are supported."
        }), 400

    # Save temporary file
    temp_dir = tempfile.gettempdir()

    filename = secure_filename(file.filename)

    filepath = os.path.join(temp_dir, filename)

    file.save(filepath)

    try:

        # --------------------------------
        # STEP 1 - Extract PDF Text
        # --------------------------------
        try:

            text = extract_text_from_pdf(filepath)

        except Exception as e:

            print("\nPDF EXTRACTION ERROR")
            traceback.print_exc()

            return jsonify({
                "error": "Unable to process resume PDF"
            }), 400

        # --------------------------------
        # STEP 2 - Validate Resume
        # --------------------------------
        if not validate_resume_text(text):

            return jsonify({
                "error": "Invalid Input - Not a Resume"
            }), 400

        # --------------------------------
        # STEP 3 - Analyze Resume
        # --------------------------------
        try:

            analysis_results = process_and_analyze_resume(text)

            return jsonify(analysis_results), 200

        except Exception as e:

            print("\n===== GEMINI ANALYSIS ERROR =====")
            traceback.print_exc()
            print("=================================\n")

            return jsonify({
                "error": f"Resume analysis failed: {str(e)}"
            }), 500

    finally:

        # Delete temp file
        if os.path.exists(filepath):

            os.remove(filepath)


# ----------------------------
# Main
# ----------------------------
if __name__ == '__main__':

    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )