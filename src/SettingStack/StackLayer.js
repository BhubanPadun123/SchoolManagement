import React,{
    useEffect
} from 'react'

import { Outlet, useNavigate,useLocation } from 'react-router-dom'
import "./root.css"
import {
    Sidebar,
    PlatformFeeStructure
} from "../components/index"
import { Typography } from '@mui/material'
import {
    Fingerprint,
    School,
    Attractions,
    AddLinkOutlined,
} from "@mui/icons-material"
import CleanHandsIcon from '@mui/icons-material/CleanHands'

const StackLayer = () => {
    const navigate = useNavigate()
    const location = useLocation()
    

    useEffect(()=>{
        const fetchUserData=()=>{
            navigate("platform")
        }
        location && location.pathname === "/setting" && fetchUserData()
    },[location.pathname])

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            width: "100%"
        }}>
            <div style={{ 
                display:"flex",
                flexDirection:"row",
                gap:8,
                alignItems:"center",
                padding:4
             }}>
                <Typography
                    variant='h4'
                    style={{
                        fontFamily: "Lato",
                        fontWeight: 400,
                        fontStyle: "normal",
                        color: "#FFFF"
                    }}
                >
                    Institution Setup
                </Typography>
                <Sidebar
                    headerTitle={"Institution Setting"}
                    defaultNav={[
                        {
                            name: "Create New Institution",
                            to: "platform",
                            icon: <School />
                        }
                    ]}
                    navList={[
                        {
                            name:"Create Registration Link",
                            to:"student_registration",
                            icon:<AddLinkOutlined/>
                        },
                        // {
                        //     name:"Manage Employees",
                        //     to:"employees",
                        //     icon:<Attractions/>
                        // },
                        {
                            name:"Setting Platform Fee",
                            to:"fee_structure",
                            icon:<CleanHandsIcon/>
                        }
                    ]}
                    handleNav={(e)=> {
                        navigate(e)
                    }}
                />
            </div>
            <div className='outlet__root'>
                <Outlet />
            </div>
        </div>
    )
}

export default StackLayer