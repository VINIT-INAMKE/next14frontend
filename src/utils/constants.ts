import UserData from "@/views/plugins/UserData";


export const API_BASE_URL: string = `https://web3lms.onrender.com/api/v1/`;
export const userId: number | undefined = UserData()?.user_id;
export const PAYPAL_CLIENT_ID: string = "test";
export const teacherId: number | undefined = UserData()?.teacher_id; 