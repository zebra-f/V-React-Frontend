import { jwtDecode } from "jwt-decode";

function getUserId(accessToken: string) {
    const decoded = jwtDecode(accessToken);
    if ('user_id' in decoded) {
        return decoded.user_id
    }
}

export default { getUserId }