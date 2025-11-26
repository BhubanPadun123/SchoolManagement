import React, {
    useState,
    useEffect
} from "react"
import { useParams } from "react-router-dom"
import {
    useLazyGetInstitutionClassesQuery,
    useUpdateClassMetadataMutation,
    useLazyGetClassStudentsListQuery
} from "../Redux/actions/classSetup.action"
import { GetCurrentUser } from "../utils/hooks"
import _ from "lodash"
import {
    Typography,
    Box,
    Checkbox,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
    Modal,
    Tooltip,
    IconButton,
    TextField,
    InputAdornment,
} from "@mui/material"
import {
    Add,
    Close,
    PendingActionsOutlined,
    SearchOutlined,
    FormatShapesOutlined
} from "@mui/icons-material"
import {
    AdmitCardA,
    AdmitCardB,
    AdmitCardC,
    AdmitCardD
} from "./AdmitCardTemplate"
import QRCode from "react-qr-code"
import {
    Loader,
    CTable
} from "../components/index"
import {
    toaster,
    Message
} from "rsuite"


export default function StudentAdmit() {
    const { class_name } = useParams()
    const [classInfo, setClassinfo] = useState(null)
    const [selectedVal, setSelectedVal] = useState("")
    const [openViewTemplate, setOpenViewTemplate] = useState(false)
    const [currentClass, setCurrentClass] = useState(null)
    const [openTemplate, setOpenTemplate] = useState(false)
    const [searchList,setSearchList] = useState([])
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
    const [updateClassMetadataAction, updateClassMetadataState] = useUpdateClassMetadataMutation()
    const [getClassStudentAction, getClassStudentState] = useLazyGetClassStudentsListQuery()


    const classStudentList = React.useMemo(() => {
        if (getClassStudentState.isSuccess) {
            const list = _.get(getClassStudentState, "currentData", [])
            const finalList = Array.isArray(list) && list.length > 0 && list.map((item, index) => {
                return {
                    "SL_No": index + 1,
                    "First_Name": item.firstname,
                    "Last_Name": item.lastname,
                    "Email": item.email
                }
            })
            return finalList
        } else {
            return []
        }
    }, [getClassStudentState])
    
    React.useEffect(()=> {
        if(classStudentList){
            setSearchList(classStudentList)
        }
    },[classStudentList])
    const update_metadataStatus = React.useMemo(() => {
        if (updateClassMetadataState.isSuccess) {
            let message = _.get(updateClassMetadataState, "data.message", "")
            toaster.push(<Message type="success" >{message}</Message>, { placement: "topCenter" })
            updateClassMetadataState.reset()
        }
        if (updateClassMetadataState.isError) {
            toaster.push(<Message type="error" >Error while update the admit template</Message>, { placement: "bottomEnd" })
        }
    }, [updateClassMetadataState])

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
                    getClassStudentAction({
                        institution_ref: findClass.institution_ref,
                        class_id: findClass.id
                    })
                }
            }
        }
    }, [getClassesState, class_name])

    const Classes = React.useMemo(() => {
        if (getClassesState.isSuccess) {
            const list = _.get(getClassesState, "currentData.list", [])
            return list
        } else {
            return []
        }
    }, [getClassesState])

    React.useEffect(() => {
        if (Array.isArray(Classes) && Classes.length > 0) {
            let findClass = Classes.find(i => i.class_name === class_name)
            if (findClass) {
                let template = _.get(findClass, "meta_data.admitTemplate", null)
                if (template) {
                    setSelectedVal(template)
                }
                setCurrentClass(findClass)
            }
        }
    }, [Classes])

    function updateTemplate() {
        if (Array.isArray(Classes) && Classes.length > 0 && selectedVal) {
            let findClass = Classes.find(i => i.class_name === class_name)
            if (findClass) {
                let meta_data = {
                    ...findClass.meta_data,
                    "admitTemplate": selectedVal
                }
                updateClassMetadataAction({
                    class_id: findClass.id,
                    meta_data: meta_data
                })
            }
        }
    }


    const getTemplate = (template) => {
        switch (template) {
            case "temp_1":
                return (
                    <AdmitCardA />
                )
                break
            case "temp_2":
                return (
                    <AdmitCardB />
                )
                break
            case "temp_3":
                return (
                    <AdmitCardC />
                )
            case "temp_4":
                return (
                    <AdmitCardD />
                )
                break
            default:
                return null
        }
    }

    const templateUpdateStatus = update_metadataStatus

    return (
        <div>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "20px"
            }}>
                <div className="col-md-12" style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    padding: "8px",
                    gap: "8px"
                }}>
                    <TextField
                        placeholder="Search"
                        // label={"Search"}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <Tooltip title={"Search"} placement="bottom" arrow >
                                    <SearchOutlined />
                                </Tooltip>
                            )
                        }}
                        sx={{
                            backgroundColor: "#FFFF",
                            borderRadius: "8px"
                        }}
                        size="small"
                        onChange={(e)=> {
                            let val = e.target.value

                            let searchList = Array.isArray(classStudentList) && 
                                            classStudentList.length > 0 && 
                                            classStudentList.filter(
                                                i => i.First_Name.toLowerCase().includes(val.toLowerCase()) ||
                                                i.Last_Name.toLowerCase().includes(val.toLowerCase()) ||
                                                i.Email.toLowerCase().includes(val.toLowerCase())
                                            )
                            setSearchList(searchList)
                        }}
                    />
                    <Button
                        size="medium"
                        variant="outlined"
                        startIcon={<FormatShapesOutlined />}
                        onClick={() => {
                            setOpenTemplate(!openTemplate)
                        }}
                    >
                        Select Template
                    </Button>
                </div>
                <div className="col-md-12" style={{
                    width: "100%",
                }}>
                    <CTable
                        header={["SL_No", "First_Name", "Last_Name", "Email"]}
                        rows={searchList}
                        renderActions={
                            <div>
                                <Tooltip title={"Approve for allow download admit card"} placement="bottom" arrow >
                                    <Button
                                        size="small"
                                        startIcon={<PendingActionsOutlined sx={{ fontSize: "14px" }} />}
                                        variant="outlined"
                                    >
                                        Pending
                                    </Button>
                                </Tooltip>
                            </div>
                        }
                    />
                    {/* {getTemplate(selectedVal)} */}
                </div>
            </div>
            <Modal
                open={openTemplate}
                onClose={() => {
                    setOpenTemplate(false)
                }}
            >
                <Box
                    sx={{
                        width: "auto",
                        height: "auto",
                        borderRadius: 1,
                        bgcolor: 'gray',
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        paddingTop: 2,
                        paddingBottom: 2,
                        paddingLeft: "8px",
                        paddingRight: "8px",
                        gap: "8px"
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
                        Select Admit Card Template
                    </Typography>
                    <Divider sx={{
                        backgroundColor: "#FFFF"
                    }} />
                    <FormControl fullWidth sx={{
                        borderColor: "#FFFF"
                    }}>
                        <InputLabel>Select Admit Template</InputLabel>
                        <Select
                            label={"Select Admit Template"}
                            variant="outlined"
                            value={selectedVal}
                            onChange={(e) => {
                                setSelectedVal(e.target.value)
                            }}
                        >
                            {
                                templates.map((item, index) => {
                                    return (
                                        <MenuItem value={item.id} key={index}>
                                            <Typography sx={{
                                                padding: 0,
                                                fontFamily: "Lato",
                                                fontSize: "14px",
                                                fontWeight: 500
                                            }}>
                                                {item.name}
                                            </Typography>
                                        </MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                    <div style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        padding: "8px",
                        gap: "4px",
                        width: "100%"
                    }}>
                        <Button
                            variant="contained"
                            onClick={updateTemplate}
                        >
                            Submit
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{
                                color: "#FFFF"
                            }}
                            onClick={() => {
                                setOpenViewTemplate(true)
                            }}
                        >
                            View Template
                        </Button>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openViewTemplate}
                onClose={() => {
                    setOpenViewTemplate(false)
                }}
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: 'center'
                }}
            >
                <div style={{
                    width: "100%"
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "center"
                    }}>
                        <Tooltip title={"Close"} arrow placement="bottom" >
                            <IconButton onClick={() => {
                                setOpenViewTemplate(false)
                            }} >
                                <Close sx={{
                                    backgroundColor: "#FFFF"
                                }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                    {
                        getTemplate(selectedVal)
                    }
                </div>
            </Modal>
            {
                (
                    getClassesState.isLoading ||
                    updateClassMetadataState.isLoading ||
                    getClassStudentState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
        </div>
    )
}