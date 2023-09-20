import { createContext, useState, ReactNode, useReducer, useEffect } from "react";
import {Cycle, cyclesReducer} from '../reducers/cycles/reducers'
import { addNewCycleAction, interruputCurrentCycleAction, markCurrentCycleasFinishedAction } from "../reducers/cycles/action";
import { differenceInSeconds } from "date-fns";


interface CreateCycleData {
    task: string;
    minutesAmount: number
}


interface CyclesContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined;
    activeCycleid: string | null;
    amountSecondsPassed: number
    markCurrentCycleFinished: () => void
    setsecondsPassed: (seconds: number) =>  void
    createNewCycle: (data: CreateCycleData ) => void
    interruptCurrentCycle: () => void

}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: ReactNode;
}


export function CyclesContextProvider({
    children,
}:CyclesContextProviderProps) {

    const [cyclesState, dispatch] = useReducer(cyclesReducer, {
        cycles: [],
        activeCycleid: null,
    }, (initialState) => {
        const storeStateAsJSON = localStorage.getItem('@vite-project:cycles-state-1.0.0',
        )
        if (storeStateAsJSON) {
            return JSON.parse(storeStateAsJSON)
        }

        return initialState
    })

    const { cycles, activeCycleid} = cyclesState
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleid)

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
        if (activeCycle) {
            return differenceInSeconds(
                new Date(),
                new Date(activeCycle.startDate))
        }

        return 0
    })

useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@vite-project:cycles-state-1.0.0', stateJSON)
}, [cyclesState])





    function createNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime())

        const newCycle: Cycle = { 
            id,
            task: data.task,
            minutesAmount: Number(data.minutesAmount), 
            startDate: new Date(),
        }

        dispatch(addNewCycleAction(newCycle))

        setAmountSecondsPassed(0)


    }
    function interruptCurrentCycle() { 
        dispatch(interruputCurrentCycleAction())
    }

    function setsecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleFinished() {
        dispatch(markCurrentCycleasFinishedAction())

    }

    return (
        <CyclesContext.Provider 
        value={{
            cycles,
            activeCycle, 
            activeCycleid, 
            markCurrentCycleFinished,
            amountSecondsPassed,
            setsecondsPassed,
            createNewCycle,
            interruptCurrentCycle
        }}
    >
        {children}
        </CyclesContext.Provider>
    )

}