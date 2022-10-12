//@ts-ignore
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { Button } from "ui";
import Peer from "simple-peer";
import { socket } from "../utils/socket";
import useCallStore from "../store/callStore";

const Home: NextPage = () => {
  const {
    me,
    setMe,
    loading,
    setLoading,
    caller,
    setCaller,
    callerSignal,
    setCallerSignal,
    name,
    setName,
    callAccepted,
    setCallAccepted,
    setIdToCall,
    callEnded,
    setCallEnded,
    idToCall,
  } = useCallStore();
  const [stream, setStream] = useState<MediaStream>();
  const selfVideoRef: MutableRefObject<any> = useRef(null);
  const userVideoRef: MutableRefObject<any> = useRef(null);
  const connectionRef: any = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((selfMediaStream) => {
        setStream(selfMediaStream);
        if (selfVideoRef.current)
          selfVideoRef.current.srcObject = selfMediaStream;
      });

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("call", (data) => {
      setLoading(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id: any) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("call", {
        userToCall: id,
        socketData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (stream) => {
      if (userVideoRef.current) userVideoRef.current.srcObject = stream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    idToCall;
    peer.on("signal", (data) => {
      socket.emit("answer", {
        signal: data,
        to: caller,
      });
    });

    peer.on("stream", (stream) => {
      if (userVideoRef.current) userVideoRef.current.srcObject = stream;
    });

    // peer.signal()
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-slate-900 py-2 text-white'>
      <Head>
        <title>WebRTC Video and Chat</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='container w-full flex-col items-center justify-center text-center'>
        <div className='grid w-full grid-cols-2 gap-9 bg-black'>
          <div>
            {stream ? (
              <video
                className='rounded-xl'
                playsInline
                muted
                autoPlay
                ref={selfVideoRef}
              />
            ) : (
              <pre className='text-white'>
                {JSON.stringify(stream, null, 2)}
              </pre>
            )}
            <div>
              {!callAccepted && !callEnded && (
                <video
                  className='rounded-xl'
                  playsInline
                  muted
                  autoPlay
                  ref={userVideoRef}
                />
              )}
            </div>
          </div>
        </div>
        <input
          className='m-2 bg-slate-600 p-4'
          placeholder='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p className='text-white'>{me}</p>
        <input
          className='m-2 bg-slate-600 p-4'
          placeholder='idToCall'
          value={idToCall}
          onChange={(e) => setIdToCall(e.target.value)}
        />
        <div>
          {callAccepted && !callEnded ? (
            <button type='button' onClick={leaveCall}>
              endcall
            </button>
          ) : (
            <div>
              <button onClick={() => callUser(idToCall)}>Call</button>
            </div>
          )}
          {idToCall}
        </div>
        <div>
          {loading && !callAccepted && (
            <>
              <h6>{name} is calling</h6>
              <button onClick={answerCall}>Answer</button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
