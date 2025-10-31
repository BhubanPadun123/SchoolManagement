import React, { useState } from "react"
import {
    Table,
    Button,
    IconButton,
    Modal,
    Tooltip,
    Whisper,
    FlexboxGrid,
    Divider,
    Input,
    InputGroup,
    Col
} from "rsuite"
import { EyeRound, TagFilter } from "@rsuite/icons"
import SearchIcon from '@rsuite/icons/Search'

const { Column, HeaderCell, Cell } = Table
const styles = {
    marginBottom: 10
}

const CustomInputGroupWidthButton = ({ placeholder, ...props }) => (
    <InputGroup {...props} inside style={styles}>
        <Input placeholder={placeholder} />
        <InputGroup.Button>
            <SearchIcon />
        </InputGroup.Button>
        <InputGroup.Button>
           <TagFilter/>
        </InputGroup.Button>
    </InputGroup>
);

const RegisterStudentList = ({ 
    studentsList = [],
    updateRegistrationAction 
}) => {
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [showModal, setShowModal] = useState(false)

    let tempList = Array.isArray(studentsList) && studentsList.filter((i) => i.meta_data && i.meta_data.hasOwnProperty('status') ? i.meta_data.status !== "admitted" : i)

    if (!Array.isArray(tempList) || tempList.length === 0){
        return(
            <div>
                <h1 style={{
                    textAlign:"center"
                }}>List Empty!</h1>
            </div>
        )
    }

    const handleRowClick = (rowData) => {
        setSelectedStudent(rowData)
        setShowModal(true)
    }

    const handleClose = () => {
        setShowModal(false)
        setSelectedStudent(null)
    }
    function handleUpdateStatus(type){
        if(!selectedStudent || !type) return
        const meta_data = {
            ...selectedStudent.meta_data,
            "status":type
        }
        updateRegistrationAction({
            registration_ref:selectedStudent.id,
            meta_data:{
                ...meta_data
            }
        })
        setSelectedStudent(null)
        setShowModal(false)
    }

    return (
        <div style={{
            paddingLeft: 4,
            paddingRight: 4
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
                    />
                </Col>
            </div>
            <Table
                height={600}
                wordWrap
                autoHeight
                data={tempList}
                hover
                bordered
            >
                <Column flexGrow={1}>
                    <HeaderCell>ID</HeaderCell>
                    <Cell dataKey="id" />
                </Column>

                <Column flexGrow={2}>
                    <HeaderCell>First Name</HeaderCell>
                    <Cell dataKey="firstname" />
                </Column>

                <Column flexGrow={2}>
                    <HeaderCell>Last Name</HeaderCell>
                    <Cell dataKey="lastname" />
                </Column>

                <Column flexGrow={1}>
                    <HeaderCell>Gender</HeaderCell>
                    <Cell dataKey="gender" />
                </Column>

                <Column flexGrow={1}>
                    <HeaderCell>Age</HeaderCell>
                    <Cell dataKey="age" />
                </Column>

                <Column flexGrow={2}>
                    <HeaderCell>Student Number</HeaderCell>
                    <Cell dataKey="cnumber" />
                </Column>

                <Column flexGrow={2}>
                    <HeaderCell>Parent Number</HeaderCell>
                    <Cell dataKey="pnumber" />
                </Column>

                <Column flexGrow={3}>
                    <HeaderCell>
                        Status
                    </HeaderCell>
                    <Cell>
                        {
                            (rowData) => {
                                return (
                                    <span style={{
                                        color: rowData.meta_data && rowData.meta_data.hasOwnProperty("status") ? "green" : "red"
                                    }}>{rowData.meta_data && rowData.meta_data.hasOwnProperty("status") ? rowData.meta_data.status : "Need Action"}</span>
                                )
                            }
                        }
                    </Cell>
                </Column>

                <Column flexGrow={1}>
                    <HeaderCell>Actions</HeaderCell>
                    <Cell>
                        {(rowData) => (
                            <FlexboxGrid justify="center" align="middle">
                                <Button
                                    endIcon={<EyeRound />}
                                    onClick={() => handleRowClick(rowData)}
                                    appearance="ghost"
                                >
                                    View
                                </Button>
                            </FlexboxGrid>
                        )}
                    </Cell>
                </Column>
            </Table>

            {/* Student Detail Modal */}
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
                    <Button onClick={() => {handleUpdateStatus("admitted") }} appearance="primary">
                        Approve Admission
                    </Button>
                    <Button onClick={() => {handleUpdateStatus("waiting") }} appearance="primary">
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
