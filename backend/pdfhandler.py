import pandas as pd
import PyMuPDF
import re
from flask import jsonify

def extract_pdf_content(filepath):
    doc = fitz.open(filepath)
    tables = []
    paragraphs = []

    for page in doc:
        blocks = page.get_text("blocks")
        text_blocks = [b[4].strip() for b in blocks if isinstance(b[4], str) and b[4].strip()]
        paragraphs.extend(text_blocks)

        page_text = page.get_text("text")
        lines = [line.strip() for line in page_text.split("\n") if line.strip()]
        if lines:
            potential_table = [re.split(r'\s{2,}', line) for line in lines if re.search(r'\s{2,}', line)]
            if potential_table and len(potential_table) > 1:
                df = pd.DataFrame(potential_table[1:], columns=potential_table[0])
                if not df.empty:
                    tables.append(df)

    return tables, paragraphs