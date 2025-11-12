import React,{
    useEffect
} from 'react'

import { Outlet, useNavigate } from 'react-router-dom'
import "./root.css"
import {
    Sidebar
} from "../components/index"
import { Typography } from '@mui/material'
import {
    Fingerprint,
    School,
    Attractions,
    AddLinkOutlined
} from "@mui/icons-material"

const StackLayer = () => {
    const navigate = useNavigate()
    

    useEffect(()=>{
        const fetchUserData=()=>{
            navigate("platform")
        }
        fetchUserData()
    },[])

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
                        {
                            name:"Manage Employees",
                            to:"employees",
                            icon:<Attractions/>
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