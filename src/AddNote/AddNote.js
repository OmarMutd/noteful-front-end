import React, { Component } from 'react'
import config from '../config'
import NotefulError from '../NotefulError';
import ApiContext from '../ApiContext'
import './AddNote.css'

export default class AddNote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: "",
      name: {
        value: "",
        touched: false
      },
      text: {
        value: ""
      }
    }
  }

  static contextType = ApiContext

  static defaultProps = {
    notes: [],
    folders: []
  }

  generateErrorMessage = () => {
		let newTextName = this.state.name.value.replace(/[\s-]/g, '');

    if (!/^[a-zA-Z0-9]*$/gm.test(newTextName) && this.state.name.touched) {
      return 'Only numbers and letters!'
    } else if (/[\s-]/gm.test(newTextName) && this.state.name.touched) {
      return 'Only numbers and letters!'
    } else if (newTextName.length >= 20) {
      return 'Please use less than 20 characters!'
    }
  }

  newNote = (input) => {
    this.setState({
      name: {
        value: input,
        touched: true
      }
    })
  }

  newText = (input) => {
    this.setState({
      text: {
        value: input
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const name = e.target[0].value
    const content = e.target[1].value
    const folderId = e.target[2].value
    const modified = new Date()
    
    
    const note = {
      name: name,
      content: content,
      folderid: Number(folderId),
      modified: modified
    }
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_TOKEN}`
      },
      body: JSON.stringify(note)
    
    })
    .then(res => {
      if (!res.ok)
        return res.json().then(e => Promise.reject(e))
        return res.json()
    })
    .then((data) => {
      console.log(data)
      this.context.addNote(data)
      this.props.history.push(`/note/${data.id}`)
    })
    .catch(error => {
      console.error({ error })
    })
  }


  render() {
    const { folders } = this.props
    console.log(folders)
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulError>
        <form className="Noteful-form" onSubmit={(e) => {this.handleSubmit(e)}}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>
            <input type='text' id='note-name-input' />
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            <textarea id='note-content-input' />
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select id='note-folder-select'>
              <option value={null}>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
          </div>
          <div className='buttons'>
            <button type='submit'>
              Add note
            </button>
          </div>
          {this.generateErrorMessage() ? <p>{this.generateErrorMessage()}</p> : ''}
        </form>
        </NotefulError>
      </section>
    )
  }
}
