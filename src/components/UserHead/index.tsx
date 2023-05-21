function UserHead({ nickname, headimgurl }: {
    nickname: string,
    headimgurl: string
}) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center'
        }}
        >
            <img style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                marginRight: 12
            }} src={headimgurl} alt=""
            />
            <a>{nickname}</a>
        </div>
    )
}

export default UserHead;