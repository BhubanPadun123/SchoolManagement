import React, {
  useState,
  useMemo,
  useEffect
} from "react";
import { ICONS } from "../Images";
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
  useUserLoginMutation
} from "../Redux/actions/user.action"
import {
  Loader,
  ToastMessage,
  ConfirmationAlert
} from "../components/index"

const { StringType } = Schema.Types

export default function LoginPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState(null)
  const [loginUserAction, loginUserSatate] = useUserLoginMutation()

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


  const model = Schema.Model({
    email: StringType()
      .isEmail("Please enter a valid email.")
      .isRequired("Email is required."),
    password: StringType().isRequired("Password is required."),
  })

  const handleSubmit = (e) => {
    loginUserAction(e)
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
                <Button appearance="subtle" block onClick={()=> {
                  localStorage.clear()
                  toaster.push(<Message type="success" >User logout successfull</Message>,{placement:"topCenter"})
                  navigate("/")
                }}>
                  Logout
                </Button>
              </Form>
            </Panel>
          </div>
        </div>
        {
          (
            loginUserSatate.isLoading
          ) && (
            <Loader
              show={true}
            />
          )
        }
        {
          status && (
            <ToastMessage
              {...status}
              onClose={() => {
                setStatus(null)
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
