import React, { useState } from "react"
import {
    Container,
    Content,
    Nav,
    Sidenav
} from "rsuite"
import {
    useMediaQuery,
    Drawer,
    IconButton,
    Tooltip,
    Box,
    Typography,
    Button
} from "@mui/material"
import { Outlet, useNavigate } from "react-router-dom"
import "rsuite/dist/rsuite.min.css"
import { class_list } from "../utils"
import {
    Tools
} from "@rsuite/icons"
import { useLazyGetInstitutionClassesQuery } from "../Redux/actions/classSetup.action"
import { Loader } from "../components/index"
import { useSelector } from "react-redux"
import { useTheme } from "@mui/material/styles"
import {
    Menu,
    School,
    Add
} from "@mui/icons-material"
import _ from "lodash"
import {
    Sidebar
} from "../components/index"

export default function StockLayout() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const navigate = useNavigate()
    const [getClassesAction, getClassState] = useLazyGetInstitutionClassesQuery()
    const [isOpenDrawer, setOpenDrawer] = useState(false)

    React.useEffect(() => {
        const fetchData = async () => {
            navigate("/stock/add")
            const user = await localStorage.getItem("current_user")
            if (user) {
                const userInfo = JSON.parse(user)
                const { user_data } = userInfo
                const { meta_data } = user_data
                if (meta_data && meta_data.hasOwnProperty('user_platform')) {
                    const institution_ref = meta_data.user_platform
                    getClassesAction({ institution_ref })
                }
            } else {
                localStorage.clear()
                navigate("/auth")
            }
        }
        fetchData()
    }, [])

    const classRoomData = useSelector((state) => {
        const queries = state.classRoomApi?.queries || {};
        const queryKey = Object.keys(queries).find(key =>
            key.startsWith("getInstitutionClasses")
        )
        const currentQuery = queries[queryKey]
        if (currentQuery) {
            let list = _.get(currentQuery, "data.list", [])
            if (Array.isArray(list) && list.length > 0) {
                const navList = list.map((item, index) => {
                    return {
                        name: item.class_name,
                        to: item.class_name,
                        icon: <School />
                    }
                })
                return navList
            } else {
                return []
            }
        }
        return currentQuery?.data?.list || []
    })

    const institutionClassesStatus = React.useMemo(() => {
        if (getClassState.isSuccess) {
            return [
                ...getClassState.currentData?.list
            ]
        }
        if (getClassState.isError) {
            return []
        }
    }, [getClassState])

    return (
        <Container style={{
            display: "flex",
            flexDirection: "column"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
            }}>
                <Typography variant="h4" style={{
                    fontWeight: 400,
                    fontFamily: "Lato",
                    fontStyle: "normal",
                    color: "#FFFF",
                    padding: 2
                }}>
                    Manage Class Admission
                </Typography>
                <Sidebar
                    navList={classRoomData}
                    headerTitle={"Institution Classes"}
                    handleNav={(e) => {
                        navigate(e)
                    }}
                    defaultNav={[
                        {
                            name:"Create New Class",
                            to:"add",
                            icon:<Add/>
                        }
                    ]}
                />
            </div>
            <Content style={{
                height: "80vh",
                overflowY: "scroll",
                width: "100%",
                "scrollbarWidth": "none",
                justifyContent:"center",
                alignItems:"center"
            }}>
                <Outlet />
            </Content>
            {
                (
                    getClassState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
        </Container>
    );
}

