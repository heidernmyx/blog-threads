import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Import your Button and Input components
import { Input } from "@/components/ui/input";
import { cn, PostProps, CommentProps, CommentDetails } from "@/lib/utils";
import Image from 'next/image';
import axios from 'axios';

const Post = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
  const [ comment, setComment ] = useState<string>('');
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get<PostProps[]>(`${process.env.NEXT_PUBLIC_URL}php/posts.php`, {
        params: { operation: 'fetch' }
      });
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
        setPosts(List);
      }
    };

    fetchPosts();
  }, []);

  const formatTimePosted = (time_posted: string) => {
    const date = new Date(time_posted);
    return date.toLocaleString();
  };

  const handleCommentClick = (post_id: number) => {
    setActiveCommentPostId(prevId => (prevId === post_id ? null : post_id));
  };

  const commentOnPost = async (post_id: number, comment_text: string) => {
    // alert('commenting on post');
    let person = prompt("Please enter your name", "Anonymous");
    console.log(post_id, comment_text)
    const formData = new FormData();
    const commentDetails: CommentDetails = {
      post_id: post_id,
      comment_text: comment_text,
      comment_username: person || 'Anonymous',
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
  }
  
  return (
    <>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Card
            key={post.post_id}
            className={cn("w-[36vw] mb-5 border border-border shadow-lg rounded-lg bg-secondary")}
          >
            <CardHeader className="border-b border-border p-4">
              <CardTitle className="text-center text-xl font-semibold text-primary">{post.post_title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Posted by <span className='text-lg font-medium text-primary'>{post.post_username}</span>
                <p className="mt-[0.5vh] text-xs text-muted-foreground">Posted on: {formatTimePosted(post.time_posted)}</p>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 text-foreground">
              <p>{post.post_description}</p>
            </CardContent>
            <CardFooter className="border-t border-border p-4 flex justify-between items-center text-muted-foreground">
              <div className="w-full flex items-center">
                <Button variant="secondary" className='hover:text-primary-foreground'>
                  ▲ <span className='text-xs'>Upvote</span>
                </Button>
                <Button variant="secondary" className='hover:text-primary-foreground'>
                  ▼ <span className='text-xs'>Downvote</span>
                </Button>
                <p className="text-sm text-muted-foreground">123</p> {/* Replace 123 with actual vote count if available */}
              </div>
              <div className="flex items-center space-x-2">
                {/* Comment button */}
                <Button onClick={() => handleCommentClick(post.post_id)} variant="secondary" className="text-xs text-primary hover:text-primary-foreground">
                  💬 Comment
                </Button>
              </div>
            </CardFooter>
            {activeCommentPostId === post.post_id && (
              <>
                <hr className='mx-[1vw] h-[2px] bg-white'/>
                <div className="mx-[1vw] my-[1vh] bg-opacity-20">
                  {post.post_comments.map(comment => (
                    <div key={comment.comment_id} className="border-b border-border p-2">
                      <p className="text-sm text-muted-foreground">{comment.comment_text}</p>
                      <p className="text-xs text-muted-foreground">— {comment.comment_username} at {formatTimePosted(comment.comment_time)}</p>
                    </div>
                  ))}
                  {/* <div  className="border-b border-border p-2">
                    <p className="text-sm text-muted-foreground">Eyyy!</p>
                    <p className="text-xs text-muted-foreground">— Anonymouses at 12/2/2 10:30:2</p>
                  </div> */}
                </div>
                <div className='flex mx-[1vw] my-[1vh] space-x-2'>
                  <Input onChange={(e) => setComment(e.target.value)} className="rounded px-[1vw] py-[1vh] outline-none focus-visible:outline-none" placeholder='Comment'/>
                  <Button onClick={() => commentOnPost(post.post_id, comment)} variant={'outline'} size={'icon'}>
                    <Image alt='comment' className="dark:invert" src='/assets/svg/send-arrow-direction-svgrepo-com.svg' width={20} height={20}/>
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
