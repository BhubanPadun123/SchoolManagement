import React from "react"
import {
    ToastMessage,
    Loader
} from "../components/index"
import {
    useLazyCheckUserPlatformQuery,
    useResetPasswordMutation
} from "../Redux/actions/user.action"
import {
    toaster,
    Message
} from "rsuite"
import _ from "lodash"
import { Typography } from "@mui/material"
import {useNavigate} from "react-router-dom"

export default function LoginPage() {
    const navigate = useNavigate()
    const [notification, setNotification] = React.useState({
        show: false,
        type: "",
        message: ""
    })
    const [email,setEmail] = React.useState("")
    const [new_password,setNewpassword] = React.useState("")
    const [platformName, setPlatformName] = React.useState("")
    const [checkUserAction, checkUserState] = useLazyCheckUserPlatformQuery()
    const [resetPasswordAction,resetPasswordState] = useResetPasswordMutation()

    const checkUserStatus = React.useMemo(() => {
        if (checkUserState.isSuccess) {
            const name = _.get(checkUserState, "currentData.platform_name", null)
            setPlatformName(name)
            return {
                show: true,
                type: "success",
                message: "Institution found!"
            }
        }
        if (checkUserState.isError) {
            const message = _.get(checkUserState, "error.data.detail", null)
            return {
                show: true,
                type: "error",
                message: message
            }
        }
    }, [checkUserState])

    React.useEffect(() => {
        if (checkUserStatus) {
            setNotification(checkUserStatus)
            if(checkUserStatus.type === "success"){
                navigate("/login")
            }
        }
    }, [checkUserStatus])

    function handleResetPass(){
        if(!email || !new_password){
            toaster.push(<Message type="info" >Please fill the email and password!</Message>,{placement:"topCenter"})
            return
        }
        resetPasswordAction({
            email:email,
            new_password:new_password
        })
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center px-4">
            <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl w-full max-w-md p-8 sm:p-10">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back 👋 {platformName && `To ${platformName}`}</h2>
                <p className="text-center text-gray-500 mb-8">Login to continue your journey</p>
                {
                    platformName ? (
                        <div>
                            <Typography variant="h4" 
                            onClick={()=> {
                                navigate("/login")
                            }}
                            sx={{
                                textAlign:"center",
                                fontFamily:"Lato",
                                fontWeight:400,
                                fontStyle:"normal",
                                border:"1px solid gray",
                                borderRadius:8,
                                backgroundColor:"violet",
                                cursor:"pointer",
                                color:"#FFFF"
                            }}>{platformName}</Typography>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={(e) => {
                            e.preventDefault()
                            const formData = new FormData(e.target)
                            const email = formData.get("email")
                            if (!email) {
                                toaster.push(<Message type="info" >Email field should not be empty!</Message>, { placement: "topCenter" })
                                return
                            }
                            checkUserAction({
                                user_email: email
                            })
                        }}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all"
                            >
                                Search
                            </button>
                        </form>
                    )
                }
            </div>
            {
                (
                    checkUserState.isLoading ||
                    resetPasswordState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
            {
                notification.show && (
                    <ToastMessage
                        {...notification}
                        onClose={() => {
                            setNotification({
                                show: false,
                                type: "",
                                message: ""
                            })
                        }}
                    />
                )
            }
        </div>
    );
}
