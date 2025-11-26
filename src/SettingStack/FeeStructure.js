import React from "react"
import {
    Typography,
    useMediaQuery,
    useTheme,
    Tooltip,
    IconButton,
    Modal,
    Divider,
    TextField,
    Button
} from "@mui/material"
import {
    CloseOutlined,
    DeleteOutline,
    EditOutlined
} from "@mui/icons-material"
import FeeStructureSidebar from "./components/FeeStructureSidebar"
import AddFeeForm from "./components/FeeForm"
import { GetCurrentUser } from "../utils/hooks"
import {
    useLazyGetInstitutionClassesQuery,
    useUpdateClassMetadataMutation
} from "../Redux/actions/classSetup.action"
import {
    useLazyGetPlatformRolesQuery
} from "../Redux/actions/setting.action"
import { Loader, ToastMessage, CTable } from "../components/index"
import {
    Message,
    toaster
} from "rsuite"
import _ from "lodash"

export default function PlatformFeeStructure() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const [user, setUser] = React.useState(null)
    const [currentClass, setCurrentClass] = React.useState(null)
    const [notification, setNotification] = React.useState({
        open: false,
        type: "",
        message: ""
    })
    const [editedFee, setEditedFee] = React.useState({
        feeName: "",
        feeAmount: ""
    })
    const [editRef, setEditRef] = React.useState("")
    const [isEdit, setEdit] = React.useState(false)
    const [isDelete, setDelete] = React.useState(false)

    const [getPlatformClassAction, getPlatformClassState] = useLazyGetInstitutionClassesQuery()
    const [getRolesAction, getRoleState] = useLazyGetPlatformRolesQuery()
    const [addFeeAction, addFeeState] = useUpdateClassMetadataMutation()

    React.useEffect(() => {
        fetchPreData()
    }, [])


    function fetchPreData() {
        const user = GetCurrentUser()
        if (user) {
            let platform_id = _.get(user, "meta_data.user_platform")
            platform_id && getPlatformClassAction({ institution_ref: platform_id })
            platform_id && getRolesAction({ platform_id: platform_id })
            setUser(user)
        }
    }

    const roles = React.useMemo(() => {
        if (getRoleState.isSuccess && user) {
            const designation = _.get(user, "meta_data.designation", null)
            const rolesList = _.get(getRoleState, "currentData.roles", null)
            if (designation && rolesList) {
                const findRole = rolesList.find(i => i.designation === designation)
                if (findRole) {
                    const privileges = _.get(findRole, "meta_data.privileges", null)
                    return privileges
                } else {
                    return null
                }
            } else {
                return null
            }
        } else {
            return null
        }
    }, [getRoleState])

    const classes = React.useMemo(() => {
        if (getPlatformClassState.isSuccess) {
            const classList = _.get(getPlatformClassState, "currentData.list", [])
            Array.isArray(classList) && classList.length > 0 && setCurrentClass(currentClass ? currentClass : classList[0].class_name)
            return classList
        } else {
            return []
        }
    }, [getPlatformClassState])

    function updateFee(feeName, feeAmount) {
        if (!feeAmount || !feeName || !currentClass || !Array.isArray(classes) || classes.length === 0) {
            toaster.push(<Message type="info" >Data missing for add fee</Message>, { placement: "topCenter" })
            return
        }
        const findClass = classes.find(i => i.class_name === currentClass)

        if (findClass) {
            let meta_data = _.get(findClass, "meta_data")

            if (meta_data && meta_data.hasOwnProperty('feeStructure') && Array.isArray(meta_data.feeStructure)) {
                let { feeStructure } = meta_data
                let isFeeExist = feeStructure.find(i => i.feeName === feeName)
                if (isFeeExist) {
                    toaster.push(<Message type="info" >Fee already exist with name {feeName}</Message>, { placement: "topCenter" })
                    return
                }
                meta_data = {
                    ...meta_data,
                    feeStructure: [
                        ...feeStructure,
                        {

                            feeName: feeName,
                            feeAmount: feeAmount
                        }
                    ]
                }
            } else {
                meta_data = {
                    ...meta_data,
                    feeStructure: [
                        {
                            feeName: feeName,
                            feeAmount: feeAmount
                        }
                    ]
                }
            }

            addFeeAction({
                class_id: findClass.id,
                meta_data: meta_data
            })
        }
    }

    const addFeeStatus = React.useMemo(() => {
        if (addFeeState.isSuccess) {
            fetchPreData()
            setDelete(false)
            setEdit(false)
            return {
                open: true,
                type: "success",
                message: "Operation completed successfully!"
            }
        }
    }, [addFeeState])

    React.useEffect(() => {
        if (addFeeStatus) {
            setNotification(addFeeStatus)
        }
    }, [addFeeStatus])

    const feeData = React.useMemo(() => {
        if (Array.isArray(classes) && classes.length > 0 && currentClass) {
            const findClass = classes.find(i => i.class_name === currentClass)
            if (findClass) {
                const feeStructure = _.get(findClass, "meta_data.feeStructure", [])
                if (feeStructure && Array.isArray(feeStructure) && feeStructure.length > 0) {
                    const list = feeStructure.map((item, index) => {
                        return {
                            "Sl_No": index + 1,
                            "Fee_Name": item.feeName,
                            "Fee_Amount": item.feeAmount
                        }
                    })
                    return list
                } else {
                    return []
                }
            } else {
                return []
            }
        } else {
            return []
        }
    }, [currentClass, getPlatformClassState])



    return (
        <div className="col-md-12" style={{
            display: "flex",
            flexDirection: "row"
        }}>
            <div style={{
                width: isMobile ? "40%" : "20%"
            }}>
                <FeeStructureSidebar
                    classes={classes}
                    currentTabVal={currentClass}
                    onChangeTab={(e, val) => {
                        setCurrentClass(val)
                    }}
                />
            </div>
            <div style={{
                flex: 1,
                flexGrow: 1,
                rowGap: "8px"
            }}>
                <Typography variant={isMobile ? "body1" : "h4"} sx={{
                    color: "#FFFF",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontFamily: "Lato",
                    textTransform: "capitalize"
                }} >
                    Fee Structure configuration for {currentClass}
                </Typography>
                <AddFeeForm
                    isMobile={isMobile}
                    roles={roles}
                    onAdd={(feeName, feeAmount) => {
                        updateFee(feeName, feeAmount)
                    }}
                />
                <div style={{
                    height: "8px"
                }} />
                <CTable
                    header={["SL_No", "Fee_Name", "Fee_Amount"]}
                    rows={feeData ? feeData : []}
                    onRowClick={(e) => {
                        setEditedFee({
                            feeAmount: e.Fee_Amount,
                            feeName: e.Fee_Name
                        })
                        setEditRef(e.Fee_Name)
                    }}
                    renderActions={
                        <div className="col-md-12">
                            <Tooltip title={"Edit"} arrow placement="bottom" >
                                <IconButton
                                    onClick={() => {
                                        setEdit(true)
                                    }}
                                    disabled={Array.isArray(roles) ?  !roles.includes("Upload Content") : true}
                                >
                                    <EditOutlined />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={"Delete"} arrow placement="bottom" >
                                <IconButton
                                    onClick={() => {
                                        setDelete(true)
                                    }}
                                    disabled={Array.isArray(roles) ? !roles.includes("Delete Content") : true}
                                >
                                    <DeleteOutline />
                                </IconButton>
                            </Tooltip>
                        </div>
                    }
                />
            </div>
            <Modal
                open={isEdit}
                onClose={() => {
                    setEdit(false)
                    setEditedFee({
                        feeAmount: "",
                        feeName: ""
                    })
                }}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%"
                }}
            >
                <div style={{
                    width: isMobile ? "90%" : "400px",
                    background: "#180f0fff",
                    border: "2px solid #FFFF",
                    borderRadius: "8px"
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                    }}>
                        <Typography variant={isMobile ? "body1" : "h5"} sx={{
                            fontStyle: "normal",
                            fontFamily: "Lato",
                            fontWeight: "bold",
                            flex: 1,
                            textAlign: "center",
                            color: "#FFFF"
                        }} >
                            Edit Fee ?
                        </Typography>
                        <Tooltip title={"Close"} arrow placement="bottom" >
                            <IconButton onClick={() => {
                                setEdit(false)
                                setEditedFee({
                                    feeAmount: "",
                                    feeName: ""
                                })
                            }}>
                                <CloseOutlined sx={{
                                    color: "#FFFF"
                                }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <Divider sx={{
                        background: "#FFFF"
                    }} />
                    <div style={{
                        height: "8px"
                    }} />
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                        padding: "10px"
                    }}>
                        <TextField
                            placeholder="Fee Name"
                            label={"Fee Name"}
                            focused
                            value={editedFee.feeName}
                            onChange={(e) => {
                                setEditedFee((prevState) => ({ ...prevState, feeName: e.target.value }))
                            }}
                            sx={{
                                width: "100%",
                                backgroundColor: "#FFFF",
                                borderRadius: "4px"
                            }}
                        />
                        <TextField
                            placeholder="Fee Amount"
                            label={"Fee Amount"}
                            focused
                            value={editedFee.feeAmount}
                            onChange={(e) => {
                                setEditedFee((prevState) => ({
                                    ...prevState,
                                    feeAmount: e.target.value
                                }))
                            }}
                            sx={{
                                width: "100%",
                                backgroundColor: "#FFFF",
                                borderRadius: "4px"
                            }}
                        />
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        padding: "8px",
                        gap: "8px"
                    }}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                if (Array.isArray(classes) && classes.length > 0 && currentClass) {
                                    const findClass = classes.find(i => i.class_name === currentClass)
                                    if (!findClass) return
                                    let meta_data = findClass.meta_data
                                    let feeStructure = _.get(findClass, "meta_data.feeStructure", [])
                                    if (feeStructure && Array.isArray(feeStructure) && feeStructure.length > 0) {
                                        let updatedFeeStructure = feeStructure.map((item) => {
                                            if (item.feeName === editRef) {
                                                return {
                                                    "feeAmount": editedFee.feeAmount,
                                                    "feeName": editedFee.feeName
                                                }
                                            } else {
                                                return {
                                                    ...item
                                                }
                                            }
                                        })
                                        meta_data = {
                                            ...meta_data,
                                            "feeStructure": updatedFeeStructure
                                        }
                                        addFeeAction({
                                            class_id: findClass.id,
                                            meta_data: meta_data
                                        })
                                    }
                                }
                            }}
                        >
                            Update
                        </Button>
                        <Button
                            variant="text"
                            onClick={() => {
                                setEdit(false)
                                setEditedFee({
                                    feeAmount: "",
                                    feeName: ""
                                })
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal
                open={isDelete}
                onClose={() => {
                    setDelete(false)
                }}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%"
                }}
            >
                <div style={{
                    width: isMobile ? "90%" : "400px",
                    background: "#180f0fff",
                    border: "2px solid #FFFF",
                    borderRadius: "8px"
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                    }}>
                        <Typography variant={isMobile ? "body1" : "h5"} sx={{
                            fontStyle: "normal",
                            fontFamily: "Lato",
                            fontWeight: "bold",
                            flex: 1,
                            textAlign: "center",
                            color: "#FFFF"
                        }} >
                            Delete Fee
                        </Typography>
                        <Tooltip title={"Close"} arrow placement="bottom" >
                            <IconButton onClick={() => {
                                setDelete(false)
                                setEditedFee({
                                    feeAmount: "",
                                    feeName: ""
                                })
                            }}>
                                <CloseOutlined sx={{
                                    color: "#FFFF"
                                }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <Divider sx={{
                        background: "#FFFF"
                    }} />
                    <div style={{
                        height: "8px"
                    }} />
                    <div style={{
                        height: "80px"
                    }}>
                        <Typography style={{
                            fontFamily: "Lato",
                            fontWeight: "bold",
                            fontStyle: "normal",
                            color: "#FFFF",
                            textAlign: "center"
                        }}>
                            Are you sure ? do you want to delete fee ?
                        </Typography>
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "8px",
                        padding: "4px"
                    }}>
                        <Button
                            variant="contained"
                            onClick={()=> {
                                if (Array.isArray(classes) && classes.length > 0 && currentClass) {
                                    const findClass = classes.find(i => i.class_name === currentClass)
                                    if (!findClass) return
                                    let meta_data = findClass.meta_data
                                    let feeStructure = _.get(findClass, "meta_data.feeStructure", [])
                                    if (feeStructure && Array.isArray(feeStructure) && feeStructure.length > 0) {
                                        let updatedFeeStructure = feeStructure.map((item) => {
                                            if (item.feeName === editRef) {
                                                return null
                                            } else {
                                                return {
                                                    ...item
                                                }
                                            }
                                        }).filter(i => i)
                                        meta_data = {
                                            ...meta_data,
                                            "feeStructure": updatedFeeStructure
                                        }
                                        addFeeAction({
                                            class_id: findClass.id,
                                            meta_data: meta_data
                                        })
                                    }
                                }
                            }}
                        >
                            Delete
                        </Button>
                        <Button
                            variant="text"
                            onClick={() => {
                                setDelete(false)
                                setEditedFee({
                                    feeAmount: "",
                                    feeName: ""
                                })
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
            {
                (
                    getPlatformClassState.isLoading ||
                    getRoleState.isLoading ||
                    addFeeState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
            {
                notification.open && (
                    <ToastMessage
                        {...notification}
                        onClose={() => {
                            setNotification({
                                open: false,
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