"use client";

import { useEffect, useState } from "react";
import { testimonials } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";

export function ContactTestimonialCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % testimonials.length);
    }, 8000);

    return () => window.clearInterval(timer);
  }, []);

  const testimonial = testimonials[index];

  return (
    <Reveal delay={180}>
      <blockquote className="card-premium relative mt-12 overflow-hidden rounded-3xl border border-pelagic-sand bg-white p-8 shadow-md sm:p-10">
        <p className="font-display text-5xl leading-none text-pelagic-gold/25">&ldquo;</p>
        <p className="mt-1 text-base leading-relaxed text-pelagic-steel sm:text-lg">
          {testimonial.quote}
        </p>
        <footer className="mt-6 border-t border-pelagic-sand pt-5">
          <p className="font-semibold text-pelagic-ink">{testimonial.author}</p>
          <p className="mt-0.5 text-sm text-pelagic-gold">{testimonial.company}</p>
        </footer>

        <div className="mt-6 flex items-center justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-pelagic-gold" : "w-2 bg-pelagic-mist hover:bg-pelagic-gold/50"
              }`}
            />
          ))}
        </div>
      </blockquote>
    </Reveal>
  );
}
