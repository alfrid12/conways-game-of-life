import { useEffect, useState } from 'react';
import { fieldWidthInCells, fieldHeightInCells } from './config';
import './App.css';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import 'bootstrap/dist/css/bootstrap.min.css';

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

    const getSimulationGrid = () => {
        return currentGrid.map((row, yIndex) => {
            return <div className="cell-row">
                {row.map((isCellAlive, xIndex) => {
                    return <div className={isCellAlive ? "cell live-cell" : "cell"} onClick={(event) => selectInitialConfigCell(xIndex, yIndex)}></div>;
                })}
            </div>;
        });
    };


    const getSelectionGridHtml = () => {
        return startPatternSelectionGrid.map((row, yIndex) => {
            return <div className="cell-row">
                {row.map((isCellAlive, xIndex) => {
                    return <div className={isCellAlive ? "cell live-cell" : "cell"} onClick={(event) => selectInitialConfigCell(xIndex, yIndex)}></div>;
                })}
            </div>;
        });
    };

    return (
        <div className="app-container">
            <h2 className="page-title">Alex's Conway's Game of Life</h2>
            <div className="button-group-container">
                <ButtonGroup size="sm" aria-label="Basic example">
                    <Button onClick={submitInitialConfig} variant="success">Start</Button>
                    <Button onClick={reset} variant="success">Reset</Button>
                    <Button onClick={clearSelection} variant="success">Clear</Button>
                </ButtonGroup>
            </div>
            <div className="grid-container">
                {selectingInitialConfig && getSelectionGridHtml()}
                {runSimulation && getSimulationGrid()}
            </div>

        </div>
    );
}

export default App;

// readme