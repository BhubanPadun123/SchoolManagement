import React from "react"
import { useNavigate, useLocation, Outlet } from "react-router-dom"
import {
    Typography,
    Button
} from "@mui/material"
import LandingPage from "./LandingPage"

export default function ExamRoot() {
    const navigate = useNavigate()
    const {
        pathname
    } = useLocation()

    return (
        <div className="col-md-12" >
            {
                pathname && pathname === "/exam" && (
                    <LandingPage
                        onClickCreate={() => {
                            navigate("/exam/create")
                        }}
                        onClickManage={() => {
                            navigate("/exam/manage")
                        }}
                    />
                )
            }
            <Outlet />
        </div>
    )
}