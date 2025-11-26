import React, { useState } from "react"
import {
    Button,
    Modal,
    Divider,
    Input,
    InputGroup,
    Col,
    toaster,
    Message
} from "rsuite"
import { EyeRound, TagFilter } from "@rsuite/icons"
import SearchIcon from '@rsuite/icons/Search'
import {
    CTable,
    Loader,
    ConfirmationAlert,
    ToastMessage
} from "../components/index"
import {
    DownloadOutlined,
    RemoveRedEyeOutlined,
    ClearOutlined
} from "@mui/icons-material"
import {
    IconButton,
    Tooltip
} from "@mui/material"
import {
    useLazyDownloadRegisterStudentsQuery
} from "../Redux/actions/download.action"
import { useParams } from "react-router-dom"
import { api_service_path, baseUrl } from "../Redux/actions/utils"
import {
    useUpdateClassMetadataMutation,
    useLazyGetInstitutionClassesQuery,
    useLazyGetClassStudentsListQuery
} from "../Redux/actions/classSetup.action"
import _ from "lodash"

const styles = {
    marginBottom: 10
}

const CustomInputGroupWidthButton = ({ placeholder, ...props }) => (
    <InputGroup {...props} inside style={styles}>
        <Input placeholder={placeholder} onChange={props.handleSearch} />
        <InputGroup.Button>
            <SearchIcon />
        </InputGroup.Button>
        <InputGroup.Button onClick={props.handleDownload}>
            <Tooltip title={"Clear All"} arrow placement="bottom" >
                <ClearOutlined fontSize="10" />
            </Tooltip>
        </InputGroup.Button>
        <InputGroup.Button onClick={props.handleDownload}>
            <Tooltip title={"Download"} arrow placement="bottom" >
                <DownloadOutlined />
            </Tooltip>
        </InputGroup.Button>
    </InputGroup>
);

function RegisterStudentList({
    studentsList = [],
    updateRegistrationAction,
    classList,
    institution_ref
}){
    const { class_name } = useParams()
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const [downloadStudentListAction, downloadStudentListState] = useLazyDownloadRegisterStudentsQuery()
    const [updateClassMetadataAction, updateClassMetadataState] = useUpdateClassMetadataMutation()
    const [getClassStudentsAction, getClassStudentState] = useLazyGetClassStudentsListQuery()

    React.useEffect(()=>{
        fetchClassStudents()
    },[class_name,institution_ref,classList])

    async function fetchClassStudents(){
        if(Array.isArray(classList.list) && classList.list.length > 0 && class_name && institution_ref){
            let findClass = classList.list.find(i => i.class_name === class_name)
            if(findClass){
                getClassStudentsAction({
                    institution_ref:institution_ref,
                    class_id:findClass.id
                })
            }
        }
    }
    async function handleDownload() {
        if (!Array.isArray(studentsList) || studentsList.length === 0 || !class_name) {
            toaster.push(
                <Message type="info">Required data missing for download the Excel file!</Message>,
                { placement: "topCenter" }
            )
            return
        }

        try {
            const class_ref = studentsList[0].class_ref
            const institution_ref = studentsList[0].institution_ref

            const response = await fetch(
                `${baseUrl}/${api_service_path.download}/registered_students/${class_ref}/${institution_ref}`,
                { method: "GET" }
            )

            if (!response.ok) {
                throw new Error("Failed to download Excel file")
            }

            // ✅ Convert the response to a Blob
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)

            // ✅ Create a temporary download link
            const link = document.createElement("a")
            link.href = url;
            link.download = `students_class_${class_ref}_institution_${institution_ref}.xlsx`
            document.body.appendChild(link)
            link.click()

            // ✅ Cleanup
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Error downloading Excel:", error)
            toaster.push(
                <Message type="error">Failed to download Excel. Please try again.</Message>,
                { placement: "topCenter" }
            );
        }
    }


    const list = Array.isArray(studentsList) && studentsList.length > 0 &&
        studentsList.map((item, index) => {
            return {
                "ID": item.id,
                "Class_ref": item.class_ref,
                "Institution_ref": item.institution_ref,
                "First_Name": item.firstname,
                "Last_Name": item.lastname,
                "Gender": item.gender,
                "Age": item.age,
                "Student_Number": item.cnumber,
                "Parent_Number": item.pnumber,
                "Status": item.meta_data.hasOwnProperty('status') ? item.meta_data.status : "Need Action",
            }
        })

    let tempList = Array.isArray(list) && list.filter((i) => i && i.Status !== "admitted" && i)

    if (!Array.isArray(tempList) || tempList.length === 0) {
        return (
            <div>
                <h1 style={{
                    textAlign: "center"
                }}>List Empty!</h1>
            </div>
        )
    }

    const handleClose = () => {
        setShowModal(false)
        setSelectedStudent(null)
    }
    function handleUpdateStatus(type) {
        if (!selectedStudent || !type) return
        const meta_data = {
            ...selectedStudent.meta_data,
            "status": type
        }
        updateRegistrationAction({
            registration_ref: selectedStudent.id,
            meta_data: {
                ...meta_data
            }
        })
        if (type === "admitted" && classList && classList.hasOwnProperty('list') && Array.isArray(classList.list)) {
            const findClass = classList.list.find(i => i.class_name === class_name)
            if (findClass) {
                let students = _.get(findClass, "meta_data.students", [])
                let isStudentExist = Array.isArray(students) && students.length > 0 && students.find(i => i.student_ref === selectedStudent.id)
                if (findClass.meta_data && findClass.meta_data.hasOwnProperty("admitted")) {

                    const meta_data = {
                        ...findClass.meta_data,
                        "admitted": findClass.meta_data.admitted + 1,
                        "students": isStudentExist && students ? [...findClass.meta_data.students] : [
                            ...findClass.meta_data.students,
                            {
                                "student_ref": selectedStudent.id,
                                "roll_no": findClass.meta_data.admitted + 1
                            }
                        ]
                    }
                    updateClassMetadataAction({
                        class_id: findClass.id,
                        meta_data: meta_data
                    })
                } else {
                    const meta_data = {
                        ...findClass.meta_data,
                        "admitted": 1,
                        "students": isStudentExist ? [...findClass.meta_data.students] : [
                            ...findClass.meta_data.students,
                            {
                                "student_ref": selectedStudent.id,
                                "roll_no": 1
                            }
                        ]
                    }
                    updateClassMetadataAction({
                        class_id: findClass.id,
                        meta_data: meta_data
                    })
                }
            }
        }
        setSelectedStudent(null)
        setShowModal(false)
    }
    function handleSearch(e) {
        console.log(studentsList, "<<<<<<<")
        // const filterList = Array.isArray(tempList) && tempList.length > 0 && tempList.filter(i => i.)
    }

    return (
        <div className="col-md-12" style={{
            paddingLeft: 4,
            paddingRight: 4,
            width: "100%"
        }}>
            <div style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center"
            }}>
                <Col xs={24} sm={12} md={8}>
                    <CustomInputGroupWidthButton
                        size="lg"
                        placeholder="Search by gmail"
                        handleDownload={handleDownload}
                        handleSearch={handleSearch}
                    />
                </Col>
            </div>
            <CTable
                header={["ID", "Class_ref", "Institution_ref", "First_Name", "Last_Name", "Gender", "Age", "Student_Number", "Parent_Number", "Status"]}
                rows={tempList}
                renderActions={
                    <div>
                        <Tooltip title={"View Details"} placement="bottom" arrow >
                            <IconButton>
                                <RemoveRedEyeOutlined />
                            </IconButton>
                        </Tooltip>
                    </div>
                }
                onRowClick={(e) => {
                    const findCandidate = studentsList.find(i => i.id === e.ID)
                    setShowModal(true)
                    setSelectedStudent(findCandidate)
                }}
            />
            {
                (
                    downloadStudentListState.isLoading ||
                    updateClassMetadataState.isLoading ||
                    getClassStudentState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
            <Modal open={showModal} onClose={handleClose} size="md">
                <Modal.Header>
                    <Modal.Title>Student Details</Modal.Title>
                </Modal.Header>
                <Divider />
                <Modal.Body>
                    {selectedStudent && (
                        <div className="student-details">
                            <p>
                                <strong>Name:</strong> {selectedStudent.firstname}{" "}
                                {selectedStudent.lastname}
                            </p>
                            <p>
                                <strong>Gender:</strong> {selectedStudent.gender}
                            </p>
                            <p>
                                <strong>Age:</strong> {selectedStudent.age}
                            </p>
                            <p>
                                <strong>Father’s Name:</strong> {selectedStudent.fathername}
                            </p>
                            <p>
                                <strong>Mother’s Name:</strong> {selectedStudent.mothername}
                            </p>
                            <p>
                                <strong>Contact No:</strong> {selectedStudent.cnumber}
                            </p>
                            <p>
                                <strong>Parent No:</strong> {selectedStudent.pnumber}
                            </p>
                            <p>
                                <strong>Email:</strong> {selectedStudent.email}
                            </p>
                            <p>
                                <strong>Last Exam:</strong> {selectedStudent.lastExamination}
                            </p>
                            <p>
                                <strong>Marks Obtained:</strong> {selectedStudent.markObtain}
                            </p>
                            <p>
                                <strong>Division:</strong> {selectedStudent.division}
                            </p>
                        </div>
                    )}
                </Modal.Body>
                <Divider />
                <Modal.Footer>
                    <Button onClick={() => { handleUpdateStatus("admitted") }} appearance="primary">
                        Approve Admission
                    </Button>
                    <Button onClick={() => { handleUpdateStatus("waiting") }} appearance="primary">
                        Mark As Waiting
                    </Button>
                    <Button onClick={handleClose} appearance="ghost">
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default RegisterStudentList
