import React from "react"
import {
    Form,
    Button,
    Container,
    toaster,
    Modal,
    Message
} from 'rsuite'
import {
    Tooltip,
    IconButton,
    Divider,
    Typography
} from "@mui/material"
import {
    EditRound,
    Danger,
    AddOutline,
    Close
} from "@rsuite/icons"
import {
    Edit,
    DeleteForeverOutlined
} from "@mui/icons-material"
import {
    useCreateClassMutation,
    useLazyGetInstitutionClassesQuery,
    useDeleteInstitutionClassMutation,
    useEditInstitutionClassMutation
} from "../Redux/actions/classSetup.action"
import { Loader, ToastMessage, ConfirmationAlert } from "../components/index"
import {
    GetCurrentUser
} from "../utils/hooks"
import {
    CTable
} from "../components/index"
import _ from "lodash"
import { useMediaQuery, useTheme } from "@mui/material"

function AddStock() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const [user, setUser] = React.useState(null)
    const [status, setStatus] = React.useState(null)
    const [selectedClass, setSelectedClass] = React.useState({
        class_id: "",
        class_name: ""
    })
    const [classRomm, setClassRoom] = React.useState({
        class_name: "",
        edit: false,
        class_id: null
    })
    const [alert, setAlert] = React.useState({
        open: false,
        title: "",
        message: ""
    })
    const [deleteAlert, setDeleteAlert] = React.useState({
        open: false,
        title: "",
        message: "",
        class_id: ""
    })
    const [classList, setClassList] = React.useState([])
    const [openModal, setModal] = React.useState(false)
    const [isEdit,setIsEdit] = React.useState(false)

    const [getClassesAction, getClassState] = useLazyGetInstitutionClassesQuery()
    const [createClassAction, createClassState] = useCreateClassMutation()
    const [updateClassAction, updateClassState] = useEditInstitutionClassMutation()
    const [deleteClassAction, deleteClassState] = useDeleteInstitutionClassMutation()

    React.useEffect(() => {
        const fetchData = async () => {
            const user = await localStorage.getItem("current_user")
            if (user) {
                const userInfo = JSON.parse(user)
                const { user_data } = userInfo
                const { meta_data } = user_data
                if (meta_data && meta_data.hasOwnProperty('user_platform')) {
                    const institution_ref = meta_data.user_platform
                    getClassesAction({ institution_ref })
                    setUser(user_data)
                }
            }
        }
        fetchData()
    }, [])

    const institutionClassesStatus = React.useMemo(() => {
        if (getClassState.isSuccess) {
            if (getClassState.currentData.hasOwnProperty("list")) {
                return [
                    ...getClassState.currentData?.list
                ]
            } else {
                return []
            }
        }
        if (getClassState.isError) {
            return []
        }
    }, [getClassState])

    React.useEffect(() => {
        if (Array.isArray(institutionClassesStatus) && institutionClassesStatus.length > 0) {
            const list = institutionClassesStatus.map((item, index) => {
                let admitted = _.get(item, 'meta_data.admitted', "0")
                let registered = _.get(item, "meta_data.registered", "0")
                let waiting = Number(admitted) > 0 && Number(registered) > 0 ? `${Number(registered) - Number(admitted)}` : "0"

                return {
                    "SL_No": index + 1,
                    "Class Name": item.class_name,
                    "Registered": registered,
                    "Admitted": admitted,
                    "Waiting" : waiting
                }
            })
            setClassList(list)
        } else {
            setClassList([])
        }
    }, [institutionClassesStatus])


    function handleCreateClass() {
        const user = GetCurrentUser()
        if (!selectedClass.class_name) {
            toaster.push(<Message type="info" >Fill the class name field</Message>, { placement: "topCenter" })
            return
        }
        if (user) {
            const { meta_data } = user
            if (meta_data && meta_data.hasOwnProperty("user_platform")) {
                const institution_ref = meta_data.user_platform
                const class_name = selectedClass.class_name
                createClassAction({
                    class_name,
                    institution_ref,
                    meta_data: {}
                })
            }
        }
    }

    const createClassStatus = React.useMemo(() => {
        const user = GetCurrentUser()
        if (createClassState.isSuccess) {
            setModal(false)
            if (user) {
                const { meta_data } = user
                if (meta_data && meta_data.hasOwnProperty("user_platform")) {
                    const institution_ref = meta_data.user_platform
                    getClassesAction({ institution_ref })
                }
            }
            return {
                show: true,
                message: createClassState.data?.message,
                type: "success"
            }
        }
        if (createClassState.isError) {
            return {
                show: true,
                message: createClassState.error.data?.detail,
                type: "error"
            }
        }
    }, [createClassState])

    function handleUpdate() {
        if (!selectedClass.class_id || !selectedClass.class_name) {
            toaster.push(<Message type="warning" >Class name is required!</Message>, { placement: "topCenter" })
            return
        }
        const findClass = Array.isArray(institutionClassesStatus) && institutionClassesStatus.find((i) => i.id === selectedClass.class_id)
        if (findClass) {
            updateClassAction({
                class_name: selectedClass.class_name,
                institution_ref: findClass.institution_ref,
                meta_data: findClass.meta_data,
                class_id: findClass.id
            })
        }
    }
    function handleClickUpdate() {
        if (!selectedClass.class_id || !selectedClass.class_name) {
            toaster.push(<Message type="warning" >Class name is required!</Message>, { placement: "topCenter" })
            return
        }
        setAlert({
            open: true,
            title: "Update Class",
            message: "Are you sure do you want to delete class?"
        })
    }

    React.useEffect(() => {
        if (createClassStatus) {
            setStatus(createClassStatus)
        }
    }, [createClassStatus])

    const updateClassStatus = React.useMemo(() => {
        if (updateClassState.isSuccess) {
            const user = GetCurrentUser()
            if (user) {
                const { meta_data } = user
                if (meta_data && meta_data.hasOwnProperty("user_platform")) {
                    const institution_ref = meta_data.user_platform
                    getClassesAction({ institution_ref })
                }
            }
            setAlert({
                open: false,
                title: "",
                message: ""
            })
            setModal(false)
            return {
                show: true,
                message: updateClassState.data?.message,
                type: "success"
            }
        }
        if (updateClassState.isError) {
            setAlert({
                open: false,
                title: "",
                message: ""
            })
            return {
                show: true,
                message: updateClassState.error.data?.detail,
                type: "error"
            }
        }
    }, [updateClassState])

    React.useEffect(() => {
        if (updateClassStatus) {
            setStatus(updateClassStatus)
        }
    }, [updateClassStatus])

    const deleteClassStatus = React.useMemo(() => {
        if (deleteClassState.isSuccess) {
            const user = GetCurrentUser()
            if (user) {
                const { meta_data } = user
                if (meta_data && meta_data.hasOwnProperty("user_platform")) {
                    const institution_ref = meta_data.user_platform
                    getClassesAction({ institution_ref })
                }
            }
            setDeleteAlert({
                open: false,
                title: "",
                message: "",
                class_id: ""
            })
            setModal(false)
            return {
                show: true,
                message: deleteClassState.data?.message,
                type: "success"
            }
        }
        if (deleteClassState.isError) {
            setDeleteAlert({
                open: false,
                title: "",
                message: "",
                class_id: ""
            })
            return {
                show: true,
                message: deleteClassState.error.data?.detail,
                type: "error"
            }
        }
    }, [deleteClassState])

    React.useEffect(() => {
        if (deleteClassStatus) {
            setStatus(deleteClassStatus)
        }
    }, [deleteClassStatus])


    return (
        <Container style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "8px",
            padding: 4
        }}>
            <Container style={{
                width: "100%",
                maxHeight: 990,
                backgroundColor: "white",
                borderRadius: 8
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    padding: 4
                }}>
                    <Button
                        appearance="primary"
                        endIcon={<AddOutline color="red" />}
                        onClick={() => {
                            setModal(true)
                            setClassRoom({
                                edit: false,
                                class_id: "",
                                class_name: ""
                            })
                        }}
                    >
                        Create New Class
                    </Button>
                </div>
                <CTable
                    header={["SL_No", "Class Name", "Registered", "Admitted","Waiting"]}
                    rows={classList}
                    onRowClick={(e) => {
                        if (Array.isArray(institutionClassesStatus) && institutionClassesStatus.length > 0) {
                            let findClickClass = institutionClassesStatus.find(i => i.class_name === e["Class Name"])
                            if (findClickClass) {
                                setSelectedClass({
                                    class_id: findClickClass.id,
                                    class_name: findClickClass.class_name
                                })
                            }
                        }
                    }}
                    renderActions={
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "4px"
                        }}>
                            <Tooltip title={"Edit Class"} placement="bottom" arrow >
                                <IconButton onClick={() => {
                                    setModal(true)
                                    setIsEdit(true)
                                }} >
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={"Delete Class"} placement="bottom" arrow >
                                <IconButton onClick={()=> {
                                    setDeleteAlert({
                                        open:true,
                                        title:"Delete Class",
                                        message:"Are you sure? do you want to delete class?",
                                        class_id:selectedClass.class_id
                                    })
                                }}>
                                    <DeleteForeverOutlined color="red" />
                                </IconButton>
                            </Tooltip>
                        </div>
                    }
                />
            </Container>
            <Modal open={openModal}>
                <div>
                    <div style={{
                        padding: 0,
                        margin: 0,
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center"
                    }}>
                        <div style={{
                            flexGrow: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <Typography sx={{
                                fontSize: "14px",
                                fontStyle: "normal",
                                fontWeight: "bold",
                            }}>
                                {
                                    isEdit ? "Edit Class" : "Create New Class"
                                }
                            </Typography>
                        </div>
                        <Tooltip title={"Close"} placement="bottom" arrow >
                            <IconButton onClick={() => {
                                setModal(false)
                                setIsEdit(false)
                                setSelectedClass({
                                    class_id:"",
                                    class_name:""
                                })
                            }} >
                                <Close fontSize={"12px"} />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <Divider />
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Form style={{
                            backgroundColor: "#FFFF",
                            padding: "8px",
                            borderRadius: "4px",
                            width: "auto"
                        }}  >
                            <Form.Group controlId="className">
                                <Form.ControlLabel>Class Name</Form.ControlLabel>
                                <Form.Control name="className" value={selectedClass.class_name} onChange={(e) => {
                                    setSelectedClass((prevState) => ({ ...prevState, class_name: e }))
                                }} />
                                <Form.HelpText>Class Name is Required.</Form.HelpText>
                            </Form.Group>
                        </Form>
                    </div>
                    <Divider />
                    <div>
                        <Form.Group style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: 8,
                            paddingTop: 2
                        }}>
                            <Button appearance="primary" onClick={isEdit ? handleClickUpdate : handleCreateClass} >
                                {
                                    isEdit ? "Update" : "Submit"
                                }
                            </Button>
                            <Button appearance="subtle" onClick={() => {
                                setModal(!openModal)
                                setSelectedClass({
                                    class_id:"",
                                    class_name:""
                                })
                                setIsEdit(false)
                            }} >
                                Cancel
                            </Button>
                        </Form.Group>
                    </div>
                </div>
            </Modal>
            {
                (
                    getClassState.isLoading ||
                    createClassState.isLoading ||
                    updateClassState.isLoading ||
                    deleteClassState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
            {
                status && status.show && (
                    <ToastMessage
                        {...status}
                        onClose={() => {
                            setStatus(null)
                        }}
                    />
                )
            }
            {
                alert.open && (
                    <ConfirmationAlert
                        {...alert}
                        onConfirm={handleUpdate}
                        onCancel={() => {
                            setAlert({
                                open: false,
                                title: "",
                                message: ""
                            })
                        }}
                    />
                )
            }
            {
                deleteAlert.open && (
                    <ConfirmationAlert
                        {...deleteAlert}
                        onCancel={() => {
                            setDeleteAlert({
                                open: false,
                                title: "",
                                message: "",
                                class_id: ""
                            })
                        }}
                        onConfirm={() => {
                            selectedClass.class_id &&
                                deleteClassAction({
                                    class_id: selectedClass.class_id
                                })
                        }}
                    />
                )
            }
        </Container>
    )
}

export default AddStock