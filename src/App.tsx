import { RecoilRoot } from "recoil";
import "./App.css";
import { Suspense } from "react";
import BoardContainer from "./components/BoardContainer";
import ControlPanelContainer from "./components/ControlPanelContainer";

function App() {
    return (
        <RecoilRoot>
            <Suspense fallback={<div>Loading...</div>}>
                <div className="flex">
                    <BoardContainer />
                    <ControlPanelContainer />
                </div>
            </Suspense>
        </RecoilRoot>
    );
}

export default App;
