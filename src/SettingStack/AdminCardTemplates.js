import React from "react"
import {
    Template_1,
} from "./AdmitTemplates/template_1"
import {
    Template_2
} from "./AdmitTemplates/template_2"
import {
    Container,
    IconButton,
    Text,
    Button,
    Divider
} from "rsuite"


function AdminCardTemplates() {

    React.useEffect(() => {
        const renderTemplate = () => {
            const template_1 = document.getElementById("template_1")
            const template_2 = document.getElementById("template_2")
            if (template_1) {
                template_1.innerHTML = Template_1
            }
            if(template_2){
                template_2.innerHTML = Template_2
            }
        }
        renderTemplate()
    }, [])

    return (
        <Container style={{
            display:"flex",
            flexDirection:"column",
            gap:8,
            justifyContent:"center",
            alignItems:"center",
            marginTop:4
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <div id="template_1" />
                <Text style={{
                    fontSize: "20px",
                    color: "#FFFF",
                    fontFamily: "Lato"
                }}>
                    Template - 1
                </Text>
                <span style={{
                    fontSize:"14px",
                    color:"#ddb9b9ff",
                    fontFamily:"Lato"
                }}>Note: Add the template to your document configuration<br/>,while create admin card this template will be used.</span>
                <Button
                    appearance="primary"
                >
                    Add Template ?
                </Button>
            </div>
            <Divider />
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <div id="template_2" />
                <Text style={{
                    fontSize: "20px",
                    color: "#FFFF",
                    fontFamily: "Lato"
                }}>
                    Template - 2
                </Text>
                <span style={{
                    fontSize:"14px",
                    color:"#ddb9b9ff",
                    fontFamily:"Lato"
                }}>Note: Add the template to your document configuration<br/>,while create admin card this template will be used.</span>
                <Button
                    appearance="primary"
                >
                    Add Template ?
                </Button>
            </div>
        </Container>
    )
}

export default AdminCardTemplates