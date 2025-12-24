import React from "react";
import {
    Grid,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography,
    Button,
    Container,
    Box,
    useTheme,
    useMediaQuery
} from "@mui/material";

const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

const MonthlyCards = ({
    onCardClick
}) => {
    const currentYear = new Date().getFullYear()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    return (
        <Container maxWidth="xl">
            {/* Page Header */}
            <Box mb={3}>
                <Typography variant="h5" fontWeight={600}>
                    Year Overview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {currentYear}
                </Typography>
            </Box>

            <Grid container spacing={3} alignItems="stretch">
                {months.map((month) => (
                    <Grid
                        item
                        key={month}
                        xs={12}   // Mobile → 1 card per row
                        md={4}    // Laptop & above → 3 cards per row
                        sx={{
                            width: isMobile ? "100%" : "30%",
                            boxShadow: "-moz-initial"
                        }}
                    >
                        <Card
                            component="section"
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: 2,
                                width: "100%",
                                background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
                                transition: "all 0.3s ease",
                                cursor: "pointer",

                                "&:hover": {
                                    transform: "translateY(-6px)",
                                    boxShadow: "0px 12px 28px rgba(0,0,0,0.12)",
                                    background: "linear-gradient(135deg, #f9fafe 0%, #f1f5ff 100%)"
                                }
                            }}
                        >
                            <CardHeader
                                component="header"
                                sx={{
                                    transition: "background-color 0.3s ease",
                                    "&:hover": {
                                        backgroundColor: "rgba(25, 118, 210, 0.04)"
                                    }
                                }}
                                title={
                                    <Typography variant="h6" fontWeight={600}>
                                        {month}
                                    </Typography>
                                }
                                subheader={currentYear}
                            />


                            <CardContent component="main" sx={{ flexGrow: 1, pt: 0 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Monthly summary and actions related to {month}.
                                </Typography>
                            </CardContent>

                            <CardActions
                                component="footer"
                                sx={{
                                    px: 2,
                                    py: 1.5,
                                    mt: "auto",
                                    justifyContent: "flex-end",
                                    borderTop: "1px solid",
                                    borderColor: "divider",
                                    gap:"4px"
                                }}
                            >
                                <Button
                                    size="small"
                                    sx={{
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            transform: "scale(1.05)"
                                        }
                                    }}
                                >
                                    View summary
                                </Button>

                                <Button
                                    size="small"
                                    variant="contained"
                                    sx={{
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            boxShadow: "0px 6px 16px rgba(25,118,210,0.35)"
                                        }
                                    }}
                                    onClick={()=> {
                                        onCardClick(month)
                                    }}
                                >
                                    Collect Fee
                                </Button>

                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

        </Container>
    );
};

export default MonthlyCards;
