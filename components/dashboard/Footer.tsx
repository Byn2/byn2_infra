import Link from "next/link";
import { HelpCircle, BookText, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#01133B] dark:text-gray-200">
              Byn2
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Empowering businesses with seamless financial solutions and
              payment processing.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                className="text-gray-500 hover:text-[#01133B] dark:hover:text-gray-300"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-500 hover:text-[#01133B] dark:hover:text-gray-300"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://linkedin.com"
                className="text-gray-500 hover:text-[#01133B] dark:hover:text-gray-300"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#01133B] dark:text-gray-200">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/dashboard/help"
                  className="flex items-center text-gray-600 hover:text-[#01133B] dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="flex items-center text-gray-600 hover:text-[#01133B] dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <BookText className="mr-2 h-4 w-4" />
                  Developer Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-[#01133B] dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/tutorials"
                  className="text-gray-600 hover:text-[#01133B] dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#01133B] dark:text-gray-200">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-[#01133B] dark:text-gray-400 dark:hover:text-gray-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-600 hover:text-[#01133B] dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-[#01133B] dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="text-gray-600 hover:text-[#01133B] dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#01133B] dark:text-gray-200">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-[#01133B] dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-[#01133B] dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-gray-600 hover:text-[#01133B] dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Security
                </Link>
              </li>
              <li>
                <Link
                  href="/compliance"
                  className="text-gray-600 hover:text-[#01133B] dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {currentYear} Byn2 Financial. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/terms"
                className="text-xs text-gray-600 hover:text-[#01133B] dark:text-gray-400 dark:hover:text-gray-300"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-gray-600 hover:text-[#01133B] dark:text-gray-400 dark:hover:text-gray-300"
              >
                Privacy
              </Link>
              <Link
                href="/cookies"
                className="text-xs text-gray-600 hover:text-[#01133B] dark:text-gray-400 dark:hover:text-gray-300"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
