'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { LikeDetails } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';
import Post from './post';
import PostVotes from './post-votes';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"



interface VoteProps {
  post_id: number;
  user_id: string | undefined;
}

interface PostVoteList {  
  username: string;
  vote_type: string;
}

const Vote: React.FC<VoteProps> = ({ post_id, user_id }) => {
  const [currentVote, setCurrentVote] = useState<"upvote" | "downvote" | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"upvote" | "downvote" | null>(null);
  const [ votesList, setVotesList ] = useState<PostVoteList[]>([]);


  const likeListRef = React.useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!user_id) return;

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

  // const fetchUpvote = async (post_id: number) => {
      
  // }

  useEffect(() => {
    fetchVotesList(post_id);
  }, [])

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
      setAlertMessage(response.data.message);
      setAlertType(voteType);
    } catch (error) {
      console.error(`Error ${voteType}ing:`, error);
    }
  };

  const upvote = () => vote("upvote");
  const downvote = () => vote("downvote");

  const [ activeMenu, setActiveMenu ] = React.useState<string>('');

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
  }
  const getTriggerClass = (menu: string) => {
    return activeMenu === menu ? 'bg-accent' : '';
  };

  const fetchVotesList = async (post_id: number) => {
    const response = await axios.get<PostVoteList>(`${process.env.NEXT_PUBLIC_URL}php/vote.php`, {
      params: {
        operation: 'fetchPostVoteList',
        json: JSON.stringify({ post_id: post_id })
      }
    });
    console.log(response.data)

    const List: PostVoteList[] = Array.isArray(response.data) ? response.data.map((votes) => ({
      username: votes.username,
      vote_type: votes.vote_type
    })) : [];
    setVotesList(List);

  }


  return (
    <>
      <div className="w-full flex items-center">
        <Button 
          onClick={upvote} 
          variant={'secondary'}
          className={`hover:text-primary-foreground text-lg ${currentVote === "upvote" ? "text-amber-400" : ""}`}>
          ▲ <span className='text-xs'>Upvote</span>
        </Button>
        <Button 
          onClick={downvote} 
          variant={'secondary'}
          className={`hover:text-primary-foreground text-lg ${currentVote === "downvote" ? "text-violet-500 " : ""}`}>
          ▼ <span className='text-xs'>Downvote</span>
        </Button>
        <PostVotes onClick={() => likeListRef.current?.click()} post_id={post_id} />
      </div>
      {/* {alertMessage && alertType && (
        <Alert className="z-50">
          <Terminal className="h-4 w-4" />
          <AlertTitle className="text-alert">Heads up!</AlertTitle>
          <AlertDescription className="text-alert">
            {alertType === 'upvote' ? 'You have upvoted!' : 'You have downvoted!'} {alertMessage}
          </AlertDescription>
        </Alert>
      )} */}
      
      <AlertDialog>
        <AlertDialogTrigger ref={likeListRef} className='hidden'>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader >
            <AlertDialogTitle className='flex h-[5vh] justify-start items-center space-x-4'>
              <span>Votes</span>
              <Menubar>
              <MenubarMenu>
                  <MenubarTrigger className={getTriggerClass('all')} onClick={() => handleMenuClick('all')}>All</MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger className={getTriggerClass('upvote')} onClick={() => handleMenuClick('upvote')}>Upvotes</MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger className={getTriggerClass('downvote')} onClick={() => handleMenuClick('downvote')}>Downvotes</MenubarTrigger>
                </MenubarMenu>
              </Menubar>
            </AlertDialogTitle>
            <AlertDialogDescription className='my-[1vh]'>
              { activeMenu == 'all' && votesList.map((vote) => 
                <div className='w-full border border-black'>
                  <div className='flex space-x-4 '>
                    <Avatar>
                      <AvatarImage src={'/assets/gif/cat-nyan-cat.gif'} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  );
}

export default Vote;