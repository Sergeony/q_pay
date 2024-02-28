import { Link, Route, Routes } from "react-router-dom";

import "./styles/index.scss";
import { A } from "components/A";
import {useTheme} from "./providers/ThemeProvider";
import {classNames} from "shared/lib/classNames/classNames";


const App = () => {
    const {theme, toggleTheme} = useTheme();

    return (
        <div className={classNames("app", {}, [theme])}>
            <div style={{display: "flex"}}>
                <Link to={"/about/"}>About</Link>
                <Link to={"/main/"}>Main</Link>
            </div>
            <Routes>
                <Route path="/about/" element={<A/>}></Route>
                <Route path="/main/" element={<A/>}></Route>
            </Routes>
            <div onClick={toggleTheme}>Toggle</div>
        </div>
    );
};

export default App;
