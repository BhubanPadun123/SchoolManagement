import React, {
    useState,
    useEffect,
    useMemo
} from "react"
import {
    Sidebar
} from "../components/index"
import {
    useLazyGetInstitutionClassesQuery
} from "../Redux/actions/classSetup.action"
import {
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material"
import {
    DocumentScanner,
    School
} from "@mui/icons-material"
import {
    GetCurrentUser
} from "../utils/hooks"
import {
    Loader
} from "../components/index"
import _ from "lodash"
import { useNavigate, Outlet } from "react-router-dom"




export default function AdmitRoot() {
    const navigate = useNavigate()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const [navList, setNavList] = useState([])

    const [getClassesAction, getClassesState] = useLazyGetInstitutionClassesQuery()

    useEffect(() => {
        const user = GetCurrentUser()
        if (user) {
            let user_platform = _.get(user, "meta_data.user_platform", null)
            user_platform && getClassesAction({
                institution_ref: user_platform
            })
            handleNav("template")
        }
    }, [])

    const listMemo = useMemo(() => {
        if (getClassesState.isSuccess) {
            let list = _.get(getClassesState, "currentData.list", [])
            if (Array.isArray(list) && list.length > 0) {
                let navList = list.map((item) => {
                    return {
                        name: item.class_name,
                        to: item.class_name,
                        icon: <School />
                    }
                })
                return navList
            } else {
                return null
            }
        } else {
            return null
        }
    }, [getClassesState])

    useEffect(() => {
        if (Array.isArray(listMemo) && listMemo.length > 0) {
            setNavList(listMemo)
        }
    }, [listMemo])

    function handleNav(to) {
        navigate(to)
    }


    return (
        <div style={{
            width: "100%",
            height: "100%"
        }}>
            <div style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 10
            }}>
                <Typography style={{
                    fontFamily: "Lato",
                    color: "#FFFF",
                    fontSize: "30px",
                    fontWeight: "bold"
                }}>
                    Manage Students Admit Card.
                </Typography>
                <Sidebar
                    headerTitle={"Classes"}
                    navList={navList}
                    handleNav={handleNav}
                    defaultNav={[
                        {
                            name: "Admit Card Template",
                            to: "template",
                            icon: <DocumentScanner />
                        }
                    ]}
                />
            </div>
            <div style={{
                width: "100%",
                height: "100%"
            }}>
                <Outlet />
            </div>
            {
                (
                    getClassesState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
        </div>
    )
}