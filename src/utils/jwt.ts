import { jwtDecode } from "jwt-decode";

function getUserId(accessToken: string): string {
    const decoded = jwtDecode(accessToken);
    if ('user_id' in decoded) {
        return String(decoded.user_id)
    } else {
        return ''
    }
}

export default { getUserId }