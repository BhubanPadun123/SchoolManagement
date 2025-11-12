import React from "react";

// Sample student data
const sampleStudent = {
    name: "Student Name",
    roll: "Roll Number",
    class: "Class Name",
    section: "Section Name",
    dob: "DOB",
    father: "Father Name",
    mother: "Mother Name",
    school: "School Name",
    exam: "Examination Name",
    date: "Date",
    photo: "", // pass image url if available
    id: "SPS-2025-00023",
    background:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=60", // 🌄 background image
};

// Utility: placeholder photo SVG
const PhotoPlaceholder = ({ size = 96 }) => (
    <div
        className="flex items-center justify-center bg-gray-100 rounded overflow-hidden"
        style={{ width: size, height: size }}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="12" cy="10" r="3"></circle>
            <path d="M21 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path>
        </svg>
    </div>
);

// Utility: small QR placeholder
const QRPlaceholder = ({ size = 72 }) => (
    <div
        style={{ width: size, height: size }}
        className="bg-white border p-1 grid grid-cols-3 gap-1"
    >
        {Array.from({ length: 9 }).map((_, i) => (
            <div
                key={i}
                className={i % 2 === 0 ? "bg-black" : "bg-gray-300"}
            ></div>
        ))}
    </div>
);

// ------------------------- Template A: Classic horizontal -------------------------
function AdmitCardA({ student = sampleStudent }) {
    return (
        <div
            className="max-w-3xl mx-auto border rounded-lg shadow-sm p-6 bg-white bg-cover bg-center"
            style={{
                backgroundImage: `url(${student.background})`,
                backgroundBlendMode: "lighten",
            }}
        >
            <div className="flex items-center gap-6 bg-white/80 p-4 rounded-lg">
                <div className="w-24 flex-shrink-0">
                    {student.photo ? (
                        <img
                            src={student.photo}
                            alt="student"
                            className="w-24 h-24 object-cover rounded"
                        />
                    ) : (
                        <PhotoPlaceholder size={96} />
                    )}
                </div>

                <div className="flex-1">
                    <h2 className="text-xl font-semibold">{student.school}</h2>
                    <p className="text-sm text-gray-600">{student.exam}</p>
                </div>

                <div className="text-right">
                    <div className="text-sm text-gray-500">Admit Card</div>
                    <div className="mt-1 font-semibold">{student.id}</div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm bg-white/80 p-4 rounded-lg">
                <div>
                    <div className="text-xs text-gray-500">Name</div>
                    <div className="font-medium">{student.name}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500">Roll No</div>
                    <div className="font-medium">{student.roll}</div>
                </div>

                <div>
                    <div className="text-xs text-gray-500">Class / Sec</div>
                    <div className="font-medium">
                        {student.class} / {student.section}
                    </div>
                </div>

                <div>
                    <div className="text-xs text-gray-500">DOB</div>
                    <div className="font-medium">{student.dob}</div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between bg-white/80 p-4 rounded-lg">
                <div className="flex items-center gap-6">
                    <div>
                        <div className="text-xs text-gray-500">Father</div>
                        <div className="text-sm">{student.father}</div>
                    </div>

                    <div>
                        <div className="text-xs text-gray-500">Mother</div>
                        <div className="text-sm">{student.mother}</div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <QRPlaceholder />
                    <div className="text-xs text-gray-500 text-right">
                        <div>Exam Date</div>
                        <div className="font-medium">{student.date}</div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end items-center gap-8 bg-white/80 p-4 rounded-lg">
                <div className="text-center">
                    <div className="text-xs text-gray-500">Principal</div>
                    <div className="mt-6 border-t pt-1 text-sm">Signature</div>
                </div>
            </div>
        </div>
    );
}

// ------------------------- Template B: ID-card style (compact vertical) -------------------------
function AdmitCardB({ student = sampleStudent }) {
    return (
        <div
            className="max-w-3xl mx-auto border rounded-lg overflow-hidden shadow-sm bg-cover bg-white bg-center"
            // style={{ backgroundImage: `url(${student.background})` }}
        >
            <div className="flex flex-col items-center text-center bg-white">
                <div className="w-24 h-24 mb-3">
                    {student.photo ? (
                        <img
                            src={student.photo}
                            alt="student"
                            className="w-24 h-24 object-cover rounded-full"
                        />
                    ) : (
                        <PhotoPlaceholder size={96} />
                    )}
                </div>
                <h3 className="font-semibold">{student.name}</h3>
                <p className="text-xs text-gray-500">
                    {student.class} - {student.section}
                </p>
            </div>

            <div className="mt-4 text-sm grid grid-cols-2 gap-2 bg-white/80 p-3 rounded-lg">
                <div className="space-y-1">
                    <div className="text-xs text-gray-400">Roll</div>
                    <div className="font-medium">{student.roll}</div>
                </div>
                <div className="space-y-1">
                    <div className="text-xs text-gray-400">ID</div>
                    <div className="font-medium">{student.id}</div>
                </div>

                <div className="col-span-2 mt-2 border-t pt-2 text-xs text-gray-500">
                    {student.school}
                    <div className="mt-1 font-semibold">{student.exam}</div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between bg-white/80 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Valid Till</div>
                <div className="font-medium">{student.date}</div>
            </div>

            <div className="mt-4 flex items-center justify-between bg-white/80 p-3 rounded-lg">
                <div className="text-xs">Authorized</div>
                <div className="flex items-center gap-3">
                    <div className="text-xs">Sign</div>
                    <QRPlaceholder size={48} />
                </div>
            </div>
        </div>
    );
}

// ------------------------- Template C: Modern full-bleed color header -------------------------
function AdmitCardC({ student = sampleStudent }) {
    return (
        <div
            className="max-w-3xl mx-auto border rounded-lg overflow-hidden shadow-sm bg-cover bg-center"
            style={{ backgroundImage: `url(${student.background})` }}
        >
            <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between bg-opacity-90">
                <div>
                    <div className="text-lg font-bold">{student.school}</div>
                    <div className="text-sm opacity-90">
                        {student.exam} — Admit Card
                    </div>
                </div>
                <div className="text-right text-sm">
                    <div>
                        ID: <span className="font-semibold">{student.id}</span>
                    </div>
                    <div className="mt-1">
                        Class {student.class} • Sec {student.section}
                    </div>
                </div>
            </div>

            <div className="p-6 bg-white/90">
                <div className="grid grid-cols-5 gap-4 items-center">
                    <div className="col-span-1">
                        {student.photo ? (
                            <img
                                src={student.photo}
                                alt="student"
                                className="w-24 h-24 object-cover rounded"
                            />
                        ) : (
                            <PhotoPlaceholder size={96} />
                        )}
                    </div>
                    <div className="col-span-3">
                        <h3 className="text-xl font-semibold">{student.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Father: {student.father}
                        </p>
                        <p className="text-sm text-gray-600">
                            Mother: {student.mother}
                        </p>
                        <div className="mt-3 text-sm grid grid-cols-3 gap-4">
                            <div>
                                <div className="text-xs text-gray-400">Roll</div>
                                <div className="font-medium">{student.roll}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-400">DOB</div>
                                <div className="font-medium">{student.dob}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-400">
                                    Exam Date
                                </div>
                                <div className="font-medium">{student.date}</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 flex flex-col items-end gap-2">
                        <QRPlaceholder />
                        <div className="text-xs text-gray-400 text-right">
                            Authorized
                        </div>
                    </div>
                </div>

                <div className="mt-6 border-t pt-4 text-xs text-gray-500 flex justify-between">
                    <div>
                        Instructions: Please carry a valid photo ID. Mobile
                        phones are not allowed in the exam hall.
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium">Principal</div>
                        <div className="mt-4 border-t pt-1 text-xs">
                            Signature
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ------------------------- Template D: Minimal two-column with accent -------------------------
function AdmitCardD({ student = sampleStudent }) {
    return (
        <div
            className="max-w-2xl mx-auto border rounded-lg overflow-hidden shadow-sm bg-cover bg-center"
            style={{ backgroundImage: `url(${student.background})` }}
        >
            <div className="p-4 flex gap-6 bg-white/85 rounded-lg">
                <div className="w-28 flex-shrink-0">
                    {student.photo ? (
                        <img
                            src={student.photo}
                            alt="student"
                            className="w-28 h-28 object-cover rounded"
                        />
                    ) : (
                        <PhotoPlaceholder size={112} />
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-xs text-gray-400">Name</div>
                            <div className="text-lg font-semibold">
                                {student.name}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                {student.school}
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-xs text-gray-400">Roll</div>
                            <div className="font-semibold text-xl">
                                {student.roll}
                            </div>
                            <div className="mt-3 text-xs text-gray-400">
                                Class
                            </div>
                            <div className="font-medium">
                                {student.class} - {student.section}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <div className="text-xs text-gray-400">Father</div>
                            <div className="font-medium">{student.father}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400">Mother</div>
                            <div className="font-medium">{student.mother}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400">DOB</div>
                            <div className="font-medium">{student.dob}</div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-20">
                                <QRPlaceholder size={64} />
                            </div>
                            <div className="text-xs text-gray-500">
                                Exam on {student.date}
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-xs text-gray-400">
                                Signature
                            </div>
                            <div className="mt-6 border-t pt-1 w-40">
                                Principal
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50/80 px-4 py-2 text-xs text-gray-600">
                {student.exam} • {student.id}
            </div>
        </div>
    );
}

// ------------------------- Playground / Export -------------------------
export default function AdmitCardPlayground() {
    const variants = [
        { id: "A", label: "Classic Horizontal" },
        { id: "B", label: "Compact ID" },
        { id: "C", label: "Modern Header" },
        { id: "D", label: "Minimal Two-column" },
    ];

    return (
        <div className="space-y-8 p-4 sm:p-6 min-h-screen">
            <h1 className="text-2xl font-bold text-center">
                Examination Admit Card Templates
            </h1>
            <p className="text-md text-white text-center">
                Select Examination Admit Card Template For Use
            </p>

            <div className="flex flex-col items-center gap-8">
                <div className="w-full max-w-3xl">
                    <div className="mb-3 text-lg font-large text-white text-center">
                        Template A — Classic
                    </div>
                    <AdmitCardA student={sampleStudent} />
                </div>

                <div className="w-full max-w-3xl">
                    <div className="mb-3 text-lg font-large text-white text-center">
                        Template B — Compact
                    </div>
                    <AdmitCardB student={sampleStudent} />
                </div>

                <div className="w-full max-w-3xl">
                    <div className="mb-3 text-lg font-large text-white text-center">
                        Template C — Modern
                    </div>
                    <AdmitCardC student={sampleStudent} />
                </div>

                <div className="w-full max-w-3xl">
                    <div className="mb-3 text-lg font-large text-white text-center">
                        Template D — Minimal
                    </div>
                    <AdmitCardD student={sampleStudent} />
                </div>
            </div>
        </div>
    );
}
