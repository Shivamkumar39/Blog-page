let months = ["January", "February", "Aril", 'March', "May", 'June', 'July', 'August', 'September', 'October', 'November', 'December']

let days = ['sunday', 'monday','tuesday', 'wednesday', 'thrusday', 'friday', 'saturady']

export const getDay = (timestamp) => {
    let date = new Date(timestamp)

    return `${date.getDate()} ${months[date.getMonth()]}`
}

export const getFullDay = (timestamp) =>{
    let date = new Date(timestamp)

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}