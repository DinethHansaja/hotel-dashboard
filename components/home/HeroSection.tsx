import Link from "next/link";

export default function HeroSection({ heroImage }: { heroImage?: string | null }) {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl bg-[#0b1728] px-6 py-12 text-white md:px-12 md:py-16 lg:px-16 lg:py-20">
      {heroImage && (
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-[#0b1728]/75" />

      <div className="relative max-w-4xl">
        <div className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e5d2b1]">
            Colombo, Sri Lanka
          </span>
        </div>

        <h1 className="editorial-title max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
          Find your next place to eat, stay, or celebrate.
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
          Compare hotel buffets, discover restaurants and cafés, contact hotels about events, and read guest reviews in one local guide.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/buffet"
            className="ui-button inline-flex items-center justify-center bg-[#c5a46d] px-6 py-3.5 text-sm font-semibold text-[#0b1728] transition hover:bg-[#ae8c55]"
          >
            Browse buffets
          </Link>
          <Link
            href="/restaurants"
            className="ui-button inline-flex items-center justify-center border border-white/50 bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Explore restaurants
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
          <Link href="/hotels" className="hover:text-white">Hotels</Link>
          <Link href="/cafes" className="hover:text-white">Cafés</Link>
          <Link href="/events" className="hover:text-white">Events &amp; weddings</Link>
          <Link href="/reviews" className="hover:text-white">Guest reviews</Link>
        </div>
      </div>
    </section>
  );
}
