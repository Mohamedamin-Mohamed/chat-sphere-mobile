import {Redirect} from "expo-router"
import {useSelector} from "react-redux";
import {RootState} from "../types/types";

const Index = () => {
    //here we should check for token instead but now lets just have it as placeholder
    const user = useSelector((state: RootState) => state.userInfo)
    if (user) {
        return <Redirect href="/chat"/>
    }
    return (
        <Redirect href="/Welcome"/>
    )
}

export default Index