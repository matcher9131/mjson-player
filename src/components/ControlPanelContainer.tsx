import {
    useGoToNextGame,
    useGoToNextPosition,
    useGoToPreviousGame,
    useGoToPreviousPosition,
} from "../modules/positionState/operations";
import ControlPanelPresenter from "./ControlPanelPresenter";

const ControlPanelContainer = () => {
    const handlePreviousClicked = useGoToPreviousPosition();
    const handleNextClicked = useGoToNextPosition();
    const handlePreviousGameClicked = useGoToPreviousGame();
    const handleNextGameClicked = useGoToNextGame();
    return (
        <ControlPanelPresenter
            onPreviousClicked={handlePreviousClicked}
            onNextClicked={handleNextClicked}
            onPreviousGameClicked={handlePreviousGameClicked}
            onNextGameClicked={handleNextGameClicked}
        />
    );
};

export default ControlPanelContainer;
