import os
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from app.core.config import settings

_generator = None

PROMPT_TEMPLATES = {
    "normal": """<|system|>
You are Prepzo, an AI study assistant for engineering students. Answer the user's question clearly and accurately using the provided context. If the context doesn't contain enough information, say so honestly.
</s>
<|user|>
Context from study materials:
{context}

Question: {question}
</s>
<|assistant|>
""",
    "2mark": """<|system|>
You are Prepzo, an AI exam assistant. Generate a concise 2-mark exam answer (2-3 sentences, definition-style). Be precise, technical, and to the point.
</s>
<|user|>
Context from study materials:
{context}

Question: {question}
</s>
<|assistant|>
""",
    "8mark": """<|system|>
You are Prepzo, an AI exam assistant. Generate a structured 8-mark exam answer with:
1. Brief Introduction (1-2 sentences)
2. Key Points (4-5 numbered points with short explanations)
3. Examples or Diagram description (if applicable)
4. Conclusion (1-2 sentences)
Keep the answer around 200-300 words.
</s>
<|user|>
Context from study materials:
{context}

Question: {question}
</s>
<|assistant|>
""",
    "13mark": """<|system|>
You are Prepzo, an AI exam assistant. Generate a highly detailed 13-mark exam answer with:
1. Introduction (2-3 sentences)
2. Detailed Explanation (6-8 numbered points with sub-points)
3. Diagram or Flowchart Description (explain how to draw it)
4. Key Formulas / Equations (if applicable)
5. Practical Examples
6. Key Advantages & Disadvantages
7. Conclusion
Keep the answer around 500-800 words.
</s>
<|user|>
Context from study materials:
{context}

Question: {question}
</s>
<|assistant|>
""",
    "viva": """<|system|>
You are Prepzo, an academic viva examiner. Generate 4-5 potential viva (oral exam) questions along with crisp, brief answers based on the study materials.
Format:
Q1: ...
A1: ...
</s>
<|user|>
Context from study materials:
{context}

Topic/Question: {question}
</s>
<|assistant|>
""",
    "quiz": """<|system|>
You are Prepzo, an exam quiz generator. Generate a 3-question Multiple Choice Quiz (MCQ) based on the context. Provide options (A, B, C, D) and specify the Correct Answer with an explanation for each.
</s>
<|user|>
Context from study materials:
{context}

Topic/Question: {question}
</s>
<|assistant|>
""",
    "notes": """<|system|>
You are Prepzo, a study notes compiler. Create structured, clear, and comprehensive revision notes for the student based on the context. Use headings, bullet points, and highlight key terms.
</s>
<|user|>
Context from study materials:
{context}

Topic/Question: {question}
</s>
<|assistant|>
"""
}

MAX_TOKENS = {
    "normal": 512,
    "2mark": 180,
    "8mark": 512,
    "13mark": 1024,
    "viva": 512,
    "quiz": 512,
    "notes": 1024
}

def get_generator():
    global _generator
    if _generator is None:
        model_name = settings.MODEL_NAME
        print(f"Loading local LLM model: {model_name}")
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device for inference: {device}")
        
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch.float16 if device == "cuda" else torch.float32,
            device_map="auto" if device == "cuda" else None
        )
        
        if device == "cpu":
            model = model.to(device)
            
        _generator = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            device=0 if device == "cuda" else -1
        )
        print("TinyLlama model loaded successfully.")
    return _generator

def generate_tinyllama_response(question: str, context: str, answer_type: str = "normal") -> str:
    """Generate answer using local TinyLlama."""
    template = PROMPT_TEMPLATES.get(answer_type, PROMPT_TEMPLATES["normal"])
    prompt = template.format(context=context[:2000], question=question)
    
    max_new_tokens = MAX_TOKENS.get(answer_type, 512)
    generator = get_generator()
    
    try:
        output = generator(
            prompt,
            max_new_tokens=max_new_tokens,
            do_sample=True,
            temperature=0.7,
            top_p=0.9,
            repetition_penalty=1.15,
            return_full_text=False
        )
        
        response = output[0]["generated_text"].strip()
        
        # Clean tags if left in text
        for tag in ["</s>", "<|user|>", "<|assistant|>", "<|system|>"]:
            response = response.replace(tag, "")
            
        return response.strip()
    except Exception as e:
        print(f"Error generating text: {e}")
        return f"Sorry, I encountered an error while formulating the answer: {str(e)}"
