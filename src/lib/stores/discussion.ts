import { writable } from 'svelte/store';
import type { DiscussionPost, DiscussionReply } from '../types';

// Discussion state
export const discussionPosts = writable<DiscussionPost[]>([]);
export const currentDiscussion = writable<DiscussionPost | null>(null);

// Discussion functions
export const discussionFunctions = {
  addPost: (post: Omit<DiscussionPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPost: DiscussionPost = {
      ...post,
      id: Date.now().toString(),
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    discussionPosts.update(posts => [newPost, ...posts]);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      discussionPosts.subscribe(posts => {
        localStorage.setItem('edu-ruang-discussions', JSON.stringify(posts));
      });
    }
  },

  addReply: (postId: string, reply: Omit<DiscussionReply, 'id' | 'createdAt'>) => {
    const newReply: DiscussionReply = {
      ...reply,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    discussionPosts.update(posts => 
      posts.map(post => 
        post.id === postId 
          ? { ...post, replies: [...post.replies, newReply], updatedAt: new Date() }
          : post
      )
    );
  },

  likePost: (postId: string) => {
    discussionPosts.update(posts =>
      posts.map(post =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  },

  dislikePost: (postId: string) => {
    discussionPosts.update(posts =>
      posts.map(post =>
        post.id === postId
          ? { ...post, dislikes: post.dislikes + 1 }
          : post
      )
    );
  },

  likeReply: (postId: string, replyId: string) => {
    discussionPosts.update(posts =>
      posts.map(post =>
        post.id === postId
          ? {
              ...post,
              replies: post.replies.map(reply =>
                reply.id === replyId
                  ? { ...reply, likes: reply.likes + 1 }
                  : reply
              )
            }
          : post
      )
    );
  }
};

// Initialize discussions from localStorage
if (typeof window !== 'undefined') {
  const storedDiscussions = localStorage.getItem('edu-ruang-discussions');
  if (storedDiscussions) {
    try {
      discussionPosts.set(JSON.parse(storedDiscussions));
    } catch (e) {
      localStorage.removeItem('edu-ruang-discussions');
    }
  }
}