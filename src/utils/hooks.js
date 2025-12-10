export const GetCurrentUser = () => {
    const user = localStorage.getItem("current_user")
    if (user) {
        const user_info = JSON.parse(user)
        const { user_data } = user_info
        return user_data
    }else{
        return null
    }
}

export const local_url = "http://localhost:3000"
export const production_url = "http://localhost:3000"