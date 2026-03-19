def format_response(response):
    """Format the response from the RAG chain."""
    answer = response["result"]
    sources = response["source_documents"]
    formatted_sources = [{"title": doc.metadata.get("title", ""), "url": doc.metadata.get("url", "")} for doc in sources]
    return {"answer": answer, "sources": formatted_sources}