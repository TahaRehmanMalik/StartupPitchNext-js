import { client } from '@/sanity/lib/client'
import { STARTUPS_BY_AUTHOR_QUERY } from '@/sanity/lib/queries'
import React from 'react'
import StartupCard, { StartupTypeCard } from './StartupCard';

const UserStartups = async({id}:{id:string}) => {
    const startups=await client.fetch(STARTUPS_BY_AUTHOR_QUERY,{id});

  return (
    <div>
    {startups.length>0?(
      startups.map((startup:StartupTypeCard)=>(
        <StartupCard key={startup._id} post={startup}/>
      ))
    ):(
        <p className='no-result'>No Post yet</p>
    )}
    </div>
  )
}

export default UserStartups
