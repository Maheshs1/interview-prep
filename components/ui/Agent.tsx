'use client'

import { Button } from '@/components/ui/button';
import { vapi } from '@/lib/vapi.sdk';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED'
}

interface SavedMessage {
  role: 'user' | 'system' | 'assistant',
  content: string;
}
const Agent = ({ userId }) => {
  console.log({ userId });
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([{
    role: 'user', content: 'Hiii theree!!!'
  }]);
  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onSpeakingStart = () => setIsSpeaking(true);
    const onSpeakingEnd = () => setIsSpeaking(false);

    const onMessage = (message: Message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        setMessages((prevMessages) => ([...prevMessages, { role: message.role, content: message.transcript }]))
      }
    }

    const onError = (e) => { console.log(e) }

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeakingStart);
    vapi.on('speech-end', onSpeakingEnd);
    vapi.on('error', onError);
    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeakingStart);
      vapi.off('speech-end', onSpeakingEnd);
      vapi.off('error', onError);
    }
  }, []);

  useEffect(() => {
    console.log("Call Finished");
    if (callStatus === CallStatus.FINISHED) {

      router.replace('/');
    }
  }, [callStatus, messages, router])

  const handleCallStart = async () => {
    setCallStatus(CallStatus.CONNECTING);

    await vapi.start(null, null, null, process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
      variableValues: {
        userId
      }
    });
  }

  const handleCallEnd = async () => {
    setCallStatus(CallStatus.FINISHED);
    await vapi.stop();
  }

  const callInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;
  console.log({ callStatus, callInactiveOrFinished })

  return (
    <div>
      <h1 className='text-3xl mb-8'>Let's Start the Interview</h1>
      <section className='flex gap-8'>
        <div className='relative w-96 h-96 bg-gray-800 flex-1 rounded flex justify-center items-center'>
          {isSpeaking && <Wave />}
          <Image src='/logo.svg' alt='logo' width={72} height={72} />
        </div>
        <div className='h-96 aspect-square bg-amber-100 flex-1 rounded flex justify-center items-center'>
          {/* {isAISpeaking === 'human' && <Wave />} */}
          <h1 className='text-amber-900 font-bold text-7xl relative z-20'>
            MS</h1>
        </div>
      </section>

      {callInactiveOrFinished || callStatus === CallStatus.ACTIVE ?
        <Button className={`${callInactiveOrFinished ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} box-content block m-4 mx-auto rounded p-1 px-5 text-white  cursor-pointer`} onClick={callInactiveOrFinished ? handleCallStart : handleCallEnd}>{callInactiveOrFinished ? 'Start ' : 'End '}
          Call</Button>
        : '...'}
      {/* <Button className='bg-red-500 rounded p-5 text-white'>End Call</Button> */}
      <div className='my-8 space-y-0.5'>
        {messages.map((message, index) => {
          return <p key={index} className='text-base '><span className='font-semibold'>{message.role}</span>: {message.content}</p>
        })}
      </div>
    </div>
  )
}

const Wave = () => {
  return <>
    <div className='rounded-full z-10 absolute bg-amber-200 w-72 h-72 animate-pulse animate-wave'></div>
    <div className='rounded-full z-10 absolute bg-amber-400 w-36 h-36 animate-pulse animate-wave'></div>
  </>
}

export default Agent;