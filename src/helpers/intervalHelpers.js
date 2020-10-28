import { checkEatBody } from "./pathFindingHelper"

export const runningProcessStep = (
    dataNode = [], 
    log = () => {}, 
    onDone = () => {},
    setDefault = () => {}, 
    stepInterval = [], 
    setDataNode = (newData, oldData) => {},
    setNodePosition = () => {},
    timerInterval = 300, 
) => {
    let interval 
    interval = setInterval(() => {
        if (!stepInterval || stepInterval.length === 0) {
            clearInterval(interval)
            return
        }
        const [ movingNext ] = stepInterval
        stepInterval.shift()
        if (movingNext) {
            dataNode = setDataNode(movingNext, dataNode)
            setNodePosition([...dataNode])
            if (checkEatBody(dataNode)) {
                clearInterval(interval)
                setDefault()
            }
        }

        if (stepInterval.length === 0) {
            clearInterval(interval)
            setDefault()
            onDone()
        }
    }, timerInterval)
}