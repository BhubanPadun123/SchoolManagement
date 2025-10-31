import React from "react"
import PropTypes from "prop-types"
import { Loader, Placeholder } from "rsuite"

/**
 * LoaderOverlay Component
 * Blocks interaction and shows a loading spinner
 * 
 * @param {boolean} show - Whether to display the loader
 * @param {string} message - Optional message to display
 */
export default function CLoader({ show, message = "Loading..." }) {
    if (!show) return null

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999, // ensures it's above everything
                backdropFilter: "blur(3px)",
            }}
        >
            <div style={{ textAlign: "center", color: "#fff" }}>
                <Loader size="lg" speed="fast" content={message} />
            </div>
        </div>
    )
}

CLoader.propTypes = {
    show: PropTypes.bool.isRequired,
    message: PropTypes.string,
}
