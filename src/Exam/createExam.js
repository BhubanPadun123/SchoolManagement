import {
    Box,
    Typography,
    TextField,
    Card,
    Button,
    FormControl,
    MenuItem,
    Select,
    InputLabel,
    Divider,
} from "@mui/material"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import React, { useState } from "react"
import {
    Loader
} from "../components/index"
import {
    Message,
    toaster
} from "rsuite"
import { GetCurrentUser } from "../utils/hooks"
import _ from "lodash"
import {
    useLazyGetInstitutionClassesQuery,
    useUpdateClassMetadataMutation
} from "../Redux/actions/classSetup.action"
import {useNavigate} from "react-router-dom"

export default function CreateExamTimetablePage() {
    const navigate = useNavigate()
    const [examName, setExamName] = useState("")
    const [selectedClass, setSelectedClass] = useState("")
    const [examList,setExamList] = useState([])
    const [rows, setRows] = useState([
        { subject: "", date: "", start: "", end: "" },
    ])

    const [getPlatformClassesAction, getPlatformClassesState] = useLazyGetInstitutionClassesQuery()
    const [updateClassAction,updateClassState] = useUpdateClassMetadataMutation()


    React.useEffect(() => {
        fetchPlatformData()
    }, [])

    const handleAddRow = () => {
        setRows([...rows, { subject: "", date: "", start: "", end: "" }])
    }

    const handleRemoveRow = (index) => {
        if (rows.length > 1) {
            setRows(rows.filter((_, i) => i !== index))
        }
    }

    function fetchPlatformData() {
        const user = GetCurrentUser()
        if (user) {
            let user_platform = _.get(user, "meta_data.user_platform", null)
            if (user_platform) {
                getPlatformClassesAction({
                    institution_ref: user_platform
                })
            }
        }
    }

    const classes = React.useMemo(() => {
        if (getPlatformClassesState.isSuccess) {
            let list = _.get(getPlatformClassesState, "currentData.list", [])
            return list
        } else {
            return []
        }
    }, [getPlatformClassesState])

    const updateClassStatus = React.useMemo(()=>{
        if(updateClassState.isSuccess){
            toaster.push(<Message type="success" >Timetable created success!</Message>,{placement:"topCenter"})
            fetchPlatformData()
            setExamName("")
            setSelectedClass("")
            updateClassState.reset()
        }
        if(updateClassState.isError){
            toaster.push(<Message type="error">Error while update the class metadata!</Message>,{placement:"topCenter"})
        }
    },[updateClassState])

    function handleCreateTimetable(){
        if(!selectedClass || !examName || !rows || !Array.isArray(classes) || classes.length === 0){
            toaster.push(<Message type="info" >Please fill all details!</Message>,{placement:"topCenter"})
            return
        } 
        const findClass = classes.find(i => i.class_name === selectedClass)
        if(!findClass) return
        const data = {
            examName:examName,
            class:findClass.class_name,
            timeTable:rows
        }
        let isExamExist = _.get(findClass,"meta_data.exam",null)
        if(isExamExist){
            let findExam = Array.isArray(examList) && examList.length > 0 && examList.find(e => e.class.toLowerCase() === selectedClass.toLowerCase() && e.examName.toLowerCase() === examName.toLowerCase())
            if(findExam){
                toaster.push(<Message type="info" >Exam Name Already Exist With Name {examName}</Message>,{placement:"topCenter"})
                return
            }
            let isExamNameExist = Array.isArray(isExamExist) && isExamExist.length > 0 && isExamExist.find(e => e.examName === examName)
            if(isExamNameExist){
                toaster.push(<Message type="info" >Exam name already exist!</Message>,{placement:"topCenter"})
                return
            }
            let meta_data = {
                ...findClass.meta_data,
                "exam":[...findClass.meta_data.exam,data]
            }
            updateClassAction({
                class_id:findClass.id,
                meta_data:meta_data
            })
        }else{
            let meta_data = {
                ...findClass.meta_data,
                "exam":[data]
            }
            updateClassAction({
                class_id:findClass.id,
                meta_data:meta_data
            })
        }
    }

    const updateStatus = updateClassStatus

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #2196F3, #3F51B5, #673AB7)",
                p: 4,
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Card
                sx={{
                    width: "100%",
                    maxWidth: 900,
                    p: 4,
                    borderRadius: 4,
                    bgcolor: "#ffffffee",
                    backdropFilter: "blur(10px)",
                }}
            >
                {/* Header */}
                <Box textAlign="center" mb={4}>
                    <CalendarMonthIcon sx={{ fontSize: 60, color: "#673AB7" }} />
                    <Typography variant="h4" fontWeight="bold" mt={1}>
                        Create Exam Timetable
                    </Typography>
                    <Typography sx={{ color: "#555", mt: 1 }}>
                        Schedule subjects, dates, and exam timings.
                    </Typography>
                </Box>

                {/* General Details */}
                <Typography variant="h6" fontWeight="600" mb={2}>
                    Exam Details
                </Typography>

                <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, mb: 4 }}>
                    <TextField
                        fullWidth
                        label="Exam Name"
                        placeholder="Example: Half-Yearly Examination"
                        value={examName}
                        onChange={(e) => {
                            setExamName(e.target.value)
                        }}
                    />

                    <FormControl fullWidth>
                        <InputLabel>Class</InputLabel>
                        <Select
                            label="Class"
                            value={selectedClass}
                            onChange={(e) => {
                                let value = e.target.value
                                setSelectedClass(value)
                                let findClass = Array.isArray(classes) && classes.length > 0 && classes.find(i => i.class_name.toLowerCase() === value.toLowerCase())
                                let exam = _.get(findClass,"meta_data.exam",null)
                                if(exam){
                                    setExamList([...exam])
                                }
                            }}
                        >
                            {
                                Array.isArray(classes) && classes.length > 0 && classes.map((item) => {
                                    return (
                                        <MenuItem key={item.id} value={item.class_name} >{item.class_name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Subject Table */}
                <Typography variant="h6" fontWeight="600" mb={2}>
                    Subject Schedule
                </Typography>

                {rows.map((row, i) => (
                    <Box
                        key={i}
                        sx={{
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr 1fr 80px" },
                            mb: 2,
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Subject Name"
                            value={row.subject}
                            onChange={(e) => {
                                let value = e.target.value
                                let updatedRows = rows.map((item, index) => {
                                    if (i === index) {
                                        return {
                                            ...item,
                                            subject: value.toUpperCase()
                                        }
                                    } else {
                                        return item
                                    }
                                })
                                setRows(updatedRows)
                            }}
                        />

                        <TextField
                            type="date"
                            fullWidth
                            label="Date"
                            InputLabelProps={{ shrink: true }}
                            value={row.date}
                            onChange={(e) => {
                                let value = e.target.value
                                let updatedRows = rows.map((item, index) => {
                                    if (i === index) {
                                        return {
                                            ...item,
                                            date: value
                                        }
                                    } else {
                                        return item
                                    }
                                })
                                setRows(updatedRows)
                            }}
                        />

                        <TextField
                            type="time"
                            fullWidth
                            label="Start Time"
                            InputLabelProps={{ shrink: true }}
                            value={row.start}
                            onChange={(e) => {
                                let value = e.target.value
                                let updatedRows = rows.map((item, index) => {
                                    if (i === index) {
                                        return {
                                            ...item,
                                            start: value
                                        }
                                    } else {
                                        return item
                                    }
                                })
                                setRows(updatedRows)
                            }}
                        />

                        <TextField
                            type="time"
                            fullWidth label="End Time"
                            InputLabelProps={{ shrink: true }}
                            value={row.end}
                            onChange={(e) => {
                                let value = e.target.value
                                let updatedRows = rows.map((item, index) => {
                                    if (i === index) {
                                        return {
                                            ...item,
                                            end: value
                                        }
                                    } else {
                                        return item
                                    }
                                })
                                setRows(updatedRows)
                            }}
                        />

                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleRemoveRow(i)}
                            sx={{ minWidth: 50 }}
                        >
                            <DeleteIcon />
                        </Button>
                    </Box>
                ))}

                <Box textAlign="left" mb={4}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#45A049" } }}
                        onClick={handleAddRow}
                    >
                        Add Subject
                    </Button>
                </Box>

                {/* Submit Button */}
                <Box textAlign="center">
                    <Button
                        variant="contained"
                        sx={{
                            px: 6,
                            py: 1.5,
                            fontSize: "16px",
                            bgcolor: "#673AB7",
                            "&:hover": { bgcolor: "#5E35B1" },
                        }}
                        onClick={handleCreateTimetable}
                    >
                        Save Timetable
                    </Button>
                </Box>
                <Box textAlign="right" mb={4}>
                    <Button
                        variant="contained"
                        sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#45A049" } }}
                        onClick={()=> {
                            navigate("/exam/manage")
                        }}
                    >
                        Manage Exam
                    </Button>
                </Box>
            </Card>
            {
                (
                    getPlatformClassesState.isLoading ||
                    updateClassState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
        </Box>
    )
}
