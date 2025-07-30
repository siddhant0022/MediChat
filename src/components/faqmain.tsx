import { FAQ } from '@/components/faq-tabs';

const FAQDemo = () => {
  const categories = {
    general: "General",
    sources: "Sources",
    techstack: "Technology Stack",
    precaution: "Precautions & Disclaimers"
  };

  const faqData = {
    general: [
      {
        question: "What can I ask this AI assistant?",
        answer:
          "You can ask about Indian medicines, their uses, dosages, side effects, combinations, and even safe home remedies. Just type your query in simple language."
      },
      {
        question: "Is it free to use?",
        answer:
          "Yes, our platform is free for personal and educational use. We may introduce premium features later for advanced users."
      },
      {
        question: "Does this work on mobile devices?",
        answer:
          "Absolutely. The platform is responsive and works on all modern smartphones, tablets, and desktop browsers."
      }
    ],
    sources: [
      {
        question: "Where does the AI get its information from?",
        answer:
          "The AI is trained on publicly available medical literature, government health portals, and drug databases like MedlinePlus, WHO publications, and India-specific resources like CIMS India and Health Ministry advisories."
      },
      {
        question: "Is this approved by any medical authority?",
        answer:
          "No, this AI is for informational purposes only and is not a certified medical tool. We follow best practices and use trusted sources, but it's not a replacement for a licensed healthcare provider."
      },
      {
        question: "How frequently is the information updated?",
        answer:
          "We continuously update our vector database with new medical guidelines, drug recalls, and policy changes from global and Indian health authorities."
      }
    ],
    techstack: [
      {
        question: "What technologies power this assistant?",
        answer:
          "Our system is powered by Retrieval-Augmented Generation (RAG), which combines vector databases with LLMs (Large Language Models). We use embeddings to store context and fetch relevant answers."
      },
      {
        question: "What is a vector database?",
        answer:
          "A vector database stores content in numerical form (vectors), making it easier to search based on meaning rather than keywords. We use tools like Pinecone, Weaviate, or Qdrant for this."
      },
      {
        question: "Do you use ChatGPT or another LLM?",
        answer:
          "Yes, the backend integrates with trusted LLM providers (like OpenAI) and enriches the response using your query + medical context fetched from our vector store."
      }
    ],
    precaution: [
      {
        question: "Should I rely only on this AI for treatment?",
        answer:
          "No. This tool is designed to assist, not replace professional medical advice. Always consult a licensed doctor before taking any action based on the AI’s suggestions."
      },
      {
        question: "What if the AI gives me a wrong answer?",
        answer:
          "Although we use high-quality data, no AI is perfect. If something seems off or risky, double-check with a healthcare provider."
      },
      {
        question: "Can I use this in emergencies?",
        answer:
          "No. For emergencies, immediately contact a doctor, ambulance, or visit a nearby hospital. This AI is not designed for emergency diagnosis or treatment."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <FAQ
        title="Frequently Asked Questions"
        subtitle="How it works, where it comes from, and what you need to know"
        categories={categories}
        faqData={faqData}
      />
    </div>
  );
};

export default FAQDemo;
