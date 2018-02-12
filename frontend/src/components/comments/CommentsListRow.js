import React from 'react'
import { Link } from 'react-router'

import ThumbsUp from '../../images/thumbs-up.png'
import ThumbsDown from '../../images/thumbs-down.png'
import { formatTimestamp } from '../../utils/Utils'

export const CommentsListRow = ({comment, onDelete, onVoteComment}) => {
  if(!comment) {
    return <tr><td><div>404 Comment Not Found!</div></td></tr>
  }

  return (
    <tr key={comment.id}>
      <td>
        <div className="post">
          <div className="post-description">
            <div className="post-body"><p>{comment.body}</p></div>
            <div className="post-likes">
              <img src={ThumbsUp} width="28" height="28" onClick={onVoteComment.bind(this, comment.id, "upVote")} />
              <img src={ThumbsDown} width="28" height="28" onClick={onVoteComment.bind(this, comment.id, "downVote")} />
            </div>
          </div>
          <br/>
          <div>
            <div className="post-author"><p><b>Author: </b> {comment.author}</p></div>
            <div className="post-author"><p><b>Time: </b> {formatTimestamp(comment.timestamp)}</p></div>
          </div>          
        </div>
      </td>
      <td>
        <div className="btn-toolbar pull-right">
          <Link to={`/posts/${comment.id}/edit`} className="btn btn-primary btn-line">
            <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
            <span><strong>Edit</strong></span>
          </Link>
          <a onClick={onDelete.bind(this, comment)} className="btn btn-danger btn-line">
            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
            <span><strong>Delete</strong></span>
          </a>
        </div>
      </td>
    </tr>
  )
};
