import axios from "axios"
import { HOST } from '@env'

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
    const { todayNumber } = getDaysNumber(startDay)

    const round = Math.ceil((todayNumber) / days)
    return round
    
}

function daysToMyRound(round, startDay, days) {
    const { todayNumber } = getDaysNumber(startDay)
    const myDay = ((round) * days) - todayNumber
    // console.log(todayNumber)
    return myDay
}

async function getRoundDetails() {
    try {
        const result = await axios.get(`http://${HOST}:3000/getRoundDetails`)
        return result.data
    }catch(err) {
        console.log(err)
        return {fail: "REQUEST FAILED"}
    }
}

async function getUsers() {
    try {
        const result = await axios.get(`http://${HOST}:3000/getUsers`)
        return result.data
    }catch(err) {
        console.log(err)
        return {fail: "REQUEST FAILED"}
    }
}

async function updateUsers(notUpdated, amount) {
    try {
        const result = await axios.post(`http://${HOST}:3000/updateUsers`, { notUpdated, amount })  
        const data = result.data.success || null
        return data   
    }catch(err) {
        console.log(err)
        return null
    }
}

async function getUser(username) {
    try {
        const result = await axios.get(`http://${HOST}:3000/getUser/${username}`,)
        return result.data
    }catch(err) {
        console.log("An error occurred")
        return {fail: "REQUEST FAILED"}
    }
}

async function verifyUser(username, password) {
    try {
        const result = await axios.post(`http://${HOST}:3000/verifyUser`, { username, password })
        return result.data
    }catch(err) {
        console.log("An error occurred")
        return {fail: "REQUEST FAILED"}
    }
}

export { getRoundPerson, daysToMyRound, getDaysNumber, getRoundDetails, getUsers, updateUsers, getUser, verifyUser }