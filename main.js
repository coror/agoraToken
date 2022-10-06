const {RtcTokenBuilder, RtcRole} = require('agora-access-token');

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

Parse.Cloud.define("getAgoraToken", async (req) => {
    
    const channelName = req.params.channel;

    if (!channelName) {
        return "{'error': 'channel is required'}"
    }

    let uid = req.params.uid;

    if (!uid || uid === '') {
        return "{'error': 'uid is required'}"
    }

    let role;
    
    if (req.params.role === 'publisher') {
        role = RtcRole.PUBLISHER
    } else if (req.params.role === 'audience') {
        role = RtcRole.SUBSCRIBER
    } else {
        return "{ 'error': 'role is incorrect' }"
    }

    let expireTime = 3600
    
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;

    let token;
    if (req.params.tokentype === 'userAccount') {
        token = RtcTokenBuilder.buildTokenWithAccount(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    } else if (req.params.tokentype === 'uid') {
        token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    } else {
        return "{ 'error': 'token type is invalid' }"
    }

    return `{ 'rtcToken': ${token} }`
})