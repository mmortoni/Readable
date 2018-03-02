import React from 'react'
import { browserHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Modal,ModalManager,Effect } from 'react-dynamic-modal'
import { CommentsList } from '../components/comments/CommentsList'
import { postsActions, postsSelectors } from '../store/posts/index'
import { commentsActions, commentsSelectors } from '../store/comments/index'

import AppModal from '../components/shared/AppModal'
import { EFFECTS } from '../constants/constants'

import { formatTimestamp } from '../utils/Utils'

@connect(
  (state, props) => {
    return {
      post: postsSelectors.getPost(state, props.params.postId),
      comments: commentsSelectors.getComments(state),
    };
  }
)

export class PostsComment extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object,
    store: React.PropTypes.object,
  };

  static propTypes = {
    params: React.PropTypes.object,
    post: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.context.store.dispatch(commentsActions.fetchComments({post:this.props.post, postId: this.props.params.postId}))
  }

  deleteComment(item, buttonValue){
    if(buttonValue === 'ok')
      this.context.store.dispatch(commentsActions.deleteComment(item))
  }

  deleteCommentModal(comment) {
    ModalManager.open(<AppModal
                        title={ 'Delete Comment' }
                        content={ 'Tem certeza de que deseja excluir?' }
                        detail={ comment.title }
                        callBackFunction={ this.deleteComment }
                        item={ comment }
                        effect={ EFFECTS['3D ROTATE LEFT'] } />);
  }

  voteComment(id, option){
    this.context.store.dispatch(commentsActions.voteComment({id: id, option: option}))
    // browserHistory.push('/posts');
  }

  votePost(id, option) {
    this.context.store.dispatch(postsActions.votePost({id: id, option: option}))
    //browserHistory.push('/posts');
  }

  render() {
    const {comments, post} = this.props
  
    return (
      <div>
        <div className="row">
          <div className="col-md-4 col-md-offset-4"><h4>POST</h4></div>

          <div className="col-md-10">
            <div className="post">
              <div className="post-description">
                <div className="post-title"><h3>{post.title}</h3></div>
                <div className="post-body"><p>{ post.body }</p></div>
                <div className="post-likes">
                  <img src="/images/thumbs-up.png" width="28" height="28" onClick={ this.votePost.bind(this, post.id, "upVote") } />
                  <img src="/images/thumbs-down.png" width="28" height="28" onClick={ this.votePost.bind(this, post.id, "downVote") } />
                </div>
                <div className="post-likes-comments">
                  { post.voteScore } votes { post.comments && post.comments.length > 0 ? post.comments.length : 0 } comments
                </div>
              </div>

              <br/>

              <div>
                <div className="post-author"><p><b>Category: </b> { post.category }</p></div>
                <div className="post-author"><p><b>Author: </b> { post.author }</p></div>
                <div className="post-author"><p><b>Time: </b> { formatTimestamp(post.timestamp) }</p></div>
              </div>          
            </div>

            {comments.length > 0 && <CommentsList comments={comments} onDelete={this.deleteCommentModal} onVoteComment={this.voteComment}/>}            
          </div>

          <div className="col-md-2 text-right">
            <Link to="/posts/new" className="btn btn-primary a-btn-slide-text">
              <span style={{class: this.classNames}} aria-hidden="true"></span>
              <span><strong>Novo Comment</strong></span>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
