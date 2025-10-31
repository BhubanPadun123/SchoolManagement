import React, {
    useState,
    useEffect,
    useMemo
} from "react"
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    ButtonToolbar,
    IconButton,
    Message,
    toaster,
    CheckboxGroup,
    Checkbox,
    Radio,
    RadioGroup
} from "rsuite"
import PlusIcon from "@rsuite/icons/Plus"
import EditIcon from "@rsuite/icons/Edit"
import TrashIcon from "@rsuite/icons/Trash"
import {
    Loader,
    ToastMessage
} from "../../components/index"
import {
    useCreatePlatformRolesMutation,
    useLazyGetPlatformRolesQuery,
    useCreatePlatformUserMutation,
    useLazyGetPlatformUserListQuery
} from "../../Redux/actions/setting.action"

const { Column, HeaderCell, Cell } = Table

function InstitutionMembers({ institutionBasicInfo, institutionMetadata, user }) {
    const [createRolesAction, createRoleState] = useCreatePlatformRolesMutation()
    const [getRolesAction, getRolesState] = useLazyGetPlatformRolesQuery()
    const [createUserAction, createUserState] = useCreatePlatformUserMutation()
    const [getUserListAction, getUserListState] = useLazyGetPlatformUserListQuery()

    const [status, setStatus] = useState(null)
    const [members, setMembers] = useState([])

    const [open, setOpen] = useState(false)
    const [openRoleModal, setOpenRoleModal] = useState(false)
    const [editingMember, setEditingMember] = useState(null)
    const [formValue, setFormValue] = useState({
        firstname: "",
        lastname: "",
        email: "",
        designation: [],
        password: ""
    })
    const [roleForm, setRoleForm] = useState({
        designation: "",
        privileges: []
    })

    useEffect(() => {
        if (institutionBasicInfo) {
            const platform_id = institutionBasicInfo.id
            platform_id && getRolesAction({ platform_id })
            platform_id && getUserListAction({ platform_id })
        }
    }, [institutionBasicInfo])
    const getRolesStatus = useMemo(() => {
        if (getRolesState.isSuccess) {
            return [
                ...getRolesState.currentData?.roles
            ]
        }
        if (getRolesState.isError) {
            return []
        }
    }, [getRolesState])
    const createRolesStatus = useMemo(() => {
        if (createRoleState.isSuccess) {
            if (institutionBasicInfo) {
                const platform_id = institutionBasicInfo.id
                platform_id && getRolesAction({ platform_id })
            }
            setOpenRoleModal(false)
            return {
                show: true,
                message: createRoleState.data?.message,
                type: "success"
            }
        }
        if (createRoleState.isError) {
            return {
                show: true,
                message: createRoleState.error.data?.detail,
                type: "error"
            }
        }
    }, [createRoleState])

    useEffect(() => {
        if (createRolesStatus) {
            setStatus(createRolesStatus)
        }
    }, [createRolesStatus])

    const platformUserListStatus = useMemo(() => {
        if (getUserListState.isSuccess) {
            return [
                ...getUserListState.currentData?.list
            ]
        }
        else if (getUserListState.isError) {
            return []
        } else {
            return []
        }
    }, [getUserListState])
    console.log(platformUserListStatus)

    const privilegesList = [
        "Add Member",
        "Edit Member",
        "Delete Member",
        "View Members",
        "Manage Roles",
        "Generate Reports",
        "Upload Content",
        "Delete Content",
        "Create Content"
    ]

    /*** Member Actions ***/
    const handleAdd = () => {
        setEditingMember(null);
        setFormValue({ name: "", role: "", email: "" });
        setOpen(true);
    };

    const handleEdit = (member) => {
        setEditingMember(member)
        setFormValue(member)
        setOpen(true)
    }

    const handleDelete = (id) => {
        setMembers(members.filter((m) => m.id !== id));
        toaster.push(<Message type="info">Member deleted</Message>, { placement: "topCenter" });
    };

    const handleSubmit = () => {
        if (!formValue.firstname || !formValue.email || !formValue.designation || !formValue.password) {
            toaster.push(<Message type="info">All fields are required</Message>, { placement: "topCenter" })
            return
        }
        if (!institutionBasicInfo) return

        createUserAction({
            firstname: formValue.firstname,
            lastname: formValue.lastname,
            email: formValue.email,
            password: formValue.password,
            meta_data: {
                "designation": formValue.designation,
                "user_platform": institutionBasicInfo?.id
            }
        })
    }

    /*** Role Actions ***/
    const handleCreateRole = () => {
        setRoleForm({ designation: "", privileges: [] })
        setOpenRoleModal(true)
    };

    const handleRoleSubmit = () => {
        if (!roleForm.designation) {
            toaster.push(<Message type="warning">Designation is required</Message>, { placement: "topCenter" });
            return
        }
        if (roleForm.privileges.length == 0) {
            toaster.push(<Message type="warning">Please select atlease one privilege</Message>, { placement: "topCenter" });
            return
        }
        if (!institutionBasicInfo) return
        createRolesAction({
            platform_id: institutionBasicInfo.id,
            designation: roleForm.designation,
            meta_data: {
                "privileges": roleForm.privileges
            }
        })
    }
    const userAddToPlatformStatus = useMemo(() => {
        if (createUserState.isSuccess) {
            setOpen(false)
            if (institutionBasicInfo) {
                const platform_id = institutionBasicInfo.id
                platform_id && getUserListAction({ platform_id })
            }
            return {
                show:true,
                message:createUserState.data?.message,
                type:"success"
            }
        }
        if(createUserState.isError){
            return {
                show:true,
                message:createUserState.error.data?.detail,
                type:"error"
            }
        }
    }, [createUserState])

    useEffect(()=> {
        if(userAddToPlatformStatus){
            setStatus(userAddToPlatformStatus)
        }
    },[userAddToPlatformStatus])

    return (
        <div
            style={{
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                background: "#f9fafb",
                minHeight: "100vh",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 10,
                }}
            >
                <h3 style={{ margin: 0 }}>Institution Members</h3>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <Button appearance="primary" startIcon={<PlusIcon />} onClick={handleAdd}>
                        Add Member
                    </Button>
                    <Button appearance="ghost" startIcon={<PlusIcon />} onClick={handleCreateRole}>
                        Create Role
                    </Button>
                </div>
            </div>

            {/* Members Table */}
            <div style={{ overflowX: "auto", background: "#fff", borderRadius: 8 }}>
                <Table data={platformUserListStatus} autoHeight bordered cellBordered wordWrap style={{ minWidth: 600 }}>
                    <Column flexGrow={1}>
                        <HeaderCell>First Name</HeaderCell>
                        <Cell dataKey="firstname" />
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell>Last Name</HeaderCell>
                        <Cell dataKey="lastname" />
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell>Designation</HeaderCell>
                        <Cell dataKey="meta_data.designation" />
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell>Email</HeaderCell>
                        <Cell dataKey="email" />
                    </Column>
                    <Column width={160} fixed="right">
                        <HeaderCell>Actions</HeaderCell>
                        <Cell>
                            {(rowData) => (
                                <ButtonToolbar>
                                    <IconButton
                                        icon={<EditIcon />}
                                        appearance="subtle"
                                        onClick={() => handleEdit(rowData)}
                                    />
                                    <IconButton
                                        icon={<TrashIcon />}
                                        appearance="subtle"
                                        color="red"
                                        onClick={() => handleDelete(rowData.id)}
                                    />
                                </ButtonToolbar>
                            )}
                        </Cell>
                    </Column>
                </Table>
            </div>

            {/* Add/Edit Member Modal */}
            <Modal open={open} onClose={() => setOpen(false)} size="xs">
                <Modal.Header>
                    <Modal.Title>{editingMember ? "Edit Member" : "Add New Member"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        fluid
                        formValue={formValue}
                        onChange={setFormValue}
                        style={{ display: "flex", flexDirection: "column", gap: 0 }}
                    >
                        <Form.Group controlId="firstname">
                            <Form.ControlLabel>First Name</Form.ControlLabel>
                            <Form.Control name="firstname" placeholder="Enter first name" />
                        </Form.Group>
                        <Form.Group controlId="lastname">
                            <Form.ControlLabel>Last Name</Form.ControlLabel>
                            <Form.Control name="lastname" placeholder="Enter last name" />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.ControlLabel>Email</Form.ControlLabel>
                            <Form.Control name="email" type="email" placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group controlId="role">
                            <Form.ControlLabel>Select Designation</Form.ControlLabel>
                            <RadioGroup
                                name="designation"
                                value={formValue.designation}
                                onChange={(val) =>
                                    setFormValue((prev) => ({
                                        ...prev,
                                        designation: val
                                    }))
                                }
                            >
                                {Array.isArray(getRolesStatus) &&
                                    getRolesStatus.map((p) => (
                                        <Radio key={p.id} value={p.designation}>
                                            {p.designation}
                                        </Radio>
                                    ))}
                            </RadioGroup>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.ControlLabel>Enter password</Form.ControlLabel>
                            <Form.Control name="password" placeholder="Enter Password" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleSubmit} appearance="primary">
                        {editingMember ? "Update" : "Add"}
                    </Button>
                    <Button onClick={() => setOpen(false)} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Create Role Modal */}
            <Modal open={openRoleModal} onClose={() => setOpenRoleModal(false)} size="sm">
                <Modal.Header>
                    <Modal.Title>Create Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        fluid
                        formValue={roleForm}
                        onChange={setRoleForm}
                        style={{ display: "flex", flexDirection: "column", gap: 10 }}
                    >
                        <Form.Group controlId="designation">
                            <Form.ControlLabel>Designation</Form.ControlLabel>
                            <Form.Control name="designation" placeholder="e.g., Admin, Teacher" />
                        </Form.Group>
                        <Form.Group controlId="privileges">
                            <Form.ControlLabel>Privileges</Form.ControlLabel>
                            <CheckboxGroup
                                name="privileges"
                                value={roleForm.privileges}
                                onChange={(val) => setRoleForm((prev) => ({ ...prev, privileges: val }))}
                            >
                                {privilegesList.map((p) => (
                                    <Checkbox key={p} value={p}>
                                        {p}
                                    </Checkbox>
                                ))}
                            </CheckboxGroup>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleRoleSubmit} appearance="primary">
                        Save Role
                    </Button>
                    <Button onClick={() => setOpenRoleModal(false)} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            {
                (
                    getRolesState.isLoading ||
                    createRoleState.isLoading ||
                    createUserState.isLoading ||
                    getUserListState.isLoading
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
        </div>
    );
}

export default InstitutionMembers;
