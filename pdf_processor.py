import os
import pdfplumber
import PyPDF2

def extract_text_from_pdf(file_path):
    """
    Robustly extracts text from a PDF file.
    Tries pdfplumber first, falls back to PyPDF2.
    Returns the extracted text or raises an Exception.
    """
    text = ""
    
    # Try pdfplumber first (better formatting)
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"pdfplumber failed: {e}. Falling back to PyPDF2.")
        text = "" # Reset text
    
    # Fallback to PyPDF2 if pdfplumber failed or returned empty
    if not text.strip():
        try:
            with open(file_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            print(f"PyPDF2 also failed: {e}")
            raise Exception("Unable to process resume PDF")
    
    if not text.strip():
        raise Exception("Unable to process resume PDF")
        
    return text.strip()

def validate_resume_text(text):
    """
    Quickly checks if the document looks like a resume based on common keywords.
    """
    text_lower = text.lower()
    keywords = ["education", "experience", "skills", "projects", "university", "college", "degree", "work", "employment"]
    
    # Check if at least 2 keywords are present
    match_count = sum(1 for keyword in keywords if keyword in text_lower)
    
    if match_count < 2:
        return False
    return True
