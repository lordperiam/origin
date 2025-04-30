/*
This client component provides the header for the app.
*/

"use client"

import { Button } from "@/components/ui/button"
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton
} from "@clerk/nextjs"
import { motion } from "framer-motion"
import { BrainCircuit, Menu, Search, Sparkles, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

// Minimalist, conceptual navigation links
const navLinks = [
  { href: "/debates", label: "Explore", icon: Search },
  { href: "/argument-locator", label: "Analyze", icon: Sparkles }, // Assuming this is the primary analysis tool
  { href: "/simulation", label: "Simulate", icon: BrainCircuit }
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      // Only apply scroll effect if not on the homepage (which has a fixed background)
      if (pathname !== "/") {
        setIsScrolled(window.scrollY > 20)
      } else {
        setIsScrolled(false) // Keep header transparent on homepage
      }
    }

    window.addEventListener("scroll", handleScroll)
    // Initial check in case the page loads scrolled
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname]) // Re-run effect if pathname changes

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 50, damping: 15 }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        isScrolled ? "bg-black/70 shadow-lg backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex max-w-7xl items-center justify-between p-4 text-white">
        {/* Simplified Logo/Brand Name */}
        <Link href="/" className="group flex items-center space-x-2">
          <BrainCircuit className="text-primary size-7 transition-transform duration-300 group-hover:rotate-12" />
          <span className="group-hover:text-primary text-2xl font-semibold tracking-tight transition-colors duration-300">
            Neurogenesis
          </span>
        </Link>

        {/* Desktop Navigation - Minimalist Icons + Text on Hover? Or just icons? Let's try icons primarily */}
        <nav className="hidden items-center space-x-4 md:flex">
          {navLinks.map(link => (
            <motion.div
              key={link.href}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={link.href}
                className="hover:text-primary group flex items-center space-x-1.5 rounded-md p-2 text-neutral-300 transition-colors duration-200"
                title={link.label} // Tooltip for accessibility
              >
                <link.icon className="size-5" />
                <span className="text-sm opacity-0 transition-opacity delay-100 duration-200 group-hover:opacity-100">
                  {link.label}
                </span>
              </Link>
            </motion.div>
          ))}
          <SignedIn>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/dashboard"
                className="hover:text-primary group flex items-center space-x-1.5 rounded-md p-2 text-neutral-300 transition-colors duration-200"
                title="Dashboard"
              >
                <BrainCircuit className="size-5" />
                <span className="text-sm opacity-0 transition-opacity delay-100 duration-200 group-hover:opacity-100">
                  Dashboard
                </span>
              </Link>
            </motion.div>
          </SignedIn>
        </nav>

        {/* Auth Buttons & Mobile Menu Toggle */}
        <div className="flex items-center space-x-3">
          <SignedOut>
            <SignInButton>
              <Button
                variant="ghost"
                className="hover:text-primary px-4 py-2 text-neutral-300 hover:bg-white/10"
              >
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="bg-primary hover:bg-primary/90 rounded-full px-5 py-2 font-semibold text-black transition-transform duration-200 hover:scale-105">
                Begin
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            {/* Customize UserButton appearance if needed */}
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          {/* Mobile Menu Button */}
          <motion.div
            className="md:hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="hover:text-primary text-neutral-300 hover:bg-white/10"
            >
              {isMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-neutral-700 bg-black/90 p-4 backdrop-blur-lg md:hidden"
        >
          <ul className="space-y-3">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-primary flex items-center space-x-3 rounded-md p-2 text-neutral-200 transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  <link.icon className="size-5" />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
            <SignedIn>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-primary flex items-center space-x-3 rounded-md p-2 text-neutral-200 transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  <BrainCircuit className="size-5" />
                  <span>Dashboard</span>
                </Link>
              </li>
            </SignedIn>
          </ul>
        </motion.nav>
      )}
    </motion.header>
  )
}
