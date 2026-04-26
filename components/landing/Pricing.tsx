import Link from "next/link";
import { Check, Zap, ShieldCheck } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "For personal projects and experiments.",
    features: [
      "3 AI generated forms",
      "Standard micro-form UI",
      "Basic API access",
      "Up to 100 responses per month",
    ],
    ctaText: "Start for free",
    ctaLink: "/login",
    popular: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For developers and teams scaling up.",
    features: [
      "Unlimited AI forms",
      "Full headless API access",
      "WhatsApp bot generation",
      "Webhooks & external integrations",
      "Unlimited responses",
      "Advanced analytics",
    ],
    ctaText: "Upgrade to Pro",
    ctaLink: "/login",
    popular: true,
  },
];

export default function Pricing() {
  return (
    <section className="w-full flex flex-col items-center relative z-10 bg-[#0a0a0a]">
      <div className="w-full max-w-300 flex flex-col border-x border-neutral-700/30">
        {/* PRICING HEADER */}
        <div className="p-10 lg:p-16 border-b border-neutral-700/30 text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-mono text-white mb-4 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl">
            Start building for free. Upgrade when you need advanced headless
            features and automated WhatsApp distribution.
          </p>
        </div>

        {/* PRICING CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`p-10 lg:p-16 flex flex-col relative ${
                index === 0
                  ? "border-b md:border-b-0 md:border-r border-neutral-700/30"
                  : ""
              } ${plan.popular ? "bg-[#0d0d0d]" : ""}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-10 -translate-y-1/2">
                  <span className="bg-white text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    <Zap size={12} fill="currentColor" /> Recommended
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-medium text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-neutral-500">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-mono text-white tracking-tight">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-neutral-500 text-sm font-medium">
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-neutral-300"
                  >
                    <Check
                      size={18}
                      className={
                        plan.popular
                          ? "text-white shrink-0"
                          : "text-neutral-500 shrink-0"
                      }
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaLink}
                className={`w-full py-3 rounded-md text-sm font-medium text-center transition-all flex items-center justify-center ${
                  plan.popular
                    ? "bg-white text-black hover:bg-neutral-200"
                    : "bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 hover:border-neutral-700"
                }`}
              >
                {plan.ctaText}
              </Link>
            </div>
          ))}
        </div>

        {/* TRUST BADGE */}
        <div className="py-6 border-t border-neutral-700/30 flex items-center justify-center gap-2 text-xs text-neutral-500 bg-[#050505]">
          <ShieldCheck size={14} className="text-neutral-600" />
          Secure subscription management powered by Dodo Payments
        </div>
      </div>

      {/* LINE: Bottom of Pricing Section */}
      <div className="w-full h-px bg-neutral-700/30"></div>
    </section>
  );
}
