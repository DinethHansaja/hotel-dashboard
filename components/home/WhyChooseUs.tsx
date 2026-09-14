import {
  MapPin,
  UtensilsCrossed,
  Star,
  ArrowRight,
} from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: MapPin,
      title: "Explore Locations",
      description:
        "Discover hotels and dining experiences across Colombo using the interactive map.",
    },
    {
      icon: UtensilsCrossed,
      title: "Discover Buffets",
      description:
        "Compare buffet experiences, prices and dining options in one place.",
    },
    {
      icon: Star,
      title: "Compare Experiences",
      description:
        "Find the right hotel or dining experience based on your preferences.",
    },
  ];

  return (
    <div className="flex h-full min-h-full flex-col rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">

      {/* HEADER */}
      <div>

        <p className="text-sm font-semibold text-[#c58d24]">
          Why Colombo Guide?
        </p>

        <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-[#111827]">
          Everything you need to explore Colombo
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Discover hotels, restaurants and buffet experiences with
          useful information to help you choose the right place.
        </p>

      </div>


      {/* FEATURES */}
      <div className="mt-6 space-y-3">

        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d9a441]/30 hover:bg-[#fffaf0] hover:shadow-sm"
            >

              <div className="flex gap-4">

                {/* ICON */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff2c9]">
                  <Icon
                    className="h-5 w-5 text-[#c58d24]"
                    strokeWidth={2}
                  />
                </div>


                {/* CONTENT */}
                <div className="min-w-0">

                  <h3 className="text-sm font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {feature.description}
                  </p>

                </div>

              </div>

            </div>
          );
        })}

      </div>


      {/* CTA */}
      <div className="mt-auto pt-5">

        <div className="flex items-center justify-between rounded-2xl bg-[#07101f] p-5 text-white">

          <div>

            <h3 className="text-sm font-bold">
              Ready to explore Colombo?
            </h3>

            <p className="mt-1 max-w-[230px] text-xs leading-5 text-slate-300">
              Start by exploring our hotel and buffet collection.
            </p>

          </div>


          {/* ARROW */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">

            <ArrowRight
              className="h-5 w-5 text-[#d9a441]"
              strokeWidth={2}
            />

          </div>

        </div>

      </div>

    </div>
  );
}