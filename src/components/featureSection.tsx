import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid"
import {

    Cross,
    Leaf,
    MessageCircle,
    Flag,
    
} from "lucide-react";


const itemsSample: BentoItem[] = [
  {
    title: "Medicine Insights",
    meta: "Ask about any medicine",
    description:
      "Understand dosage, side effects, and usage of common Indian medicines instantly with AI.",
    icon: <Cross className="w-4 h-4 text-red-500" />,
    status: "Live",
    tags: ["Medicine", "AI", "Safety"],
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: "Home Remedies",
    meta: "Ayurvedic & household tips",
    description:
      "Discover safe, effective remedies from Ayurveda and Indian home practices for everyday problems.",
    icon: <Leaf className="w-4 h-4 text-green-500" />,
    status: "Updated",
    tags: ["Ayurveda", "Natural", "Wellness"],
  },
  {
    title: "Smart Q&A",
    meta: "Text-based AI chat",
    description:
      "Chat with an AI trained on Indian medical data. No jargon, just answers that make sense.",
    icon: <MessageCircle className="w-4 h-4 text-blue-500" />,
    tags: ["AI", "Chatbot", "Support"],
    colSpan: 2,
  },
  {
    title: "Indian-Focused",
    meta: "Built for Bharat",
    description:
      "Covers brands, remedies, and concerns relevant to Indian users — from Dolo to Dabur.",
    icon: <Flag className="w-4 h-4 text-orange-500" />,
    status: "Beta",
    tags: ["India", "Localized", "Accessible"],
  },
];


function BentoGridDemo() {
    return <BentoGrid items={itemsSample} />
}

export { BentoGridDemo }