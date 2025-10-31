import React from "react"
import { Outlet } from "react-router-dom"
import { Panel, Button } from "rsuite"
import { Link } from "react-router-dom"
import {useNavigate} from "react-router-dom"

export default function AuthStack() {
    const navigate = useNavigate()
    React.useEffect(()=>{
        const user = localStorage.getItem("current_user")
        if(!user){
            navigate("/auth/signup")
        }else{
            navigate("/auth/login")
        }
    },[])
    return (
        <div className="col-md-12"
            style={{
                display: "flex",
                justifyContent: "center",
                padding: 20,
                flexDirection: "column",
                width: "100%"
            }}
        >
            <Panel
            >
                <Outlet />
            </Panel>
        </div>
    )
}
