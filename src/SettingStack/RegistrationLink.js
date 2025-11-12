import React, {
    useState,
    useEffect,
    useMemo
} from "react"
import {
    useLazyGetInstitutionClassesQuery
} from "../Redux/actions/classSetup.action"
import {
    useLazyGetPlatformRolesQuery
} from "../Redux/actions/setting.action"
import {
    useCreateAdmissionLinkMutation,
    useDeleteAdmissionLinkMutation,
    useEditAdmissionLinkMutation,
    useLazyGetAllAdmissionLinkQuery
} from "../Redux/actions/admissionSetup.action"
import { GetCurrentUser } from "../utils/hooks"
import { useNavigate } from "react-router-dom"
import { toaster, Message } from "rsuite"
import {
    Loader,
    ConfirmationAlert,
    ToastMessage,
    CTable
} from "../components/index"
import _ from "lodash"
import {
    Edit,
    Share,
    Delete,
    CopyAll,
    Create,
    Close
} from "@mui/icons-material"
import {
    IconButton,
    Typography,
    Button,
    Modal,
    Box,
    Divider
} from "@mui/material"
import {
    CreateLink
} from "./index"

export default function CreateRegistrationLink() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [privilages, setPrivilages] = useState([])
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: "",
        operation_type: "",
        title: ""
    })
    const [selectedRow, setSelectedRow] = useState(null)
    const [notification, setNotification] = useState({
        show: false,
        message: "",
        type: ""
    })
    const [model, setModel] = useState({
        open: false,
        type: "",
        title: ""
    })
    const [classRef, setClassRef] = useState("")
    const [title, setTitle] = useState("")
    const [expiryDate, setExpiryDate] = useState("")

    const tableHeader = [
        "SL_No",
        "Class_Name",
        "Created_At",
        "Expired_At",
        "Title"
    ]


    const [getClassListAction, getClassListState] = useLazyGetInstitutionClassesQuery()
    const [getPlatformRolesActions, getPlatformRolesState] = useLazyGetPlatformRolesQuery()
    const [getAllRegistrationLinkAction, getAllRegistrationLinkStatus] = useLazyGetAllAdmissionLinkQuery()
    const [deleteLinkAction, deleteLinkState] = useDeleteAdmissionLinkMutation()
    const [createAdmissionLinkAction, createAdmissionLinkState] = useCreateAdmissionLinkMutation()
    const [editLinkAction, editLinkState] = useEditAdmissionLinkMutation()



    useEffect(() => {
        fetUser()
    }, [])

    console.log({
        createAdmissionLinkState
    })

    const classList = useMemo(() => {
        if (getClassListState.isSuccess) {
            const list = _.get(getClassListState, "currentData.list", [])
            return list
        } else {
            return []
        }
    }, [getClassListState])

    const roleList = useMemo(() => {
        if (getPlatformRolesState.isSuccess) {
            const list = _.get(getPlatformRolesState, 'currentData.roles', [])
            return list
        } else {
            return []
        }
    }, [getPlatformRolesState])

    useEffect(() => {
        if (roleList.length > 0 && user) {
            let designation = _.get(user, "meta_data.designation", null)
            const roles = roleList.find((item) => item.designation === designation)
            if (roles) {
                let privileges = _.get(roles, 'meta_data.privileges', [])
                setPrivilages(privileges)
            }
        }
    }, [roleList])
    const linkList = useMemo(() => {
        if (getAllRegistrationLinkStatus.isSuccess) {
            const list = _.get(getAllRegistrationLinkStatus, 'currentData.list', [])
            if (Array.isArray(list) && Array.isArray(classList) && classList.length > 0) {
                const finalLinkList = list.flatMap((link_item, index) => {
                    return classList
                        .filter(class_item => class_item.id === link_item.class_ref)
                        .map(class_item => ({
                            SL_No: index + 1,
                            "Class_Name": class_item.class_name,
                            "Created_At": link_item.created,
                            "Expired_At": link_item.expired,
                            "Title": link_item.title
                        }))
                })
                return finalLinkList
            }
        }
        return [];
    }, [getAllRegistrationLinkStatus, classList])


    function handleEditLink(e) {
        setModel({
            open: true,
            title: "Edit Link",
            type: "edit"
        })
    }
    function handleDeleteLink(e) {
        setAlert({
            open: true,
            message: "Are you sure ? do you want to delete link?",
            type: "info",
            operation_type: "delete",
            title: "Delete Link"
        })
    }
    function handleCopyLink(e, val) {
        setAlert({
            open: true,
            message: "Are you sure ? do you want to copy link?",
            type: "info",
            operation_type: "copy",
            title: "Copy Link"
        })
    }
    function handleShareLink(e, val) {
        setAlert({
            open: true,
            message: "Are you sure ? do you want to share link?",
            type: "info",
            operation_type: "share",
            title: "Share Title"
        })
    }
    function onConfirmDelete() {
        if (!selectedRow) return
        const findClass = Array.isArray(classList) && classList.find(i => i.class_name === selectedRow.Class_Name)
        const links = _.get(getAllRegistrationLinkStatus, 'currentData.list', [])
        if (!findClass || !alert.operation_type || !links || !Array.isArray(links)) {
            toaster.push(<Message type="info">Selected link data not found!</Message>, { placement: "topCenter" })
            return
        }
        const findLink = links.find(i => i.class_ref === findClass.id && i.institution_ref === findClass.institution_ref)
        if (!findLink) return
        switch (alert.operation_type) {
            case "delete": {
                deleteLinkAction({
                    link_id: findLink.id
                })
            }
            default:
                return
        }
    }

    const deleteLinkStatus = useMemo(() => {
        if (deleteLinkState.isSuccess) {
            const message = _.get(deleteLinkState, 'data.message', null)
            fetUser()
            setAlert({
                open: false,
                message: "",
                type: "",
                operation_type: ""
            })
            return {
                show: true,
                message,
                type: "success"
            }
        }
        if (deleteLinkState.isError) {
            setAlert({
                open: false,
                message: "",
                type: "",
                operation_type: ""
            })
            return {
                show: true,
                message: "Error while delete the link",
                type: "error"
            }
        }
    }, [deleteLinkState])

    useEffect(() => {
        if (deleteLinkStatus) {
            setNotification(deleteLinkStatus)
        }
    }, [deleteLinkStatus])
    const createLinkStatus = useMemo(() => {
        if (createAdmissionLinkState.isSuccess) {
            fetUser()
            setModel({
                open: false,
                title: "",
                type: "",
            })
            setClassRef("")
            setTitle("")
            setExpiryDate("")
            const message = _.get(createAdmissionLinkState, "data.message", "")
            return {
                show: true,
                message: message,
                type: "success"
            }
        }
        if (createAdmissionLinkState.isError) {
            return {
                show: true,
                message: "Error while create link!",
                type: "error"
            }
        }
    }, [createAdmissionLinkState])
    useEffect(() => {
        if (createLinkStatus) {
            setNotification(createLinkStatus)
        }
    }, [createLinkStatus])

    function fetUser() {
        const userInfo = GetCurrentUser()
        if (!userInfo) {
            navigate("/auth")
        } else {
            setUser(userInfo)
            let user_platform = _.get(userInfo, "meta_data.user_platform", null)
            if (!user_platform) {
                toaster.push(<Message type={"info"} >User not allow for this route</Message>, { placement: "topCenter" })
                navigate("/auth")
            } else {
                getClassListAction({
                    institution_ref: user_platform
                })
                getPlatformRolesActions({
                    platform_id: user_platform
                })
                getAllRegistrationLinkAction({
                    institution_ref: user_platform
                })
            }
        }
    }

    function onSubmitModel() {
        if (!model.type || !title || !classRef || !expiryDate || !Array.isArray(classList)) {
            toaster.push(<Message type="info" >Mandatory data not found!</Message>, { placement: "topCenter" })
            return
        }
        const findClass = classList.find(i => i.id === classRef)
        const list = _.get(getAllRegistrationLinkStatus, 'currentData.list', [])

        if (!findClass) return
        if (model.type === "create") {
            createAdmissionLinkAction({
                title: title,
                expired: expiryDate,
                institution_ref: findClass.institution_ref,
                class_ref: classRef
            })
        } else if (model.type === "edit" && Array.isArray(list)) {
            const findLink = list.find(i => i.class_ref === findClass.id)
            if(!findLink){
                toaster.push(<Message type="warning">Not Allow to update this link with current changes.</Message>,{placement:"topCenter"})
                return
            }
            editLinkAction({
                title: title,
                expired: expiryDate,
                institution_ref: findClass.institution_ref,
                class_ref: classRef,
                link_id:findLink.id
            })
        }
    }

    const editLinkStatus = useMemo(()=>{
        if(editLinkState.isSuccess){
            setModel({
                open:false,
                title:"",
                type:""
            })
            setTitle("")
            setClassRef("")
            setExpiryDate("")
            fetUser()

            const message = _.get(editLinkState,"data.message",null)

            return {
                show:true,
                message:message,
                type:"success"
            }
        }
        if(editLinkState.isError){
            return {
                show:true,
                message:"Error while update the link,try again",
                type:"error"
            }
        }
    },[editLinkState])

    useEffect(()=> {
        if(editLinkStatus){
            setNotification(editLinkStatus)
        }
    },[editLinkStatus])

    return (
        <div className="col-md-12">
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: "8px",
                gap: "10px"
            }}>
                <Typography variant="h6" sx={{
                    fontFamily: "Lato",
                    fontWeight: "400",
                    color: "#FFFF",
                    padding: "4px",
                    textAlign: "center"
                }}>
                    Create Sharable link for register the students details.
                </Typography>
                <Button
                    startIcon={<Create />}
                    variant="outlined"
                    onClick={() => {
                        setModel({
                            open: true,
                            title: "Create New Link",
                            type: "create"
                        })
                    }}
                >
                    Create New Link
                </Button>
            </div>
            <CTable
                header={tableHeader}
                rows={linkList}
                onRowClick={(e) => {
                    setSelectedRow(e)
                    const {
                        Class_Name,
                        Created_At,
                        Expired_At,
                        SL_No,
                        Title
                    } = e
                    setTitle(Title)
                    const findClass = Array.isArray(classList) && classList.length > 0 &&
                        classList.find(i => i.class_name === Class_Name)
                    if (findClass) {
                        setClassRef(findClass.id)
                    }
                    const formatted = Expired_At.split("T")[0]
                    setExpiryDate(formatted)
                }}
                renderActions={
                    <div>
                        <IconButton onClick={handleCopyLink}>
                            <CopyAll />
                        </IconButton>
                        <IconButton onClick={handleEditLink}>
                            <Edit />
                        </IconButton>
                        <IconButton onClick={handleShareLink}>
                            <Share />
                        </IconButton>
                        <IconButton onClick={handleDeleteLink}>
                            <Delete />
                        </IconButton>
                    </div>
                }
            />
            <Modal
                open={model.open}
                onClose={() => {
                    setModel({
                        open: false,
                        title: ""
                    })
                }}
            >
                <Box sx={style}>
                    <Box sx={{
                        background: "rgba(204, 204, 145, 1)",
                        width: "100%",
                        height: "40px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: "2px",
                        alignItems: "center"
                    }}>
                        <Typography variant="h6" component="h2" sx={{
                            fontFamily: "Lato",
                            fontWeight: 400,
                            letterSpacing: 1.2,
                            fontStyle: "normal",
                            paddingLeft: "8px"
                        }}>{model.title}</Typography>
                        <IconButton onClick={() => {
                            setModel({
                                open: false,
                                title: "",
                                type: ""
                            })
                        }}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Divider />
                    <Box sx={{
                        width: "100%",
                        maxHeight: "200px",
                        overflowY: "scroll",
                        minHeight: "150px"
                    }}>
                        <CreateLink
                            classList={classList}
                            title={title}
                            setTitle={setTitle}
                            classRef={classRef}
                            setClassRef={setClassRef}
                            expiryDate={expiryDate}
                            setExpiryDate={setExpiryDate}
                        />
                    </Box>
                    <Divider />
                    <Box sx={{
                        height: "40px",
                        background: "rgba(204, 204, 145, 1)",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "8px",
                        paddingTop: "4px",
                        paddingBottom: "4px"
                    }}>
                        <Button
                            variant="contained"
                            onClick={onSubmitModel}
                            size="small"
                        >
                            {
                                model.type === "edit" ? "Update" : "Submit"
                            }
                        </Button>
                        <Button
                            variant="text"
                            onClick={() => {
                                setModel({
                                    open: false,
                                    title: "",
                                    type: ""
                                })
                            }}
                            size="small"
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>

            </Modal>
            {
                (
                    getClassListState.isLoading ||
                    getPlatformRolesState.isLoading ||
                    getAllRegistrationLinkStatus.isLoading ||
                    deleteLinkState.isLoading ||
                    editLinkState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
            {
                alert.open && (
                    <ConfirmationAlert
                        {...alert}
                        onConfirm={onConfirmDelete}
                        onCancel={() => {
                            setAlert({
                                open: false,
                                message: "",
                                operation_type: "",
                                title: ""
                            })
                        }}
                    />
                )
            }
            {
                notification.show && (
                    <ToastMessage
                        {...notification}
                        onClose={() => {
                            setNotification({
                                show: false,
                                message: "",
                                type: ""
                            })
                        }}
                    />
                )
            }
        </div>
    )
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: "8px"
}