import React from 'react';
import axios from 'axios';
import { json } from 'stream/consumers';
import { Button } from '@/components/ui/button'


interface PostVotesProps {
  post_id: number;
  onClick: () => void;
}
const PostVotes: React.FC<PostVotesProps> = ({ post_id, onClick }) => {


  const [ votes, setVotes ] = React.useState<number>(0);
  
  React.useEffect(() => {
    const fetchLikes = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}php/posts.php`,{
        params: { operation: 'fetchLikes', 
          json: JSON.stringify({ post_id: post_id })
        }
      })
      console.log(response.data)
      const { upvote, downvote} = response.data;
      setVotes(upvote - downvote);
    }
    fetchLikes();
  }, [])
  return (
    <>
      <Button onClick={onClick} variant={'link'}>
        <span>{votes}</span>
      </Button>
    </>
  )
}

export default PostVotes