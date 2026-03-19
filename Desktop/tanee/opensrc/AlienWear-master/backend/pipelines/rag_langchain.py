from dotenv import load_dotenv
import os

load_dotenv()  # Loads variables from .env

openai_api_key = os.getenv("OPENAI_API_KEY")


from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms import OpenAI
from langchain.chains import RetrievalQA

import json
# ...rest of your code...

# 1. Load your product data
with open('../data/OGMyntraFasionClothing.json', 'r') as f:
    data = json.load(f)

# 2. Prepare documents for indexing
documents = []
for item in data:
    text = f"Product ID: {item.get('Product_id', '')}\nTitle: {item.get('Title', '')}\nDescription: {item.get('Description', '')}\nPrice: {item.get('OriginalPrice (in Rs)', '')}"
    documents.append(text)

# 3. Create embeddings and vector store
embeddings = OpenAIEmbeddings(openai_api_key="openai_api_key")
vectorstore = FAISS.from_texts(documents, embeddings)

# 4. Set up the retrieval QA chain
qa = RetrievalQA.from_chain_type(
    llm=OpenAI(openai_api_key="openai_api_key"),
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

# 5. Function to answer questions
def answer_question(question):
    return qa.run(question)

# 6. Example usage
if __name__ == "__main__":
    question = "Kurta for girls"
    print(answer_question(question))