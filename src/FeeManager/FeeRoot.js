import React from "react";
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    useMediaQuery,
    useTheme
} from "@mui/material"

import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";

export default function FeeRoot() {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",
                background: "#f7faff",
                px: isSmall ? 2 : 6,
                py: 6
            }}
        >
            {/* Header Section */}
            <Box sx={{ textAlign: "center", mb: 6 }}>
                <Typography variant={isSmall ? "h5" : "h3"} fontWeight={700}>
                    Monthly Fee Collection Manager
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{ mt: 2, maxWidth: "600px", mx: "auto", color: "gray" }}
                >
                    Manage student fee records, generate invoices, track dues, and automate billing for your School or College.
                </Typography>

                <Box sx={{ mt: 4 }}>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{ mr: 2, borderRadius: 3 }}
                    >
                        Start Managing
                    </Button>
                    <Button variant="outlined" size="large" sx={{ borderRadius: 3 }}>
                        View Reports
                    </Button>
                </Box>
            </Box>

            {/* Feature Cards Section */}
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ borderRadius: 4, py: 2, cursor: "pointer" }}>
                        <CardContent sx={{ textAlign: "center" }}>
                            <PeopleAltRoundedIcon sx={{ fontSize: 50, color: "#2962ff" }} />
                            <Typography variant="h6" fontWeight={600} sx={{ mt: 2 }}>
                                Manage Students
                            </Typography>
                            <Typography variant="body2" sx={{ color: "gray", mt: 1 }}>
                                Add, update or view student fee & profile details.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ borderRadius: 4, py: 2, cursor: "pointer" }}>
                        <CardContent sx={{ textAlign: "center" }}>
                            <PaymentsRoundedIcon sx={{ fontSize: 50, color: "#00bfa5" }} />
                            <Typography variant="h6" fontWeight={600} sx={{ mt: 2 }}>
                                Collect Fee
                            </Typography>
                            <Typography variant="body2" sx={{ color: "gray", mt: 1 }}>
                                Record payments, generate receipts and track dues.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ borderRadius: 4, py: 2, cursor: "pointer" }}>
                        <CardContent sx={{ textAlign: "center" }}>
                            <BarChartRoundedIcon sx={{ fontSize: 50, color: "#ff7043" }} />
                            <Typography variant="h6" fontWeight={600} sx={{ mt: 2 }}>
                                Reports & Analytics
                            </Typography>
                            <Typography variant="body2" sx={{ color: "gray", mt: 1 }}>
                                View monthly revenue, unpaid dues, and balance sheets.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
