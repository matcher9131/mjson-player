import {
    //useGoToNextGame,
    useGoToNextPosition,
    //useGoToPreviousGame,
    //useGoToPreviousPosition,
} from "../modules/positionState/operations";
import { useUpdateTileState } from "../modules/tileState/operation";
import ControlPanelPresenter from "./ControlPanelPresenter";

const ControlPanelContainer = () => {
    const updateTileState = useUpdateTileState();
    const goToNextPosition = useGoToNextPosition();
    const handlePreviousClicked = () => {}; // NOT IMPLEMENTED
    const handleNextClicked = () => {
        goToNextPosition();
        updateTileState();
    };
    const handlePreviousGameClicked = () => {}; // NOT IMPLEMENTED
    const handleNextGameClicked = () => {}; // NOT IMPLEMENTED
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
