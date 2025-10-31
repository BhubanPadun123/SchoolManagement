import React from "react"
import PropTypes from "prop-types"
import { Modal, Button } from "rsuite"

/**
 * Reusable confirmation popup using RSuite
 * @param {boolean} open - Controls visibility of the popup
 * @param {string} title - Popup title
 * @param {string} message - Message to display inside popup
 * @param {Function} onConfirm - Callback when user confirms
 * @param {Function} onCancel - Callback when user cancels
 */
export default function ConfirmationAlert({
    open,
    title = "Confirm Action",
    message = "Are you sure you want to continue?",
    onConfirm,
    onCancel,
}) {
    return (
        <Modal open={open} onClose={onCancel} backdrop="static" size="xs">
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ fontSize: 15, color: "#444" }}>
                {message}
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={onConfirm} appearance="primary" color="green">
                    Confirm
                </Button>
                <Button onClick={onCancel} appearance="subtle">
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

ConfirmationAlert.propTypes = {
    open: PropTypes.bool.isRequired,
    title: PropTypes.string,
    message: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}
