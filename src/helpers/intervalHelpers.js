import { checkEatBody } from "./gameSnakeHelpers"

export const runningProcessStep = (
    data = {}, 
    dataNode = [], 
    log = () => {}, 
    onDone = () => {},
    setDefault = () => {}, 
    step = [], 
    setDataNode = () => {},
    setNodePosition = () => {},
    timerInterval = 300, 
) => {
    let interval 
    interval = setInterval(() => {
        if (data.startGame === false) {
            clearInterval(interval)
            setDefault()
            log()
            return 

        }
        const [ movingNext ] = step
        step.shift()

        if (movingNext) {
            dataNode = setDataNode(movingNext, dataNode)
            setNodePosition([...dataNode])
            if (checkEatBody(dataNode)) {
                clearInterval(interval)
                setDefault()
            }
        }

        if (step.length === 0) {
            clearInterval(interval)
            setDefault()
            onDone()
        }
    }, timerInterval)
}