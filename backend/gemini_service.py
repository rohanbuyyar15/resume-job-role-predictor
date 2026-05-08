from google import genai
from google.genai import types

import os
import json
import re

from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

# Initialize Gemini Client
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODEL_NAME = "gemini-2.5-flash"


JSON_SCHEMA_PROMPT = """
You are an expert AI Technical Recruiter and Career Coach.

Analyze the candidate's resume carefully and return ONLY a single valid JSON object.

CRITICAL RULES:
- Do NOT return markdown, code fences, or any explanation.
- Return ONLY raw JSON starting with { and ending with }.
- Base every field on ACTUAL content from the resume — no hallucination.
- For "roles", identify SPECIFIC job titles that match the candidate's skills, e.g.:
    "Data Scientist", "Machine Learning Engineer", "Java Backend Developer",
    "Frontend React Developer", "DevOps Engineer", "Cybersecurity Analyst",
    "Full Stack Developer", "Android Developer", "NLP Engineer", "Cloud Architect",
    "Business Analyst", "UI/UX Designer", "Embedded Systems Engineer", etc.
  NEVER use vague labels like "Engineering" or "Technology".

Required JSON structure (fill every field based on actual resume):

{
  "roles": [
    {
      "name": "<Specific job title e.g. 'Data Scientist' or 'Java Backend Developer'>",
      "match_percentage": <integer 0-100>,
      "ats_score": <integer 0-100>,
      "salary_estimate": "<e.g. '$90,000 – $130,000/yr'>",
      "description": "<2-sentence description of this exact role and why it fits this candidate>",
      "reason": "<concrete reason from resume evidence why this role fits>"
    }
  ],
  "benchmark_score": <integer 0-100>,
  "match_score": <integer 0-100>,
  "keyword_match_rate": <integer 0-100>,
  "strengths": ["<specific strength from resume>"],
  "weaknesses": ["<specific gap or missing skill>"],
  "advanced_gap_analysis": [
    {
      "skill": "<skill name>",
      "status": "<one of: 'Strongly Demonstrated', 'Partially Demonstrated', 'Mentioned Only', 'Missing'>",
      "suggestion": "<actionable suggestion to improve>"
    }
  ],
  "roadmap": ["<Step 1: specific action with resource>", "<Step 2>"],
  "suggestions": ["<concrete resume improvement suggestion>"],
  "interview_questions": ["<likely interview question for top role>"],
  "formatting_tips": ["<ATS formatting tip>"],
  "job_links": [
    {
      "role": "<specific job title>",
      "linkedin": "https://www.linkedin.com/jobs/search/?keywords=<url-encoded-role>",
      "indeed": "https://www.indeed.com/jobs?q=<url-encoded-role>"
    }
  ]
}
"""


def summarize_chunk(chunk):
    prompt = f"""
    Extract and summarize key information from this resume section:
    - Skills (technical and soft)
    - Work Experience (companies, roles, duration, technologies)
    - Projects (names, tech stack, outcomes)
    - Education (degree, institution, year)
    - Certifications

    Resume section:
    {chunk}
    """

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"Chunk summary error: {e}")
        return chunk[:500]


def extract_json_from_response(text):
    """Robustly extract JSON from model response."""
    text = text.strip()

    # Remove markdown fences if present
    text = re.sub(r'^```(?:json)?\s*', '', text)
    text = re.sub(r'\s*```$', '', text)
    text = text.strip()

    # Find first { and last }
    start = text.find('{')
    end = text.rfind('}')
    if start != -1 and end != -1:
        return text[start:end + 1]

    return text


def process_and_analyze_resume(text):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=10000,
        chunk_overlap=1000
    )

    chunks = splitter.split_text(text)
    final_text = text

    # Summarize huge resumes to fit context
    if len(chunks) > 3:
        print(f"Large resume detected ({len(chunks)} chunks). Summarizing...")
        summaries = [summarize_chunk(chunk) for chunk in chunks]
        final_text = "\n\n".join(summaries)

    final_prompt = f"""{JSON_SCHEMA_PROMPT}

RESUME TO ANALYZE:
{final_text}
"""

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=final_prompt,
            config=types.GenerateContentConfig(
                temperature=0.1,
                response_mime_type="application/json"
            )
        )

        response_text = extract_json_from_response(response.text)
        parsed_json = json.loads(response_text)

        # Validate & ensure all expected fields exist
        required_fields = [
            "roles", "benchmark_score", "match_score", "keyword_match_rate",
            "strengths", "weaknesses", "advanced_gap_analysis", "roadmap",
            "suggestions", "interview_questions", "formatting_tips", "job_links"
        ]
        for field in required_fields:
            if field not in parsed_json:
                parsed_json[field] = [] if field not in ["benchmark_score", "match_score", "keyword_match_rate"] else 0

        return parsed_json

    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        print(f"Raw response: {response.text[:500]}")
        raise Exception("Failed to parse Gemini JSON response.")

    except Exception as e:
        print(f"Gemini Error: {e}")
        raise Exception(f"Resume analysis failed: {str(e)}")