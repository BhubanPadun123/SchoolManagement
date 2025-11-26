import React from 'react'
import {
    Typography,
    Button,
    IconButton,
    Tooltip,
    Modal,
    useMediaQuery,
    useTheme,
    Divider,
    TextField
} from "@mui/material"
import {
    UpdateOutlined,
    DownloadOutlined,
    CloseOutlined,
    LocalAtmOutlined,
    RecyclingOutlined,
    DocumentScannerOutlined,
    CycloneOutlined
} from "@mui/icons-material"
import {
    Loader,
    CTable
} from "../components/index"
import {
    useLazyGetClassStudentsListQuery,
    useUpdateClassMetadataMutation,
    useLazyGetInstitutionClassesQuery
} from "../Redux/actions/classSetup.action"
import {
    useLazyGetAllinstitutionRegisteredStudentsQuery,
} from "../Redux/actions/admissionSetup.action"
import {
    useDownloadAdmissionRecievedMutation
} from "../Redux/actions/download.action"
import {
    useUpdateUserMetadataMutation
} from "../Redux/actions/setting.action"
import {
    toaster,
    Message
} from "rsuite"
import _ from "lodash"
import ManageFee from './components/Fee'

const StudentList = ({
    institution_ref,
    class_name,
    classes
}) => {
    const theme = useTheme()
    const iseMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [openUpdate, setOpenUpdate] = React.useState(false)
    const [rollNo, setRollNo] = React.useState("")
    const [openDownload, setOpenDownload] = React.useState(false)
    const [selectedStudent, setSelectedStudent] = React.useState(null)
    const [openFeeModal, setOpenFeeModal] = React.useState(false)

    const [getClassStudentsAction, getClassStudentState] = useLazyGetClassStudentsListQuery()
    const [updateClassMetadataAction, updateClassMetadataState] = useUpdateClassMetadataMutation()
    const [getClassesAction, getClassesState] = useLazyGetInstitutionClassesQuery()
    const [getRegisteredStudentAction, getRegisteredStudentState] = useLazyGetAllinstitutionRegisteredStudentsQuery()
    const [downloadAdmissionRecievedAction, downloadAdmissionRecievedState] = useDownloadAdmissionRecievedMutation()
    const [updateUserMetadataAction, updateUserMetadataState] = useUpdateUserMetadataMutation()


    const updateUserMetadataStatus = React.useMemo(() => {
        if (updateUserMetadataState.isSuccess) {
            let message = _.get(updateUserMetadataState, "data.message", "")
            toaster.push(<Message type="success" >{message}</Message>, { placement: "topCenter" })
            setOpenFeeModal(false)
            fetchClassAndStudents()
            updateUserMetadataState.reset()
            return true
        }
        if (updateUserMetadataState.isError) {
            toaster.push(<Message type="error" >Error while update the student fee,Please try after sometime!</Message>, { placement: "bottomCenter" })
            return false
        }
    }, [updateUserMetadataState])
    const classList = React.useMemo(() => {
        if (getClassesState.isSuccess) {
            const list = _.get(getClassesState, "currentData.list", [])
            return list
        } else {
            return []
        }
    }, [getClassesState])
    React.useEffect(() => {
        if (Array.isArray(classList) && classList.length > 0) {
            classes = classList
        }
    }, [classList])
    function fetchClassAndStudents() {
        if (institution_ref && class_name && Array.isArray(classes) && classes.length > 0) {
            const findClass = classes.find(item => item.class_name === class_name)
            if (findClass) {
                getClassStudentsAction({
                    institution_ref: findClass.institution_ref,
                    class_id: findClass.id
                })
                getClassesAction({
                    institution_ref: institution_ref
                })
            }
        }
    }
    const updateClassMetadataStatus = React.useMemo(() => {
        if (updateClassMetadataState.isSuccess) {
            fetchClassAndStudents()
            let message = _.get(updateClassMetadataState, "data.message", "")
            toaster.push(<Message type='info' >{message}</Message>, { placement: "topCenter" })
            setRollNo("")
            setOpenUpdate(false)
            updateClassMetadataState.reset()
        }
    }, [updateClassMetadataState])
    React.useEffect(() => {
        if (institution_ref && class_name && Array.isArray(classes) && classes.length > 0) {
            const findClass = classes.find(item => item.class_name === class_name)
            if (findClass) {
                getClassStudentsAction({
                    institution_ref: findClass.institution_ref,
                    class_id: findClass.id
                })
                getRegisteredStudentAction({
                    institution_ref: findClass.institution_ref,
                    class_ref: findClass.id
                })
            }
        }
    }, [class_name])

    const studentList = React.useMemo(() => {
        if (getClassStudentState.isSuccess) {
            const dataList = _.get(getClassStudentState, "currentData", [])
            const findClass = Array.isArray(classes) && classes.length > 0 && classes.find(i => i.class_name === class_name)
            if (findClass && Array.isArray(dataList) && dataList.length > 0) {
                let findFees = _.get(findClass,"meta_data.feeStructure",[])
                const list = dataList.map((item, index) => {
                    let sudentFeeCount = _.get(item,"meta_data.feePayment",[])
                    let student_ref = item.id
                    let students = _.get(findClass, "meta_data.students", [])
                    let rollNoInfo = Array.isArray(students) && students.length > 0 && students.find(i => i.student_ref === student_ref)
                    return {
                        "SL_No": index + 1,
                        "First_Name": item.firstname,
                        "Last_Name": item.lastname,
                        "Email": item.email,
                        "Class": class_name,
                        "Roll_No": rollNoInfo ? rollNoInfo.roll_no : "No Assign",
                        "Payment_Count":`${sudentFeeCount.length} / ${findFees.length}`
                    }
                })
                return list
            } else {
                return []
            }
        }
    }, [getClassStudentState])

    const currentStudent = React.useMemo(() => {
        if (getClassStudentState.isSuccess && selectedStudent) {
            let studentList = _.get(getClassStudentState, "currentData", [])
            let findCurrentStudent = Array.isArray(studentList) && studentList.length > 0 && studentList.find(i => i.email == selectedStudent.Email)
            return findCurrentStudent
        } else {
            return null
        }
    }, [getClassStudentState, selectedStudent])

    const registerStudentList = React.useMemo(() => {
        if (getRegisteredStudentState.isSuccess) {
            const list = _.get(getRegisteredStudentState, "currentData.list", [])
            return list
        } else {
            return []
        }
    }, [getRegisteredStudentState])

    function handleDownloadAdmissionRecieved() {
        let findClass = selectedStudent && Array.isArray(classes) && classes.length > 0 && classes.find(i => i.class_name === selectedStudent.Class)
        let students = findClass && _.get(findClass, "meta_data.students", [])
        let findStudent = selectedStudent && Array.isArray(students) && students.length > 0 && students.find(i => i.roll_no == selectedStudent.Roll_No)
        let findRegisterStudent = selectedStudent && Array.isArray(registerStudentList) && registerStudentList.length > 0 && registerStudentList.find(i => i.email === selectedStudent.Email)
        if (institution_ref && findClass && findStudent && findRegisterStudent) {
            const data = {
                "school_name": "ABC Public School",
                "school_address": "123 Main Road, City Name | Phone: 9876543210",
                "student_name": "John Doe",
                "class_name": "8th Standard",
                "application_no": "ADM2025-00125",
                "submitted_date": "19 Nov 2025",
                "review_text": "The admission process was smooth and staff was very friendly."
            }
            // downloadAdmissionRecievedAction(data)
        }
        console.log({
            findRegisterStudent,
            findStudent,
            findClass
        })
    }

    const updateClass = updateClassMetadataStatus
    const updateUser= updateUserMetadataStatus



    return (
        <div style={{
            width: "100%"
        }}>
            <CTable
                header={["SL_No", "First_Name", "Last_Name", "Email", "Class", "Roll_No","Payment_Count"]}
                rows={studentList}
                onRowClick={(e) => {
                    setSelectedStudent(e)
                }}
                renderActions={
                    <div className='cl-md-12'>
                        <Tooltip title={"Update Fee Data"} >
                            <IconButton onClick={() => {
                                setOpenFeeModal(true)
                            }} >
                                <CycloneOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={"Update Student Roll No"} placement='bottom' arrow >
                            <IconButton onClick={() => {
                                setOpenUpdate(true)
                            }} >
                                <UpdateOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={"Download Data"} placement='bottom' arrow >
                            <IconButton onClick={() => {
                                setOpenDownload(true)
                            }} >
                                <DownloadOutlined />
                            </IconButton>
                        </Tooltip>
                    </div>
                }
            />
            <Modal
                open={openFeeModal}
                onClose={() => {
                    setOpenFeeModal(false)
                }}
                sx={{
                    width: "100%",
                    height: "100%"
                }}
            >
                <ManageFee
                    selectedStudent={selectedStudent}
                    classes={classes}
                    currentStudent={currentStudent}
                    onClose={() => {
                        setOpenFeeModal(false)
                    }}
                    onSubmit={(e) => {
                        let students = _.get(getClassStudentState, "currentData", [])
                        let findStudent = selectedStudent && Array.isArray(students) && students.length > 0 && students.find(i => i.email === selectedStudent.Email)
                        if (findStudent) {
                            let student = {
                                ...findStudent
                            }
                            let isExistFee = _.get(student, "meta_data.feePayment", null)
                            if (!isExistFee) {
                                let meta_data = {
                                    ...student.meta_data,
                                    feePayment: [...e]
                                }
                                student.meta_data = meta_data
                                updateUserMetadataAction({
                                    userRef: student.id,
                                    userInfo: student
                                })
                            } else {
                                let meta_data = {
                                    ...student.meta_data,
                                    feePayment: [...isExistFee,...e]
                                }
                                student.meta_data = meta_data
                                updateUserMetadataAction({
                                    userRef: student.id,
                                    userInfo: student
                                })
                            }
                        }
                    }}
                />
            </Modal>
            <Modal
                open={openUpdate}
                onClose={() => {
                    setOpenUpdate(false)
                }}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <div style={{
                    width: iseMobile ? "90%" : "400px",
                    backgroundColor: "gray",
                    border: "1px solid #FFFF",
                    borderRadius: "8px",
                    minHeight: "200px"
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <Typography variant='h5' sx={{
                            fontFamily: "Lato",
                            fontWeight: 400,
                            color: "#FFFF",
                            fontStyle: "normal",
                            flexGrow: 1
                        }}>
                            Update Student Roll No
                        </Typography>
                        <Tooltip title={"Close"} placement='bottom' arrow >
                            <IconButton onClick={() => {
                                setOpenUpdate(false)
                                setRollNo("")
                                setSelectedStudent(null)
                            }}>
                                <CloseOutlined color='#FFFF' sx={{
                                    color: "#FFFF"
                                }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <Divider style={{
                        backgroundColor: "#FFFF"
                    }} />
                    <div style={{
                        flexGrow: 2,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: 'center',
                        height: "120px",
                        background: "#FFFF",
                        width: "100%",
                    }}>
                        <TextField
                            placeholder='Enter Student Roll No'
                            label={"Enter Student Roll No"}
                            variant='outlined'
                            focused
                            value={rollNo}
                            onChange={(e) => {
                                setRollNo(e.target.value)
                            }}
                            type='number'
                        />
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        width: "100%",
                        flexFlow: 1,
                        padding: "4px"
                    }}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                const dataList = _.get(getClassStudentState, "currentData", [])
                                if (!rollNo || !selectedStudent || !Array.isArray(classes) || !Array.isArray(dataList) || dataList.length === 0) return
                                let findClass = Array.isArray(classes) && classes.length > 0 && classes.find(i => i.class_name === selectedStudent.Class)
                                if (findClass) {
                                    let students = _.get(findClass, "meta_data.students", [])
                                    let findStudent = dataList.find(i => i.email === selectedStudent.Email)
                                    let studentRegistrationLink = Array.isArray(registerStudentList) && registerStudentList.length > 0 && registerStudentList.find(i => i.email === selectedStudent.Email)
                                    let isExistRollNo = studentRegistrationLink && Array.isArray(students) && students.length > 0 && students.find(i => i.student_ref === studentRegistrationLink.id)

                                    let updatedStudent = isExistRollNo ? Array.isArray(students) && students.length > 0 && studentRegistrationLink && students.map((item) => {
                                        if (item.student_ref === studentRegistrationLink.id) {
                                            return {
                                                "roll_no": rollNo,
                                                "student_ref": findStudent.id
                                            }
                                        } else {
                                            return item
                                        }
                                    }) : [
                                        ...students,
                                        {
                                            "roll_no": rollNo,
                                            "student_ref": findStudent.id
                                        }
                                    ]
                                    let meta_data = {
                                        ...findClass.meta_data,
                                        "students": [
                                            ...updatedStudent,
                                        ]
                                    }
                                    updateClassMetadataAction({
                                        class_id: findClass.id,
                                        meta_data: meta_data
                                    })
                                }
                            }}
                        >
                            Submit
                        </Button>
                        <Button
                            variant='text'
                            sx={{
                                color: "#FFFF"
                            }}
                            onClick={() => {
                                setOpenUpdate(false)
                                setRollNo("")
                                setSelectedStudent(null)
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal
                open={openDownload}
                onClose={() => {
                    setOpenDownload(false)
                }}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <div style={{
                    width: iseMobile ? "90%" : 400,
                    backgroundColor: "gray",
                    border: "1px solid #FFFF",
                    borderRadius: "4px"
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <Typography variant='h5' sx={{
                            fontFamily: "Lato",
                            fontWeight: 400,
                            fontSize: "20px",
                            flexGrow: 1,
                            fontStyle: "normal",
                            color: "#FFFF",
                            padding: "2px"
                        }}>
                            Download Admission Documents
                        </Typography>
                        <Tooltip title={"Close"} placement='bottom' arrow >
                            <IconButton onClick={() => {
                                setOpenDownload(false)
                                setSelectedStudent(null)

                            }} >
                                <CloseOutlined sx={{
                                    color: "#FFFF"
                                }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <Divider sx={{
                        backgroundColor: "#FFFF"
                    }} />
                    <div style={{
                        padding: "4px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "start",
                        gap: "8px",
                        marginLeft: iseMobile ? "40px" : "70px"
                    }}>
                        <Tooltip title={"Download Recieved"} placement="bottom" arrow >
                            <Button
                                variant="outlined"
                                startIcon={<LocalAtmOutlined sx={{
                                    color: "#FFFF",
                                    fontSize: "14px"
                                }} />}
                                sx={{
                                    color: "#FFFF"
                                }}
                                onClick={handleDownloadAdmissionRecieved}
                            >
                                Admission Recieved
                            </Button>
                        </Tooltip>
                        <Tooltip title={"Admission Document"} placement="bottom" arrow >
                            <Button
                                variant="outlined"
                                startIcon={<DocumentScannerOutlined sx={{
                                    color: "#FFFF",
                                    fontSize: "14px"
                                }} />}
                                sx={{
                                    color: "#FFFF"
                                }}
                            >
                                Admission Documents
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </Modal>
            {
                (
                    getClassStudentState.isLoading ||
                    updateClassMetadataState.isLoading ||
                    getClassesState.isLoading ||
                    getRegisteredStudentState.isLoading ||
                    downloadAdmissionRecievedState.isLoading ||
                    updateUserMetadataState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
        </div>
    )
}

export default StudentList