import * as React from 'react'
import Cards from '../Cards'
import Navbars from '../Navbars'

export const App = () => {
    return (
        <>
            <Navbars
                brand="CloudTube"
                profileImg="https://media-exp1.licdn.com/dms/image/C5603AQFv-FCmCMxTig/profile-displayphoto-shrink_100_100/0/1517777420741?e=1622073600&v=beta&t=w7CPW75tpBqzo9r-chnBKpFGZ9kwFuTqrBDJNrcQbq4"
            />
            <Cards
                title="Introducing the CloudTube"
                channel="Clark Chen"
                date="3/25/2021"
                description="This is a introduction video for CloudTube provided by CloudVOD Team"
                channelProfileImg="https://media-exp1.licdn.com/dms/image/C5603AQFv-FCmCMxTig/profile-displayphoto-shrink_100_100/0/1517777420741?e=1622073600&v=beta&t=w7CPW75tpBqzo9r-chnBKpFGZ9kwFuTqrBDJNrcQbq4"
                thumbnail="https://raw.githubusercontent.com/jigar288/CloudVOD/master/resources/azure-cloud-vod-architecture-diagram.png?token=ACHQJYBWMHJQ7IK3XPDKYCDAM2MNM"
            />
        </>
    )
}
