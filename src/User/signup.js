import React, {
  useState,
  useMemo,
  useEffect
} from "react"
import { ICONS } from "../Images"
import {
  Container,
  Content,
  Panel,
  Form,
  Button,
  ButtonToolbar,
  Schema,
} from "rsuite"
import { useNavigate } from "react-router-dom"
import {
  useUserRegisterMutation
} from "../Redux/actions/user.action"
import {
  Loader,
  ToastMessage
} from "../components/index"

const { StringType } = Schema.Types;

export default function SignupPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState(null)
  const [userRegistrationAction, userRegisterState] = useUserRegisterMutation()


  const userRegisterStatus = useMemo(() => {
    if (userRegisterState.isSuccess) {
      return {
        show: true,
        message: userRegisterState.data.message,
        type: "success",
        redirect: "/auth/login"
      }
    }
    if (userRegisterState.isError) {
      return {
        show: true,
        message: userRegisterState.error.data?.detail,
        type: "error",
        redirect: null
      }
    }
  }, [userRegisterState])

  useEffect(() => {
    if (userRegisterStatus) {
      setStatus(userRegisterStatus)
    }
  }, [userRegisterStatus])

  const model = Schema.Model({
    firstname: StringType().isRequired("First Name is required."),
    email: StringType()
      .isEmail("Please enter a valid email.")
      .isRequired("Email is required."),
    password: StringType().isRequired("Password is required."),
  })

  const handleSubmit = (e) => {
    const data = {
      ...e,
      meta_data: {
        user_type: "user"
      }
    }
    userRegistrationAction(data)
  }

  return (
    <Container style={{ height: "100vh", overflow: "hidden" }}>
      <Content style={{ height: "100%" }}>
        <div className="signup-wrapper">
          {/* Left Image Section */}
          <div className="signup-left">
            <img src={ICONS.login_banner} alt="Signup" />
            <div className="overlay">
              <h2>Join Our Platform</h2>
              <p>Connect, grow, and achieve with us.</p>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="signup-right">
            <Panel
              header={<h3 style={{ textAlign: "center", color: "#fff" }}>Create Account</h3>}
              className="signup-panel"
            >
              <Form fluid model={model} onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.ControlLabel>First Name</Form.ControlLabel>
                  <Form.Control name="firstname" placeholder="Enter your first name" />
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>Last Name</Form.ControlLabel>
                  <Form.Control name="lastname" placeholder="Enter your last first name" />
                </Form.Group>

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
                      Sign Up
                    </Button>
                  </ButtonToolbar>
                </Form.Group>

                <p style={{ textAlign: "center", color: "#ddd", marginTop: "10px" }}>
                  Already have an account?{" "}
                  <a href="/login" style={{ color: "#4ea9ff" }}>
                    Login
                  </a>
                </p>
              </Form>
            </Panel>
          </div>
        </div>
        {
          (
            userRegisterState.isLoading
          ) && (
            <Loader show={true} />
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

        .signup-wrapper {
          display: flex;
          height: 100%;
          width: 100%;
          overflow: hidden;
        }

        .signup-left {
          flex: 2;
          position: relative;
          overflow: hidden;
        }

        .signup-left img {
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

        .signup-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0e0e0e;
          padding: 40px;
        }

        .signup-panel {
          width: 100%;
          max-width: 400px;
          background: transparent;
          color: #fff;
        }

        /* Input appearance fix for dark bg */
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
          .signup-wrapper {
            flex-direction: column;
          }
          .signup-left {
            height: 250px;
          }
          .signup-right {
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
          .signup-right {
            padding: 20px;
          }
        }
      `}</style>
    </Container>
  );
}
