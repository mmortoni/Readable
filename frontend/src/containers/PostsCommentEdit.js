import React from 'react';
import { browserHistory } from 'react-router';
import Textarea from 'react-textarea-autosize';
import { commentsActions, commentsSelectors } from '../store/comments/index';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

@connect(
  (state, props) => {
    return {
      comment: commentsSelectors.getComment(state, props.params.commentId),
    };
  }
)

export class PostsCommentEdit extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object,
    store: React.PropTypes.object
  };

  static propTypes = {
    params: React.PropTypes.object,
    post: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      ...this.state,
      commentId: this.props.params.commentId,
      comment: this.props.comment
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.post, this.state.comment)) {
      this.setState({...this.state, post: nextProps.comment});
    }
  }
  
  handleChange(field, e) {
    const comment = Object.assign({}, this.state.comment, {[field]: e.target.value});
    this.setState(Object.assign({}, this.state, {comment}));
  }

  handleSubmit() {
    if (this.state.commentId) {
      this.context.store.dispatch(commentsActions.updateComment(this.state.comment));
      browserHistory.push(`/posts/${this.state.comment.parentId}/comment`);
    }
  }

  render() {
    let { author, body } = this.state.comment

    return (
      <form onSubmit={ this.handleSubmit.bind(this) } noValidate>
        <div className="form-group">
          <label className="label-control">Autor</label>
          <input
            type="text"
            className="form-control"
            value={ author }
            onChange={ this.handleChange.bind(this, 'author') } />
        </div>

        <div className="form-group">
          <label className="label-control">Body</label>
          <Textarea
            className="form-control"
            value={ body }
            onChange={this.handleChange.bind(this, 'body')} />
        </div>

        <button type="submit" className="btn btn-default">Update Comment</button>
      </form>
    );
  }
}
