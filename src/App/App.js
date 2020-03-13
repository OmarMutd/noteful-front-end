import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import AddFolder from '../AddFolder/AddFolder'
import AddNote from '../AddNote/AddNote'
import ApiContext from '../ApiContext';
import config from '../config';
import './App.css';

class App extends Component {
	state = {
		notes: [],
		folders: []
	};

	// componentDidMount() {
	// 	Promise.all([
	// 		fetch(`${config.API_ENDPOINT}/notes`, {
    //     method: 'GET',
    //     headers: {
    //       'content-type': 'application/json',
    //       'Authorization': `Bearer ${config.API_TOKEN}`
    //     }
    //   }),
	// 		fetch(`${config.API_ENDPOINT}/folders`, {
    //     method: 'GET',
    //     headers: {
    //       'content-type': 'application/json',
    //       'Authorization': `Bearer ${config.API_TOKEN}`
    //     }
    //   })
	// 	])
	// 	.then(([notesRes, foldersRes]) => {
	// 		if (!notesRes.ok)
	// 			return notesRes.json().then(e => Promise.reject(e));
	// 		if (!foldersRes.ok)
	// 			return foldersRes.json().then(e => Promise.reject(e));

    //   return Promise.all([notesRes.json(), foldersRes.json()]);
	// 	})
	// 	.then(([notes, folders]) => {
	// 		this.setState({notes, folders});
	// 	})
	// 	.catch(error => {
	// 		console.error({error});
	// 	});
	// }

	handleAddFolder = folder => {
    const newFolders = this.state.folders.concat(folder)
    this.setState({
      folders: newFolders
    })
  }

	handleDeleteFolder = folderId => {
		this.setState({
			folders: this.state.folders.filter(folder => folder.id != folderId)
		})
	}

	handleAddNote = noteData => {
		const newNotes = this.state.notes.concat(noteData)
		this.setState({
			notes: newNotes
		})
	}

	handleDeleteNote = noteId => {
		this.setState({
			notes: this.state.notes.filter(note => note.id != noteId)
		});
	};

	renderNavRoutes() {
		return (
			<>
				{['/', '/folder/:folderId'].map(path => (
					<Route
						exact
						key={path}
						path={path}
						component={NoteListNav}
					/>
				))}
				<Route path="/note/:noteId" component={NotePageNav} />
				<Route path="/add-folder" component={NotePageNav} />
				<Route path="/add-note" component={NotePageNav} />
			</>
		);
	}

	renderMainRoutes() {
		return (
			<>
				{['/', '/folder/:folderId'].map(path => (
					<Route
						exact
						key={path}
						path={path}
						component={NoteListMain}
					/>
				))}
				<Route path="/note/:noteId" component={NotePageMain} />
				<Route path="/add-folder" component={AddFolder} />
				<Route
					path="/add-note"
					render={routeProps => {
						return (
							<AddNote
							{...routeProps}
							folders={this.state.folders}
							/>
						)
					}}
				/>
			</>
		);
	}

	render() {
		const value = {
			notes: this.state.notes,
			folders: this.state.folders,
			addFolder: this.handleAddFolder,
			deleteFolder: this.handleDeleteFolder,
			addNote: this.handleAddNote,
			deleteNote: this.handleDeleteNote,
		};
		return (
			<ApiContext.Provider value={value}>
				<div className="App">
					<nav className="App__nav">{this.renderNavRoutes()}</nav>
					<header className="App__header">
						<h1>
							<Link to="/">Noteful</Link>{' '}
							<FontAwesomeIcon icon="check-double" />
						</h1>
					</header>
					<main className="App__main">{this.renderMainRoutes()}</main>
				</div>
			</ApiContext.Provider>
		);
  }
}

export default App;
