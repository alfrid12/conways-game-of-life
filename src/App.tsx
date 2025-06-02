import { useEffect, useState } from 'react';
import { fieldWidthInCells, fieldHeightInCells } from './config';
import './App.css';

const App = () => {
    const [currentGrid, setCurrentGrid] = useState<boolean[][]>([]);
    const [selectingInitialConfig, setSelectingInitialConfig] = useState(true);
    const [runSimulation, setRunSimulation] = useState(false);
    const [startPatternSelectionGrid, setStartPatternSelectionGrid] = useState<boolean[][]>([]);

    useEffect(() => {
        const freshGrid = getFreshGrid();
        setStartPatternSelectionGrid(freshGrid);
    }, []);

    useEffect(() => {
        if (runSimulation) {
            const timer = setTimeout(() => stepForward(), 200);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [currentGrid]);

    const getFreshGrid = () => {
        const freshGrid: boolean[][] = [];

        for (let i = 0; i < fieldHeightInCells; i++) {
            const fieldRow: boolean[] = [];
            for (let j = 0; j < fieldWidthInCells; j++) {
                fieldRow.push(false);
            }
            freshGrid.push(fieldRow);
        }

        return freshGrid;
    };

    const stepForward = () => {
        const newGrid = getFreshGrid();
        const newLiveCells: { x: number, y: number }[] = [];

        currentGrid.forEach((gridRow, yIndex) => {
            gridRow.forEach((cellState, xIndex) => {
                const livingNeighborCount: number = getLivingNeighborCount(currentGrid, xIndex, yIndex);

                if (cellState) {
                    if (livingNeighborCount === 2 || livingNeighborCount === 3) {
                        newGrid[yIndex][xIndex] = true;
                        newLiveCells.push({ x: xIndex, y: yIndex });
                    }
                } else {
                    if (livingNeighborCount === 3) {
                        newGrid[yIndex][xIndex] = true;
                        newLiveCells.push({ x: xIndex, y: yIndex });
                    }
                }
            });
        });

        setCurrentGrid(newGrid);
    };

    const getLivingNeighborCount = (grid: boolean[][], x: number, y: number) => {
        const neighboringCellStates = [];

        // top left
        if (x > 0 && y > 0) {
            neighboringCellStates.push(grid[y - 1][x - 1]);
        }

        // top middle
        if (y > 0) {
            neighboringCellStates.push(grid[y - 1][x]);
        }

        // top right
        if (x < fieldWidthInCells - 1 && y > 0) {
            neighboringCellStates.push(grid[y - 1][x + 1]);
        }

        // middle right
        if (x < fieldWidthInCells - 1) {
            neighboringCellStates.push(grid[y][x + 1]);
        }

        // bottom right
        if (x < fieldWidthInCells - 1 && y < fieldHeightInCells - 1) {
            neighboringCellStates.push(grid[y + 1][x + 1]);
        }

        // bottom middle
        if (y < fieldHeightInCells - 1) {
            neighboringCellStates.push(grid[y + 1][x]);
        }

        // bottom left
        if (x > 0 && y < fieldHeightInCells - 1) {
            neighboringCellStates.push(grid[y + 1][x - 1]);
        }

        // middle left
        if (x > 0) {
            neighboringCellStates.push(grid[y][x - 1]);
        }

        return neighboringCellStates.filter(state => state === true).length;
    };

    const submitInitialConfig = () => {
        setCurrentGrid(startPatternSelectionGrid);
        setSelectingInitialConfig(false);
        setRunSimulation(true);
    };

    const selectInitialConfigCell = (x: number, y: number) => {
        if (selectingInitialConfig) {
            const updatedInitialConfigGrid = JSON.parse(JSON.stringify(startPatternSelectionGrid));
            updatedInitialConfigGrid[y][x] = !updatedInitialConfigGrid[y][x];
            setStartPatternSelectionGrid(updatedInitialConfigGrid);
        }
    };

    const reset = () => {
        setSelectingInitialConfig(true);
        setRunSimulation(false);
    };

    const clearSelection = () => {
        const freshGrid = getFreshGrid();
        setStartPatternSelectionGrid(freshGrid);
        setRunSimulation(false);
        setSelectingInitialConfig(true);
    };


    const emptySquareStyle = {
        height: "15px",
        width: "15px",
        border: "0.1em solid #555555",
        display: "inline-block"
    };

    const filledSquareStyle = {
        ...emptySquareStyle,
        backgroundColor: "#555555"
    };

    const getCurrentGridHtml = () => {
        return currentGrid.map((row, yIndex) => {
            return <div style={{ height: "15px" }}>
                {row.map((isCellAlive, xIndex) => {
                    return <div style={isCellAlive ? filledSquareStyle : emptySquareStyle} onClick={(event) => selectInitialConfigCell(xIndex, yIndex)}></div>;
                })}
            </div>;
        });
    };


    const getSelectionGridHtml = () => {
        return startPatternSelectionGrid.map((row, yIndex) => {
            return <div style={{ height: "15px" }}>
                {row.map((isCellAlive, xIndex) => {
                    return <div style={isCellAlive ? filledSquareStyle : emptySquareStyle} onClick={(event) => selectInitialConfigCell(xIndex, yIndex)}></div>;
                })}
            </div>;
        });
    };

    return (
        <div className="App">
            {selectingInitialConfig && getSelectionGridHtml()}
            {runSimulation && getCurrentGridHtml()}

            <button onClick={submitInitialConfig}>Start</button>
            <button onClick={reset}>Reset</button>
            <button onClick={clearSelection}>Clear</button>
        </div>
    );
}

export default App;
