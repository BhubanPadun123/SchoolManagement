import React from "react";
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Button,
    MenuItem,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useNavigate,useLocation } from "react-router-dom"
import {GetCurrentUser} from "../utils/hooks"
import {AddOutline, Admin} from "@rsuite/icons"

const routesList = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Setting", path: "/setting" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    {name:"Admin",path:"/admin"},
    { name: "Login", path: "/auth" },
]
const publicRoutes = [
    {name:"Home",path:"/"},
    {name:"Services",path:"/service"},
    {name:"Result",path:"/results"},
    {name:"Registration",path:"/registration"},
    {name:"Login",path:"/auth"},
]

const ResponsiveHeader= () => {
    const path = useLocation()
    const [anchorElNav, setAnchorElNav] = React.useState(null)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const navigate = useNavigate()
    const [user,setUser] = React.useState(null)

    React.useEffect(function(){
        fetchUserData()
    },[path?.pathname])

    function fetchUserData(){
        const user = GetCurrentUser()
        if(!user){
            setUser(null)
        }else{
            setUser(user)
        }
    }

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget)
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null)
    }

    const handleNavigate = (path) => {
        navigate(path)
        handleCloseNavMenu()
    }

    return (
        <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Logo / Title (Desktop) */}
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 4,
                            display: { xs: "none", md: "flex" },
                            fontWeight: 700,
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        MyWebsite
                    </Typography>

                    {/* Mobile Menu Icon */}
                    {isMobile && (
                        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                            <IconButton
                                size="large"
                                aria-label="menu"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorElNav}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                                transformOrigin={{ vertical: "top", horizontal: "left" }}
                                sx={{ display: { xs: "block", md: "none" } }}
                            >
                                {(user ? routesList : publicRoutes).map((route) => (
                                    <MenuItem key={route.name} onClick={() => handleNavigate(route.path)}>
                                        <Typography textAlign="center">{route.name}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    )}

                    {/* Logo / Title (Mobile) */}
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                            fontWeight: 700,
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        MyWebsite
                    </Typography>

                    {/* Navigation Links - Desktop */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                            justifyContent: "flex-end",
                        }}
                    >
                        {(user ? routesList : publicRoutes).map((route) => (
                            <Button
                                key={route.name}
                                onClick={() => handleNavigate(route.path)}
                                sx={{ 
                                    my: 2, 
                                    color: "white", 
                                    display: route.path.includes("auth") ? "flex" : "block",
                                    border: route.path.includes("auth") && "2px solid #FFFF", 
                                    justifyContent:"center",
                                    alignItems:"center"
                                }}
                                variant="outlined"
                                endIcon={route.path.includes("auth") && <Admin/>}
                            >
                                {route.name}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default ResponsiveHeader;
