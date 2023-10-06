import { RecoilRoot } from "recoil";
import "./App.css";
import { Suspense } from "react";

function App() {
    return (
        <RecoilRoot>
            <Suspense fallback={<div>Loading...</div>}>
                <div>foo</div>
            </Suspense>
        </RecoilRoot>
    );
}

export default App;
