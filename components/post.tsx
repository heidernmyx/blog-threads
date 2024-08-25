import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Import your Button and Input components
import { Input } from "@/components/ui/input";
import { cn, PostProps, CommentProps, CommentDetails } from "@/lib/utils";
import Image from 'next/image';
import axios from 'axios';
import { returnSession } from '../app/api/auth/getsession/route';
import type { User } from 'next-auth';
import Vote from './vote';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { usePathname } from 'next/navigation';

const Post = () => {

  const [ session, setSession ] = React.useState<User>();
  const pathname = usePathname();
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
  const [ comment, setComment ] = useState<string>('');
  const [ sessionFetched, setSessionFetched ] = useState(false);


  useEffect(() => {
    fetchSession();
    console.log(pathname)
    if (pathname == '/dashboard/liked-posts' && sessionFetched) {
      console.log(true);
      console.log(session!.id)
      fetchLikedPosts(session!.id);
    }
  }, [sessionFetched])

  const fetchSession = async () => {
    const sessionData = await returnSession();
    console.log(sessionData)
    setSession(sessionData);
    setSessionFetched(true);
  }
  console.log(session);
  console.log(session?.id)
  

  const fetchPosts = async () => {
    const response = await axios.get<PostProps[]>(`${process.env.NEXT_PUBLIC_URL}php/posts.php`, {
      params: { operation: 'fetch' }
    });
    // console.log(response.data)
    if (response.status === 200 && response.data) {
      const List: PostProps[] = Array.isArray(response.data)
        ? response.data.map((post: PostProps) => ({
            post_id: post.post_id,
            post_title: post.post_title,
            post_username: post.post_username,
            post_description: post.post_description,
            time_posted: post.time_posted,
            post_comments: Array.isArray(post.post_comments)
            ? post.post_comments.map((comment: CommentProps) => ({
                comment_id: comment.comment_id,
                comment_text: comment.comment_text,
                comment_username: comment.comment_username,
                comment_time: comment.comment_time
              }))
            : [],
          }))
        : [];
      console.log(posts)
      setPosts(List);
    }
  };

  const fetchLikedPosts = async (session_id: number) => {
    if (!session?.id) {
      await fetchSession();
    }
  
    if (session?.id) {
      try {
        const response = await axios.get<PostProps[]>(`${process.env.NEXT_PUBLIC_URL}php/liked_post.php`, {
          params: { session_id: session_id }
        });
        console.log(response.data);
  
        if (response.data && response.data.length > 0) {
          console.log(true)
          const List: PostProps[] = response.data.map((post: PostProps) => ({
            post_id: post.post_id,
            post_title: post.post_title,
            post_username: post.post_username,
            post_description: post.post_description,
            time_posted: post.time_posted,
            post_comments: Array.isArray(post.post_comments)
              ? post.post_comments.map((comment: CommentProps) => ({
                  comment_id: comment.comment_id,
                  comment_text: comment.comment_text,
                  comment_username: comment.comment_username,
                  comment_time: comment.comment_time
                }))
              : [],
          }));
          console.log(List);
          setPosts(List);
        }
      } catch (error) {
        console.error('Error fetching liked posts:', error);
      }
    }
  };
  
  React.useEffect(() => {
    if (pathname === '/dashboard') {
      fetchPosts();
    } 
    // else if (pathname === '/dashboard/liked-posts' && sessionFetched) {
    //   console.log(sessionFetched)
    //   fetchLikedPosts();
    // }
  }, [pathname, sessionFetched]);

  

  const formatTimePosted = (time_posted: string): string => {
    const postDate = new Date(time_posted);
    const now = new Date();
  
    const secondsAgo = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    
    if (secondsAgo < 60) {
      return `${secondsAgo} seconds ago`;
    } else if (secondsAgo < 3600) {
      const minutesAgo = Math.floor(secondsAgo / 60);
      return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
    } else if (secondsAgo < 86400) {
      const hoursAgo = Math.floor(secondsAgo / 3600);
      return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    } else {
      const daysAgo = Math.floor(secondsAgo / 86400);
      return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    }
  };
  

  const handleCommentClick = (post_id: number) => {
    setActiveCommentPostId(prevId => (prevId === post_id ? null : post_id));
  };

  const commentOnPost = async (post_id: number, comment_text: string) => {
    // alert('commenting on post');
    // let person = prompt("Please enter your name", "Anonymous");
    console.log(post_id, comment_text)
    const formData = new FormData();
    const commentDetails: CommentDetails = {
      post_id: post_id,
      comment_text: comment_text,
      userComment_id: session!.id,
    }
    formData.append('operation', 'comment');
    formData.append('json', JSON.stringify(commentDetails));
    const response = await axios({
      url: `${process.env.NEXT_PUBLIC_URL}php/comment.php`,
      method: "POST",
      data: formData,
    });
    console.log(response.status);
    console.log(response.data);
    const now = new Date();
    console.log(now)
    if (response.data == 1) {
      const newComment: CommentProps = {
        comment_id: commentDetails.post_id,
        comment_text: commentDetails.comment_text,
        comment_username: session!.username,
        comment_time: formatTimePosted(new Date().toString())
      }
      setPosts(prevPosts =>
      prevPosts.map(post =>
        post.post_id === post_id
          ? {
              ...post,
              post_comments: [...post.post_comments, newComment],
            }
          : post
      )
    );
    setComment('');
    };
     // Clear the comment input
  }

  const deletePost = async (post_id: number) => {
    console.log(post_id)
    const url = `${process.env.NEXT_PUBLIC_URL}php/posts.php`;
    const formData = new FormData();
    formData.append('operation', 'delete');
    formData.append('json', JSON.stringify({post_id: post_id}))
    const response = await axios({
      url: url,
      method: 'POST',
      data: formData
    })
    
  }
  
  return (
    <>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Card
            key={post.post_id}
            className={cn("relative w-[36vw] mb-5 border border-border shadow-lg rounded-lg bg-secondary")}
          >
            {/* Menubar positioned at the top-right of the entire Card */}
            { post.post_username == session?.username && 
              <div className="absolute top-4 right-4">
                <Menubar className="bg-inherit">
                  <MenubarMenu>
                    <MenubarTrigger className="hover:bg-background rounded-full">...</MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem >
                        Edit<MenubarShortcut>⌘T</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem onClick={() => deletePost(post.post_id)}>
                        Delete<MenubarShortcut>⌘D</MenubarShortcut>
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </div>
            }

            {/* Card Header */}
            <CardHeader className="border-b border-border p-4">
              <CardDescription className="text-sm text-muted-foreground">
                Posted by <span className="text-lg font-medium text-primary">{post.post_username}</span>
                <p className="mt-[0.5vh] text-xs text-muted-foreground">Posted: {formatTimePosted(post.time_posted)}</p>
              <CardTitle className="text-center text-xl font-semibold text-primary">{post.post_title}</CardTitle>

              </CardDescription>
            </CardHeader>

            {/* Card Content */}
            <CardContent className="p-4 text-foreground">
              <p>{post.post_description}</p>
            </CardContent>

            {/* Card Footer */}
            <CardFooter className="border-t border-border p-4 flex justify-between items-center text-muted-foreground">
              <Vote 
                post_id={post.post_id} 
                user_id={session?.id} 
              />
              <div className="flex items-center space-x-2">
                {/* Comment button */}
                <Button onClick={() => handleCommentClick(post.post_id)} variant="secondary" className="text-xs text-primary hover:text-primary-foreground">
                  💬 Comment
                </Button>
              </div>
            </CardFooter>

            {/* Comments Section */}
            {activeCommentPostId === post.post_id && (
              <>
                <hr className="mx-[1vw] h-[2px] bg-white"/>
                <div className="mx-[1vw] my-[1vh] bg-opacity-20">
                  {post.post_comments.map(comment => (
                    <div key={comment.comment_id} className="border-b border-border p-2">
                      <p className="text-sm text-muted-foreground">{comment.comment_text}</p>
                      <p className="text-xs text-muted-foreground">— <span className='text-base'>{comment.comment_username} </span>at {formatTimePosted(comment.comment_time)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex mx-[1vw] my-[1vh] space-x-2">
                  <Input onChange={(e) => setComment(e.target.value)} className="rounded px-[1vw] py-[1vh] outline-none focus-visible:outline-none" placeholder="Comment"/>
                  <Button onClick={() => commentOnPost(post.post_id, comment)} variant="outline" size="icon">
                    <Image alt="comment" className="dark:invert" src="/assets/svg/send-arrow-direction-svgrepo-com.svg" width={20} height={20}/>
                  </Button>
                </div>
              </>
            )}
          </Card>

        ))
      ) : (
        <p className="text-muted-foreground">No posts available.</p>
      )}
    </>
  );
};

export default Post;
