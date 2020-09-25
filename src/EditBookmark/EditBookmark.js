import React, { Component } from  'react';
import PropTypes from 'prop-types';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
// import './EditBookmark.css';

const Required = () => (
  <span className='AddBookmark__required'>*</span>
)

class EditBookmark extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };

  static contextType = BookmarksContext;

  state = {
    error: null,
    id: '',
    title: '',
    url: '',
    description: '',
    rating: 1,
  };

  componentDidMount() {
      const { id } = this.props.match.params
      console.log(id)

      fetch(config.API_ENDPOINT + `/${id}`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        }
      })
      .then(res => {
        if (!res.ok)
          return res.json().then(error => Promise.reject(error))

        return res.json()
      })
      .then(data => {
        console.log(data, data.id)
          this.setState({
            id: data.id,
            title: data.title,
            url: data.url,
            description: data.description,
            rating: data.rating,
          })
      })

  }

  handleChangeTitle = e => {
      this.setState({
          title: e.target.value
      })
  }

  handleChangeRating = e => {
    this.setState({
        rating: e.target.value
    })
}

handleChangeUrl = e => {
    this.setState({
        url: e.target.value
    })
}
handleChangeDescription = e => {
    this.setState({
        description: e.target.value
    })
}

  handleSubmit = e => {
    e.preventDefault()
    // get the form fields from the event
    const { id } = this.props.match.params
    const { title, url, description, rating } = this.state
    const newBookmark = {
      id: id,
      title: title,
      url: url,
      description: description,
      rating: rating,
    }
    this.setState({ error: null })
    fetch(config.API_ENDPOINT + `/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(newBookmark),
      headers: {
        'content-type': 'application/json',
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => Promise.reject(error))
        }
        return;
      })
      .then((data) => {
      
          this.context.updateBookmark(this.props.match.params.id, newBookmark)
          this.props.history.push('/')
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  handleClickCancel = () => {
    this.props.history.push('/')
  };

  render() {
    const { error } = this.state
    return (
      <section className='AddBookmark'>
        <h2>Edit a bookmark</h2>
        <form
          className='EditBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='AddBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              value={this.state.title}
              onChange={this.handleChangeTitle}
              required
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              value={this.state.url}
              onChange={this.handleChangeUrl}
              required
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              value={this.state.description}
              onChange={this.handleChangeDescription}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              value={this.state.rating}
              min='1'
              max='5'
              onChange={this.handleChangeRating}
              required
            />
          </div>
          <div className='AddBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditBookmark;
