import * as dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});
type Message = {
    role: 'user' | 'model';
    parts: { text: string }[];
};

const History: Message[] = [];


async function transformQuery(question: string){

History.push({
    role:'user',
    parts:[{text:question}]
    })  

const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: History,
    config: {
      systemInstruction: `You are a query rewriting expert for a health-focused AI assistant.
Your job is to take the provided chat history and the "Follow Up User Question" and rewrite it into a standalone medical query that can be understood without any previous context.
Preserve any sense of urgency or concern expressed by the user. 
Output only the rewritten question.
      `,
    },
 });
 
 History.pop()
 
 return response.text

}


export async function chatWithDocument(question: string) {

    const queries = await transformQuery(question);

    const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'text-embedding-004',
    });
 
 const queryVector = await embeddings.embedQuery(queries ?? ""); 
//  query vector


// make connection with pinecone
 const pinecone = new Pinecone();
 const pineconeIndexName = process.env.PINECONE_INDEX_NAME;
 if (!pineconeIndexName) {
    throw new Error("PINECONE_INDEX_NAME environment variable is not set.");
 }
 const pineconeIndex = pinecone.Index(pineconeIndexName);

const searchResults = await pineconeIndex.query({
    topK: 10,
    vector: queryVector,
    includeMetadata: true,
    });

//   console.log(searchResults);  

//   top 10 documents: 10 metadata text part 10 documebnt

const context = searchResults.matches
                   .map(match => match.metadata && match.metadata.text ? match.metadata.text : "")
                   .join("\n\n---\n\n");
// create the context for the LLM

// Gemini


History.push({
    role:'user',
    parts:[{text:queries || ""}]
    })  


    const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: History,
    config: {
      systemInstruction: `You are a verified Medical Assistant for the MediChat platform.

Use ONLY the context provided from the retrieved documents to answer user questions about symptoms, diseases, treatments, or remedies.

If the context does NOT contain relevant information, respond with:
"I could not find the answer in the provided document."

If the user asks about a disease, symptom, or remedy that is not clear, ask them to be more specific.

Make responses helpful, clear, and based ONLY on the given data. Do not make up answers.

Always try to guide the user toward a more specific or answerable question if context is lacking.


      
      Context: ${context}
      `,
    },
   });


   History.push({
    role:'model',
    parts:[{text:response.text || ""}]
  })

  return response.text;

}