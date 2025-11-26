import React from "react"
import {
    Loader,
    CTable,
    ConfirmationAlert
} from "../components/index"
import { useParams } from "react-router-dom"
import { GetCurrentUser } from "../utils/hooks"
import { toaster, Message } from "rsuite"
import _ from "lodash"
import {
    useLazyGetInstitutionClassesQuery,
    useUpdateClassMetadataMutation
} from "../Redux/actions/classSetup.action"
import {
    useLazyGetPlatformRolesQuery,
    useGetPlatformUserListQuery,
    useLazyGetPlatformUserListQuery
} from "../Redux/actions/setting.action"
import {
    Typography,
    Modal,
    useTheme,
    useMediaQuery,
    IconButton,
    Button,
    Tooltip,
    ButtonGroup,
    Box,
    Divider,
    TextField,
    Select,
    MenuItem,
    Checkbox,
    FormControl,
    InputLabel
} from "@mui/material"
import {
    Add,
    Close,
    BookOnlineOutlined,
    Edit,
    DeleteOutline
} from "@mui/icons-material"

export default function ManageSubjects() {
    const { class_name } = useParams()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    const [openAddSubject, setOpenAddSubject] = React.useState(false)
    const [subjectName, setSubjectName] = React.useState("")
    const [currentClass, setCurrentClass] = React.useState(null)
    const [selectedSubject, setSelectedSubject] = React.useState(null)
    const [isEditSubject, setIsEditSubject] = React.useState(false)
    const [isDelete, setIsDelete] = React.useState(false)
    const [selectedTeacher, setSelectedTeacher] = React.useState([])


    const [getPlatformClassesAction, getPlatformClassesState] = useLazyGetInstitutionClassesQuery()
    const [getPlatformRolesAction, getPlatformRolesState] = useLazyGetPlatformRolesQuery()
    const [updateClassMetadataAction, updateClassMetadataState] = useUpdateClassMetadataMutation()
    const [getUserListAction, getUserListState] = useLazyGetPlatformUserListQuery()



    React.useEffect(() => {
        getPreData()
    }, [class_name])

    function getPreData() {
        const user = GetCurrentUser()
        if (user) {
            let user_platform = _.get(user, "meta_data.user_platform", null)
            if (user_platform) {
                getPlatformClassesAction({
                    institution_ref: user_platform
                })
                getPlatformRolesAction({
                    platform_id: user_platform
                })
                getUserListAction({
                    platform_id: user_platform
                })
            }
        }
    }


    const classes = React.useMemo(() => {
        if (getPlatformClassesState.isSuccess) {
            let list = _.get(getPlatformClassesState, "currentData.list", [])
            let findClass = Array.isArray(list) && list.length > 0 && list.find(i => i.class_name.toLowerCase() === class_name.toLowerCase())
            setCurrentClass(findClass)
            return list
        } else {
            return []
        }
    }, [getPlatformClassesState])

    const roles = React.useMemo(() => {
        if (getPlatformRolesState.isSuccess) {
            let list = _.get(getPlatformRolesState, "currentData.roles", [])
            return list
        } else {
            return []
        }
    }, [getPlatformRolesState])
    const teachersList = React.useMemo(() => {
        if (getUserListState.isSuccess) {
            const list = _.get(getUserListState, "currentData.list", [])
            const tList = list && Array.isArray(list) && list.length > 0 && list.map((user) => {
                let designation = _.get(user, "meta_data.designation", null)
                if (designation && designation === "Teacher") {
                    return user
                } else {
                    return null
                }
            }).filter(i => i)
            return tList
        } else {
            return []
        }
    }, [getUserListState])
    const metadataUpdateStatus = React.useMemo(() => {
        if (updateClassMetadataState.isSuccess) {
            let message = _.get(updateClassMetadataState, "data.message", "")
            getPreData()
            setIsEditSubject(false)
            setIsDelete(false)
            setSelectedSubject(false)
            setOpenAddSubject(false)
            setSubjectName("")
            setSelectedTeacher([])
            toaster.push(<Message type="success" >{message}</Message>, { placement: "topCenter" })
            updateClassMetadataState.reset()
        }
        if (updateClassMetadataState.isError) {
            toaster.push(<Message type="error" >Error while update the subject</Message>, { placement: "topCenter" })
            updateClassMetadataState.reset()
        }
    }, [updateClassMetadataState])

    function handleCreateSubject() {
        if (!subjectName) {
            toaster.push(<Message type="info" >Please fill the subject name</Message>, { placement: "topCenter" })
            return
        }
        const findClass = Array.isArray(classes) && classes.length > 0 && classes.find(i => i.class_name === class_name)

        if (findClass) {
            let subjects = _.get(findClass, "meta_data.subjects", null)
            let meta_data = {
                ...findClass.meta_data
            }
            if (subjects) {
                let isExistSubject = Array.isArray(subjects) && subjects.length > 0 && subjects.find(i => i.subject_name.toLowerCase() === subjectName.toLowerCase())
                if (isExistSubject) {
                    toaster.push(<Message type="info" >Subject Already exist with name {subjectName}</Message>, { placement: "topCenter" })
                    return
                } else {
                    meta_data = {
                        ...meta_data,
                        "subjects": [...subjects, { subject_name: subjectName, teachers: [...selectedTeacher] }]
                    }
                }
            } else {
                meta_data = {
                    ...meta_data,
                    "subjects": [{ subject_name: subjectName, teachers: [...selectedTeacher] }]
                }
            }
            updateClassMetadataAction({
                class_id: findClass.id,
                meta_data: meta_data
            })
        }
    }

    function handleEditSubjectName() {
        if (!selectedSubject || !subjectName) return
        const findClass = Array.isArray(classes) && classes.length > 0 && classes.find(i => i.class_name === class_name)

        if (findClass) {
            let subjects = _.get(findClass, "meta_data.subjects", null)
            let meta_data = {
                ...findClass.meta_data
            }
            if (subjects) {
                let updatedSubects = Array.isArray(subjects) && subjects.length > 0 &&
                    subjects.map(i => {
                        if (i.subject_name.toLowerCase() === selectedSubject.Subject.toLowerCase()) {
                            return {
                                subject_name: subjectName,
                                teachers:[...selectedTeacher]
                            }
                        } else {
                            return {
                                ...i
                            }
                        }
                    })
                meta_data = {
                    ...meta_data,
                    subjects: [...updatedSubects]
                }
            }

            updateClassMetadataAction({
                class_id: findClass.id,
                meta_data: meta_data
            })
        }
    }

    function deleteSubject() {
        if (!selectedSubject) return
        const findClass = Array.isArray(classes) && classes.length > 0 && classes.find(i => i.class_name === class_name)

        if (findClass) {
            let subjects = _.get(findClass, "meta_data.subjects", null)
            let meta_data = {
                ...findClass.meta_data
            }
            if (subjects) {
                let updatedSubects = Array.isArray(subjects) && subjects.length > 0 &&
                    subjects.map(i => {
                        if (i.subject_name.toLowerCase() !== selectedSubject.Subject.toLowerCase()) {
                            return {
                                ...i
                            }
                        } else {
                            return null
                        }
                    }).filter(i => i)
                meta_data = {
                    ...meta_data,
                    subjects: [...updatedSubects]
                }
            }

            updateClassMetadataAction({
                class_id: findClass.id,
                meta_data: meta_data
            })
        }
    }

    const subjects = currentClass && _.get(currentClass, "meta_data.subjects", [])
    const tableSubjectListData = Array.isArray(subjects) && subjects.length > 0 && subjects.map((item, index) => {
        return {
            "SL_No": index + 1,
            "Class_Name": currentClass.class_name,
            "Subject": item.subject_name,
            "Teachers": Array.isArray(item.teachers) && item.teachers.length > 0
                ? item.teachers.join(", ")
                : "Not Assign"
        }
    })



    const isMetadataUpdate = metadataUpdateStatus

    return (
        <div className="col-md-12">
            <div style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                padding: "8px"
            }}>
                <ButtonGroup
                    variant="contained"
                    size="small"
                >
                    <Button
                        startIcon={<Add />}
                        size="small"
                        variant="outlined"
                        onClick={() => {
                            setOpenAddSubject(!openAddSubject)
                        }}
                    >
                        Create Subject
                    </Button>
                </ButtonGroup>
            </div>
            <CTable
                header={["SL_No", "Class_Name", "Subject", "Teachers"]}
                rows={tableSubjectListData}
                renderActions={
                    <div>
                        <Tooltip title={"Edit Subject"} placement="bottom" arrow >
                            <IconButton onClick={() => {
                                setOpenAddSubject(true)
                                setIsEditSubject(true)
                            }} >
                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={"Delete Subject"} placement="bottom" arrow >
                            <IconButton onClick={() => {
                                setIsDelete(true)
                            }} >
                                <DeleteOutline color="red" />
                            </IconButton>
                        </Tooltip>
                    </div>
                }
                onRowClick={(e) => {
                    setSelectedSubject(e)
                    setSubjectName(e.Subject)
                    let findClass = Array.isArray(classes) && classes.length > 0 && classes.find(i => i.class_name === e.Class_Name)
                    if(findClass){
                        let subjects = _.get(findClass,"meta_data.subjects",[])
                        let findSubject = Array.isArray(subjects) && subjects.length > 0 && subjects.find(i => i.subject_name.toLowerCase() === e.Subject.toLowerCase())
                        if(findSubject && findSubject.teachers){
                            setSelectedTeacher(findSubject.teachers)
                        }
                    }
                }}
            />
            <Modal
                open={openAddSubject}
                onClose={() => {
                    setOpenAddSubject(!openAddSubject)
                }}
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Box sx={{
                    width: isMobile ? "90%" : "400px",
                    border: "2px solid #FFFF",
                    borderRadius: "8px",
                    backgroundColor: "#0a3738ff"
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: "4px",
                        backgroundColor: "#cc7777ff",
                        borderTopRightRadius: "8px",
                        borderTopLeftRadius: "8px"
                    }}>
                        <Typography sx={{
                            fontFamily: "Lato",
                            fontWeight: 500,
                            fontStyle: "normal",
                            color: "#FFFF",
                            flex: 1
                        }}>{isEditSubject ? "Update Subject Name" : "Add New Subject"}</Typography>
                        <Tooltip title={"Close"} arrow placement="bottom" >
                            <IconButton
                                onClick={() => {
                                    setOpenAddSubject(false)
                                    setSubjectName("")
                                    setSelectedSubject(null)
                                    setIsEditSubject(false)
                                    setSelectedTeacher([])
                                }}
                            >
                                <Close sx={{
                                    backgroundColor: "#FFFF"
                                }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <Divider />
                    <div style={{
                        width: "100%",
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px"
                    }}>
                        <TextField fullWidth
                            placeholder="Enter Subject Name"
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <BookOnlineOutlined />
                                )
                            }}
                            value={subjectName}
                            onChange={(e) => {
                                setSubjectName(e.target.value)
                            }}
                            sx={{
                                backgroundColor: "#FFFF",
                                borderRadius: "8px"
                            }}
                        />
                        {
                            Array.isArray(teachersList) && teachersList.length > 0 && (
                                <FormControl fullWidth>
                                    <InputLabel>Select Subject Teacher</InputLabel>
                                    <Select fullWidth
                                        label={"Select Subject Teacher"}
                                        // multiline
                                        multiple
                                        variant="outlined"
                                        sx={{
                                            backgroundColor: "#FFFF"
                                        }}
                                        value={selectedTeacher}
                                    >
                                        {
                                            teachersList.map((item, index) => {
                                                let val = `${item.firstname} ${item.lastname}`
                                                return (
                                                    <MenuItem
                                                        key={index}
                                                        value={val}
                                                        onClick={() => {
                                                            if (selectedTeacher.includes(val)) {
                                                                let removedList = selectedTeacher.filter(i => i !== val)
                                                                setSelectedTeacher(removedList)
                                                            } else {
                                                                setSelectedTeacher([...selectedTeacher, val])
                                                            }
                                                        }}
                                                    >
                                                        <Typography sx={{
                                                            fontSize: "14px",
                                                            fontFamily: "Lato",
                                                            fontWeight: 500,
                                                            fontStyle: "normal"
                                                        }}>{val}</Typography>
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            )
                        }
                    </div>
                    <div style={{
                        padding: "8px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "8px"
                    }}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={isEditSubject ? handleEditSubjectName : handleCreateSubject}
                        >
                            {isEditSubject ? "Update" : "Submit"}
                        </Button>
                        <Button
                            variant="text"
                            onClick={() => {
                                setOpenAddSubject(false)
                                setSubjectName("")
                                setSelectedSubject(null)
                                setIsEditSubject(false)
                                setSelectedTeacher([])
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </Box>
            </Modal>
            <ConfirmationAlert
                open={isDelete}
                title={"Subject Delete Confirmation"}
                onConfirm={deleteSubject}
                onCancel={() => {
                    setSelectedSubject(null)
                    setIsDelete(false)
                    setOpenAddSubject(false)
                    setIsEditSubject(false)
                    setSubjectName("")
                }}
            />
            {
                (
                    getPlatformClassesState.isLoading ||
                    getPlatformRolesState.isLoading ||
                    updateClassMetadataState.isLoading ||
                    getUserListState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
        </div>
    )
}