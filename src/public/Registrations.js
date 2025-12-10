import React, { useState } from "react";
import {
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    useMediaQuery,
    useTheme,
    Paper
} from "@mui/material"
import {
    Loader
} from "../components/index"
import {
    useLazyUseGetAllPlatformsListQuery
} from "../Redux/actions/setting.action"
import {
    useLazyGetInstitutionClassesQuery
} from "../Redux/actions/classSetup.action"
import { updateFields, resetForm } from "../Redux/actions/formValue.action"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import _ from "lodash"

export default function StudentRegistration() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    const { state } = useSelector((state) => state.form)

    const [platforms, setPlatforms] = useState([])
    const [classList, setClassList] = useState([])

    const [getAllPlatformAction, getAllPlatformState] = useLazyUseGetAllPlatformsListQuery()
    const [getClassesAction, getClassesState] = useLazyGetInstitutionClassesQuery()

    React.useEffect(() => {
        getAllPlatformAction()

        return()=> {
            dispatch(resetForm())
        }
    }, [])

    const platformList = React.useMemo(() => {
        if (getAllPlatformState.isSuccess) {
            let list = _.get(getAllPlatformState, "currentData.list", [])
            return list
        } else {
            return []
        }
    }, [getAllPlatformState])
    const classes = React.useMemo(() => {
        if (getClassesState.isSuccess) {
            let list = _.get(getClassesState, "currentData.list", [])
            return list
        } else {
            return []
        }
    }, [getClassesState])


    React.useEffect(() => {
        if (platformList && platformList.length > 0) {
            setPlatforms(platformList)
        }
    }, [platformList])
    React.useEffect(() => {
        if (classes && classes.length > 0) {
            setClassList(classes)
        }
    }, [classes])

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "85vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#eef2ff",
                padding: "20px"
            }}
        >
            <Paper
                elevation={5}
                sx={{
                    width: isMobile ? "100%" : "450px",
                    padding: "35px 30px",
                    borderRadius: "18px",
                    textAlign: "center"
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: "#283593"
                    }}
                >
                    Student Registration
                </Typography>

                <Typography sx={{ mb: 4, fontSize: "15px", color: "#666" }}>
                    Please select your school and class to proceed with registration.
                </Typography>

                {/* School Select */}
                {
                    platforms && Array.isArray(platforms) && platforms.length > 0 && (
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Select School / College</InputLabel>
                            <Select
                                value={_.get(state, "institution_ref", "")}
                                label="Select School / College"
                                onChange={(e) => {
                                    let institution_ref = e.target.value
                                    if (institution_ref) {
                                        dispatch(updateFields({ institution_ref: institution_ref }))
                                        getClassesAction({ institution_ref: institution_ref })
                                    }
                                }}
                            >
                                {
                                    platforms.map((item, index) => {
                                        return (
                                            <MenuItem value={item.id} key={index} >{item.name.toUpperCase()}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                    )
                }

                {/* Class Select */}
                {
                    classList && Array.isArray(classList) && classList.length > 0 && (
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Select Class</InputLabel>
                            <Select
                                label="Select Class"
                                onChange={(e) => {
                                    let class_id = e.target.value
                                    if(class_id){
                                        dispatch(updateFields({class_id:class_id}))
                                    }
                                }}
                                value={_.get(state,"class_id","")}
                            >
                                {
                                    classList.map((item,index)=> {
                                        return(
                                            <MenuItem value={item.id} key={`${item.class_name} + ${index}`} >{item.class_name}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                    )
                }

                {/* Continue Button */}
                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                        background: "#3949ab",
                        fontWeight: 600,
                        padding: "12px",
                        borderRadius: "10px",
                        ":hover": { background: "#303f9f" }
                    }}
                    disabled={!_.get(state,"class_id",null) || !_.get(state,"institution_ref",null)}
                    onClick={() => {
                        navigate(`/registration/${JSON.stringify(state)}`)
                    }}
                >
                    Continue
                </Button>
            </Paper>
            {
                (
                    getAllPlatformState.isLoading ||
                    getClassesState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
        </Box>
    );
}
