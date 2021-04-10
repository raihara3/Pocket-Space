import { parssePainter, Painter } from '../../threeComponents/Mesh'
import AudioMedia from '../AudioMedia'

export const receiveMessagingHandler = async(socket: SocketIOClient.Socket, scene: THREE.Scene, audioMedia: AudioMedia, setMemberList: (list: any) => void) => {
  const peerList = {}

  socket.on('addUser', async({ newEntryID, userName, memberList }) => {
    console.log(`join: ${newEntryID}, userName: ${userName}`)
    setMemberList(memberList)

    if(!audioMedia.stream) return
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.test.com:19000' }]
    })
    const audioTrack = audioMedia.getTrack
    if(!audioTrack) return
    peerConnection.addTrack(audioTrack, audioMedia.stream)
    peerConnection.ontrack = async(event) => {
      const video = document.getElementById(newEntryID) as HTMLVideoElement
      video.srcObject = event.streams[0]
      await video.play()
    }
    peerConnection.onicecandidate = ({candidate}) => {
      if(!candidate) return
      sendIceCandidate(socket, newEntryID, candidate)
    }
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    peerList[newEntryID] = peerConnection
    sendPeerOfferHandler(socket, newEntryID, offer)
  })

  socket.on('join', ({ myID, userName, memberList }) => {
    setMemberList(memberList)
    console.log(`myID: ${myID}, userName: ${userName}`)
  })

  socket.on('getMesh', (data) => {
    try {
      parssePainter(scene, data)
    } catch (e) {
      console.error('Faild to synchronize scene', e)
    }
  })

  socket.on('getOffer', async ({senderID, sdp}) => {
    if(!audioMedia.stream) return
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.test.com:19000' }]
    })
    const audioTrack = audioMedia.getTrack
    if(!audioTrack) return
    peerConnection.addTrack(audioTrack, audioMedia.stream)
    peerConnection.ontrack = async(event) => {
      const video = document.getElementById(senderID) as HTMLVideoElement
      video.srcObject = event.streams[0]
      await video.play()
    }
    peerConnection.onicecandidate = ({candidate}) => {
      if(!candidate) return
      sendIceCandidate(socket, senderID, candidate)
    }
    peerConnection.setRemoteDescription(sdp)
    const answer = await peerConnection.createAnswer()
    peerConnection.setLocalDescription(answer)
    peerList[senderID] = peerConnection

    sendPeerAnswerHandler(socket, senderID, answer)
  })

  socket.on('getAnswer', async ({senderID, sdp}) => {
    const peerConnection: RTCPeerConnection = peerList[senderID]
    peerConnection.setRemoteDescription(sdp)
    peerList[senderID] = peerConnection
  })

  socket.on('getIceCandidate', async({senderID, ice}) => {
    const peerConnection: RTCPeerConnection = peerList[senderID]
    await peerConnection?.addIceCandidate(new RTCIceCandidate(ice))
  })

  socket.on('leaveUser', ({ id, memberList}) => {
    setMemberList(memberList)
    delete peerList[id]
  })

  socket.on('disconnect', () => {
    console.log('disconnect!!')
  })
}

export const sendMeshHandler = (socket: SocketIOClient.Socket, data: Painter) => {
  socket.emit('sendMesh', data)
}

export const sendPeerOfferHandler = (socket: SocketIOClient.Socket, targetID: string, offer: RTCSessionDescriptionInit) => {
  socket.emit('sendPeerOffer', {
    targetID: targetID,
    senderID: socket.id,
    sdp: offer
  })
}

export const sendPeerAnswerHandler = async(socket: SocketIOClient.Socket, targetID: string, answer: RTCSessionDescriptionInit) => {
  socket.emit('sendPeerAnswer', {
    targetID: targetID,
    senderID: socket.id,
    sdp: answer
  })
}

export const sendIceCandidate = (socket: SocketIOClient.Socket, targetID: string, ice: any) => {
  socket.emit('sendIceCandidate', {
    targetID: targetID,
    senderID: socket.id,
    ice: ice
  })
}
