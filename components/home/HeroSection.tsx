import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[28px] bg-[#0b1728] px-7 py-10 text-white shadow-sm md:px-12 md:py-12 lg:px-16 lg:py-14">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#c5a46d]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative max-w-4xl">
        {/* Label */}
        <div className="mb-5 inline-flex items-center rounded-full border border-[#c5a46d]/30 bg-[#c5a46d]/10 px-4 py-2">
          <span className="text-sm font-semibold text-[#c5a46d]">
            Explore Colombo
          </span>
        </div>

        {/* Heading */}
        <h1 className="editorial-title max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
          Discover the Best
          <span className="block text-[#c5a46d]">
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
            className="ui-button inline-flex items-center justify-center bg-[#c5a46d] px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-[#ae8c55]"
          >
            Explore Buffets
            <span className="ml-2 text-lg">→</span>
          </Link>

          <a
            href="#hotel-map"
            className="ui-button ui-button-secondary inline-flex items-center justify-center border-slate-600 bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Explore Hotels
          </a>
        </div>
      </div>
    </section>
  );
}
