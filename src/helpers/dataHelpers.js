export const range = (start = 0, end = 0, increment = 1) => {
    let array = []
    if (!end) {
        for(let i = 0; i < start; i++) {
            array.push(i)
        }
    } else if (end !== 0) {
        for(let i = start; i < end; i++) {
            array.push(i)
        }
    }

    return array
}

export const last = (obj = [], getNumber = 1, getFromIndex = -1) => {
    if (obj.length === 0) return null
    if (getNumber === 1)
    return obj[obj.length - 1]
    else {
        let result = []
        let max = obj.length - 1
        for(let i = max; i > max - getNumber; i--) result.push(obj[i])
        if (getFromIndex >= 0) return result[getFromIndex]
        return result
    }
}

export const arrayToString = (array = []) => {
    let result = ""
    array.forEach((item) => result += item)
    return result
}