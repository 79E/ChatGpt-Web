import store from '.'
import { getUserInfo, postLogin } from '@/request/api'
import { RequestLoginParams } from '@/types'

export async function fetchLogin (params: RequestLoginParams) {
    const response = await postLogin(params);
    if(!response.status){
        store.getState().login({ ...response.data });
    }
    return response;
}

export async function fetchUserInfo () {
    const response = await getUserInfo();
    if(!response.status){
        store.getState().login({
            token: store.getState().token,
            user_detail: response.data
        });
    }
    return response;
}
