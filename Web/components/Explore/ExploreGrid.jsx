"use client";

import { ExploreCard } from "./ExploreCard";

export function ExploreGrid({ posts, onOpenPost }) {
  return (
    <section className="grid auto-rows-[180px] grid-cols-3 gap-[2px] md:gap-1">
      {posts.map((post, index) => {
        const isLarge = index % 7 === 2 || index % 7 === 5;

        return (
          <div
            key={post.id}
            className={isLarge ? "col-span-1 row-span-2" : "col-span-1 row-span-1"}
          >
            <ExploreCard post={post} onOpen={() => onOpenPost(post)} />
          </div>
        );
      })}
    </section>
  );
}