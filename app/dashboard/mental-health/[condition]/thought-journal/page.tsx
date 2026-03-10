"use client";

import FeatureLayout from "@/components/FeatureLayout";
import { useState } from "react";

export default function ThoughtJournalPage() {
  const [entry, setEntry] = useState("");

  return (
    <FeatureLayout
      title="Thought Journal ✍️"
      description="Write your thoughts, track your emotions, and reflect safely."
      content={
        <div>
          <textarea
            className="w-full p-4 border rounded-lg bg-transparent text-sm h-40 resize-none"
            placeholder="Write your thoughts..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
          />

          <button className="mt-4 px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white">
            Save Entry
          </button>
        </div>
      }
    />
  );
}