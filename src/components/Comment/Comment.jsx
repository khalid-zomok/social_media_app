import { CardFooter } from '@heroui/react'
import React from 'react'
import { CardHeader } from '@heroui/react';
export default function Comment({topComment , PLACE_HOLDER_IMAGE}) {
  return (
    <CardFooter>
         <CardHeader className="flex gap-3">
          <img
            alt="heroui logo"
            height={40}
            radius="sm"
            src={topComment?.commentCreator?.photo || PLACE_HOLDER_IMAGE}
            width={40}
            onError={(e)=> {e.target.src=PLACE_HOLDER_IMAGE}}
          />
          <div className="flex flex-col">
            <p className="text-md">{topComment?.commentCreator?.name}</p>
            <p className="text-small text-default-500 break-all whitespace-normal overflow-hidden">{topComment?.content}</p>
            {topComment.image && <img className='rounded-sm m-1 max-h-[100px]' src={topComment.image} /> }
          </div>
        </CardHeader>
        </CardFooter>
  )
}
