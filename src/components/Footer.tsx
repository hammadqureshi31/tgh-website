"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { openBooksyWidget } from "@/lib/utils";
import { PiTiktokLogo } from "react-icons/pi";
import { FiFacebook } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  {
    icon: FaInstagram,
    label: "Instagram",
    href: "https://www.instagram.com/tghbarbershop/",
  },
  // {
  //   icon: Twitter,
  //   label: "Twitter / X",
  //   href: "https://twitter.com/tghofficial",
  // },
  {
    icon: FiFacebook,
    label: "Facebook",
    href: "https://www.facebook.com/TGHbarbershop/",
  },
  {
    icon: PiTiktokLogo,
    label: "TikTok",
    href: "https://www.tiktok.com/@thegentryhousebarbershop",
  },
];

const handleNavClick = (href: string) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      // TODO: Connect to your newsletter service (Mailchimp, SendGrid, etc.)
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-luxury-midnight border-t border-luxury-graphite/50">
      {/* Main Footer */}
      <div className="max-w-luxury mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="md:flex gap-12 lg:gap-10">
          {/* Brand Column */}
          <div className="flex-1 mb-6 md:mb-0">
            {/* Logo */}
            <div className="mb-6">
              {/* <span
                className="font-mono text-luxury-amber text-sm uppercase block mb-1"
                style={{ letterSpacing: '0.35em' }}
              >
                TGH
              </span> */}
              <img
                src="/logo/tgh-logo-compress.png"
                alt=""
                className="mix-blend-screen h-40 w-auto"
              />
              {/* <span className="font-playfair text-luxury-ivory text-lg">
                The Gentlemen&apos;s House
              </span> */}
            </div>

            <p className="font-outfit text-luxury-pearl/40 text-sm leading-relaxed mb-8">
              Where modern gentlemen come to refine their image. Premium
              grooming experience crafted for those who demand excellence.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center border border-luxury-graphite text-luxury-pearl hover:border-luxury-amber hover:text-luxury-amber transition-all duration-300"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
          <div>
            {/* Newsletter Signup */}
            <div className="mb-8 lg:mb-12 md:flex items-center">
              <div className="flex-1">
                <h3
                  className="font-mono text-luxury-amber text-base uppercase mb-4"
                  style={{ letterSpacing: "0.25em" }}
                >
                  Newsletter
                </h3>
                <p className="font-outfit text-luxury-pearl/50 text-sm mb-4 leading-relaxed">
                  Get exclusive grooming tips and special offers delivered to
                  your inbox.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="flex">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading || subscribed}
                    className="w-full px-4 py-2.5 bg-luxury-graphite/20 border border-luxury-graphite text-luxury-ivory placeholder-luxury-pearl/30 font-outfit text-sm focus:outline-none focus:border-luxury-amber transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading || subscribed}
                  whileHover={{ scale: subscribed ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-fit px-4 py-2.5 bg-luxury-amber text-luxury-midnight font-outfit font-medium text-xs uppercase tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ letterSpacing: "0.12em" }}
                >
                  {subscribed
                    ? "✓ Subscribed!"
                    : loading
                      ? "Subscribing..."
                      : "Subscribe"}
                </motion.button>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-outfit text-xs text-red-400"
                  >
                    {error}
                  </motion.p>
                )}

                {subscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-outfit text-xs text-luxury-amber"
                  >
                    Thanks for subscribing!
                  </motion.p>
                )}
              </form>
            </div>

            {/* Navigation & Contact Info */}
            <div className="grid text-center md:text-left grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-5">
              {/* Contact Info */}
              <div>
                <h3
                  className="font-mono text-luxury-amber text-xs uppercase mb-6"
                  style={{ letterSpacing: "0.25em" }}
                >
                  Contact
                </h3>
                <ul className="space-y-4">
                  <li className="flex text-center justify-center md:justify-start gap-3">
                    <MapPin
                      size={14}
                      className="text-luxury-amber/60 shrink-0 mt-0.5"
                    />
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=11112+Veterans+Memorial+Pkwy,+Lake+Saint+Louis,+MO+63367"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-outfit text-luxury-pearl/50 text-sm leading-relaxed hover:text-luxury-amber transition-colors duration-300"
                    >
                      11112 Veterans Memorial Pkwy,<br />
                      Lake Saint Louis, 63367
                    </a>
                  </li>
                  <li className="flex text-center justify-center md:justify-start items-center  gap-3">
                    <Phone
                      size={14}
                      className="text-luxury-amber/60 shrink-0"
                    />
                    <a
                      href="tel:+16362650109"
                      className="font-outfit text-luxury-pearl/50 text-sm hover:text-luxury-amber transition-colors duration-300"
                    >
                      +1 (636) 265-0109
                    </a>
                  </li>
                  <li className="flex text-center justify-center md:justify-start items-center  gap-3">
                    <Mail size={14} className="text-luxury-amber/60 shrink-0" />
                    <a
                      href="mailto:thegentryhousebarbershop@gmail.com"
                      className="font-outfit text-luxury-pearl/50 text-sm hover:text-luxury-amber transition-colors duration-300"
                    >
                      thegentryhousebarbershop@gmail.com
                    </a>
                  </li>
                </ul>
              </div>

              {/* Navigation */}
              <div className=" md:pl-12">
                <h3
                  className="font-mono text-luxury-amber text-xs uppercase mb-6"
                  style={{ letterSpacing: "0.25em" }}
                >
                  Navigation
                </h3>
                <nav>
                  <ul className="space-y-3">
                    {navLinks.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(link.href);
                          }}
                          className="font-outfit text-luxury-pearl/50 text-sm hover:text-luxury-amber transition-colors duration-300"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Hours */}
              <div>
                <h3
                  className="font-mono text-luxury-amber text-xs uppercase mb-6"
                  style={{ letterSpacing: "0.25em" }}
                >
                  Hours
                </h3>
                <ul className="space-y-3">
                  {[
                    { days: "Monday — Thursday", hours: "9:00 AM – 8:00 PM" },
                    { days: "Friday - Saturday", hours: "9:00 AM – 9:00 PM" },
                    { days: "Sunday", hours: "9:00 AM – 7:00 PM" },
                  ].map(({ days, hours }) => (
                    <li key={days} className="flex justify-center md:justify-start items-start gap-2">
                      <Clock 
                        size={12}
                        className="text-luxury-amber/40 shrink-0 mt-1"
                      />
                      <div>
                        <div className="font-outfit text-luxury-pearl/60 text-xs">
                          {days}
                        </div>
                        <div className="font-outfit text-luxury-pearl/40 text-xs">
                          {hours}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Book CTA */}
                <button
                  onClick={openBooksyWidget}
                  className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 bg-luxury-amber text-luxury-midnight font-outfit font-medium text-xs uppercase tracking-wide hover:bg-luxury-whiskey transition-all duration-300 hover:scale-105"
                  style={{ letterSpacing: "0.12em" }}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-luxury-graphite/40">
        <div className="max-w-luxury mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-outfit text-luxury-pearl/25 text-xs">
              © {new Date().getFullYear()} The Gentry House. All
              rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="font-outfit text-luxury-pearl/25 text-xs hover:text-luxury-amber transition-colors duration-300"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
