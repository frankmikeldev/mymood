"use client";

import React from "react";

export default function FeatureLayout({
  title,
  description,
  content,
}: {
  title: string;
  description: string;
  content: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] p-6 md:p-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Dynamic Content */}
        <div>{content}</div>

        {/* Footer */}
        <p className="text-xs mt-10 text-center text-[var(--color-text-muted)]">
          ⚠️ Not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
}