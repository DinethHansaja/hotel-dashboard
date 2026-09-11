import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[28px] bg-[#07101f] px-7 py-10 text-white shadow-sm md:px-12 md:py-12 lg:px-16 lg:py-14">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#d9a441]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative max-w-4xl">
        {/* Label */}
        <div className="mb-5 inline-flex items-center rounded-full border border-[#d9a441]/30 bg-[#d9a441]/10 px-4 py-2">
          <span className="text-sm font-semibold text-[#f1bd45]">
            Explore Colombo
          </span>
        </div>

        {/* Heading */}
        <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
          Discover the Best
          <span className="block text-[#ffb900]">
            Hotels in Colombo
          </span>
        </h1>

        {/* Description */}
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
          Explore hotels, restaurants, buffet experiences, events and dining
          options across Colombo. Find the perfect place for your next
          experience.
        </p>

        {/* CTA buttons */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/buffet"
            className="inline-flex items-center justify-center rounded-xl bg-[#ffb900] px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-[#f5ae00] hover:shadow-lg"
          >
            Explore Buffets
            <span className="ml-2 text-lg">→</span>
          </Link>

          <a
            href="#hotel-map"
            className="inline-flex items-center justify-center rounded-xl border border-slate-600 bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Explore Hotels
          </a>
        </div>
      </div>
    </section>
  );
}