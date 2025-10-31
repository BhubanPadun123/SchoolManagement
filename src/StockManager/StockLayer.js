import React, { useState } from "react"
import {
    Container,
    Header,
    Content,
    Sidebar,
    Nav,
    Text,
    Divider,
    Sidenav
} from "rsuite"
import {
    useMediaQuery,
    Drawer,
    IconButton,
    Tooltip,
    Box
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
    Menu
} from "@mui/icons-material"

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
        );
        const currentQuery = queries[queryKey];
        return currentQuery?.data?.list || [];
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

    function SubNavList() {
        return (
            <Box
                sx={{
                    width: 250
                }}
                role={"presentation"}
                onClick={() => setOpenDrawer(false)}
                onKeyDown={() => setOpenDrawer(false)}
            >
                <Sidenav expanded={true} defaultOpenKeys={['3', '4']}>
                    <Sidenav.Body>
                        <Nav>
                            <Nav.Item eventKey={"new_class"} onClick={() => navigate("/stock/add")} icon={<Tools />}>
                                Create New Class
                            </Nav.Item>
                            {
                                Array.isArray(classRoomData) && classRoomData.length > 0 && classRoomData.map((item, index) => {
                                    return (
                                        <Nav.Item eventKey={index} key={index} onClick={() => navigate(`/stock/${item.class_name}`)} icon={<Tools />} >
                                            {item.class_name}
                                        </Nav.Item>
                                    )
                                })
                            }
                        </Nav>
                    </Sidenav.Body>
                </Sidenav>
            </Box>
        )
    }

    return (
        <Container style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row"
        }}>
            {
                !isMobile ? (
                    <Container
                        style={{
                            width: 180,
                            position: "sticky",
                            height: "90vh",
                            overflowY: "scroll",
                            scrollbarWidth: "thin"
                        }}
                    >
                        {/* Sidebar Navigation */}
                        <Sidenav expanded={true} defaultOpenKeys={['3', '4']}>
                            <Sidenav.Body>
                                <Nav>
                                    <Nav.Item eventKey={"new_class"} onClick={() => navigate("/stock/add")} icon={<Tools />}>
                                        Create New Class
                                    </Nav.Item>
                                    {
                                        Array.isArray(classRoomData) && classRoomData.length > 0 && classRoomData.map((item, index) => {
                                            return (
                                                <Nav.Item eventKey={index} key={index} onClick={() => navigate(`/stock/${item.class_name}`)} icon={<Tools />} >
                                                    {item.class_name}
                                                </Nav.Item>
                                            )
                                        })
                                    }
                                </Nav>
                            </Sidenav.Body>
                        </Sidenav>
                    </Container>
                ) : (
                    <div style={{
                        minHeight: "20px",
                        width: "100%",
                        background: "white",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center"
                    }}>
                        <Tooltip title={"Show More"} placement="bottom" arrow>
                            <IconButton onClick={() => setOpenDrawer(!isOpenDrawer)}>
                                <Menu />
                            </IconButton>
                        </Tooltip>
                        <Drawer
                            anchor="right"
                            open={isOpenDrawer}
                            onClose={() => setOpenDrawer(false)}
                        >
                            <SubNavList />
                        </Drawer>
                    </div>
                )
            }
            <Content style={{
                height: "90vh",
                overflowY: "scroll",
                width: isMobile ? "100%" : "80%",
                "scrollbarWidth": "none"
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

