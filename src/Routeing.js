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
    CreateRegistrationLink
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
    LoginPage as CLogin
} from "./public/index"

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
        </Routes>
    )
}
