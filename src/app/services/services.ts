const BASE_URL = "https://review-un6v.onrender.com/"; // "http://localhost:8000/";

export const ANDROID = {
    app: BASE_URL + "android/app",
    review: BASE_URL + "android/review",
    search: BASE_URL + "android/search",
    sentiment: BASE_URL + "android/sentiment"
};
export const IOS = {
    app: BASE_URL + "ios/app",
    review: BASE_URL + "ios/review",
    rating: BASE_URL + "ios/rating",
    search: BASE_URL + "ios/search",
    sentiment: BASE_URL + "ios/sentiment",
    insertRatings: BASE_URL + "ios/insert/ratings"
};
export const DATA = {
    saveApps: BASE_URL + "save-apps",
    sendEmail: BASE_URL + "mail/send",
    history: BASE_URL + "ratings/history"
}
export const AI = {
    summary: BASE_URL + "get/summary",
    summaryV2: BASE_URL + "get/v2/summary",
    initiateChat: BASE_URL + "get/initiate-chat",
    chat: BASE_URL + "get/chat"
}

export interface IOS_INSERT_RATING {
    appId: string,
    score: string
    ratingsCount: number,
    appData: any
} 