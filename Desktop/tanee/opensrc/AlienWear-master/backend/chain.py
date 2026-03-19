from langchain.vectorstores import Pinecone
from langchain.embeddings.openai import OpenAIEmbeddings
import pinecone

# Initialize Pinecone and OpenAI embeddings
pinecone.init(api_key="YOUR_PINECONE_API_KEY", environment="YOUR_PINECONE_ENVIRONMENT")
index_name = "your-pinecone-index"

def get_retriever():
    embeddings = OpenAIEmbeddings(openai_api_key="YOUR_OPENAI_API_KEY")
    retriever = Pinecone(index_name=index_name, embedding_function=embeddings.embed_query)
    return retriever