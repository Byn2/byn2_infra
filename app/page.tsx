import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, MapPin, Mail, Phone } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="w-full bg-[#faf7e2] py-30 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Byn2 Logo"
                  width={32}
                  height={32}
                  className="mr-2"
                />
                <span className="text-xl font-bold text-[#01133B]">Byn2</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-gray-900">
                  Your business
                  <br />
                  success starts here.
                </h1>
                <p className="max-w-[600px] text-gray-700 md:text-lg">
                  Empowering businesses in Sierra Leone to securely accept and
                  make payments from international and local customers by
                  providing fast and easy payment experience.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-[#01133B] mt-0.5" />
                  <span className="text-gray-700">
                    Reduce risk and save time
                  </span>
                </div>
                <div className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-[#01133B] mt-0.5" />
                  <span className="text-gray-700">
                    Get the ultimate business efficiency
                  </span>
                </div>
                <div className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-[#01133B] mt-0.5" />
                  <span className="text-gray-700">
                    Access to real-time payment-related reports
                  </span>
                </div>
                <div className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-[#01133B] mt-0.5" />
                  <span className="text-gray-700">
                    A host of tools that can scale your business with ease
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button className="bg-[#01133B] hover:bg-[#523526] text-white px-6">
                    Get started
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="border-[#01133B] text-[#01133B] px-6"
                  >
                    Contact us <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/dashboard-mockup.png"
                alt="Byn2 Dashboard"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full bg-[#0e2a2b] text-white py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-12">
            Byn2 B2B services
            <br />
            you can utilize today
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-[#0e2a2b] border border-gray-700 rounded-lg p-6 relative">
              <div className="absolute top-6 right-6 bg-white rounded-lg p-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 7L7 17M7 7L17 17"
                    stroke="#0e2a2b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Cross-border payment</h3>
              <p className="text-gray-300 text-sm">
                We offer seamless solutions for cross-border transactions,
                helping businesses manage their international payments
                efficiently and securely.
              </p>
            </div>

            <div className="bg-[#0e2a2b] border border-gray-700 rounded-lg p-6 relative">
              <div className="absolute top-6 right-6 bg-white rounded-lg p-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="#0e2a2b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Loans</h3>
              <p className="text-gray-300 text-sm">
                Access flexible loans with low-interest rates to help scale your
                business operations, whether for expansion or working capital.
              </p>
            </div>

            <div className="bg-[#0e2a2b] border border-gray-700 rounded-lg p-6 relative">
              <div className="absolute top-6 right-6 bg-white rounded-lg p-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5"
                    stroke="#0e2a2b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Buying invoice</h3>
              <p className="text-gray-300 text-sm">
                When you have businesses with high invoice amounts, we can
                provide the capital to cover the expense for a small fee.
              </p>
            </div>

            <div className="bg-[#0e2a2b] border border-gray-700 rounded-lg p-6 relative">
              <div className="absolute top-6 right-6 bg-white rounded-lg p-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 8V16M8 12H16"
                    stroke="#0e2a2b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Save and invest</h3>
              <p className="text-gray-300 text-sm">
                Grow your business funds with our investment options that earn
                high interest rates that exceed the regular bank rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Use Section */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Why use Byn2
                <br />
                B2B services
              </h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-3 h-6 w-6 rounded-full bg-[#01133B] flex items-center justify-center text-white">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-gray-700">Low to no fees</span>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 h-6 w-6 rounded-full bg-[#01133B] flex items-center justify-center text-white">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-gray-700">Mobile wallet first</span>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 h-6 w-6 rounded-full bg-[#01133B] flex items-center justify-center text-white">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-gray-700">
                    Byn2 enhances business efficiency
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 h-6 w-6 rounded-full bg-[#01133B] flex items-center justify-center text-white">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-gray-700">
                    It caters to all your payment-related needs
                  </span>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 h-6 w-6 rounded-full bg-[#01133B] flex items-center justify-center text-white">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-gray-700">
                    A array of ready features can assist your business with ease
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/mobile-app-mockup.png"
                alt="Byn2 Mobile App"
                width={500}
                height={500}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full bg-[#0e2a2b] text-white py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">
            What People are Saying About Byn2
          </h2>

          <div className="max-w-3xl mx-auto">
            <div className="bg-[#faf7e2] text-gray-800 p-8 rounded-lg relative">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-32 h-32 rounded-lg overflow-hidden">
                  <Image
                    src="/testimonial-image.png"
                    alt="Rachel Wright"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <p className="mb-4 text-gray-700">
                    "Byn2 offers both short-term and long term loans to its
                    users through 'The community', a peer-to-peer lending
                    platform."
                  </p>
                  <p className="font-bold">Rachel Wright</p>
                  <p className="text-sm text-gray-600">Business Owner</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6 space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-500"></div>
              <div className="w-6 h-2 rounded-full bg-white"></div>
              <div className="w-2 h-2 rounded-full bg-gray-500"></div>
              <div className="w-2 h-2 rounded-full bg-gray-500"></div>
              <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Second CTA Section */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Your business success starts here
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-gray-700">
            We offer a variety of interesting features that you can help
            increase your productivity in your business, easily.
          </p>
          <Link href="/signup">
            <Button className="bg-[#01133B] hover:bg-[#523526] text-white px-6">
              Get started
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full bg-[#0e2a2b] text-white py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Frequently Asked
                <br />
                Questions
              </h2>
              <p className="text-gray-300">
                Empowering businesses in Sierra Leone to securely accept and
                make payments fast and easy.
              </p>
            </div>

            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="border-b border-gray-700 pb-4">
                  <button className="flex justify-between items-center w-full text-left">
                    <span>What payment methods do you accept?</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-900">
                Contact us
              </h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="mr-3 h-5 w-5 text-[#01133B]" />
                  <span>Byn2@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-3 h-5 w-5 text-[#01133B]" />
                  <span>+232 78 490070</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="mr-3 h-5 w-5 text-[#01133B] mt-1" />
                  <span>FBC Campus, Mount Oriel</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold mb-6 text-gray-900">
                Send us a message
              </h3>

              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm text-gray-600 mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="EXAMPLE JOHN"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-gray-600 mb-1"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="example@gmail.com"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm text-gray-600 mb-1"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  ></textarea>
                </div>

                <Button className="w-full bg-[#01133B] hover:bg-[#523526] text-white">
                  Send message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#0e2a2b] text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="Byn2 Logo"
                width={32}
                height={32}
                className="mr-2"
              />
              <span className="text-xl font-bold text-white">Byn2</span>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mb-8">
            <a
              href="#"
              className="h-10 w-10 rounded-full border border-gray-600 flex items-center justify-center"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="#"
              className="h-10 w-10 rounded-full border border-gray-600 flex items-center justify-center"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="#"
              className="h-10 w-10 rounded-full border border-gray-600 flex items-center justify-center"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="#"
              className="h-10 w-10 rounded-full border border-gray-600 flex items-center justify-center"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 9H2V21H6V9Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="#"
              className="h-10 w-10 rounded-full border border-gray-600 flex items-center justify-center"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.54 6.42C22.4212 5.94541 22.1793 5.51057 21.8387 5.15941C21.498 4.80824 21.0708 4.55318 20.6 4.42C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92922 4.59318 2.50197 4.84824 2.16134 5.19941C1.82071 5.55057 1.57884 5.98541 1.46 6.46C1.14522 8.20556 0.991243 9.97631 1 11.75C0.988687 13.537 1.14266 15.3213 1.46 17.08C1.59096 17.5398 1.83831 17.9581 2.17814 18.2945C2.51798 18.6308 2.93882 18.8738 3.4 19C5.12 19.46 12 19.46 12 19.46C12 19.46 18.88 19.46 20.6 19C21.0708 18.8668 21.498 18.6118 21.8387 18.2606C22.1793 17.9094 22.4212 17.4746 22.54 17C22.8524 15.2676 23.0063 13.5103 23 11.75C23.0113 9.96295 22.8573 8.1787 22.54 6.42Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.75 15.02L15.5 11.75L9.75 8.48V15.02Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="#"
              className="h-10 w-10 rounded-full border border-gray-600 flex items-center justify-center"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.5 2H6.5C4.01472 2 2 4.01472 2 6.5V17.5C2 19.9853 4.01472 22 6.5 22H17.5C19.9853 22 22 19.9853 22 17.5V6.5C22 4.01472 19.9853 2 17.5 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61991 14.1902 8.22773 13.4229 8.09406 12.5922C7.9604 11.7615 8.09206 10.9099 8.47032 10.1584C8.84858 9.40685 9.45418 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.12831C15.4785 9.73515 15.8741 10.5211 16 11.37Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.5 6.5H17.51"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          <div className="text-center text-sm text-gray-400">
            <p>© 2024 Byn2 Company and rights reserved</p>
            <div className="mt-2 space-x-4">
              <a href="#" className="hover:text-white">
                Terms and Conditions
              </a>
              <span>•</span>
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
