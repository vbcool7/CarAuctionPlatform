
import {
  ShieldCheck,
  Headphones,
  BadgeHelp,
  Clock3,
} from "lucide-react";

const supportItems = [
  {
    icon: BadgeHelp,
    title: "Find Quick Answers",
    description: "Browse our FAQs to get instant solutions.",
  },
  {
    icon: Headphones,
    title: "Still Need Help?",
    description: "Our support team is here to assist you.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    description: "We're committed to providing a safe bidding experience.",
  },
  {
    icon: Clock3,
    title: "24/7 Support",
    description: "Reach out anytime via chat, email or phone.",
  },
];

function FAQsFeaturebar() {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="border border-slate-200 rounded-3xl bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
            {supportItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-6 ${
                    index !== supportItems.length - 1
                      ? "xl:border-r border-slate-100"
                      : ""
                  }`}
                >
                  {/* Icon */}
                  <div className="shrink-0">
                    <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
                      <Icon
                        size={26}
                        className="text-[#D97706]"
                        strokeWidth={2}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="font-semibold text-[#0B1E3D] text-[17px]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQsFeaturebar;