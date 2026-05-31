"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn, openBooksyWidget } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-600",
          scrolled
            ? "bg-luxury-midnight/95 backdrop-blur-md shadow-xl shadow-black/20"
            : "bg-transparent",
        )}
      >
        <div className="max-w-luxury mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a
              href="#home"
              className="flex items-center text-center gap-3 group"
              aria-label="The Gentlemen's House"
            >
              <div className="flex justify-center text-center items-center gap-2">
                <span
                  className="font-mono text-luxury-amber text-xs tracking-widest2 uppercase"
                  style={{ letterSpacing: "0.3em" }}
                >
                  <img
                    src="/icon/TGH icon.png"
                    alt="The Gentry House Logo"
                    className="h-12 w-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300" 
                  />
                </span>
                <span
                  className="font-playfair text-nowrap text-xl flex md:items-center md:leading-snug md:justify-center md:text-center md:text-2xl text-luxury-amber tracking-luxury"
                  // style={{ letterSpacing: "0.25em" }}
                >
                  The Gentry House
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-8"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="font-outfit text-sm text-luxury-pearl/70 hover:text-luxury-amber transition-colors duration-300 tracking-wide uppercase"
                  style={{ letterSpacing: "0.08em", fontSize: "0.75rem" }}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={openBooksyWidget}
                className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 bg-luxury-amber text-luxury-midnight font-outfit font-medium text-sm tracking-wide uppercase hover:bg-luxury-whiskey transition-all duration-300 hover:scale-105"
                style={{ letterSpacing: "0.1em", fontSize: "0.75rem" }}
              >
                Book Appointment
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center text-luxury-ivory hover:text-luxury-amber transition-colors"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-In Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-luxury-midnight/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "tween",
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-luxury-charcoal border-l border-luxury-graphite flex flex-col"
              aria-label="Mobile navigation"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 h-20 border-b border-luxury-graphite">
                <span className="font-mono text-luxury-amber text-xs tracking-widest2 uppercase">
                  Menu
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-luxury-pearl/60 hover:text-luxury-amber transition-colors"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Nav Links */}
              <div className="flex flex-col px-8 py-10 gap-2 flex-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="font-playfair text-2xl text-luxury-ivory/80 hover:text-luxury-amber py-3 border-b border-luxury-graphite/50 transition-colors duration-300"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="px-8 pb-10">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    openBooksyWidget();
                  }}
                  className="block w-full text-center py-4 bg-luxury-amber text-luxury-midnight font-outfit font-medium text-sm tracking-wide uppercase hover:bg-luxury-whiskey transition-colors"
                  style={{ letterSpacing: "0.1em" }}
                >
                  Book Appointment
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
