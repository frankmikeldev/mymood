"use client";

import FeatureLayout from "@/components/FeatureLayout";

export default function CalmingPlaylistPage() {
  const songs = [
    { title: "Weightless – Marconi Union", reason: "Scientifically proven to reduce anxiety by 65%." },
    { title: "Rain Sounds", reason: "Helps improve sleep, peace, and mental clarity." },
    { title: "Someone Like You – Adele", reason: "Allows emotional release and reflection." },
    { title: "Strawberry Swing – Coldplay", reason: "Boosts mood and reduces stress hormones." },
  ];

  return (
    <FeatureLayout
      title="Calming Playlist 🎧"
      description="Curated playlist to help you relax, focus, and restore emotional balance."
      content={
        <div className="space-y-4">
          {songs.map((song, i) => (
            <div key={i} className="p-4 border bg-[var(--color-box)] rounded-lg">
              <h3 className="font-semibold">{song.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)]">{song.reason}</p>
            </div>
          ))}
        </div>
      }
    />
  );
}