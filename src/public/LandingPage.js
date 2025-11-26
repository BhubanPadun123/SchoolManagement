import React from "react"
import {
    useNavigate
} from "react-router-dom"
import ConnectUs from "./ContactUs";

const LandingPage = () => {
    const navigate = useNavigate()
    const [isConnect, setConnect] = React.useState(false)


    return (
        <div className="font-sans text-gray-800 h-full">
            <section class="bg-center bg-no-repeat bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/conference.jpg')] bg-gray-700 bg-blend-multiply">
                <div class="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
                    <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">Simplify School & College Management</h1>
                    <p class="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">Manage students, teachers, attendance, and academics — all in one intuitive dashboard.</p>
                    <div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
                        <a href="#" class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setConnect(true)
                            }}
                        >
                            Get started
                            <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                            </svg>
                        </a>
                        <a href="#" class="inline-flex justify-center hover:text-gray-900 items-center py-3 px-5 sm:ms-4 text-base font-medium text-center text-white rounded-lg border border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400">
                            Learn more
                        </a>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="px-8 md:px-16 py-16 bg-white">
                <h3 className="text-3xl font-bold text-center mb-10 text-blue-700">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        {
                            title: "Student Information Management",
                            desc: "Maintain complete student records including profiles, attendance, performance, and documents — all in one place.",
                            key: "f1"
                        },
                        {
                            title: "Teacher Portal",
                            desc: "Empower teachers with tools to manage classes, grades, schedules, and student communication effortlessly.",
                            key: "f2"
                        },
                        {
                            title: "Reports & Analytics Dashboard",
                            desc: "Access smart reports and visual analytics to make data-driven academic and administrative decisions.",
                            key: "f3"
                        },
                        {
                            title: "Exam & Results Management",
                            desc: "Easily conduct exams and publish class, sessional, and term results online in just a few clicks.",
                            key: "f4"
                        },
                        {
                            title: "Online Admission & Registration",
                            desc: "Simplify student enrollment with a digital registration process and seamless admission workflow.",
                            key: "f5"
                        },
                        {
                            title: "Digital Admit Cards",
                            desc: "Generate and distribute examination admit cards online to save time and minimize manual work.",
                            key: "f6"
                        },
                        {
                            title: "Certificates & Mark Sheets",
                            desc: "Create and issue academic certificates or mark sheets securely with verified digital records.",
                            key: "f7"
                        },
                        {
                            title: "Student Dashboard",
                            desc: "Provide students with a personalized dashboard to view classes, grades, assignments, and announcements.",
                            key: "f8"
                        },
                        {
                            title: "Event & Activity Management",
                            desc: "Plan and manage school or college events, track participation, and share updates with students and staff.",
                            key: "f9"
                        }
                    ].map((f, i) => (
                        <div key={i} class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                            <a href={`/feature/${f.key}`}>
                                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{f.title}</h5>
                            </a>
                            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{f.desc}</p>
                            <a href={`/feature/${f.key}`} class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Read more
                                <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                </svg>
                            </a>
                        </div>

                    ))}
                </div>
            </section>

            <section id="features" className="px-8 md:px-16 py-16 bg-white">
                <h3 className="text-3xl font-bold text-center mb-10 text-blue-700">Platform Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {
                        [
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
                        ].map((f, i) => (
                            <div key={i} class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                <a href="#">
                                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{f.title}</h5>
                                </a>
                                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{f.desc}</p>
                                <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Read more
                                    <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                    </svg>
                                </a>
                            </div>

                        ))}
                </div>
            </section>

            {/* About */}
            <section id="about" className="px-8 md:px-16 py-16 bg-gray-50 text-center">
                <h3 className="text-3xl font-bold text-blue-700 mb-6">About EduManage</h3>
                <p className="max-w-2xl mx-auto text-lg">
                    EduManage is a complete digital solution for schools and colleges.
                    We simplify administration, enhance collaboration, and empower teachers
                    and students through an integrated and user-friendly platform.
                </p>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="px-8 md:px-16 py-16 bg-white">
                <h3 className="text-3xl font-bold text-center mb-10 text-blue-700">What Our Users Say</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { name: "Principal R. Sharma", msg: "EduManage has streamlined our administration drastically!" },
                        { name: "Teacher S. Nair", msg: "Managing attendance and reports is now effortless." },
                        { name: "Student Council", msg: "An amazing platform connecting everyone in one place!" },
                    ].map((t, i) => (
                        <div key={i} className="p-6 bg-blue-50 rounded-lg shadow hover:shadow-md">
                            <p className="italic mb-4">"{t.msg}"</p>
                            <h4 className="font-semibold text-blue-700">– {t.name}</h4>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="px-8 md:px-16 py-16 bg-blue-600 text-white text-center">
                <h3 className="text-3xl font-bold mb-6">Get in Touch</h3>
                <p className="mb-6 text-lg">Interested in transforming your school or college with EduManage?</p>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100"
                    onClick={() => {
                        setConnect(true)
                    }}
                >
                    Contact Us
                </button>
            </section>

            <ConnectUs
                open={isConnect}
                onClose={() => {
                    setConnect(false)
                }}
            />

            {/* Footer */}
            <footer className="text-center py-6 bg-gray-800 text-gray-200">
                © {new Date().getFullYear()} EduManage. All rights reserved.
            </footer>
        </div>
    );
};

export default LandingPage;
