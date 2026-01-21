# Jarvis

**Your personal AI assistant with a dedicated memory.**

### What's this all about?

So, what is this? Jarvis is a custom-built Retrieval-Augmented Generation (RAG) agent designed to act as a "second brain." Most chatbots reset their context when you close the tab, but Jarvis is built to remember.

I built this to solve the "Build Your Own Jarvis" challenge, specifically tackling the requirement for a self-hosted LLM architecture that handles persistent memory without being slow or clunky.

### Core Features

* **Long-Term Memory:** Jarvis doesn't just chat; it retains information. Tell it your API keys, your project details, or your name, and it stores that specific fact in a vector database for later retrieval.
* **Intent Classification:** It’s smart enough to know the difference between a command and a question. If you say "My project code is 123," it switches to **STORE** mode. If you ask "What is my project code?", it switches to **QUERY** mode.
* **Transparent Logic:** The UI includes a "Thought Process" dropdown. You can see exactly what the backend is doing—classifying intent, searching memory, or synthesizing an answer.
* **Local Embeddings:** We use a local transformer model on the server to generate vectors. This keeps the memory process fast and reduces dependency on external embedding APIs.

### How it Works

Dumping context into a prompt is inefficient. Jarvis uses a structured pipeline to handle information intelligently.

1. **The Classifier:** First, the input hits a classifier (Llama 3) that decides the user's intent. Is this a fact to save or a question to answer?
2. **The Vault:** If it's a fact, we run it through a local embedding model (`all-MiniLM-L6-v2`) to turn text into numbers, then store it in **Pinecone**.
3. **The Brain:** If it's a question, we search Pinecone for relevant context, retrieve it, and feed it into **Llama 3.3 70b** (via Groq) to generate the final answer.

### The Tech Stack

This project connects a few high-performance tools to get the job done.

**Frontend**

* React
* Tailwind CSS (Custom Gemini-style dark theme)
* Lucide React (Icons)

**Backend**

* Node.js & Express
* Groq SDK (Llama 3.3 70b)
* Pinecone (Vector Database)
* @xenova/transformers (Local Embeddings)

### Getting Started

Ready to get this running? Here’s the deal.

**1. Clone the repo**

```bash
git clone https://github.com/dhruval30/Diligent-Assignment-Dhruval.git

```

**2. Set up the Backend**

Navigate to the backend and install the dependencies.

```bash
cd backend
npm install

```

Create a `.env` file in the `backend` directory with your keys:

```env
GROQ_API_KEY="your_groq_api_key"
PINECONE_API_KEY="your_pinecone_api_key"
PORT=5001

```

Start the server:

```bash
npm run dev

```

**3. Set up the Frontend**

Open a new terminal, go to the frontend directory, and install the UI packages.

```bash
cd frontend
npm install

```

Start the interface:

```bash
npm run dev

```

The app should now be running on your local host.

### Author

**Dhruval Padia**
B.Tech Computer Science and Engineering
Class of 2026
22WU0101028