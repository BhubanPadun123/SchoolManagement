import Home from "./Home"
import React from "react"
import {
    Route,
    Routes,
    useLocation
} from "react-router-dom"
import { GetCurrentUser } from "./utils/hooks"
import {
    AddStock,
    StockLayout,
    AdmissionForm
} from "./StockManager/index"
import {
    StackLayer,
    PlatformSetup,
    CreateRegistrationLink,
    PlatformFeeStructure
} from "./SettingStack/index"
import {
    LoginPage,
    SignupPage,
    AuthStack
} from "./User/index"
import {
    AdmitRoot,
    AdmitCardPlayground,
    StudentAdmit
} from "./AdmitCard/index"
import {
    RegisterStudents,
    PublicRootLayer,
    LandingPage,
    FeatureInfo,
    FeatureLayer,
    ServicesPage,
    LoginPage as CLogin,
    NewStudentForm,
    PublicResults,
    StudentRegistration,
    StudentsRegistrationForm
} from "./public/index"
import {
    AdminRoot,
    CreateClient,
    ClientList,
    PlatformFee
} from "./AdminPanel/index"
import {
    SubjectRootLayout,
    ManageSubjects
} from "./Subjects/index"
import {
    ExamRoot,
    CreateExamTimetablePage,
    ManageExamsPage,
    EditExamDetails
} from "./Exam/index"
import {
    FeeRoot
} from "./FeeManager"

export default function Routing() {
    const path = useLocation()
    const [user, setUser] = React.useState(null)
    React.useEffect(() => {
        const user = GetCurrentUser()
        if (!user) {
            setUser(null)
        } else {
            setUser(user)
        }
    }, [path?.pathname])

    if (!user) {
        return (
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/feature" element={<FeatureLayer />} >
                    <Route path=":f" element={<FeatureInfo />} />
                </Route>
                <Route path="/service" element={<ServicesPage />} />
                <Route path="/auth" element={<CLogin />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/results" element={<PublicResults/>} />
                <Route path="/registration" element={<StudentRegistration/>} />
                <Route path="/registration/:data" element={<StudentsRegistrationForm/>} />
                <Route path="/registrations/:institution_id/:class/:link_id" element={<NewStudentForm/>} />
            </Routes>
        )
    }

    

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/stock" element={<StockLayout />}>
                <Route path="add" element={<AddStock />} />
                <Route path=":class_name" element={<AdmissionForm />} />
            </Route>
            <Route path="/setting" element={<StackLayer />}>
                <Route path="platform" element={<PlatformSetup />} />
                <Route path="student_registration" element={<CreateRegistrationLink />} />
                <Route path="fee_structure" element={<PlatformFeeStructure/>} />
            </Route>
            <Route path="/auth" element={<AuthStack />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
            </Route>
            <Route path="/admit" element={<AdmitRoot />}>
                <Route path="template" element={<AdmitCardPlayground />} />
                <Route path=":class_name" element={<StudentAdmit />} />
            </Route>

            <Route path="/public" element={<PublicRootLayer />} >
                <Route path="register" element={<RegisterStudents />} />
            </Route>
            <Route path="/admin" element={<AdminRoot/>} >
               <Route path="new" element={<CreateClient/>} />
               <Route path="client_list" element={<ClientList/>} />
               <Route path="fee_setting" element={<PlatformFee/>} />
            </Route>
            <Route path="/subjects" element={<SubjectRootLayout/>} >
                <Route path=":class_name" element={<ManageSubjects />} />
            </Route>
            <Route path="/exam" element={<ExamRoot/>} >
               <Route path="create" element={<CreateExamTimetablePage/>} />
               <Route path="manage" element={<ManageExamsPage/>} />
               <Route path=":examInfo" element={<EditExamDetails/>} />
            </Route>
            <Route path="/fee" element={<FeeRoot/>} ></Route>
        </Routes>
    )
}
