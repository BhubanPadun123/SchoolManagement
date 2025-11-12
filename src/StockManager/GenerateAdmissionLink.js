import React, {
    useState,
    useMemo,
    useEffect
} from "react"
import {
    Form,
    Container,
    Input,
    DatePicker,
    Text,
    Button,
    toaster,
    Message,
    Radio,
    RadioGroup,
    Table,
    Tooltip,
    IconButton,
    Modal,
    Divider
} from "rsuite"
import {
    useCreateAdmissionLinkMutation,
    useLazyGetAllAdmissionLinkQuery,
    useDeleteAdmissionLinkMutation
} from "../Redux/actions/admissionSetup.action"
import { GetCurrentUser } from "../utils/hooks"
import {
    useLazyGetUserPrivilegesQuery
} from "../Redux/actions/user.action"
import {
    useLazyGetInstitutionClassesQuery
} from "../Redux/actions/classSetup.action"
import { useNavigate } from "react-router-dom"
import {
    Loader,
    ConfirmationAlert,
    ToastMessage
} from "../components/index"
import {
    Edit,
    ShareOutline,
    Copy,
    Danger,
    AddOutline
} from "@rsuite/icons"
import {useParams} from "react-router-dom"


const { Cell, Column, HeaderCell } = Table


function CreateAdmissionLink() {
    const navigation = useNavigate()
    const {class_name} = useParams()
    const [form, setForm] = useState({
        title: "",
        expired: "",
        class_ref: ""
    })
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: "",
        title: ""
    })
    const [user, setUser] = useState({
        user: null,
        roles: [],
    })
    const [status, setStatus] = useState({
        show: false,
        type: "",
        message: ""
    })
    const [selecteItem, setSelectItem] = useState(null)
    const [openModal, setModal] = useState(false)

    const [createLinkAction, createLinkState] = useCreateAdmissionLinkMutation()
    const [getUserRolesAction, getUserRolesState] = useLazyGetUserPrivilegesQuery()
    const [getClassesListAction, getClassesState] = useLazyGetInstitutionClassesQuery()
    const [getAllAdmissionLinkAction, getAllAdmissionLinkState] = useLazyGetAllAdmissionLinkQuery()
    const [deleteLinkAction, deleteLinkState] = useDeleteAdmissionLinkMutation()


    function fetchPreData(){
        const user = GetCurrentUser()
        if (!user) {
            navigation("/auth")
        } else {
            setUser((prevState) => ({ ...prevState, user: user }))
            const { meta_data } = user
            if (meta_data && meta_data.hasOwnProperty("designation") && meta_data.hasOwnProperty("user_platform")) {
                const designation = meta_data.designation
                const user_platform = meta_data.user_platform
                getUserRolesAction({
                    designation: designation,
                    platform_id: user_platform
                })
                getClassesListAction({
                    institution_ref: user_platform
                })
                getAllAdmissionLinkAction({
                    institution_ref: user_platform
                })
            }
        }
    }
    useEffect(() => {
        fetchPreData()
    }, [])

    const rolesList = useMemo(() => {
        if (getUserRolesState.isSuccess) {
            return [
                ...getUserRolesState.currentData.roles.meta_data.privileges
            ]
        } else {
            return []
        }
    }, [getUserRolesState])


    useEffect(() => {
        if (rolesList) {
            setUser((prevState) => ({ ...prevState, roles: rolesList }))
        }
    }, [rolesList])

    const classList = useMemo(() => {
        if (getClassesState.isSuccess) {
            return [
                ...getClassesState.currentData.list
            ]
        } else {
            return []
        }
    }, [getClassesState])

    const createLinkStatus = useMemo(() => {
        const user = GetCurrentUser()
        if (createLinkState.isSuccess) {
            setModal(false)
            const { meta_data } = user
            if (meta_data && meta_data.hasOwnProperty("user_platform")) {
                const user_platform = meta_data.user_platform
                getAllAdmissionLinkAction({
                    institution_ref: user_platform
                })
            }
            return {
                show: true,
                message: createLinkState.data.link_data.message,
                type: "success"
            }
        }
        if (createLinkState.isError) {
            return {
                show: true,
                message: createLinkState.error.error || createLinkState.error.data.detail,
                type: "error"
            }
        }
    }, [createLinkState])

    useEffect(() => {
        if (createLinkStatus) {
            setStatus(createLinkStatus)
        }
    }, [createLinkStatus])

    const availableLinks = useMemo(() => {
        if (getAllAdmissionLinkState.isSuccess) {
            return [
                ...getAllAdmissionLinkState.currentData.list
            ]
        } else {
            return []
        }
    }, [getAllAdmissionLinkState])



    function createLink() {
        const user = GetCurrentUser()
        let classRef = Array.isArray(classList) && classList.length > 0 && classList.find((item)=> item.class_name === class_name)
        if (!form.title || !form.expired || !user || !classRef) {
            toaster.push(<Message type="warning" >All fields are mandatory!</Message>, { placement: "topCenter" })
            return
        }
        console.log("hellllo--->",classRef)
        const {
            meta_data
        } = user
        if (meta_data && meta_data.hasOwnProperty("user_platform")) {
            const date = new Date(form.expired)
            const isoDate = date.toISOString()

            const data = {
                title: form.title,
                expired: isoDate,
                institution_ref: meta_data.user_platform,
                class_ref: classRef.id
            }
            createLinkAction({
                ...data
            })
        }
    }

    const deleteLinkStatus = useMemo(() => {
        if (deleteLinkState.isSuccess) {
            fetchPreData()
            setAlert({
                open:false,
                title:"",
                message:"",
                type:""
            })
            return {
                show:true,
                message:deleteLinkState.data?.message,
                type:"success"
            }
        }
        if(deleteLinkState.isError){
            return {
                show:true,
                type:"error",
                message:"Error while delete the link"
            }
        }
    }, [deleteLinkState])

    useEffect(()=>{
        if(deleteLinkStatus){
            setStatus(deleteLinkStatus)
        }
    },[deleteLinkStatus])

    function handleOnConfirmPopover() {
        switch (alert.type) {
            case "delete": {
                if (!selecteItem) return
                deleteLinkAction({
                    link_id: selecteItem.id
                })
            }
            default:
                return
        }
    }

    return (
        <div style={{
            width: "100%",
            // height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: 'center',
            flexDirection: "column",
            gap: 8
        }}>
            <Container className="col-md-8" style={{
                backgroundColor: "white",
                width: "100%"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    padding: 8
                }}>
                    <Button
                        endIcon={<AddOutline color="red" />}
                        appearance="primary"
                        onClick={() => setModal(true)}
                    >
                        Create New Link
                    </Button>
                </div>
                {
                    Array.isArray(availableLinks) && availableLinks.length > 0 && (
                        <Table height={500}
                            data={availableLinks}
                            bordered
                            cellBordered
                            onSortColumn={(sortColumn, sortType) => {
                                console.log(sortColumn, sortType);
                            }}>
                            <Column width={50} align="center">
                                <HeaderCell>Id</HeaderCell>
                                <Cell dataKey="id" />
                            </Column>

                            <Column flexGrow={1}>
                                <HeaderCell>
                                    Title
                                </HeaderCell>
                                <Cell dataKey="title" />
                            </Column>

                            <Column flexGrow={1}>
                                <HeaderCell>
                                    Created At
                                </HeaderCell>
                                <Cell dataKey="created" />
                            </Column>

                            <Column flexGrow={1}>
                                <HeaderCell>Expire At</HeaderCell>
                                <Cell dataKey="expired" />
                            </Column>
                            <Column flexGrow={1}>
                                <HeaderCell>Actions</HeaderCell>
                                <Cell style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    gap: 4
                                }}>
                                    {(rowData, rowIndex) => (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "flex-start",
                                                alignItems: "center",
                                                gap: 4,
                                            }}
                                        >
                                            <IconButton
                                                icon={<Edit />}
                                                appearance="subtle"
                                                onClick={() => {
                                                    setSelectItem(rowData)
                                                    setModal(true)
                                                    setForm({
                                                        title: rowData.title,
                                                        expired: rowData.expired,
                                                        class_ref: rowData.class_ref
                                                    })
                                                    console.log(rowData)
                                                }}
                                            />
                                            <IconButton icon={<ShareOutline />} appearance="subtle" />
                                            <IconButton icon={<Copy />} appearance="subtle" />
                                            <IconButton
                                                icon={<Danger color="red" />}
                                                appearance="subtle"
                                                onClick={() => {
                                                    setAlert({
                                                        open: true,
                                                        message: "Are you sure, do you want to delete ?",
                                                        title: "Delete Admission Link",
                                                        type: "delete"
                                                    })
                                                    setSelectItem(rowData)
                                                }}
                                            />
                                        </div>
                                    )}
                                </Cell>
                            </Column>
                        </Table>
                    )
                }
            </Container>
            <Modal
                open={openModal}
                onClose={() => setModal(false)}
            >
                <Container style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    justifyContent: "center",
                    border: "1px solid white",
                    padding: 8,
                    borderRadius: 4
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4
                    }}>
                        <Text style={{
                            fontSize: 14,
                            color: "#5e5151ff",
                            fontFamily: "Lato",
                            fontWeight: 400
                        }}>Provides the form title.Students will able to see the form form title.</Text>
                        <Input
                            placeholder="Enter form title*"
                            value={form.title}
                            onChange={(e) => {
                                setForm((prevState) => ({ ...prevState, title: e }))
                            }}
                        />
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4
                    }}>
                        <Text style={{
                            fontSize: 14,
                            color: "#413333ff",
                            fontFamily: "Lato",
                            fontWeight: 400
                        }}>Pick the expiry date of form registration.Once date will past the link will be expire.</Text>
                        <DatePicker
                            value={form.expired}
                            onChange={(e) => {
                                setForm((prevState) => ({ ...prevState, expired: e }))
                            }}
                        />
                    </div>
                    <Divider />
                    <div style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: 8
                    }}>
                        <Button
                            appearance="primary"
                            onClick={createLink}
                            disabled={Array.isArray(rolesList) && rolesList.includes("Create Content") ? false : true}
                        >Create</Button>
                        <Button
                            appearance="subtle"
                            onClick={() => {
                                setModal(false)
                            }}
                        >Cancel</Button>
                    </div>
                </Container>
            </Modal>
            {
                (
                    getUserRolesState.isLoading ||
                    createLinkState.isLoading ||
                    getClassesState.isLoading ||
                    getAllAdmissionLinkState.isLoading ||
                    deleteLinkState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
            {
                status.show && (
                    <ToastMessage
                        {...status}
                        onClose={() => {
                            setStatus({
                                show: false,
                                message: "",
                                type: ""
                            })
                        }}
                    />
                )
            }
            {
                alert.open && (
                    <ConfirmationAlert
                        {...alert}
                        onConfirm={handleOnConfirmPopover}
                        onCancel={() => setAlert({
                            open: false,
                            title: "",
                            message: "",
                            type: ""
                        })}
                    />
                )
            }
        </div>
    )
}

export default CreateAdmissionLink