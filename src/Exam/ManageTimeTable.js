import {
    Box,
    Typography,
    Card,
    TextField,
    IconButton,
    Button,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Popover,
    Tooltip,
    useTheme,
    useMediaQuery,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Divider
} from "@mui/material";
import {
    Close,
    DownloadDoneOutlined,
    ExpandMoreOutlined,
    DownloadOutlined,
    Edit,
    DeleteOutline
} from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/index";
import { GetCurrentUser } from "../utils/hooks";
import { useLazyGetInstitutionClassesQuery } from "../Redux/actions/classSetup.action";
import _ from "lodash";
import React from "react";

export default function ManageExamsPage() {
    const navigate = useNavigate()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const [selectedSubjectInfo, setSelectedSubjectInfo] = React.useState(null)
    const [openManage, setOpenManage] = React.useState(false)



    const [getClassesAction, getClassesState] = useLazyGetInstitutionClassesQuery()

    React.useEffect(() => {
        fetchPlatformData()
    }, [])

    function fetchPlatformData() {
        const user = GetCurrentUser()
        if (user) {
            let user_platform = _.get(user, "meta_data.user_platform", null)
            user_platform && getClassesAction({ institution_ref: user_platform })
        }
    }

    const classes = React.useMemo(() => {
        if (getClassesState.isSuccess) {
            let list = _.get(getClassesState, "currentData.list", null);
            return list;
        } else {
            return null;
        }
    }, [getClassesState]);


    return (
        <div className="col-md-12"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #512DA8, #673AB7, #9575CD)",
                p: { xs: 2, sm: 4 },
            }}
        >
            <Card
                sx={{
                    maxWidth: 1200,
                    mx: "auto",
                    p: { xs: 2, sm: 4 },
                    borderRadius: 4,
                    bgcolor: "#ffffffee",
                    backdropFilter: "blur(12px)",
                }}
            >
                {/* ---------- HEADER ---------- */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <Typography variant="h4" fontWeight="bold" textAlign="center">
                        Manage Exams
                    </Typography>

                    <Button
                        fullWidth={{ xs: true, sm: false }}
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{
                            bgcolor: "#4CAF50",
                            "&:hover": { bgcolor: "#45A049" },
                            py: 1.4,
                        }}
                        onClick={() => navigate("/exam/create")}
                    >
                        Create New Exam
                    </Button>
                </Box>

                <Typography sx={{ opacity: 0.7, mb: 4, textAlign: "center" }}>
                    Update, publish, and review previously created exams.
                </Typography>

                {/* -------- ACCORDION LIST -------- */}
                {Array.isArray(classes) &&
                    classes.length > 0 &&
                    classes.map((item, index) => {
                        let className = _.get(item, "class_name", "");
                        let exams = _.get(item, "meta_data.exam", []);

                        return (
                            <Accordion key={index} sx={{ mb: 2, borderRadius: 2 }}>
                                <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                                    <Typography fontSize="18px" fontWeight={600}>
                                        {className}
                                    </Typography>
                                </AccordionSummary>

                                <AccordionDetails>
                                    {Array.isArray(exams) && exams.length > 0 ? (
                                        <TableContainer
                                            component={Paper}
                                            sx={{
                                                borderRadius: 2,
                                                overflowX: "auto",
                                                boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
                                            }}
                                        >
                                            <Table size="small">
                                                <TableHead sx={{ backgroundColor: "#F5F5F5" }}>
                                                    <TableRow>
                                                        <TableCell>#</TableCell>
                                                        <TableCell>Exam Name</TableCell>
                                                        <TableCell>Time Table</TableCell>
                                                        <TableCell align="center">Actions</TableCell>
                                                    </TableRow>
                                                </TableHead>

                                                <TableBody>
                                                    {exams.map((sub, i) => {
                                                        let timeTable = _.get(sub, "timeTable", []);

                                                        return (
                                                            <TableRow
                                                                key={i}
                                                                sx={{
                                                                    "&:nth-of-type(odd)": { backgroundColor: "#FAFAFA" },
                                                                    "&:hover": { backgroundColor: "#EEE" },
                                                                }}
                                                            >
                                                                <TableCell>{i + 1}</TableCell>
                                                                <TableCell>{sub.examName}</TableCell>

                                                                <TableCell>
                                                                    {Array.isArray(timeTable) && timeTable.length > 0 ? (
                                                                        <TableContainer
                                                                            component={Paper}
                                                                            sx={{
                                                                                maxHeight: 160,
                                                                                overflow: "auto",
                                                                                borderRadius: 1,
                                                                                mt: 1,
                                                                            }}
                                                                        >
                                                                            <Table size="small">
                                                                                <TableHead>
                                                                                    <TableRow>
                                                                                        <TableCell>Subject</TableCell>
                                                                                        <TableCell>Start</TableCell>
                                                                                        <TableCell>End</TableCell>
                                                                                        <TableCell>Date</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {timeTable.map((t, t_index) => (
                                                                                        <TableRow key={t_index}>
                                                                                            <TableCell>{t.subject}</TableCell>
                                                                                            <TableCell>{t.start}</TableCell>
                                                                                            <TableCell>{t.end}</TableCell>
                                                                                            <TableCell>{t.date}</TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </TableContainer>
                                                                    ) : (
                                                                        <Chip label="No Timetable" size="small" />
                                                                    )}
                                                                </TableCell>

                                                                <TableCell align="center">
                                                                    <Button variant="outlined" size="small" onClick={() => {
                                                                        setSelectedSubjectInfo(sub)
                                                                        setOpenManage(!openManage)
                                                                    }} >
                                                                        Manage
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    ) : (
                                        <Typography
                                            sx={{
                                                fontSize: "18px",
                                                textAlign: "center",
                                                py: 2,
                                                opacity: 0.6,
                                            }}
                                        >
                                            No exams created yet.
                                        </Typography>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        )
                    })}
            </Card>
            <Dialog
                open={openManage}
                onClose={() => {
                    setOpenManage(!openManage)
                }}
            >
                <DialogTitle sx={{
                    padding: "0px 8px",
                    margin: 0,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }} >
                    <Typography>
                        Manage Exam Actions
                    </Typography>
                    <Tooltip title={"Close"} placement="bottom" arrow >
                        <IconButton>
                            <Close />
                        </IconButton>
                    </Tooltip>
                </DialogTitle>
                <Divider />
                <DialogContent sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px"
                }}>
                    <Tooltip title={"Download exam timetable"} placement="bottom" arrow >
                        <Button
                            size="small"
                            startIcon={<DownloadOutlined />}
                            variant="outlined"
                            onClick={() => {

                            }}
                        >
                            Download Timetable
                        </Button>
                    </Tooltip>
                    <Tooltip title={"Edit Timetable"} placement="bottom" arrow >
                        <Button
                            size="small"
                            startIcon={<Edit />}
                            variant="outlined"
                            onClick={() => {
                                if (!selectedSubjectInfo) return
                                navigate(`/exam/${JSON.stringify(selectedSubjectInfo)}`)
                            }}
                        >
                            Edit Timetable
                        </Button>
                    </Tooltip>
                    <Tooltip title={"Delete Timetable"} placement="bottom" arrow >
                        <Button
                            size="small"
                            startIcon={<DeleteOutline />}
                            variant="outlined"
                        >
                            Delete Timetable
                        </Button>
                    </Tooltip>
                </DialogContent>
            </Dialog>
            {getClassesState.isLoading && <Loader show={true} />}
        </div>
    );
}
