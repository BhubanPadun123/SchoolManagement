import React, { useEffect } from "react"
import PropTypes from "prop-types"
import {
    useToaster,
    Message,
    Modal
} from "rsuite"
import { useNavigate } from "react-router-dom"

/**
 * Reusable Toast Message Component using RSuite
 * @param {string} message - The message to display
 * @param {'success' | 'error' | 'warning' | 'info'} type - The type of toast message
 */
export default function ToastMessage({
    message,
    type = "info",
    open = true,
    onClose,
    redirect=null
}) {
    const navigate = useNavigate()
    React.useState(()=>{
        setTimeout(()=>{
            onClose()
            if(redirect){
                navigate(`${redirect}`)
            }
        },3000)
    },[type,message])
    return (
        <Modal 
        open={open} 
        style={{
            padding:0,
        }}>
            {
                type === "info" && (
                    <Message showIcon type="info" style={{
                        padding:0,
                        margin:0
                    }}>
                        <strong>Info!</strong> {message}
                    </Message>
                )
            }
            {
                type === "success" && (
                    <Message showIcon type="success">
                        <strong>Success!</strong> {message}
                    </Message>
                )
            }
            {
                type === "warning" && (
                    <Message showIcon type="warning">
                        <strong>warning!</strong> {message}
                    </Message>
                )
            }
            {
                type === "error" && (
                    <Message showIcon type="error">
                        <strong>Error!</strong> {message}
                    </Message>
                )
            }
        </Modal>
    )
}

ToastMessage.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["success", "error", "warning", "info"]),
}
