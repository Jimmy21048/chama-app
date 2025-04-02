function getDaysNumber(startDay) {
    const today = new Date()
    const startOfYear = new Date(today.getFullYear(), 0, 0)
    const dayInMilliseconds = 1000 * 60 * 60 * 24

    //get the first round's day in the calender
    const startRoundDate = new Date(startDay)
    const startDayNumber = Math.floor((startRoundDate - startOfYear) / dayInMilliseconds)

    //get today's day number in the calender
    const diff = today - startRoundDate
    const todayNumber = Math.floor(diff/dayInMilliseconds)

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

export { getRoundPerson, daysToMyRound, getDaysNumber }