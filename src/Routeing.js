import Home from "./Home"
import React from "react"
import {
    Route,
    Routes
} from "react-router-dom"
import {
    AddStock,
    StockLayout,
    AdmissionForm
} from "./StockManager/index"
import {
    StackLayer,
    AdminCardTemplates,
    PlatformSetup
} from "./SettingStack/index"
import {
    LoginPage,
    SignupPage,
    AuthStack
} from "./User/index"
import {
    AdmitRoot,
    AdmitCardPlayground
} from "./AdmitCard/index"

export default function Routing() {
    return (
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/stock" element={<StockLayout/>}>
                <Route path="add"  element={<AddStock/>} />
                <Route path=":class_name" element={<AdmissionForm/>} />
            </Route>
            <Route path="/setting" element={<StackLayer/>}>
               <Route path="platform" element={<PlatformSetup/>} />
               <Route path="admit" element={<AdminCardTemplates/>} />
            </Route>
            <Route path="/auth" element={<AuthStack/>}>
               <Route path="login" element={<LoginPage/>} />
               <Route path="signup" element={<SignupPage/>} />
            </Route>
            <Route path="/admit" element = {<AdmitRoot/>}>
               <Route path="template" element={<AdmitCardPlayground/>} />
            </Route>
        </Routes>
    )
}
