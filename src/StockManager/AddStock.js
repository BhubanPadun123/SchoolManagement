import React from "react"
import {
    Form,
    Button,
    Container,
    List,
    Text,
    IconButton,
    Tooltip,
    Message,
    toaster,
    Divider,
    Modal,
} from 'rsuite'
import {
    EditRound,
    Danger,
    AddOutline,
    Close
} from "@rsuite/icons"
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

function AddStock() {
    const [user, setUser] = React.useState(null)
    const [status, setStatus] = React.useState(null)
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
    const [openModal, setModal] = React.useState(false)

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
            }else{
                return []
            }
        }
        if (getClassState.isError) {
            return []
        }
    }, [getClassState])


    function handleCreateClass() {
        const user = GetCurrentUser()
        if (!classRomm.class_name) {
            toaster.push(<Message type="info" >Fill the class name field</Message>, { placement: "topCenter" })
            return
        }
        if (user) {
            const { meta_data } = user
            if (meta_data && meta_data.hasOwnProperty("user_platform")) {
                const institution_ref = meta_data.user_platform
                const class_name = classRomm.class_name
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
        if (!classRomm.class_id || !classRomm.class_name) {
            toaster.push(<Message type="warning" >Class name is required!</Message>, { placement: "topCenter" })
            return
        }
        const findClass = Array.isArray(institutionClassesStatus) && institutionClassesStatus.find((i) => i.id === classRomm.class_id)
        if (findClass) {
            updateClassAction({
                class_name: classRomm.class_name,
                institution_ref: findClass.institution_ref,
                meta_data: findClass.meta_data,
                class_id: findClass.id
            })
        }
    }
    function handleClickUpdate() {
        if (!classRomm.class_id || !classRomm.class_name) {
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
                borderRadius:8
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    padding:4
                }}>
                    <Button
                        appearance="primary"
                        endIcon={<AddOutline color="red" />}
                        onClick={() => {
                            setModal(true)
                        }}
                    >
                        Create New Class
                    </Button>
                </div>
                {
                    institutionClassesStatus && Array.isArray(institutionClassesStatus) && institutionClassesStatus.length > 0 && (
                        <React.Fragment>
                            <Divider />
                            <List size={"lg"}>
                                {institutionClassesStatus && Array.isArray(institutionClassesStatus) && institutionClassesStatus.map((item, index) => (
                                    <List.Item key={index} index={index} style={{
                                        paddingLeft: "8px",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}>
                                        <Text style={{
                                            fontFamily: "Lato",
                                            fontWeight: 500,
                                            fontStyle: "normal",
                                            lineHeight: "12px"
                                        }}>{item.class_name}</Text>
                                        <div style={{ flexGrow: 1 }} />
                                        <IconButton
                                            icon={<EditRound color="gray" />}
                                            onClick={() => {
                                                setClassRoom((prevState) => ({ ...prevState, edit: true, class_name: item.class_name, class_id: item.id }))
                                                setModal(true)
                                            }}
                                        />
                                        <IconButton
                                            icon={<Danger color="red" />}
                                            onClick={() => {
                                                setDeleteAlert({
                                                    open: true,
                                                    title: "Delete Class",
                                                    message: "Are you sure do you want to delete class?",
                                                    class_id: item.id
                                                })
                                            }}
                                        />
                                    </List.Item>
                                ))}
                            </List>
                        </React.Fragment>
                    )
                }
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
                        <IconButton onClick={() => setModal(false)} icon={<Close />} />
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
                                <Form.Control name="className" value={classRomm.class_name} onChange={(e) => {
                                    setClassRoom((prevState) => ({ ...prevState, class_name: e }))
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
                            gap: 8
                        }}>
                            <Button appearance="primary" onClick={classRomm.edit ? handleClickUpdate : handleCreateClass} >
                                {
                                    classRomm.edit ? "Update" : "Submit"
                                }
                            </Button>
                            <Button appearance="subtle" onClick={() => {
                                setModal(!openModal)
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
                            deleteAlert.class_id &&
                                deleteClassAction({
                                    class_id: deleteAlert.class_id
                                })
                        }}
                    />
                )
            }
        </Container>
    )
}

export default AddStock