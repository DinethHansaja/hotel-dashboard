"use client";

import {
  Accessibility,
  Check,
  Monitor,
  Moon,
  RotateCcw,
  Settings2,
  Sun,
} from "lucide-react";
import { useThemePreferences, type ThemePreference } from "@/components/layout/ThemeProvider";

const themeChoices: {
  value: ThemePreference;
  label: string;
  description: string;
  Icon: typeof Sun;
}[] = [
  {
    value: "light",
    label: "Light",
    description: "A bright, classic guide experience.",
    Icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "A comfortable low-light experience.",
    Icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description: "Follow your device appearance setting.",
    Icon: Monitor,
  },
];

export default function SettingsPage() {
  const { theme, setTheme, reduceMotion, setReduceMotion, resetPreferences } =
    useThemePreferences();

  return (
    <main className="min-h-full bg-slate-50 px-5 py-8 text-slate-900 md:px-8 md:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#c5a46d]">
            Your experience
          </p>
          <h1 className="page-title mt-2">
            Settings
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
            Personalize the Colombo Dining &amp; Events Guide to suit your
            preferences.
          </p>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white surface-card shadow-sm">
          <div className="flex items-start gap-4 border-b border-slate-100 px-6 py-5 md:px-8">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c5a46d]/10 text-[#806744]">
              <Settings2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Appearance</h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose how the guide looks on this device.
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h3 className="text-sm font-semibold text-slate-800">Color theme</h3>
            <div role="radiogroup" aria-label="Color theme" className="mt-4 grid gap-3 md:grid-cols-3">
              {themeChoices.map(({ value, label, description, Icon }) => {
                const selected = theme === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setTheme(value)}
                    className={`group card-interactive rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c5a46d] ${
                      selected
                        ? "border-[#c5a46d] bg-[#c5a46d]/5 ring-1 ring-[#c5a46d]/30"
                        : "border-slate-200 hover:border-[#c5a46d]/60 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:text-[#806744]">
                        <Icon className="h-4 w-4" />
                      </span>
                      {selected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c5a46d] text-white">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </span>
                    <span className="mt-4 block text-sm font-semibold text-slate-900">{label}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Your theme preference is saved in this browser. Gold accents and
              the existing brand colors stay the same.
            </p>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white surface-card p-6 shadow-sm md:p-8">
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c5a46d]/10 text-[#806744]">
                <Accessibility className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Accessibility</h2>
                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                  Reduce motion effects across the guide if you prefer fewer
                  animations.
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={reduceMotion}
              aria-label="Reduce motion"
              onClick={() => setReduceMotion(!reduceMotion)}
              className={`relative mt-1 inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c5a46d] ${
                reduceMotion ? "bg-[#806744]" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  reduceMotion ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </section>

        <section className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white surface-card p-6 shadow-sm sm:flex-row sm:items-center md:p-8">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Reset preferences</h2>
            <p className="mt-1 text-sm text-slate-500">
              Restore the system theme and standard motion settings.
            </p>
          </div>
          <button
            type="button"
            onClick={resetPreferences}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 transition-colors hover:border-[#c5a46d] hover:text-[#806744] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c5a46d]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset settings
          </button>
        </section>
      </div>
    </main>
  );
}
