import React from "react"
import { Outlet, useNavigate } from "react-router-dom"
import {
    Typography,
    Box,
    useTheme,
    useMediaQuery
} from "@mui/material"
import {
    Sidebar,
    Loader
} from "../components/index"
import {
    useLazyGetInstitutionClassesQuery
} from "../Redux/actions/classSetup.action"
import {
    useLazyGetPlatformRolesQuery
} from "../Redux/actions/setting.action"
import { GetCurrentUser } from "../utils/hooks"
import _ from "lodash"
import {
    SchoolOutlined
} from "@mui/icons-material"

export default function SubjectRootLayout() {
    const navigate = useNavigate()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    const [getClassesAction, getClassesState] = useLazyGetInstitutionClassesQuery()
    const [getPlatformRolesAction, getPlatformRoleState] = useLazyGetPlatformRolesQuery()

    React.useEffect(() => {
        getClassess()
    }, [])

    function getClassess() {
        const user = GetCurrentUser()
        if (user) {
            let user_platform = _.get(user, "meta_data.user_platform", null)
            if (user_platform) {
                getClassesAction({
                    institution_ref: user_platform
                })
                getPlatformRolesAction({
                    platform_id: user_platform
                })
            }
        }
    }

    const classes = React.useMemo(() => {
        if (getClassesState.isSuccess) {
            let list = _.get(getClassesState, "currentData.list", [])
            return [...list]
        } else {
            return []
        }
    }, [getClassesState])

    const navList = React.useMemo(() => {
        if (Array.isArray(classes) && classes.length > 0) {
            return classes.map((item) => ({
                name: item.class_name,
                to: `${item.class_name}`,
                icon: (
                    <SchoolOutlined
                        sx={{ fontSize: "30px" }}
                    />
                )
            }))
        } else {
            return []
        }
    }, [classes])

    return (
        <div
            className="col-md-12"
            style={{ padding: "6px" }}
        >
            <Sidebar
                headerTitle={"Configure Class Subject"}
                navList={Array.isArray(navList) && navList.length > 0 ? [...navList] : []}
                handleNav={(e) => {
                    navigate(e)
                }}
            />

            {/* Subject Info Section */}
            <Box
                sx={{
                    mt: 2,
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: 1
                }}
            >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Subject Management
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                >
                    Manage academic subjects for schools and colleges. Create new subjects
                    and maintain existing ones class-wise to ensure a structured curriculum.
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                        gap: 2
                    }}
                >
                    {/* Create Subject */}
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider"
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight={600}>
                            📘 Create Subject
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Add new subjects for a selected class or course. Define subject
                            name, subject code, type (theory or practical), and assign it
                            to the academic structure.
                        </Typography>
                    </Box>

                    {/* Manage Subject */}
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider"
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight={600}>
                            ⚙️ Manage Subject
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            View, update, or deactivate existing subjects. Modify subject
                            details and manage availability as curriculum requirements evolve.
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Route Content */}
            <div className="col-md-12">
                <Outlet />
            </div>
        </div>
    )
}
