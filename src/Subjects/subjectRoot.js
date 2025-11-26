import React from "react"
import {Outlet,useNavigate} from "react-router-dom"
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
import {GetCurrentUser} from "../utils/hooks"
import _ from "lodash"
import {
    SchoolOutlined
} from "@mui/icons-material"

export default function SubjectRootLayout(){
    const navigate = useNavigate()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    const [getClassesAction,getClassesState] = useLazyGetInstitutionClassesQuery()
    const [getPlatformRolesAction,getPlatformRoleState] = useLazyGetPlatformRolesQuery()

    React.useEffect(()=>{
        getClassess()
    },[])

    function getClassess(){
        const user = GetCurrentUser()
        if(user){
            let user_platform = _.get(user,"meta_data.user_platform",null)
            if(user_platform){
                getClassesAction({
                    institution_ref:user_platform
                })
                getPlatformRolesAction({
                    platform_id:user_platform
                })
            }
        }
    }

    const classes = React.useMemo(()=> {
        if(getClassesState.isSuccess){
            let list = _.get(getClassesState,"currentData.list",[])
            console.log(list)
            return [...list]
        }else {
            return []
        }
    },[getClassesState])

    const navList = React.useMemo(()=>{
        if(Array.isArray(classes) && classes.length > 0){
            let list = classes.map((item)=> {
                return {
                    name:item.class_name,
                    to:`${item.class_name}`,
                    icon:<SchoolOutlined sx={{
                        fontSize:"30px"
                    }} />
                }
            })
            return list
        }else{
            return []
        }
    },[classes])



    return(
        <div className="col-md-12" style={{
            padding:"6px"
        }} >
            <Sidebar 
               headerTitle={"Configure Class Subject"}
            //    defaultNav={Array.isArray(navList) && navList.length > 0 ? [navList[0]] : []}
                navList={Array.isArray(navList) && navList.length > 0 ? [...navList] : []}
                handleNav={(e)=> {
                    navigate(e)
                    console.log(e)
                }}
            />
            <div className="col-md-12">
                <Outlet/>
            </div>
        </div>
    )
}