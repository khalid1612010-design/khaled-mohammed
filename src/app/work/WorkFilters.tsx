"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Chip, ProjectCard, type WorkItem } from "@/components/ui";

export default function WorkFilters({
  items,
  categories,
  allLabel,
  ar,
}: {
  items: WorkItem[];
  categories: string[];
  allLabel: string;
  ar: boolean;
}) {
  const [cat, setCat] = useState<string>("All");
  const filtered = useMemo(
    () => (cat === "All" ? items : items.filter((p) => p.category === cat)),
    [cat, items],
  );
  const empty = ar ? "مفيش مشاريع في التصنيف ده لسه." : "No projects in this category yet.";

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-2">
        <Chip active={cat === "All"} onClick={() => setCat("All")}>{allLabel}</Chip>
        {categories.map((c) => (
          <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>
        ))}
      </div>
      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard p={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {filtered.length === 0 && <p className="py-20 text-center text-mut">{empty}</p>}
    </div>
  );
}
