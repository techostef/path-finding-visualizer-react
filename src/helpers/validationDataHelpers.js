export const isEqualObject = (object1, object2) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
  
    if (keys1.length !== keys2.length) return false;
  
    for (let key of keys1)
      if (object1[key] !== object2[key]) return false;
  
    return true;
}

export const isEqualArrayOfObject = (array1, array2) => {
    if (array1.length !== array2) return false

    for(let i = 0; i < array1.length; i++) 
        if (!isEqualObject(array1[i], array2[i])) return false

    return true
}