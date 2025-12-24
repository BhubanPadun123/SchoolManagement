import React, { useState } from "react"
import {
    Box,
    Typography,
    IconButton,
    Container,
    Grid,
    Paper,
    useTheme,
    useMediaQuery,
    Tooltip,
    Button,
} from "@mui/material"
import EventSeatIcon from "@mui/icons-material/EventSeat"
import {
    Close
} from "@mui/icons-material"
import _ from "lodash"

const TOTAL_ROWS = 8

const generateSeats = (studentList, seatsPerRow, feeCollectionData, currentClass) => {
    const collection = _.get(feeCollectionData, "fee_collection.data")
    const class_name = _.get(currentClass, "class_name", null)
    const ids = class_name && collection && Array.isArray(collection) && collection.find(i => i.class_name == class_name)?.ids || []
    const rows = []

    for (let i = 0; i < studentList.length; i += seatsPerRow) {
        rows.push(
            studentList.slice(i, i + seatsPerRow).map((student, idx) => {
                return ({
                    id: student.id || `${i + idx}`,
                    rollNo: student.rollNo || i + idx + 1,
                    status: ids && Array.isArray(ids) && ids.includes(student.rollNo) ? "paid" : "not-paid",
                    student: {
                        ...student.student
                    }
                })
            })
        )
    }

    return rows
};


const ClassSeatLayout = ({
    onClose,
    studentList,
    feeCollectionData,
    updatePayment,
    currentClass
}) => {
    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"))

    const seatsPerRow = isSmallScreen ? 5 : 10
    const leftSeats = isSmallScreen ? 2 : 4

    const [seatMap, setSeatMap] = useState(
        generateSeats(studentList, seatsPerRow, feeCollectionData, currentClass)
    )
    React.useEffect(() => {
        const data = generateSeats(studentList, seatsPerRow, feeCollectionData, currentClass)
        setSeatMap(data)
    }, [currentClass?.class_name, feeCollectionData])
    const [selectedStudent, setSelectedStudent] = useState(null)


    const toggleSeat = (student) => {
        setSelectedStudent(student)
    }


    const seatColor = (status) => {
        if (status === "available") return "grey.400";
        if (status === "selected") return "primary.main";
        return "error.main";
    }

    return (
        <div className="col-md-12" style={{
            width: isSmallScreen ? "100%" : window.innerWidth
        }} >
            <div style={{
                width: "100%",
                flex: 1,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px"
            }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                    Class Students List
                </Typography>
                <Tooltip title={"Close"} arrow placement="bottom" >
                    <IconButton onClick={onClose} >
                        <Close />
                    </IconButton>
                </Tooltip>
            </div>

            <Grid container spacing={3}>
                {/* Seat Layout */}
                <Grid item xs={12} md={8} sx={{
                    width: isSmallScreen ? "100%" : "50%",
                    height: isSmallScreen ? "300px" : "400px",
                    borderRadius: 2,
                    border: "1px solid",
                }}>
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            height: "100%",
                            overflowY: "scroll"
                        }}
                    >
                        {seatMap.map((row, rowIndex) => (
                            <Box
                                key={rowIndex}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                mb={1}
                            >
                                {row.map((seat, colIndex) => (
                                    <React.Fragment key={seat.id}>
                                        <Seat
                                            seat={seat}
                                            color={selectedStudent && selectedStudent.rollNo == seat.rollNo ? seatColor("selected") : seatColor(seat.status)}
                                            onClick={() => toggleSeat(seat)}
                                            selectedStudent={selectedStudent}
                                        />
                                    </React.Fragment>
                                ))}
                            </Box>
                        ))}

                    </Box>
                </Grid>

                {/* Student Details Panel */}
                <Grid item xs={12} md={4} flex={1}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            height: "100%",
                            position: "sticky",
                            top: 16
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight={600} mb={1}>
                            Student Details
                        </Typography>

                        {selectedStudent ? (
                            <>
                                <Typography><b>Roll No:</b> {selectedStudent.rollNo}</Typography>
                                <Typography><b>Name:</b> {selectedStudent.student.name}</Typography>
                                <Typography><b>Class:</b> {selectedStudent.student.class}</Typography>
                                <Typography><b>Section:</b> {selectedStudent.student.section}</Typography>
                                <Typography><b>Phone:</b> {selectedStudent.student.phone}</Typography>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    onClick={() => {
                                        updatePayment(selectedStudent)
                                        setSelectedStudent(null)
                                    }}
                                >Update Payment?</Button>
                            </>
                        ) : (
                            <Typography color="text.secondary">
                                Select a seat to view details
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Legend */}
            <Box display="flex" gap={3} mt={3}>
                <Legend color="grey.400" label="Paid" />
                <Legend color="primary.main" label="Selected" />
                <Legend color="error.main" label="UnPaid" />
            </Box>
        </div>
    );
};

/* Seat Component */
const Seat = ({ seat, color, onClick, selectedStudent }) => (
    <Tooltip
        placement="bottom"
        arrow
        title={
            <Box sx={{ p: 1 }}>
                <Typography variant="body2">
                    Roll No: {seat.rollNo}
                </Typography>
                <Typography variant="body2">
                    Status: {seat.status}
                </Typography>
            </Box>
        }
    >
        <IconButton
            disabled={seat.status === "paid"}
            onClick={onClick}
            sx={{
                color,
                position: "relative",
                transition: "0.2s",
                "&:hover": { transform: "scale(1.1)" }
            }}
        >
            <EventSeatIcon />

            <Typography
                variant="caption"
                sx={{
                    position: "absolute",
                    fontSize: "10px",
                    color: "#000",
                    top: "60%"
                }}
            >
                {seat.rollNo}
            </Typography>
        </IconButton>
    </Tooltip>
)

/* Legend */
const Legend = ({ color, label }) => (
    <Box display="flex" alignItems="center" gap={1}>
        <EventSeatIcon sx={{ color }} />
        <Typography variant="body2">{label}</Typography>
    </Box>
);

export default ClassSeatLayout
