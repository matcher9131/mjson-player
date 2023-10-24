type ControlPanelPresenterProps = {
    readonly onNextClicked: () => void;
    readonly onPreviousClicked: () => void;
    readonly onNextGameClicked: () => void;
    readonly onPreviousGameClicked: () => void;
};

const ControlPanelPresenter = ({
    onNextClicked,
    onPreviousClicked,
    onNextGameClicked,
    onPreviousGameClicked,
}: ControlPanelPresenterProps) => {
    return (
        <div className="grid grid-cols-2">
            <button className="bg-gray-800 text-white rounded" onClick={onPreviousClicked}>
                ←
            </button>
            <button className="bg-gray-800 text-white rounded" onClick={onNextClicked}>
                →
            </button>
            <button className="bg-gray-800 text-white rounded" onClick={onPreviousGameClicked}>
                ←←
            </button>
            <button className="bg-gray-800 text-white rounded" onClick={onNextGameClicked}>
                →→
            </button>
        </div>
    );
};

export default ControlPanelPresenter;
