import os
from typing import List
import pdfplumber
from pypdf import PdfReader
import docx

def extract_text_from_file(file_path: str) -> str:
    """Extract all text from PDF or DOCX file."""
    ext = os.path.splitext(file_path)[1].lower()
    text = ""
    
    if ext == ".pdf":
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            print(f"pdfplumber failed, falling back to pypdf: {e}")
            try:
                reader = PdfReader(file_path)
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            except Exception as pe:
                print(f"pypdf also failed: {pe}")
                
    elif ext in [".docx", ".doc"]:
        try:
            doc = docx.Document(file_path)
            paragraphs = [p.text for p in doc.paragraphs if p.text]
            text = "\n".join(paragraphs)
        except Exception as e:
            print(f"docx parsing failed: {e}")
            
    else:
        # Fallback to reading as text if possible
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
        except Exception as e:
            print(f"Fallback reading failed: {e}")
            
    return text.strip()

def chunk_text(text: str, chunk_size: int = 600, overlap: int = 100) -> List[str]:
    """Split text into overlapping semantic/character-based chunks."""
    if not text:
        return []
        
    chunks = []
    # Replace double newlines with single spaces and split by sentences
    sentences = text.replace("\n", " ").split(". ")
    current_chunk = ""
    
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
            
        # Re-append dot since split removed it
        sentence_with_dot = sentence + ". "
        
        if len(current_chunk) + len(sentence_with_dot) <= chunk_size:
            current_chunk += sentence_with_dot
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
                # Generate overlap from the end of the current chunk
                words = current_chunk.split()
                # Find length of sentence representation of words
                overlap_words = words[-15:] if len(words) > 15 else words
                current_chunk = " ".join(overlap_words) + " " + sentence_with_dot
            else:
                # Single sentence exceeds chunk size limit, add it directly
                chunks.append(sentence_with_dot.strip())
                current_chunk = ""
                
    if current_chunk.strip():
        chunks.append(current_chunk.strip())
        
    return chunks
