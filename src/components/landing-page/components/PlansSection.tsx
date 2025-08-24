import React from "react";
import { Check, Star, Zap, Crown, Users, Target, Shield, BookOpen, Clock, TrendingUp } from "lucide-react";

interface PlansSectionProps {
  id: string;
}

export default function PlansSection({ id }: PlansSectionProps) {
  const plans = [
    {
      name: "Prime",
      price: "₹999",
      period: "/month",
      description: "Perfect for individual students and small groups",
      popular: false,
      features: [
        "AI-powered eligibility checking",
        "Personalized study plans",
        "Interview preparation resources",
        "Company insights & analytics",
        "Resume builder & optimization",
        "Mock interview sessions (5/month)",
        "Email support",
        "Basic progress tracking"
      ],
      icon: Star,
      color: "from-blue-500 to-cyan-500",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      badge: null
    },
    {
      name: "Prime+",
      price: "₹1,999",
      period: "/month",
      description: "Advanced features for placement cells and institutions",
      popular: true,
      features: [
        "Everything in Prime",
        "Advanced AI interview coaching",
        "Unlimited mock interviews",
        "Placement cell dashboard",
        "Company management tools",
        "Bulk student onboarding",
        "Advanced analytics & reports",
        "Priority support (24/7)",
        "Custom branding options",
        "API access & integrations",
        "White-label solutions",
        "Dedicated account manager"
      ],
      icon: Crown,
      color: "from-purple-500 to-pink-500",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      badge: "Most Popular"
    }
  ];

  return (
    <section id={id} className="py-24 relative z-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-50"></div>
      
      <Container>
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Plan
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Unlock your potential with our comprehensive placement solutions. 
            From individual students to entire institutions, we have the perfect plan for you.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? "bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-purple-500/50 shadow-2xl shadow-purple-500/20"
                    : "bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-gray-600"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      {plan.badge}
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} mb-4 shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-green-400" />
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${plan.buttonColor}`}
                >
                  Get Started
                </button>

                {/* Additional Benefits */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span>30-day money-back guarantee</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-gray-400 mb-6">
              We offer enterprise solutions for large institutions with custom requirements. 
              Get in touch with our team for a personalized quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
                Contact Sales
              </button>
              <button className="px-8 py-3 border-2 border-gray-600 text-gray-300 font-semibold rounded-xl hover:border-gray-500 hover:text-white transition-all duration-300">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-6">Trusted by 500+ institutions across India</p>
          <div className="flex items-center justify-center space-x-8 text-gray-500">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span className="text-sm">50,000+ Students</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span className="text-sm">95% Success Rate</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">ISO 27001 Certified</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Container({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      {...props}
    />
  );
}
