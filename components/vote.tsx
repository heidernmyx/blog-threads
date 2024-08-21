import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { LikeDetails } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from 'lucide-react';

interface VoteProps {
  post_id: number;
  user_id: string | undefined;
}

const Vote: React.FC<VoteProps> = ({ post_id, user_id }) => {
  const [currentVote, setCurrentVote] = useState<"upvote" | "downvote" | null>(null);

  useEffect(() => {
    if (!user_id) return;

    // Fetch the current vote from the backend
    const fetchUserVote = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}php/vote.php`, {
          params: {
            operation: 'getVote',
            post_id,
            user_id
          }
        });

        // Assuming the API returns the vote type (e.g., "upvote", "downvote", or null)
        setCurrentVote(response.data.vote_type);
      } catch (error) {
        console.error('Error fetching user vote:', error);
      }
    };

    fetchUserVote();
  }, [post_id, user_id]);

  const vote = async (voteType: "upvote" | "downvote") => {
    if (!user_id) return;

    const operation = voteType === "upvote" ? "upvote" : "downvote";
    const url = `${process.env.NEXT_PUBLIC_URL}php/vote.php`;
    const likeDetails: LikeDetails = {
      post_id: post_id.toString(),
      user_id: user_id
    };
    const formData = new FormData();
    formData.append('operation', operation);
    formData.append('json', JSON.stringify(likeDetails));

    try {
      const response = await axios({
        url: url,
        method: 'POST',
        data: formData
      });
      setCurrentVote(voteType);
      console.log(response.data);
    } catch (error) {
      // console.error(`Error ${voteType}ing:`, error);
    }
  };

  const upvote = () => vote("upvote");
  const downvote = () => vote("downvote");

  return (
    <>
      <div className="w-full flex items-center">
        <Button 
          onClick={upvote} 
          variant={'secondary'}
          className={`hover:text-primary-foreground ${currentVote === "upvote" ? "text-primary" : ""}`}>
          ▲ <span className='text-xs'>Upvote</span>
        </Button>
        <Button 
          onClick={downvote} 
          variant={'secondary'}
          className={`hover:text-primary-foreground ${currentVote === "downvote" ? "text-primary" : ""}`}>
          ▼ <span className='text-xs'>Downvote</span>
        </Button>
        <p className="text-sm text-muted-foreground">123</p> {/* Replace 123 with actual vote count if available */}
      </div>
    </>
  );
}

export default Vote;
