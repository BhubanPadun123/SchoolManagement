import React,{
    useEffect,
    useState,
    useMemo
} from "react"
import './home.css'
import {
    Container,
    Header,
    Footer,
    Content,
    FlexboxGrid,
    Text,
    Divider,
    List,
    IconButton
} from "rsuite"
import {Button} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { service_list,class_list } from "../utils"
import {
    useLazyGetInstitutionClassesQuery
} from "../Redux/actions/classSetup.action"
import {
    Loader
} from "../components/index"
import _ from "lodash"
import {
    ArrowRight
} from "@mui/icons-material"
import {
    Tooltip
} from "@mui/material"


export default function Home() {
    const navigate = useNavigate()
    const [getClassesAction,getClassesState] = useLazyGetInstitutionClassesQuery()
    useEffect(()=>{
        const checkUser=async()=>{
            const user = await localStorage.getItem("current_user")
            if(!user){
                navigate("/auth/login")
            }else{
                const userInfo = JSON.parse(user)
                const {user_data} = userInfo
                const user_platform = _.get(user_data,"meta_data.user_platform",null)
                user_platform && getClassesAction({
                    institution_ref:user_platform
                })
            }
        }
        checkUser()
    },[])
    const classList = useMemo(()=>{
        if(getClassesState.isSuccess){
            const list = _.get(getClassesState,"currentData.list",[])
            return list
        }else{
            return []
        }
    },[getClassesState])

    return (
        <Container>
            <Content className="show-grid">
                {
                    service_list.map((item, index) => {
                        return (
                            <div className="service__items" key={index}>
                                {item.icon}
                                <Text
                                    color="blue"
                                    style={{
                                        fontSize: "20px",
                                        textAlign: "center",
                                        margin: 0,
                                        padding: 0
                                    }}
                                >
                                    {item.title}
                                </Text>
                                {
                                    item.title === "Admission" && (
                                        <div>
                                            <Button
                                               onClick={()=> navigate(`${item.to}`)}
                                               size="small"
                                               variant="outlined"
                                            >
                                                Create Class
                                            </Button>
                                        </div>
                                    )
                                }
                                <div className="service__list_container">
                                    <List bordered>
                                        {
                                            (
                                                item.title === "Exam Admit Card" ||
                                                item.title === "Admission" ||
                                                item.title === "Class Subject's" ||
                                                item.title === "Exam Planning" ||
                                                item.title === "Monthly Fee" ||
                                                item.title === "Result Management"
                                            ) && Array.isArray(classList) && classList.length > 0 && 
                                            classList.map((ls,key)=> {
                                                return (
                                                    <List.Item key={key} style={{
                                                        display: "flex",
                                                        padding: 0,
                                                        margin: 0,
                                                        alignItems: 'center',
                                                        gap: "8px"
                                                    }}>
                                                        <Text>{key + 1} )</Text>
                                                        <Text>{ls.class_name}</Text>
                                                        <div style={{
                                                            flexGrow: 1
                                                        }} />
                                                        <IconButton
                                                            size="md"
                                                            style={{
                                                                padding: 0
                                                            }}
                                                            onClick={()=> navigate(`${item.to}`)}
                                                        >
                                                            <ArrowRight/>
                                                        </IconButton>
                                                    </List.Item>
                                                )
                                            })
                                        }
                                    </List>
                                </div>
                            </div>
                        )
                    })
                }
            </Content>
            {
                (
                    getClassesState.isLoading
                ) && (
                    <Loader show={true} />
                )
            }
            <Footer></Footer>
        </Container>
    )
}