import React, {
  useState,
  useMemo,
  useEffect
} from "react";
import { ICONS } from "../Images"
import _ from "lodash"
import {
  Container,
  Content,
  Panel,
  Form,
  Button,
  ButtonToolbar,
  Schema,
  toaster,
  Message
} from "rsuite";
import { useActionData, useNavigate } from "react-router-dom"
import {
  useUserLoginMutation,
  useResetPasswordMutation
} from "../Redux/actions/user.action"
import {
  Loader,
  ToastMessage,
  ConfirmationAlert
} from "../components/index"
import {
  Modal,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Divider,
  TextField,
  InputAdornment
} from "@mui/material"
import {
  Close,
  EmailOutlined,
  PasswordOutlined
} from "@mui/icons-material"

const { StringType } = Schema.Types

export default function LoginPage() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [status, setStatus] = useState({
    show:false,
    message:"",
    type:""
  })
  const [email,setEmail] = useState("")
  const [new_password,setNewpassword] = useState("")
  const [loginUserAction, loginUserSatate] = useUserLoginMutation()
  const [resetPasswordAction, resetPasswordState] = useResetPasswordMutation()
  const [resetPassword, setResetPassword] = useState(false)


  const updateConfirmationStatus = useMemo(() => {
    if (loginUserSatate.isSuccess) {
      localStorage.setItem("current_user", JSON.stringify(loginUserSatate.data))
      return {
        show: true,
        message: loginUserSatate.data.message,
        type: "success",
        redirect: "/"
      }
    }
    if (loginUserSatate.isError) {
      return {
        show: true,
        message: loginUserSatate.error.data?.detail,
        type: "error",
        redirect: null
      }
    }
  }, [loginUserSatate])

  useEffect(() => {
    if (updateConfirmationStatus) {
      setStatus(updateConfirmationStatus)
    }
  }, [updateConfirmationStatus])
  const resetPasswordStatus = React.useMemo(()=>{
    if(resetPasswordState.isSuccess){
      const message = _.get(resetPasswordState,"data.message",null)
      toaster.push(<Message type="success">{message}</Message>,{placement:"topCenter"})
      return {
        show:true,
        type:"success",
        message:message,
      }
    }else if(resetPasswordState.isError){
      return {
        show:true,
        type:"error",
        message:"Error while reset the password!"
      }
    }
  },resetPasswordState)
  React.useEffect(()=>{
    if(resetPasswordStatus){
      setStatus(resetPasswordStatus)
      setEmail("")
      setNewpassword("")
      setResetPassword(false)
    }
  },[resetPasswordStatus])


  const model = Schema.Model({
    email: StringType()
      .isEmail("Please enter a valid email.")
      .isRequired("Email is required."),
    password: StringType().isRequired("Password is required."),
  })

  const handleSubmit = (e) => {
    loginUserAction(e)
  }
  function handleResetPass() {
    if (!email || !new_password) {
      toaster.push(<Message type="info" >Please fill the email and password!</Message>, { placement: "topCenter" })
      return
    }
    resetPasswordAction({
      email: email,
      new_password: new_password
    })
  }

  return (
    <Container style={{ height: "100vh", overflow: "hidden" }}>
      <Content style={{ height: "100%" }}>
        <div className="login-wrapper">
          {/* Left Image Section */}
          <div className="login-left">
            <img src={ICONS.login_banner} alt="Login" />
            <div className="overlay">
              <h2>Welcome Back</h2>
              <p>Sign in to access your institution dashboard</p>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="login-right">
            <Panel
              header={<h3 style={{ textAlign: "center", color: "#fff" }}>Login</h3>}
              className="login-panel"
            >
              <Form fluid model={model} onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.ControlLabel>Email</Form.ControlLabel>
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                  />
                </Form.Group>

                <Form.Group>
                  <Form.ControlLabel>Password</Form.ControlLabel>
                  <Form.Control
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                  />
                </Form.Group>

                <Form.Group>
                  <ButtonToolbar>
                    <Button appearance="primary" block type="submit">
                      Login
                    </Button>
                  </ButtonToolbar>
                </Form.Group>

                <p style={{ textAlign: "center", color: "#ddd", marginTop: "10px" }}>
                  Don’t have an account?{" "}
                  <a href="/auth/signup" style={{ color: "#4ea9ff" }}>
                    Sign Up
                  </a>
                </p>
                <Button appearance="subtle" block onClick={() => {
                  localStorage.clear()
                  toaster.push(<Message type="success" >User logout successfull</Message>, { placement: "topCenter" })
                  navigate("/")
                }}>
                  Logout
                </Button>
                <p style={{ textAlign: "center", color: "#ddd", marginTop: "10px" }}>
                  Forget password?{" "}
                  <a href="#" style={{ color: "#4ea9ff" }} onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setResetPassword(true)
                  }}>
                    Reset
                  </a>
                </p>
              </Form>
            </Panel>
          </div>
        </div>
        <Modal
          open={resetPassword}
          onClose={() => {
            setResetPassword(false)
          }}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div style={{
            width: isMobile ? "90%" : "400px",
            backgroundColor: "#0a0909ff",
            border: "1px solid #FFFF",
            borderRadius: "4px"
          }}>
            <div style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center"
            }}>
              <Typography variant={isMobile ? "body1" : "h4"} sx={{
                fontFamily: "Lato",
                color: "#FFFF",
                fontWeight: 400,
                fontStyle: "normal",
                flex: 1
              }} >Reset Password ?</Typography>
              <Tooltip title={"Close"} placement="bottom" arrow >
                <IconButton>
                  <Close sx={{
                    backgroundColor: "#FFFF"
                  }} />
                </IconButton>
              </Tooltip>
            </div>
            <Divider sx={{
              backgroundColor: "#FFFF"
            }} />
            <div style={{ height: "8px" }} />
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              paddingLeft: "8px",
              paddingRight: "8px",
              paddingTop: "10px",
              paddingBottom: "10px"
            }}>
              <TextField fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" >
                      <EmailOutlined />
                    </InputAdornment>
                  )
                }}
                placeholder="Enter Email"
                label={"Enter Email"}
                variant="outlined"
                style={{
                  backgroundColor: "#FFFF",
                  borderRadius: "4px"
                }}
                value={email}
                onChange={(e)=> {
                  setEmail(e.target.value)
                }}
                type="email"
              />
              <TextField fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" >
                      <PasswordOutlined />
                    </InputAdornment>
                  )
                }}
                placeholder="Enter New Password"
                label={"Enter New Password"}
                variant="outlined"
                style={{
                  backgroundColor: "#FFFF",
                  borderRadius: "4px"
                }}
                value={new_password}
                onChange={(e)=> {
                  setNewpassword(e.target.value)
                }}
                type="password"
              />
            </div>
            <div style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: 'flex-end',
              alignItems: "center",
              gap: "10px",
              padding: "8px"
            }}>
              <Button
                type="button"
                appearance="primary"
                onClick={handleResetPass}
              >
                Submit
              </Button>
              <Button
                type="button"
                appearance="subtle"
                onClick={()=> {
                  setEmail("")
                  setNewpassword("")
                  setResetPassword(false)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
        {
          (
            loginUserSatate.isLoading ||
            resetPasswordState.isLoading
          ) && (
            <Loader
              show={true}
            />
          )
        }
        {
          status.show && (
            <ToastMessage
              {...status}
              onClose={() => {
                setStatus({
                  show:false,
                  message:"",
                  type:""
                })
              }}
            />
          )
        }
      </Content>

      {/* Styles */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        .login-wrapper {
          display: flex;
          height: 100%;
          width: 100%;
          overflow: hidden;
        }

        .login-left {
          flex: 2;
          position: relative;
          overflow: hidden;
        }

        .login-left img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.6);
        }

        .overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #fff;
          text-align: center;
        }

        .overlay h2 {
          font-size: 2.2rem;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .overlay p {
          font-size: 1rem;
          opacity: 0.9;
        }

        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0e0e0e;
          padding: 40px;
        }

        .login-panel {
          width: 100%;
          max-width: 400px;
          background: transparent;
          color: #fff;
        }

        /* Input styling for dark background */
        .rs-form-control,
        .rs-form-control input {
          background-color: #1a1a1a !important;
          color: #fff !important;
        }

        .rs-form-control input::placeholder {
          color: #aaa !important;
        }

        /* Tablet */
        @media (max-width: 992px) {
          .login-wrapper {
            flex-direction: column;
          }
          .login-left {
            height: 250px;
          }
          .login-right {
            padding: 30px 20px;
          }
        }

        /* Mobile */
        @media (max-width: 600px) {
          .overlay h2 {
            font-size: 1.6rem;
          }
          .overlay p {
            font-size: 0.9rem;
          }
          .login-right {
            padding: 20px;
          }
        }
      `}</style>
    </Container>
  );
}
