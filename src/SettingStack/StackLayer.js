import React from 'react'
import { Sidenav, Nav, Toggle } from 'rsuite'
import DashboardIcon from '@rsuite/icons/legacy/Dashboard'
import GroupIcon from '@rsuite/icons/legacy/Group'
import MagicIcon from '@rsuite/icons/legacy/Magic'
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle'
import { Outlet,useNavigate } from 'react-router-dom'
import {
    Admin,
    Model
} from "@rsuite/icons"
import "./root.css"

const StackLayer = () => {
    const navigate = useNavigate()
    const [expanded, setExpanded] = React.useState(true)
    const [activeKey, setActiveKey] = React.useState('1')
    return (
        <div style={{
            display:"flex",
            flexDirection:"row",
            position:"relative",
            width:"100%"
        }}>
            <div style={{ width: 240,position:"sticky" }}>
                <Sidenav expanded={expanded} defaultOpenKeys={['3', '4']}>
                    <Sidenav.Body>
                        <Nav activeKey={activeKey} onSelect={setActiveKey}>
                            <Nav.Item eventKey="2" icon={<Model />} onClick={()=> navigate("/setting/platform")}  >
                                Institution Setup
                            </Nav.Item>
                            <Nav.Item eventKey="1" icon={<Admin />} onClick={()=> navigate("/setting/admit")} >
                                Admin Card Template
                            </Nav.Item>
                            <Nav.Menu
                                placement="rightStart"
                                eventKey="4"
                                title="Settings"
                                icon={<GearCircleIcon />}
                            >
                                <Nav.Item eventKey="4-1">Applications</Nav.Item>
                                <Nav.Item eventKey="4-2">Channels</Nav.Item>
                                <Nav.Item eventKey="4-3">Versions</Nav.Item>
                                <Nav.Menu eventKey="4-5" title="Custom Action">
                                    <Nav.Item eventKey="4-5-1">Action Name</Nav.Item>
                                    <Nav.Item eventKey="4-5-2">Action Params</Nav.Item>
                                </Nav.Menu>
                            </Nav.Menu>
                        </Nav>
                    </Sidenav.Body>
                    <Sidenav.Toggle onToggle={expanded => setExpanded(expanded)} />
                </Sidenav>
            </div>
            <div className='outlet__root'>
                <Outlet/>
            </div>
        </div>
    )
}

export default StackLayer