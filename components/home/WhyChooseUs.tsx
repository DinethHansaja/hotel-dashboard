export default function WhyChooseUs() {
  const features = [
    {
      icon: "⌖",
      title: "Explore Locations",
      description:
        "Discover hotels and dining experiences across Colombo using the interactive map.",
    },
    {
      icon: "🍽",
      title: "Discover Buffets",
      description:
        "Compare buffet experiences, prices and dining options in one place.",
    },
    {
      icon: "★",
      title: "Compare Experiences",
      description:
        "Find the right hotel or dining experience based on your preferences.",
    },
  ];

  return (
    <div className="flex h-full flex-col rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      <div>
        <p className="text-sm font-semibold text-[#c58d24]">
          Why Colombo Guide?
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#111827]">
          Everything you need to explore Colombo
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Discover hotels, restaurants and buffet experiences with useful
          information to help you choose the right place.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-[#d9a441]/30 hover:bg-[#fffaf0]"
          >
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff2c9] text-lg">
                {feature.icon}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-5">
        <div className="rounded-2xl bg-[#07101f] p-5 text-white">
          <h3 className="text-sm font-bold">
            Ready to explore Colombo?
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-300">
            Start by exploring our hotel and buffet collection.
          </p>
        </div>
      </div>
    </div>
  );
}