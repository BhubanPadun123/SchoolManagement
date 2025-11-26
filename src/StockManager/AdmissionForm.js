import React, {
    useState,
    useEffect,
    useMemo
} from "react"
import { useParams } from "react-router-dom"
import {
    Tabs,
    Placeholder,
    Container
} from 'rsuite'
import FormAdmission from "./Form"
import RegisterStudentList from "./RegisterList"
import CreateAdmissionLink from "./GenerateAdmissionLink"
import StudentList from "./StudentList"
import {
    useLazyGetInstitutionClassesQuery,
} from "../Redux/actions/classSetup.action"
import {
    useGetAllinstitutionRegisteredStudentsQuery,
    useLazyGetAllinstitutionRegisteredStudentsQuery,
    useUpdateRegistrationStatusMutation
} from "../Redux/actions/admissionSetup.action"
import {
    useUserRegisterMutation
} from "../Redux/actions/user.action"
import {
    GetCurrentUser
} from "../utils/hooks"
import {
    Loader,
    ToastMessage
} from "../components/index"
import {
    useMediaQuery,
    useTheme
} from "@mui/material"


function AdmissionForm() {
    const { class_name } = useParams()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const [operation, setOperation] = useState("new_admission")
    const [institution_ref, setInstitution_ref] = useState(null)
    const [status, setStatus] = useState({
        open: false,
        message: "",
        type: ""
    })

    const [getClassListAction, getClassListState] = useLazyGetInstitutionClassesQuery()
    const [registeredListAction, registeredListState] = useLazyGetAllinstitutionRegisteredStudentsQuery()
    const [updateRegistrationAction, updateRegistrationState] = useUpdateRegistrationStatusMutation()
    const [admitStudentsAction, admitStudentState] = useUserRegisterMutation()

    function fetchUserData() {
        const user = GetCurrentUser()
        if (user) {
            const { meta_data } = user
            if (meta_data && meta_data.hasOwnProperty("user_platform")) {
                const institution_ref = meta_data.user_platform
                setInstitution_ref(institution_ref)
                getClassListAction({
                    institution_ref: institution_ref
                })
            }
        }
    }
    useEffect(() => {
        fetchUserData()
        fetchRegisterStudentList()
    }, [class_name, operation])

    const classes = useMemo(() => {
        if (getClassListState.isSuccess) {
            return [...getClassListState.currentData.list]
        } else {
            return []
        }
    }, [getClassListState])


    function fetchRegisterStudentList() {
        if (Array.isArray(classes) && classes.length > 0 && class_name) {
            const findRef = classes.find(i => i.class_name === class_name)
            if (findRef) {
                registeredListAction({
                    institution_ref: findRef.institution_ref,
                    class_ref: findRef.id
                })
            }
        }
    }

    const studentsList = useMemo(() => {
        if (registeredListState.isSuccess) {
            if (registeredListState && registeredListState.currentData && registeredListState.currentData.hasOwnProperty('list')) {
                return [
                    ...registeredListState.currentData.list
                ]
            } else {
                return []
            }
        } else {
            return []
        }
    }, [registeredListState])

    function admitStudentsIntoClass() {
        const {
            age,
            class_ref,
            cnumber,
            created,
            division,
            email,
            fatherOccupation,
            fathername,
            firstname,
            gender,
            id,
            institution_ref,
            lastExamination,
            lastname,
            markObtain,
            motherOccupation,
            mothername,
            pnumber,
            year,
            meta_data
        } = updateRegistrationState.data.updated_form
        const data = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: `${firstname}@12345`,
            meta_data: {
                user_platform: institution_ref,
                user_class: class_ref,
                user_type: "student",
                fathername: fathername,
                mothername: mothername,
                cnumber: cnumber,
                pnumber: pnumber,
                gender: gender
            }
        }
        if (meta_data && meta_data.hasOwnProperty('status') && meta_data.status === "admitted") {
            admitStudentsAction({
                ...data
            })
        }
    }

    const updateRegistrationStatus = useMemo(() => {
        if (updateRegistrationState.isSuccess) {
            fetchUserData()
            fetchRegisterStudentList()
            admitStudentsIntoClass()
            return {
                open: true,
                message: updateRegistrationState.data.message,
                type: "success"
            }
        }
        if (updateRegistrationState.isError) {
            return {
                open: true,
                message: "Something went wrong!",
                type: "error"
            }
        }
    }, [updateRegistrationState])


    useEffect(() => {
        if (updateRegistrationStatus) {
            setStatus(updateRegistrationStatus)
            updateRegistrationState.reset()
        }
    }, [updateRegistrationStatus])



    return (
        <Container style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 8,
            width: "100%"
        }}>
            <div style={{
                width:"100%",
                // background:"gray",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                paddingTop:4,
                paddingBottom:4,
                margin:8,
            }}>
                <Tabs
                    defaultActiveKey={operation}
                    activeKey={operation}
                    appearance={"pills"}
                    onSelect={setOperation}
                    vertical={isMobile ? true : false}
                >
                    <Tabs.Tab eventKey="new_admission" title="New Registration" />
                    <Tabs.Tab eventKey="registered_student" title="Registered List" />
                    <Tabs.Tab eventKey="students_list" title="Students List" />
                </Tabs>
            </div>
            <div style={{
                width: "100%",
                display:"flex",
                justifyContent:"center",
                alignItems:"center"
            }}>
                {
                    operation === "new_admission" && (
                        <FormAdmission
                            class_name={class_name}
                            classes={classes}
                            institution_ref={institution_ref}
                        />
                    )
                }
                {
                    operation === "registered_student" && (
                        <RegisterStudentList
                            studentsList={studentsList}
                            updateRegistrationAction={updateRegistrationAction}
                            classList={getClassListState?.currentData ? getClassListState.currentData : []}
                            institution_ref={institution_ref}
                        />
                    )
                }
                {
                    operation === "students_list" && (
                        <StudentList
                            institution_ref={institution_ref}
                            class_name={class_name}
                            classes={classes}
                        />
                    )
                }
            </div>
            {
                (
                    getClassListState.isLoading ||
                    registeredListState.isLoading ||
                    updateRegistrationState.isLoading ||
                    admitStudentState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
            {
                status.open && (
                    <ToastMessage
                        {...status}
                        onClose={() => {
                            setStatus({
                                open: false,
                                message: "",
                                type: ""
                            })
                        }}
                    />
                )
            }
        </Container>
    )
}

export default AdmissionForm