"use client";

export default function TrackerList({ entries }: { entries: any[] }) {
  const moodLabels = ["Very Sad", "Sad", "Neutral", "Happy", "Very Happy"];
  const moodEmojis = ["😞", "😕", "😐", "🙂", "😄"];

  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-[var(--color-text-header)] mb-4">
        Recent Entries
      </h3>

      <ul className="space-y-3">
        {entries.map((item) => (
          <li
            key={item.id}
            className="border-b border-[var(--color-border)] pb-2 text-sm flex justify-between items-center"
          >
            <span className="flex items-center gap-2">
              <span>{moodEmojis[item.mood - 1]}</span>
              <span className="font-medium">{moodLabels[item.mood - 1]}</span>
              <span className="text-[var(--color-text-body)] opacity-70">
                — {item.notes || "No notes"}
              </span>
            </span>
            <span className="text-xs opacity-60">
              {new Date(item.created_at).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
