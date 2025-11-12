import React from "react";

const servicesList = [
    {
        title: "Custom Web Development",
        desc: "We build fast, responsive, and scalable websites tailored to your business goals using the latest technologies like React, Next.js, and Node.js."
    },
    {
        title: "Mobile App Development",
        desc: "Design and develop high-performance mobile applications for Android and iOS with seamless user experiences using React Native and Flutter."
    },
    {
        title: "Enterprise Software Solutions",
        desc: "From ERP systems to custom CRM and management platforms, we deliver secure, reliable software that streamlines business operations."
    },
    {
        title: "UI/UX Design",
        desc: "Our creative team crafts intuitive and visually engaging user interfaces to ensure your customers enjoy a smooth, modern experience."
    },
    {
        title: "E-Commerce Solutions",
        desc: "Launch and manage powerful online stores with features like product management, secure payments, and analytics dashboards."
    },
    {
        title: "Cloud Integration & Deployment",
        desc: "We help businesses migrate and deploy applications securely on cloud platforms like AWS, Azure, and Firebase for improved scalability."
    },
    {
        title: "Maintenance & Support",
        desc: "Our dedicated team provides continuous monitoring, updates, and technical support to ensure your applications run flawlessly."
    },
    {
        title: "API Development & Integration",
        desc: "Build secure and scalable RESTful APIs or integrate third-party services to connect systems and enhance functionality."
    },
    {
        title: "Consulting & Digital Transformation",
        desc: "Empower your business with strategic technology consulting, helping you adapt modern tools and achieve digital growth."
    }
];

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800">
            <header className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">We build products that people love</h1>
                    <p className="mt-2 text-gray-600 max-w-xl">High-quality software, delivered with care. Explore our services and find the right fit for your project.</p>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2 shadow hover:shadow-lg transition-shadow text-sm font-medium"
                    >
                        Contact Sales
                    </a>
                    <a
                        href="#services"
                        className="hidden sm:inline-block text-sm px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100"
                    >
                        View Services
                    </a>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pb-16">
                {/* Search & filters */}
                <div className="bg-white rounded-2xl p-6 shadow-sm -mt-6 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                            <label htmlFor="search" className="sr-only">Search services</label>
                            <div className="relative">
                                <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <input id="search" placeholder="Search services, e.g. 'API', 'UI'" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">All</button>
                            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">Web</button>
                            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">Mobile</button>
                        </div>
                    </div>
                </div>

                {/* Services grid */}
                <section id="services" aria-label="Our services">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {servicesList.map((s, idx) => (
                            <article key={s.title} className="relative group bg-white rounded-2xl p-6 shadow hover:shadow-lg transform hover:-translate-y-1 transition-all">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-none w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            {/* simple icon: initials */}
                                            <span className="font-semibold">{s.title.split(" ").slice(0, 2).map(w => w[0]).join("")}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold leading-snug">{s.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1 hidden sm:block">{s.desc}</p>
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a href="#contact" className="text-indigo-600 text-sm font-medium">Get started →</a>
                                    </div>
                                </div>

                                {/* mobile desc */}
                                <p className="mt-4 text-gray-600 sm:hidden">{s.desc}</p>

                                <div className="mt-5 flex items-center justify-between">
                                    <div className="text-xs text-gray-400">Trusted • 100% Confidential</div>
                                    <div className="text-sm">
                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-gray-50 border border-gray-100">Learn more</span>
                                    </div>
                                </div>

                                {/* subtle decorative SVG */}
                                <svg className="absolute -right-6 -bottom-6 w-36 h-36 opacity-5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </article>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section id="contact" className="mt-12 bg-indigo-600 text-white rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold">Ready to start your project?</h2>
                        <p className="mt-2 text-indigo-100 max-w-lg">Tell us your goals and we'll propose a tailored plan with timeline and cost estimate.</p>
                    </div>
                    <div className="flex gap-3">
                        <a href="mailto:hello@yourcompany.com" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium">Email Us</a>
                        <a href="#" className="inline-flex items-center gap-2 border border-white px-4 py-2 rounded-lg">Book a Call</a>
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-12 text-sm text-gray-500">
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4">
                        <div>© {new Date().getFullYear()} Your Company — Built with care</div>
                        <div className="flex gap-4">
                            <a href="#" className="hover:underline">Privacy</a>
                            <a href="#" className="hover:underline">Terms</a>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
