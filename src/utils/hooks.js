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