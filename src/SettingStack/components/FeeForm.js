import React from "react"
import {
    Typography,
    TextField,
    Box,
    Divider,
    Button
} from "@mui/material"

export default function AddFeeForm({
    isMobile = false,
    roles = [],
    onAdd
}) {
    const [feeName,setFeeName] = React.useState("")
    const [feeAmount,setFeeAmount] = React.useState("")
    return (
        <div style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px"
        }}>
            <Box sx={{
                width: isMobile ? "100%" : "400px",
                backgroundColor: "#9c9a9aff",
                border: "1px solid #FFFF",
                borderRadius: "8px"
            }}>
                <Typography sx={{
                    textAlign: "center",
                    color: "#FFFF",
                    fontFamily: "Lato",
                    padding: "4px"
                }}>Fill The Fee Details</Typography>
                <Divider sx={{ backgroundColor: "#FFFF" }} />
                <TextField
                    placeholder="Enter Fee Name"
                    label={"Enter Fee Name"}
                    value={feeName}
                    onChange={(e)=>{
                        setFeeName(e.target.value)
                    }}
                    sx={{
                        background: "#FFFF",
                        width: "80%",
                        marginLeft: 4,
                        marginRight: 4,
                        borderRadius: 2,
                        marginTop: 2,
                        marginBottom: 2
                    }}
                />
                <TextField
                    placeholder="Enter Fee Amount"
                    label={"Enter Fee Amount"}
                    type="number"
                    value={feeAmount}
                    onChange={(e)=>{
                        setFeeAmount(e.target.value)
                    }}
                    sx={{
                        background: "#FFFF",
                        width: "80%",
                        marginLeft: 4,
                        marginRight: 4,
                        borderRadius: 2,
                        marginBottom: 2
                    }}
                />
                <div style={{
                    width: "100%",
                    padding:"4px",
                    display:"flex",
                    justifyContent:"center"
                }}>
                    <Button
                        variant="contained"
                        onClick={()=> {
                            onAdd(feeName,feeAmount)
                            setFeeAmount("")
                            setFeeName("")
                        }}
                        disabled = {Array.isArray(roles) ? !roles.includes("Create Content") : true}
                    >
                        Add
                    </Button>
                </div>
            </Box>
        </div>
    )
}