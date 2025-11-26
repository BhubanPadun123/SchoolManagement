import React from "react"
import {
    Modal,
    useTheme,
    useMediaQuery,
    Typography,
    IconButton,
    Tooltip,
    Divider,
    TextField,
    InputAdornment,
    Button
} from "@mui/material"
import {
    Close,
    EmailOutlined,
    MobileScreenShareOutlined,
    MessageOutlined
} from "@mui/icons-material"

export default function ConnectUs({
    open = false,
    onClose
}) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <div style={{
                width: isMobile ? "90%" : "500px",
                padding: "8px",
                border: "1px solid #e0f3d9ff",
                backgroundColor: "#080101ff",
                borderRadius: "8px"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    padding: "4px"
                }}>
                    <Typography variant={isMobile ? "body1" : "h4"} sx={{
                        flex: 1,
                        color: "#FFFF",
                        fontFamily: "Lato",
                        fontWeight: "bold",
                        fontStyle: "normal"
                    }} >
                        Connect with us
                    </Typography>
                    <Tooltip title={"Close"} placement="bottom" arrow >
                        <IconButton onClick={onClose} >
                            <Close sx={{
                                color: "#FFFF"
                            }} />
                        </IconButton>
                    </Tooltip>
                </div>
                <Divider sx={{
                    backgroundColor: "#FFFF"
                }} />
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "16px",
                    padding: "4px",
                    backgroundColor: "#e7c2c2ff",
                    paddingTop: "14px"
                }}>
                    <TextField fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment
                                    position="start"
                                    component={"div"}
                                >
                                    <EmailOutlined />
                                </InputAdornment>
                            )
                        }}
                        placeholder="Enter Email Address"
                        label={"Enter Email Address"}
                        variant="outlined"
                    />
                    <TextField fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment
                                    position="start"
                                    component={"div"}
                                >
                                    <MobileScreenShareOutlined />
                                </InputAdornment>
                            )
                        }}
                        placeholder="Enter Phone Number"
                        label={"Enter Phone Number"}
                        variant="outlined"
                        type="number"
                    />
                    <TextField fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment
                                    position="start"
                                    component={"div"}
                                >
                                    <MessageOutlined />
                                </InputAdornment>
                            )
                        }}
                        placeholder="Enter Message"
                        label={"Enter Message"}
                        variant="outlined"
                        multiline
                    />
                </div>
                <div style={{
                    padding:"8px",
                    display:"flex",
                    flexDirection:"row",
                    justifyContent:"flex-end",
                    alignItems:"center",
                    gap:"8px"
                }}>
                    <Button
                       variant="contained"
                    >
                        Submit
                    </Button>
                    <Button
                       variant="text"
                       onClick={onClose}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    )
}