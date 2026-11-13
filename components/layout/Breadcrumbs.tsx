"use client";

import Link from "next/link";

export type BreadcrumbItem = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link href="/" className="transition hover:text-[#8b682b]">Home</Link></li>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              <span aria-hidden="true" className="text-slate-300">/</span>
              {item.href && !current ? <Link href={item.href} className="transition hover:text-[#8b682b]">{item.label}</Link> : <span aria-current="page" className="text-slate-700">{item.label}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
