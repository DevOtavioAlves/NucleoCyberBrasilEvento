type PostCardProps = {
  author: string
  course: string
  title: string
  content: string
  likes: number
  comments: number
  shares: number
}

export default function PostCard({
  author,
  course,
  title,
  content,
  likes,
  comments,
  shares,
}: PostCardProps) {
  return (
    <div className="post-card">
      <h4>{title}</h4>
      <p className="author">
        {author} – <span>{course}</span>
      </p>
      <p>{content}</p>
      <div className="post-actions">
        <span>👍 {likes}</span>
        <span>💬 {comments}</span>
        <span>↗ {shares}</span>
      </div>
    </div>
  )
}
