import React from "react"
import { Outlet, useNavigate } from "react-router-dom"
import {
    Sidebar
} from "../components/index"
import {
    NewLabelOutlined,
    AccountTreeOutlined,
    CardMembershipOutlined
} from "@mui/icons-material"
import {
    useTheme,
    useMediaQuery
} from "@mui/material"

export default function AdminRoot() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const navigate = useNavigate()
    React.useEffect(()=>{
        navigate("/admin/new")
    },[])
    return (
        <div style={{
            // display:"flex",
            // flexDirection:"row",
            // alignItems:"center",
            // gap:"10px"
        }}>
            <div style={{
                display:"flex",
                justifyContent:"flex-start",
                alignItems:"flex-start",
                padding:"8px"
            }}>
                <Sidebar
                    headerTitle={"Admin Panel"}
                    defaultNav={
                        [
                            {
                                name: "Create New Client",
                                to: "new",
                                icon: <NewLabelOutlined />
                            }
                        ]
                    }
                    navList={
                        [
                            {
                                name:"Client List",
                                to:"client_list",
                                icon:<AccountTreeOutlined/>
                            },
                            {
                                name:"Platform Fee Setting",
                                to:"fee_setting",
                                icon:<CardMembershipOutlined/>
                            }
                        ]
                    }
                    handleNav={(e) => navigate(e)}
                />
            </div>
            <div style={{
                flex:1
            }}>
                <Outlet />
            </div>
        </div>
    )
}