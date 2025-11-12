import React, { useState } from 'react';
import {
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Toolbar,
    Typography,
    Button
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Mail as MailIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';

const drawerTopOffset = 69

const Sidebar = ({
    headerTitle,
    navList = [],
    handleNav,
    defaultNav = []
}) => {
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState(defaultNav.length > 0 ? defaultNav[0].name : "")

    const toggleDrawer = () => {
        setOpen(!open)
    }

    const drawerContent = (
        <Box sx={{ width: 250 }}>
            <Toolbar>
                <Typography variant="h6" component="div">
                    {headerTitle ? headerTitle : "My App"}
                </Typography>
            </Toolbar>
            <Divider />
            {
                navList.length > 0 && (
                    <List>
                        {
                            defaultNav.length > 0 && (
                                defaultNav.map((item, index) => {
                                    return (
                                        <ListItem
                                            disablePadding
                                            key={index}
                                            onClick={() => {
                                                setOpen(!open)
                                                handleNav(item.to)
                                                setActive(item.name)
                                            }}
                                            sx={{
                                                background: item.name === active && "gray"
                                            }}
                                        >
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    {item.icon}
                                                </ListItemIcon>
                                                <ListItemText primary={item.name} />
                                            </ListItemButton>
                                        </ListItem>
                                    )
                                })
                            )
                        }
                        {
                            navList.map((item, index) => {
                                return (
                                    <ListItem
                                        disablePadding
                                        key={index}
                                        onClick={() => {
                                            setOpen(!open)
                                            handleNav(item.to)
                                            setActive(item.name)
                                        }}
                                        sx={{
                                            background: item.name === active && "gray"
                                        }}
                                    >
                                        <ListItemButton>
                                            <ListItemIcon>
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={item.name} />
                                        </ListItemButton>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                )
            }
        </Box>
    );

    return (
        <>
            <Button
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                variant="outlined"
                startIcon={<MenuIcon color='#FFFF' style={{ color: "#FFFF" }} />}
                size='small'
            >
                <Typography style={{
                    fontFamily: "Lato",
                    fontWeight: "bold",
                    color: "#FFFF",
                    textTransform: "uppercase"
                }}>
                    Open Menu
                </Typography>
            </Button>
            <Drawer
                anchor="left"
                open={open}
                onClose={toggleDrawer}
                ModalProps={{
                    keepMounted: true,
                }}
                PaperProps={{
                    sx: {
                        top: `${drawerTopOffset}px`,
                        height: `calc(100% - ${drawerTopOffset}px)`,
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Sidebar;