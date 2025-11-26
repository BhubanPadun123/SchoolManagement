import React from "react"
import {
    Typography,
    Box,
    Tabs,
    Tab,
    useMediaQuery,
    useTheme,
    Divider
} from "@mui/material"


export default function FeeStructureSidebar({
    classes = [],
    currentTabVal = "",
    onChangeTab
}){
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    return(
        <Box sx={{
            width:"100%",
            backgroundColor:"#a5a0a0ff",
            minHeight:"60vh",
            marginLeft:"-10px"
        }}>
            <Typography variant={!isMobile ? "h4" : "body2"} sx={{
                fontSize:!isMobile ? "26px" : "18px",
                color:"#FFFF",
                fontFamily:"Lato",
                fontWeight:"bold",
                fontStyle:"normal",
                textAlign:"center",
            }} >
                Class list
            </Typography>
            <Divider sx={{
                background:"#FFFF"
            }} />
            <div style={{
                flex:1,
                width:"100%",
                overflowY:"scroll"
            }}>
                {
                    Array.isArray(classes) && classes.length > 0 && (
                        <Tabs
                           orientation="vertical"
                           value={currentTabVal}
                           indicatorColor="primary"
                           onChange={onChangeTab}
                        >
                            {
                                classes.map((item,index)=> {
                                    return(
                                        <Tab 
                                            label={item.class_name} 
                                            key={index} 
                                            sx={{
                                                color:"#FFFF",
                                                fontFamily:"Lato"
                                            }} 
                                            value={item.class_name}
                                        />
                                    )
                                })
                            }
                        </Tabs>
                    )
                }
            </div>
        </Box>
    )
}