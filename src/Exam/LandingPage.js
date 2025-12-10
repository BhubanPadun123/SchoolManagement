import { Box, Typography, Card, CardContent, Button } from "@mui/material"
import SchoolIcon from "@mui/icons-material/School"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"
import { styled } from "@mui/material/styles"

const ActionCard = styled(Card)(({ theme }) => ({
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "18px",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    transition: "0.35s",
    cursor: "pointer",
    "&:hover": {
        transform: "scale(1.05)",
        background: "rgba(255, 255, 255, 0.25)",
        boxShadow: "0px 10px 25px rgba(0,0,0,0.25)",
    },
}))

export default function LandingPage(props) {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #673AB7, #512DA8, #9C27B0)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 3,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 800,
                    textAlign: "center",
                    color: "#fff",
                }}
            >
                {/* Header */}
                <SchoolIcon sx={{ fontSize: 70, mb: 1 }} />
                <Typography variant="h3" fontWeight="bold">
                    Exam Management
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.8, mb: 5 }}>
                    Design, organize, and monitor your exams with ease.
                </Typography>

                {/* Cards */}
                <Box
                    sx={{
                        display: "grid",
                        gap: 3,
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    }}
                >
                    {/* Create Exam Card */}
                    <ActionCard>
                        <CardContent>
                            <AddCircleOutlineIcon sx={{ fontSize: 50, color: "#4CAF50", mb: 2 }} />
                            <Typography variant="h5" fontWeight="600" gutterBottom>
                                Create Exam
                            </Typography>
                            <Typography sx={{ opacity: 0.85, mb: 3 }}>
                                Build a new exam with duration, subjects and rules.
                            </Typography>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    bgcolor: "#4CAF50",
                                    fontWeight: 600,
                                    "&:hover": { backgroundColor: "#45A049" },
                                    borderRadius: "10px",
                                }}
                                onClick={()=> {
                                    props.onClickCreate()
                                }}
                            >
                                Start
                            </Button>
                        </CardContent>
                    </ActionCard>

                    {/* Manage Exam Card */}
                    <ActionCard>
                        <CardContent>
                            <ManageAccountsIcon sx={{ fontSize: 50, color: "#03A9F4", mb: 2 }} />
                            <Typography variant="h5" fontWeight="600" gutterBottom>
                                Manage Exams
                            </Typography>
                            <Typography sx={{ opacity: 0.85, mb: 3 }}>
                                Update, publish, and review previously created exams.
                            </Typography>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    bgcolor: "#03A9F4",
                                    fontWeight: 600,
                                    "&:hover": { backgroundColor: "#0288D1" },
                                    borderRadius: "10px",
                                }}
                                onClick={()=> {
                                    props.onClickManage()
                                }}
                            >
                                View
                            </Button>
                        </CardContent>
                    </ActionCard>
                </Box>
            </Box>
        </Box>
    )
}
