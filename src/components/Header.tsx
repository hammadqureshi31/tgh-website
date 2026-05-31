"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Star, X } from "lucide-react";
import { cn, openBooksyWidget } from "@/lib/utils";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  // { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showReviewTooltip, setShowReviewTooltip] = useState(false);

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
                  className="font-outfit text-sm pt-1.5 text-luxury-pearl/70 hover:text-luxury-amber transition-colors duration-300 tracking-wide uppercase"
                  style={{ letterSpacing: "0.08em", fontSize: "0.75rem" }}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <a
                  href="https://g.page/r/CcacO9CgMp4ZEAE/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setShowReviewTooltip(true)}
                  onMouseLeave={() => setShowReviewTooltip(false)}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F8F5F0] shadow-md hover:shadow-lg transition-all duration-300 group"
                  aria-label="Leave a review on Google"
                >
                  {/* Google G Icon */}
                  <svg
                    className="w-7 h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <div className="flex flex-col items-center">
                    {/* Stars */}
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className="fill-luxury-amber text-luxury-amber"
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      Reviews
                    </span>
                  </div>
                </a>

                {/* Tooltip */}
                <AnimatePresence>
                  {showReviewTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute -bottom-12 right-5  transform -translate-x-1/2 mb-2 px-3 py-2 bg-luxury-midnight text-luxury-amber text-xs font-medium rounded whitespace-nowrap pointer-events-none z-50"
                    >
                      Leave Review
                      <div className="absolute bottom-full right-10  transform -translate-x-1/2 border-4 border-transparent border-t-luxury-midnight" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
              className="fixed top-0 right-0 overflow-y-scroll bottom-0 z-50 w-72 bg-luxury-charcoal border-l border-luxury-graphite flex flex-col"
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
              <div className="px-8 pb-10 flex flex-col gap-3">
                <a
                  href="https://g.page/r/CcacO9CgMp4ZEAE/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setShowReviewTooltip(true)}
                  onMouseLeave={() => setShowReviewTooltip(false)}
                  className="mx-auto inline-flex w-fit items-center gap-2 px-4 py-1.5 bg-[#F8F5F0] shadow-md hover:shadow-lg transition-all duration-300 group"
                  aria-label="Leave a review on Google"
                >
                  {/* Google G Icon */}
                  <svg
                    className="w-7 h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <div className="flex flex-col items-center">
                    {/* Stars */}
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className="fill-luxury-amber text-luxury-amber"
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      Reviews
                    </span>
                  </div>
                </a>
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
