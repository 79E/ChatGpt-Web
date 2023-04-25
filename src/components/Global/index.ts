import useStore from '@/store'
import { fetchUserInfo } from '@/store/async';
import { useEffect } from 'react'

type Props = {
    children: React.ReactElement
}

function Global(props: Props){

    const { token, chats, addChat, changeSelectChatId } = useStore();

    useEffect(()=>{
        if(chats.length <= 0){
            addChat()
        }else{
            const id = chats[0].id;
            changeSelectChatId(id)
        }
        if(token){
            fetchUserInfo();
        }
    },[])

    return props.children
}

export default Global
