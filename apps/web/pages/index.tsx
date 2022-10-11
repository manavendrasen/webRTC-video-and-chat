import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { Button } from "ui";
import Peer from "simple-peer";
import { socket } from "../utils/socket";
import useCallStore from "../store/callStore";

const Home: NextPage = () => {
  const {
    setMe,
    setLoading,
    setCaller,
    setCallerSignal,
    setName,
    setCallAccepted,
    setIdToCall,
    setCallEnded,
  } = useCallStore();
  const [stream, setStream] = useState<MediaStream>();
  const selfVideoRef: MutableRefObject<any> = useRef(null);
  const joinerVideoRef = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    const func = async () => {
      const selfMediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      setStream(selfMediaStream);
      if (selfVideoRef.current) selfVideoRef.current.srcObject = stream;
    };
    func();

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

  // const call = (id) => {
  //   const peer = new Peer();
  // };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-slate-900 py-2'>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='container w-full items-center justify-center text-center'>
        <div className='grid w-full grid-cols-2 gap-9'>
          {stream && (
            <video
              className='w-full rounded-xl'
              playsInline
              muted
              autoPlay
              ref={selfVideoRef}
            />
          )}
        </div>
      </main>
    </div>
  );
};;

export default Home;
