import { commonAPI } from "./commonAPI"
import SERVER_URL from "./server"

export const loginAPI = async(reqBody) => {
    // console.log("first",reqBody)
    return await commonAPI("POST",`${SERVER_URL}/api/login`,reqBody)
}

export const registerAPI = async(reqBody) => {
    return await commonAPI("POST",`${SERVER_URL}/api/register`,reqBody)
}
export const getAllUsersAPI = async(userId) => {
    // console.log(userId)
    return await commonAPI("GET",`${SERVER_URL}/api/users/${userId}`)
}

export const sendMessageAPI = async(reqBody) => {
    return await commonAPI("POST",`${SERVER_URL}/api/messages`,reqBody)
}

export const getMessagesAPI = async(room) => {
    return await commonAPI("GET",`${SERVER_URL}/api/messages/${room}`)
}
