import React, { useEffect, useMemo, useState } from 'react';
import {
    Form,
    Button,
    ButtonToolbar,
    Schema,
    Panel,
    FlexboxGrid,
    Container,
    InputPicker,
    Divider,
    Input,
    Grid,
    Row,
    Col,
    Header
} from 'rsuite';
import {
    useRegisterStudentMutation
} from "../Redux/actions/admissionSetup.action"
import {
    Loader,
    ToastMessage
} from "../components/index"

const { StringType } = Schema.Types;

const model = Schema.Model({
    firstname: StringType().isRequired('First name is required'),
    fathername: StringType().isRequired('Father name is required'),
    mothername: StringType().isRequired('Mother name is required'),
    cnumber: StringType().isRequired('Contact number is required'),
    pnumber: StringType().isRequired('Parent contact number is required'),
    email: StringType().isEmail('Enter a valid email').isRequired('Email is required'),
    fatherOccupation: StringType().isRequired(),
    motherOccupation: StringType().isRequired(),
    age: StringType().isRequired(),
    gender: StringType().isRequired(),
    lastExamination: StringType().isRequired(),
    year: StringType().isRequired(),
    division: StringType().isRequired(),
    markObtain: StringType().isRequired()
});

const TextField = React.forwardRef((props, ref) => {
    const { name, label, accepter, ...rest } = props;
    return (
        <Form.Group ref={ref}>
            <Form.ControlLabel>{label}</Form.ControlLabel>
            <Form.Control name={name} accepter={accepter} {...rest} />
        </Form.Group>
    );
});

const FormAdmission = ({
    class_name,
    classes,
    institution_ref
}) => {
    const formRef = React.useRef();
    const [formError, setFormError] = React.useState({});
    const [formValue, setFormValue] = React.useState({
        firstname: '',
        lastname: '',
        fathername: '',
        mothername: '',
        cnumber: '',
        pnumber: '',
        email: '',
        fatherOccupation: '',
        motherOccupation: '',
        age: '',
        gender: '',
        lastExamination: '',
        year: '',
        division: '',
        markObtain: ''
    })
    const [status, setStatus] = useState({
        show: false,
        message: "",
        type: ""
    })

    const [registerStudentAction, registerStudentState] = useRegisterStudentMutation();

    const handleSubmit = () => {
        if (!formRef.current.check() || !institution_ref || !Array.isArray(classes) || !class_name) {
            console.error('Form Error')
            return
        }
        const classRef = classes.find((i) => i.class_name === class_name)
        if (!classRef) return
        registerStudentAction({
            ...formValue,
            class_ref: classRef.id,
            institution_ref: institution_ref,
            meta_data: {}
        })
    }

    const registerStudentStatus = useMemo(() => {
        if (registerStudentState.isSuccess) {
            return {
                show: true,
                message: registerStudentState.data.message,
                type: "success"
            }
        }
        if (registerStudentState.isError) {
            return {
                show: true,
                message: "Error while registering the form",
                type: "error"
            }
        }
    }, [registerStudentState])

    useEffect(() => {
        if (registerStudentStatus) {
            setStatus(registerStudentStatus)
        }
    }, [registerStudentStatus])


    return (
        <Container
            style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '20px',
                width: '100%'
            }}
        >
            <Panel
                bordered
                shaded
                style={{
                    width: '100%',
                    maxWidth: 900,
                    backgroundColor: '#a18686ff',
                    borderRadius: 10,
                    padding: 20
                }}
            >
                <Header style={{
                    textAlign: 'center',
                    fontFamily: "Lato",
                    fontSize: 20,
                    color: "white"
                }}>Student Registration Form.</Header>
                <Form
                    ref={formRef}
                    onChange={setFormValue}
                    onCheck={setFormError}
                    formValue={formValue}
                    model={model}
                    fluid
                >
                    <Grid fluid>
                        {/* Basic Info */}
                        <Row gutter={10}>
                            <Col xs={24} sm={12}><TextField name="firstname" label="First Name" /></Col>
                            <Col xs={24} sm={12}><TextField name="lastname" label="Last Name" /></Col>
                        </Row>

                        <Row gutter={10}>
                            <Col xs={24} sm={12}><TextField name="fathername" label="Father Name" /></Col>
                            <Col xs={24} sm={12}><TextField name="mothername" label="Mother Name" /></Col>
                        </Row>

                        <Row gutter={10}>
                            <Col xs={24} sm={12}><TextField name="cnumber" label="Contact Number" /></Col>
                            <Col xs={24} sm={12}><TextField name="pnumber" label="Parent Contact Number" /></Col>
                        </Row>

                        <Row gutter={10}>
                            <Col xs={24} sm={12}><TextField name="email" label="Email Address" /></Col>
                            <Col xs={24} sm={12}><TextField name="pEmail" label="Parent Email Address" /></Col>
                        </Row>

                        <Divider />

                        {/* Occupation */}
                        <Row gutter={10}>
                            <Col xs={24} sm={12}><TextField name="fatherOccupation" label="Father Occupation" /></Col>
                            <Col xs={24} sm={12}><TextField name="motherOccupation" label="Mother Occupation" /></Col>
                        </Row>

                        <Row gutter={10}>
                            <Col xs={24} sm={12}><TextField name="age" label="Age" /></Col>
                            <Col xs={24} sm={12}><TextField name="gender" label="Gender" /></Col>
                        </Row>

                        <Divider />

                        {/* Academic Info */}
                        <Row gutter={10}>
                            <Col xs={24} sm={12}><TextField name="lastExamination" label="Last Examination" /></Col>
                            <Col xs={24} sm={12}><TextField name="year" label="Academic Year" /></Col>
                        </Row>

                        <Row gutter={10}>
                            <Col xs={24} sm={12}>
                                <Form.Group>
                                    <Form.ControlLabel>Select Division</Form.ControlLabel>
                                    <Form.Control
                                        name="division"
                                        accepter={InputPicker}
                                        data={[
                                            { label: "First Division", value: "first_division" },
                                            { label: "Second Division", value: "second_division" },
                                            { label: "Third Division", value: "third_division" }
                                        ]}
                                        placeholder="Choose Division"
                                        style={{ width: '100%' }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={24} sm={12}><TextField name="markObtain" label="Marks Obtained" /></Col>
                        </Row>

                        <Divider />

                        {/* Address */}
                        <Row gutter={10}>
                            <Col xs={24} sm={12}><TextField name="state" label="State" /></Col>
                            <Col xs={24} sm={12}><TextField name="district" label="District" /></Col>
                        </Row>

                        <Row gutter={10}>
                            <Col xs={24} sm={12}><TextField name="po" label="Post Office" /></Col>
                            <Col xs={24} sm={12}><TextField name="pin" label="PIN Code" /></Col>
                        </Row>

                        <Row>
                            <Col xs={24}>
                                <Form.Group>
                                    <Form.ControlLabel>Full Address</Form.ControlLabel>
                                    <Form.Control
                                        name="address"
                                        accepter={Input}
                                        // as="textarea"
                                        rows={3}
                                        placeholder="Enter full address"
                                        multiple
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Divider />

                        {/* Submit Button */}
                        <Row>
                            <Col xs={24}>
                                <ButtonToolbar style={{ justifyContent: 'center' }}>
                                    <Button appearance="primary" onClick={handleSubmit} block>
                                        Submit
                                    </Button>
                                </ButtonToolbar>
                            </Col>
                        </Row>
                    </Grid>
                </Form>
            </Panel>
            {
                (
                    registerStudentState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
            {
                status.show && (
                    <ToastMessage
                        {...status}
                        onClose={() => {
                            setStatus({
                                show: false,
                                type: "",
                                message: ""
                            })
                        }}
                    />
                )
            }
        </Container>
    )
}

export default FormAdmission
