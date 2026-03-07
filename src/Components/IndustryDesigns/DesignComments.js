"use client";

import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import { MdOutlineReply } from "react-icons/md";
import NameProfile from "../CommonJsx/NameProfile";
import { contextState } from "../CommonJsx/ContextProvider";
import { BASE_URL } from "@/config";
import styles from "./DesignComments.module.css";

const LIMIT = 10;

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours > 0) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  const diffSeconds = Math.floor(diffMs / 1000);
  return `${diffSeconds} second${diffSeconds !== 1 ? "s" : ""} ago`;
}

function CommentItem({ comment, onReply, replyingToId, replyText, onReplyTextChange, onReplySubmit, replyPosting, isLoggedIn }) {
  const user = comment?.user_id || {};
  const name = user?.full_name || "Anonymous";
  const isReplying = replyingToId === comment._id;

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentAvatar}>
        <NameProfile
          userName={name}
          width="40"
          memberPhoto={user?.photo}
          borderRadius="50%"
          fontSize="14px"
          fontweight="600"
        />
      </div>
      <div className={styles.commentBody}>
        <div className={styles.commentMeta}>
          <span className={styles.commentAuthor}>{name}</span>
          <span className={styles.commentTime}>{formatTimeAgo(comment.createdAt)}</span>
        </div>
        <p className={styles.commentText}>{comment.comment}</p>
        {isLoggedIn && (
          <div className={styles.commentActions}>
            <button
              type="button"
              className={styles.replyButton}
              onClick={() => onReply(comment._id)}
              aria-label="Reply to comment"
            >
              <MdOutlineReply /> Reply
            </button>
          </div>
        )}
        {comment.reply && (
          <div className={styles.replyBlock}>
            <div className={styles.commentAvatar}>
              <NameProfile
                userName={comment.reply?.user_id?.full_name || "Anonymous"}
                width="40"
                memberPhoto={comment.reply?.user_id?.photo}
                borderRadius="50%"
                fontSize="14px"
                fontweight="600"
              />
            </div>
            <div className={styles.commentBody}>
              <div className={styles.commentMeta}>
                <span className={styles.commentAuthor}>
                  {comment.reply?.user_id?.full_name || "Anonymous"}
                </span>
                <span className={styles.commentTime}>
                  {formatTimeAgo(comment.reply.createdAt)}
                </span>
              </div>
              <p className={styles.commentText}>{comment.reply.comment}</p>
            </div>
          </div>
        )}
        {isLoggedIn && isReplying && (
          <div className={styles.replyForm}>
            <textarea
              className={styles.replyInput}
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => onReplyTextChange(e.target.value)}
              rows={2}
            />
            <div className={styles.replyFormActions}>
              <button
                type="button"
                className={styles.replyCancelBtn}
                onClick={() => onReply(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.replySubmitBtn}
                onClick={() => onReplySubmit(comment._id)}
                disabled={replyPosting || !replyText.trim()}
              >
                {replyPosting ? "Posting..." : "Post Reply"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DesignComments({ designId }) {
  const { user, setUser } = useContext(contextState);
  const [comments, setComments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyPosting, setReplyPosting] = useState(false);

  const isLoggedIn = !!(user?.name && String(user.name).trim());

  useEffect(() => {
    const uuid = typeof window !== "undefined" ? localStorage.getItem("uuid") : null;
    if (!uuid) return;
    if (user?.name) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/v1/cad/get-user-details`, {
          headers: { "user-uuid": uuid },
        });
        if (res.data?.meta?.success && res.data?.data) {
          const d = res.data.data;
          setUser((prev) => ({
            ...prev,
            name: d?.full_name || "",
            photo: d?.photo || "",
          }));
        }
      } catch (err) {
        console.error("Error fetching user for comments:", err);
      }
    };
    fetchUser();
  }, [user?.name, setUser]);

  const fetchComments = useCallback(
    async (pageNum = 1, append = false) => {
      if (!designId) return;
      try {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        const res = await axios.get(
          `${BASE_URL}/v1/cad/get-design-comments?design_id=${designId}&page=${pageNum}&limit=${LIMIT}`,
          {
            headers: { "user-uuid": typeof window !== "undefined" ? localStorage.getItem("uuid") : "" },
          }
        );

        if (res.data?.meta?.success && res.data?.data) {
          const { comments: newComments, pagination } = res.data.data;
          if (append) {
            setComments((prev) => [...prev, ...newComments]);
          } else {
            setComments(newComments);
          }
          setTotalCount(pagination?.total_comments ?? 0);
          setHasMore(pagination?.has_next_page ?? false);
          setPage(pagination?.current_page ?? 1);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [designId]
  );

  useEffect(() => {
    fetchComments(1);
  }, [fetchComments]);

  const loadMore = () => {
    if (hasMore && !loadingMore) {
      fetchComments(page + 1, true);
    }
  };

  const postComment = async () => {
    const trimmed = (commentText || "").trim();
    if (!trimmed || posting) return;

    const uuid = typeof window !== "undefined" ? localStorage.getItem("uuid") : null;
    if (!uuid) {
      alert("Please sign in to post a comment.");
      return;
    }

    try {
      setPosting(true);
      const res = await axios.post(
        `${BASE_URL}/v1/cad/create-design-comments`,
        { design_id: designId, comment: trimmed },
        { headers: { "user-uuid": uuid } }
      );

      if (res.data?.meta?.success) {
        setCommentText("");
        fetchComments(1);
      } else {
        alert(res.data?.meta?.message || "Failed to post comment");
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      alert(err.response?.data?.meta?.message || "Failed to post comment");
    } finally {
      setPosting(false);
    }
  };

  const postReply = async (parentCommentId) => {
    const trimmed = replyText.trim();
    if (!trimmed || replyPosting) return;

    const uuid = typeof window !== "undefined" ? localStorage.getItem("uuid") : null;
    if (!uuid) {
      alert("Please sign in to reply.");
      return;
    }

    try {
      setReplyPosting(true);
      const res = await axios.post(
        `${BASE_URL}/v1/cad/create-design-comments`,
        { design_id: designId, comment: trimmed, parent_comment_id: parentCommentId },
        { headers: { "user-uuid": uuid } }
      );

      if (res.data?.meta?.success) {
        setReplyText("");
        setReplyingToId(null);
        fetchComments(1);
      } else {
        alert(res.data?.meta?.message || "Failed to post reply");
      }
    } catch (err) {
      console.error("Error posting reply:", err);
      alert(err.response?.data?.meta?.message || "Failed to post reply");
    } finally {
      setReplyPosting(false);
    }
  };

  const handleReply = (commentId) => {
    setReplyingToId(commentId);
    setReplyText("");
  };

  if (!designId) return null;

  return (
    <section className={styles.commentsSection}>
      <div className={styles.commentsHeader}>
        <h3 className={styles.commentsTitle}>Comments</h3>
        <MdOutlineChatBubbleOutline className={styles.commentsIcon} />
        <span className={styles.commentsCount}>{totalCount}</span>
      </div>

      {isLoggedIn && (
      <div className={styles.addCommentRow}>
        <div className={styles.addCommentAvatar}>
          <NameProfile
            userName={user?.name || "You"}
            width="40"
            memberPhoto={user?.photo}
            borderRadius="50%"
            fontSize="14px"
            fontweight="600"
          />
        </div>
        <div className={styles.addCommentInputWrap}>
          <textarea
            className={styles.addCommentInput}
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={2}
          />
          <button
            type="button"
            className={styles.postButton}
            onClick={postComment}
            disabled={posting || !commentText.trim()}
          >
            Post Comment
          </button>
        </div>
      </div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading comments...</div>
      ) : comments.length === 0 ? (
        <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
      ) : (
        <ul className={styles.commentsList}>
          {comments.map((c) => (
            <li key={c._id}>
              <CommentItem
                comment={c}
                onReply={handleReply}
                replyingToId={replyingToId}
                replyText={replyText}
                onReplyTextChange={setReplyText}
                onReplySubmit={postReply}
                replyPosting={replyPosting}
                isLoggedIn={isLoggedIn}
              />
            </li>
          ))}
        </ul>
      )}

      {!loading && hasMore && (
        <div className={styles.viewMoreWrap}>
          <button
            type="button"
            className={styles.viewMoreButton}
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : `View more (${totalCount - comments.length} remaining)`}
          </button>
        </div>
      )}
    </section>
  );
}
