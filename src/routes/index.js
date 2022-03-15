import { Routes, Route } from "react-router-dom";
import Config from "../containers/Config"
import ConfigList from "../containers/ConfigList"

const MainRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ConfigList />} exact />
            <Route path="/update-config" element={<Config />} exact />
        </Routes>
    )
}

export default MainRoutes;