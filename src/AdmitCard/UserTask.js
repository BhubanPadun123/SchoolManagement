import React, {
    useState,
    useEffect
} from "react"
import examinationIcon from "../Images/examination.svg"
import { useParams } from "react-router-dom"
import {
    useLazyGetInstitutionClassesQuery,
    useUpdateClassMetadataMutation,
    useLazyGetClassStudentsListQuery,
} from "../Redux/actions/classSetup.action"
import {
    useUpdateUserMetadataMutation
} from "../Redux/actions/setting.action"
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
    useTheme,
    useMediaQuery,
    Card
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
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const { class_name } = useParams()
    const [classInfo, setClassinfo] = useState(null)
    const [selectedVal, setSelectedVal] = useState("")
    const [openViewTemplate, setOpenViewTemplate] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [currentClass, setCurrentClass] = useState(null)
    const [openTemplate, setOpenTemplate] = useState(false)
    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const [searchList, setSearchList] = useState([])
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
    const [updateUserMetadataAction, updateMetadataState] = useUpdateUserMetadataMutation()



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

    React.useEffect(() => {
        if (classStudentList) {
            setSearchList(classStudentList)
        } else {
            setSearchList([])
        }
    }, [classStudentList])
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
    const updateUserMetadataStatus = React.useMemo(() => {
        if (updateMetadataState.isSuccess) {
            let message = _.get(updateMetadataState, "data.message", "")
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
            setOpenUpdateModal(false)
            setSelectedStudent(null)
            toaster.push(<Message type="success" >{message}</Message>, { placement: "topCenter" })
            updateMetadataState.reset()
        }
        if (updateMetadataState.isError) {
            toaster.push(<Message type="error" >Error while approve.Please try again after sometime</Message>, { placement: "topCenter" })
            updateMetadataState.reset()
        }
    }, [updateMetadataState])

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

    function checkUpdateBtnStatus(name){
        if(!selectedStudent) return true
        let examAdmits = _.get(selectedStudent,"meta_data.examAdmits",null)
        if(!examAdmits) return false

        let isAlreadyApprove = examAdmits.find((item) => item.examName.toLowerCase() === name.toLowerCase())
        if(isAlreadyApprove){
            return true
        }else{
            return false
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
                        onChange={(e) => {
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
                        onRowClick={(e) => {
                            const list = _.get(getClassStudentState, "currentData", [])
                            const findStudent = list && Array.isArray(list) && list.length > 0 && list.find(i => i.email.toLowerCase() === e.Email.toLowerCase())
                            setSelectedStudent(findStudent)
                        }}
                        renderActions={
                            <div>
                                <Tooltip title={"Approve for allow download admit card"} placement="bottom" arrow >
                                    <Button
                                        size="small"
                                        startIcon={<PendingActionsOutlined sx={{ fontSize: "14px" }} />}
                                        variant="outlined"
                                        onClick={() => {
                                            setOpenUpdateModal(!openUpdateModal)
                                        }}
                                    >
                                        Update
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
            <Modal
                open={openUpdateModal}
                onClose={() => {
                    setOpenUpdateModal(false)
                }}
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <div style={{
                    width: isMobile ? "100%" : "400px",
                    height: isMobile ? "400px" : "600px",
                    backgroundColor: "pink",
                    padding: "8px",
                    border: "2px solid black",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "scroll"
                }}>
                    <div style={{
                        width: "100%",
                        padding: "4px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        background: "#FFFF",
                        alignItems: "center",
                        borderRadius: "10px"
                    }}>
                        <Typography sx={{
                            fontFamily: "Lato",
                            fontWeight: 500,
                            fontStyle: "normal",
                            flex: 1
                        }}>
                            Approve Examination Admit Card
                        </Typography>
                        <Tooltip title={"Close"} arrow placement="bottom" >
                            <IconButton onClick={() => {
                                setSelectedStudent(null)
                                setOpenUpdateModal(false)
                            }} >
                                <Close />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div style={{
                        padding: "10px",
                        display: "flex",
                        flexWrap: "wrap",
                        rowGap: 4,
                        columnGap: 4,
                        justifyContent: "center"
                    }}>
                        {
                            currentClass && _.get(currentClass, "meta_data.exam", []) && Array.isArray(_.get(currentClass, "meta_data.exam", [])) && _.get(currentClass, "meta_data.exam", []).map((item, index) => {
                                return (
                                    <Card key={index} sx={{
                                        width: isMobile ? "40%" : "150px",
                                        boxShadow: "inherit",
                                        padding: "4px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        rowGap: "2px"
                                    }}>
                                        <img
                                            src={examinationIcon}
                                            height={isMobile ? "80px" : "120px"}
                                        />
                                        <Typography sx={{
                                            fontFamily: "Lato",
                                            fontWeight: 500,
                                            fontStyle: "normal",
                                            fontSize: "14px",
                                            textAlign: "center"
                                        }}>{item.examName}</Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            disabled={checkUpdateBtnStatus(item.examName)}
                                            onClick={() => {
                                                if (!selectedStudent) return
                                                let user = JSON.parse(JSON.stringify(selectedStudent))
                                                let examAdmits = _.get(selectedStudent, "meta_data.examAdmits", null)
                                                if (!examAdmits) {
                                                    let meta_data = {
                                                        ...selectedStudent.meta_data,
                                                        examAdmits: [{
                                                            "examName": item.examName,
                                                            "allow": "True",
                                                            "timeTable": item.timeTable
                                                        }]
                                                    }
                                                    user = {
                                                        ...user,
                                                        meta_data: {
                                                            ...meta_data
                                                        }
                                                    }
                                                    updateUserMetadataAction({
                                                        userRef: selectedStudent.id,
                                                        userInfo: user
                                                    })
                                                } else {
                                                    let isExist = Array.isArray(examAdmits) && examAdmits.find((ex) => ex.examName.toLowerCase() === item.examName.toLowerCase())

                                                    if (isExist) {
                                                        toaster.push(<Message type="info" >Admit Card Already being Approved</Message>, { placement: "topCenter" })
                                                    } else {
                                                        let meta_data = {
                                                            ...user.meta_data,
                                                            examAdmits: [
                                                                ...examAdmits,
                                                                {
                                                                    "examName": item.examName,
                                                                    "allow": "True",
                                                                    "timeTable": item.timeTable
                                                                }
                                                            ]
                                                        }
                                                        user = {
                                                            ...user,
                                                            meta_data: {
                                                                ...meta_data
                                                            }
                                                        }
                                                        updateUserMetadataAction({
                                                            userRef: selectedStudent.id,
                                                            userInfo: user
                                                        })
                                                    }
                                                }
                                            }}
                                        >
                                            Approve
                                        </Button>
                                    </Card>
                                )
                            })
                        }
                    </div>
                </div>
            </Modal>
            {
                (
                    getClassesState.isLoading ||
                    updateClassMetadataState.isLoading ||
                    getClassStudentState.isLoading ||
                    updateMetadataState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
        </div>
    )
}