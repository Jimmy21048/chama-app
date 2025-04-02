function getDaysNumber(startDay) {
    const today = new Date()
    const startOfYear = new Date(today.getFullYear(), 0, 0)

    //get today's day number in the calender
    const diff = today - startOfYear
    const dayInMilliseconds = 1000 * 60 * 60 * 24
    const todayNumber = Math.floor(diff/dayInMilliseconds)

    //get the first round's day in the calender
    const startRoundDate = new Date(startDay)
    const startDayNumber = Math.floor((startRoundDate - startOfYear) / dayInMilliseconds)

    return { todayNumber, startDayNumber }
}

function getRoundPerson(days, startDay) {
    const { todayNumber, startDayNumber } = getDaysNumber(startDay)

    const round = Math.ceil((todayNumber - startDayNumber) / days)
    return round
    
}

function daysToMyRound(round, startDay, days) {
    const { todayNumber ,startDayNumber } = getDaysNumber(startDay)
    const myDay = (round * 30) + startDayNumber
    return myDay - days
}

export { getRoundPerson, daysToMyRound }