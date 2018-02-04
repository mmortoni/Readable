import React from 'react';
import Textarea from 'react-textarea-autosize';
import { postsActions, postsSelectors } from '../store/posts/index';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import { categoriesActions, categoriesSelectors } from '../store/categories/index';

// props
@connect(
  (state, props) => {
    return {
      categories: categoriesSelectors.getCategories(state),
    };
  }
)

export class PostsNew extends React.Component {
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
      post: { title: '', autor: '', category: '', body: '' },
    };
  }

  componentWillReceiveProps(nextProps) {
    // refresh - do usuário ()
    if(!this.props.categories)
      this.context.store.dispatch(categoriesActions.fetchCategories(this.state))

    if (!isEqual(nextProps.post, this.state.post)) {
      this.setState({...this.state, post: nextProps.post});
    }
  }

  handleChange(field, e) {
    const post = Object.assign({}, this.state.post, {[field]: e.target.value});
    this.setState(Object.assign({}, this.state, {post}));
  }

  handleSubmit() {
    this.context.store.dispatch(postsActions.createPost(this.state.post));
  }

  render() {
    let {title, autor, category, body} = this.state.post

    let categories // props
    if(this.props.categories){
      categories = this.props.categories[0]
      console.log(categories)

    }



    return (
      <form onSubmit={ this.handleSubmit.bind(this) } noValidate>
        <div className="form-group">
          <label className="label-control">Title</label>
          <input
            type="text"
            className="form-control"
            value={ post.title }
            onChange={ this.handleChange.bind(this, 'title') } />
        </div>

        <div className="form-group">
          <label className="label-control">Autor</label>
          <input
            type="text"
            className="form-control"
            value={ post.autor }
            onChange={ this.handleChange.bind(this, 'autor') } />
        </div>

        <div className="form-group">
          <label className="label-control">Category&nbsp;&nbsp;</label>
          <select className="selectpicker" 
                  data-style="btn-info" 
                  id="selCategory" 
                  onChange={ this.handleChange.bind(this, 'category') } >
            { categories && Object.keys(categories).map( key =>
                <option key={ key } value={ categories[key].name }>{ categories[key].path }</option>
              )
            }
          </select>
        </div>

        <div className="form-group">
          <label className="label-control">Body</label>
          <Textarea
            className="form-control"
            value={ post.body }
            onChange={this.handleChange.bind(this, 'body')} />
        </div>

        <button type="submit" className="btn btn-default">Create Post</button>
      </form>
    );
  }
}
