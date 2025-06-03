import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { fieldWidthInCells, fieldHeightInCells, instructions } from './config';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [startPatternSelectionGrid, setStartPatternSelectionGrid] = useState<boolean[][]>([]);
    const [simulationGrid, setSimulationGrid] = useState<boolean[][]>([]);
    const [selectingInitialConfig, setSelectingInitialConfig] = useState<boolean>(true);
    const [runSimulation, setRunSimulation] = useState<boolean>(false);

    useEffect(() => {
        const emptyGrid: boolean[][] = getEmptyGrid();
        setStartPatternSelectionGrid(emptyGrid);
    }, []);

    useEffect(() => {
        if (runSimulation) {
            const timer = setTimeout(stepForward, 300);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [simulationGrid]);

    const getEmptyGrid = (): boolean[][] => {
        const emptyGrid: boolean[][] = [];

        for (let i = 0; i < fieldHeightInCells; i++) {
            const gridRow: boolean[] = [];
            for (let j = 0; j < fieldWidthInCells; j++) {
                gridRow.push(false);
            }
            emptyGrid.push(gridRow);
        }

        return emptyGrid;
    };

    const stepForward = () => {
        const newGrid: boolean[][] = getEmptyGrid();

        simulationGrid.forEach((gridRow, yIndex) => {
            gridRow.forEach((isCellAlive, xIndex) => {
                const livingNeighborCount: number = getLivingNeighborCount(simulationGrid, xIndex, yIndex);

                if (isCellAlive) {
                    if (livingNeighborCount === 2 || livingNeighborCount === 3) {
                        newGrid[yIndex][xIndex] = true;
                    }
                } else {
                    if (livingNeighborCount === 3) {
                        newGrid[yIndex][xIndex] = true;
                    }
                }
            });
        });

        setSimulationGrid(newGrid);
    };

    const getLivingNeighborCount = (grid: boolean[][], x: number, y: number): number => {
        const neighboringCellStates: boolean[] = [];

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

        const livingNeighborCount: number = neighboringCellStates.filter(isCellAlive => isCellAlive === true).length;
        return livingNeighborCount;
    };

    const startSimulation = () => {
        setSimulationGrid(startPatternSelectionGrid);
        setSelectingInitialConfig(false);
        setRunSimulation(true);
    };

    const reset = () => {
        setSelectingInitialConfig(true);
        setRunSimulation(false);
    };

    const clearSelection = () => {
        const emptyGrid: boolean[][] = getEmptyGrid();
        setStartPatternSelectionGrid(emptyGrid);
        setRunSimulation(false);
        setSelectingInitialConfig(true);
    };

    const renderSimulationGrid = () => {
        return simulationGrid.map((row) => {
            return <div className="cell-row">
                {row.map((isCellAlive) => {
                    return <div className={isCellAlive ? "cell live-cell" : "cell"}></div>;
                })}
            </div>;
        });
    };

    const renderSelectionGrid = () => {
        return startPatternSelectionGrid.map((row, yIndex) => {
            return <div className="cell-row">
                {row.map((isCellAlive, xIndex) => {
                    return <div className={isCellAlive ? "cell live-cell" : "cell"} onClick={(event) => selectInitialConfigCell(xIndex, yIndex)}></div>;
                })}
            </div>;
        });
    };

    const selectInitialConfigCell = (x: number, y: number) => {
        const updatedInitialConfigGrid = JSON.parse(JSON.stringify(startPatternSelectionGrid));
        updatedInitialConfigGrid[y][x] = !updatedInitialConfigGrid[y][x];
        setStartPatternSelectionGrid(updatedInitialConfigGrid);
    };

    return (
        <div className="app-container">
            <h2 className="page-title">Alex's Conway's Game of Life</h2>

            <div className="button-group-container">
                <ButtonGroup size="sm">
                    <Button onClick={startSimulation} variant="success" disabled={runSimulation}>Start</Button>
                    <Button onClick={reset} variant="success">Reset</Button>
                    <Button onClick={clearSelection} variant="success">Clear</Button>
                    <Button onClick={() => alert(instructions)} variant="success">Help</Button>
                </ButtonGroup>
            </div>

            <div className="grid-container">
                {selectingInitialConfig && renderSelectionGrid()}
                {runSimulation && renderSimulationGrid()}
            </div>
        </div>
    );
}

export default App;
