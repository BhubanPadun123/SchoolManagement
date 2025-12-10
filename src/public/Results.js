import React from "react";
import {
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    Box,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    useTheme,
    useMediaQuery,
    Divider
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
import {
    updateFields,
    resetForm
} from "../Redux/actions/formValue.action"
import { useSelector, useDispatch } from "react-redux"
import _ from "lodash"
import { SearchOutlined } from "@mui/icons-material"

export default function PublicResults() {
    const dispatch = useDispatch()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const [platforms, setPlatforms] = React.useState([])
    const [classesList, setClassesList] = React.useState([])
    const [examList, setExamList] = React.useState([])

    const { state } = useSelector((state) => state.form)


    const [getPlatformListAction, getPlatformListState] = useLazyUseGetAllPlatformsListQuery()
    const [getClassesAction, getClassesState] = useLazyGetInstitutionClassesQuery()


    React.useEffect(() => {
        getPlatformListAction()

        return()=> {
            dispatch(resetForm())
        }
    }, [])

    const platformList = React.useMemo(() => {
        if (getPlatformListState.isSuccess) {
            let list = _.get(getPlatformListState, "currentData.list", [])
            return list
        } else {
            return []
        }
    }, [getPlatformListState])
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
            setClassesList(classes)
        }
    }, [classes])



    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",
                background: "#f5f7fa",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 2
            }}
        >
            <Card
                sx={{
                    width: isMobile ? "100%" : "50%",
                    borderRadius: 4,
                    padding: 3,
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.1)"
                }}
            >
                <CardContent>
                    {/* Header */}
                    <Typography
                        variant="h4"
                        sx={{ textAlign: "center", fontWeight: 700, marginBottom: 2 }}
                    >
                        🎓 Check Your Result
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{ textAlign: "center", color: "gray", marginBottom: 3 }}
                    >
                        Enter your details below to view your examination results.
                    </Typography>

                    {/* Form Fields */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {
                            platforms && Array.isArray(platforms) && platforms.length > 0 && (
                                <FormControl fullWidth>
                                    <InputLabel>Select School Or College</InputLabel>
                                    <Select
                                        label="Select School Or College"
                                        onChange={(e) => {
                                            let institution_ref = e.target.value
                                            if (institution_ref) {
                                                getClassesAction({
                                                    institution_ref: institution_ref
                                                })
                                            }
                                            dispatch(updateFields({ institution_ref: institution_ref }))
                                        }}
                                        value={_.get(state,"institution_ref","")}
                                    >
                                        <TextField fullWidth
                                            placeholder="Search... "
                                            variant="outlined"
                                            InputProps={{
                                                endAdornment: (
                                                    <SearchOutlined />
                                                )
                                            }}
                                            size="small"
                                        />
                                        <Divider />
                                        {
                                            platformList.map((item, index) => {
                                                return (
                                                    <MenuItem value={item.id} key={index} >{item.name.toUpperCase()}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            )
                        }
                        {
                            classesList && Array.isArray(classesList) && classesList.length > 0 && (
                                <FormControl fullWidth>
                                    <InputLabel>Select Class</InputLabel>
                                    <Select
                                        label="Select Class"
                                        onChange={(e) => {
                                            let class_id = e.target.value
                                            if (class_id) {
                                                dispatch(updateFields({ class_id: class_id }))
                                                let findClass = classesList.find((item) => item.id === class_id)
                                                if (findClass) {
                                                    let exams = _.get(findClass, "meta_data.exam", [])
                                                    setExamList(exams)
                                                }
                                            }
                                        }}
                                        value={_.get(state,"class_id","")}
                                    >
                                        <TextField fullWidth
                                            placeholder="Search... "
                                            variant="outlined"
                                            InputProps={{
                                                endAdornment: (
                                                    <SearchOutlined />
                                                )
                                            }}
                                            size="small"
                                        />
                                        <Divider />
                                        {
                                            classesList.map((cl, index) => {
                                                return (
                                                    <MenuItem value={cl.id} key={`${index}+${cl.class_name}`} >{cl.class_name}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            )
                        }

                        {
                            examList && Array.isArray(examList) && examList.length > 0 && (
                                <FormControl fullWidth>
                                    <InputLabel>Select Exam</InputLabel>
                                    <Select
                                        label="Select Exam"
                                        onChange={(e) => {
                                            let exam = e.target.value
                                            if(exam){
                                                dispatch(updateFields({exam:exam}))
                                            }
                                        }}
                                        value={_.get(state,"exam","")}
                                    >
                                        {
                                            examList.map((ex,index)=> {
                                                return(
                                                    <MenuItem value={ex.examName} key={`${ex.examName}+${index}`} >{ex.examName}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            )
                        }

                        <TextField
                            fullWidth
                            label="Roll Number"
                            placeholder="Enter your roll number"
                            onChange={(e)=>{
                                let rollNo = e.target.value
                                dispatch(updateFields({rollNo:rollNo}))
                            }}
                            value={_.get(state,"rollNo","")}
                        />

                        <TextField
                            fullWidth
                            label="Date of Birth"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            onChange={(e)=> {
                                let dob = e.target.value
                                dispatch(updateFields({dob:dob}))
                            }}
                            value={_.get(state,"dob","")}
                        />

                        {/* Submit Button */}
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                padding: "12px",
                                fontSize: "16px",
                                borderRadius: 2,
                                marginTop: 2
                            }}
                        >
                            View Result
                        </Button>
                    </Box>

                    {/* Footer */}
                    <Typography
                        variant="caption"
                        sx={{
                            display: "block",
                            marginTop: 3,
                            textAlign: "center",
                            color: "gray"
                        }}
                    >
                        *Make sure details are correct before checking the results.
                    </Typography>
                </CardContent>
            </Card>
            {
                (
                    getPlatformListState.isLoading ||
                    getClassesState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
        </Box>
    )
}
