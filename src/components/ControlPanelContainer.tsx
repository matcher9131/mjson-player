import {
    useGoToNextGame,
    useGoToNextPosition,
    useGoToPreviousGame,
    useGoToPreviousPosition,
} from "../modules/positionState/operations";
import { useUpdateTileState } from "../modules/tileState/operation";
import ControlPanelPresenter from "./ControlPanelPresenter";

const ControlPanelContainer = () => {
    const updateTileState = useUpdateTileState();
    const goToNextPosition = useGoToNextPosition();
    const goToPreviousPosition = useGoToPreviousPosition();
    const goToNextGame = useGoToNextGame();
    const goToPreviousGame = useGoToPreviousGame();
    const handlePreviousClicked = () => {
        goToPreviousPosition();
        updateTileState();
    };
    const handleNextClicked = () => {
        goToNextPosition();
        updateTileState();
    };
    const handlePreviousGameClicked = () => {
        goToNextGame();
        updateTileState();
    };
    const handleNextGameClicked = () => {
        goToPreviousGame();
        updateTileState();
    };
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
