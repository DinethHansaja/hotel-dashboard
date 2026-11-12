export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 md:px-8 md:py-14">
      <section className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-sm md:px-10 md:py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#a47a27]">
          Colombo Dining & Events Guide
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          About Us
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Welcome to your guide to hotel buffets, restaurants, cafes and events
          across Colombo. Explore local options and find the right experience
          for your next visit.
        </p>
      </section>
    </main>
  );
}
