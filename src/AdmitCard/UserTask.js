import React, {
    useState,
    useEffect
} from "react"
import { useParams } from "react-router-dom"
import { useLazyGetInstitutionClassesQuery } from "../Redux/actions/classSetup.action"
import {
    Loader
} from "../components/index"
import { GetCurrentUser } from "../utils/hooks"
import _ from "lodash"
import {
    Typography,
    Box,
    Checkbox,
    List,
    ListItemButton,
    ListItemIcon,
    ListItem,
    ListItemText,
    Button
} from "@mui/material"
import {
    Add
} from "@mui/icons-material"


export default function StudentAdmit() {
    const { class_name } = useParams()
    const [classInfo, setClassinfo] = useState(null)
    const templates = [
        {
            name: "Template-A",
            id: "temp_1"
        },
        {
            name: "Template-B",
            id: "temp_2"
        },
        {
            name: "Template-C",
            id: "temp_3"
        },
        {
            name: "Template-D",
            id: "temp_4"
        },
    ]

    const [getClassesAction, getClassesState] = useLazyGetInstitutionClassesQuery()

    useEffect(() => {
        const user = GetCurrentUser()
        if (user) {
            let user_platform = _.get(user, "meta_data.user_platform", null)
            user_platform && getClassesAction({
                institution_ref: user_platform
            })
        }
    }, [])

    useEffect(() => {
        if (getClassesState.isSuccess) {
            const list = _.get(getClassesState, "currentData.list", [])
            if (Array.isArray(list) && list.length > 0) {
                let findClass = list.find((item) => item.class_name === class_name)
                if (findClass) {
                    setClassinfo(findClass)
                }
            }
        }
    }, [getClassesState, class_name])

    return (
        <div>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Box
                    sx={{
                        width: "auto",
                        height: "auto",
                        borderRadius: 1,
                        bgcolor: 'gray',
                        display:"flex",
                        flexDirection:"column",
                        alignItems:"center",
                        paddingTop:2,
                        paddingBottom:2
                    }}
                >
                    <Typography variant='h5' sx={{
                        fontFamily: "Lato",
                        fontWeight: 400,
                        // lineHeight:"12px",
                        color: "#FFFF",
                        padding: "8px",
                        textAlign: "center"
                    }}>
                        Configure the examination admit card template
                    </Typography>
                    <List>
                        {
                            templates.map((item, index) => {
                                return (
                                    <ListItem key={index}>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <Checkbox 
                                                   size="small"
                                                />
                                            </ListItemIcon>
                                            <ListItemText primary={item.name} style={{
                                                color:"#FFFF",
                                                padding:0,
                                                margin:0,
                                                fontFamily:"Lato",
                                                fontWeight:400,
                                                fontSize:"14px"
                                            }} />
                                        </ListItemButton>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                    <Button
                       startIcon={<Add />}
                       variant="contained"
                    >
                        Submit Template
                    </Button>
                </Box>
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