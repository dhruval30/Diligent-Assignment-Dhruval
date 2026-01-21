const { Pinecone } = require('@pinecone-database/pinecone');
const { pipeline } = require('@xenova/transformers');

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

const indexName = 'jarvis-memory';
let embedder = null;

const getEmbedder = async () => {
  if (!embedder) {
    console.log("Initializing embedding model (downloading first time)...");
    
    // We attach a progress_callback to see the download status
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      progress_callback: (data) => {
        if (data.status === 'progress') {
          // Log progress every 10% to avoid spamming
          if (Math.round(data.progress) % 10 === 0) {
            console.log(`Model loading: ${Math.round(data.progress)}%`);
          }
        }
      }
    });
    console.log("Embedding model ready.");
  }
  return embedder;
};

const getEmbedding = async (text) => {
  try {
    const generateEmbedding = await getEmbedder();
    const output = await generateEmbedding(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  } catch (err) {
    console.error("Error generating embedding:", err);
    throw err;
  }
};

const searchMemory = async (query) => {
  try {
    console.log(`Generating vector for query: ${query}`);
    const vector = await getEmbedding(query);
    
    console.log("Querying Pinecone database...");
    const index = pinecone.index(indexName);
    
    const queryResponse = await index.query({
      vector: vector,
      topK: 3,
      includeMetadata: true,
    });

    console.log(`Found ${queryResponse.matches.length} matches in memory.`);
    return queryResponse.matches.map(match => match.metadata.text).join('\n\n');
  } catch (error) {
    console.error("Pinecone Query Error:", error);
    return ""; 
  }
};

const storeMemory = async (text) => {
  console.log(`Storing new memory: ${text}`);
  const vector = await getEmbedding(text);
  const index = pinecone.index(indexName);
  
  await index.upsert([{
    id: Date.now().toString(),
    values: vector,
    metadata: { text }
  }]);
  console.log("Memory successfully stored in Pinecone.");
};

module.exports = { searchMemory, storeMemory };