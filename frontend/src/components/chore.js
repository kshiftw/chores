import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import GoogleMap from './map';

import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { authMiddleWare } from '../util/auth';

const styles = (theme) => ({
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	appBar: {
		position: 'relative',
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
	submitButton: {
		display: 'block',
		color: 'white',
		textAlign: 'center',
		position: 'absolute',
		top: 14,
		right: 10,
	},
	floatingButton: {
		position: 'fixed',
		bottom: 0,
		right: 0,
	},
	form: {
		width: '98%',
		marginLeft: 10,
	},
	toolbar: theme.mixins.toolbar,
	root: {
		minWidth: 335,
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
	},
	pos: {
		marginBottom: 12,
	},
	uiProgress: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%',
	},
	dialogueStyle: {
		maxWidth: '50%',
	},
	viewRoot: {
		margin: 0,
		padding: theme.spacing(2),
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
});

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />;
});

class Chore extends Component {
	constructor(props) {
		super(props);

		this.state = {
			chores: '',
			title: '',
			body: '',
			type: '',
			location: '',
			choreId: '',
			errors: [],
			open: false,
			uiLoading: true,
			buttonType: '',
			viewOpen: false,
		};

		this.deleteChoreHandler = this.deleteChoreHandler.bind(this);
		this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
		this.handleViewOpen = this.handleViewOpen.bind(this);
	}

	handleChange = (event) => {
		event.preventDefault();
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	componentWillMount = () => {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get('/chores')
			.then((response) => {
				this.setState({
					chores: response.data,
					uiLoading: false,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	deleteChoreHandler(data) {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		let choreId = data.chore.choreId;
		axios
			.delete(`chore/${choreId}`)
			.then(() => {
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	handleEditClickOpen(data) {
		this.setState({
			title: data.chore.title,
			body: data.chore.body,
			type: data.chore.type,
			location: data.chore.location,
			choreId: data.chore.choreId,
			buttonType: 'Edit',
			open: true,
		});
	}

	handleViewOpen(data) {
		this.setState({
			title: data.chore.title,
			body: data.chore.body,
			type: data.chore.type,
			location: data.chore.location,
			viewOpen: true,
		});
	}

	render() {
		const DialogTitle = withStyles(styles)((props) => {
			const { children, classes, onClose, ...other } = props;
			return (
				<MuiDialogTitle disableTypography className={classes.root} {...other}>
					<Typography variant='h6'>{children}</Typography>
					{onClose ? (
						<IconButton
							aria-label='close'
							className={classes.closeButton}
							onClick={onClose}
						>
							<CloseIcon />
						</IconButton>
					) : null}
				</MuiDialogTitle>
			);
		});

		// const DialogContent = withStyles((theme) => ({
		// 	viewRoot: {
		// 		padding: theme.spacing(2),
		// 	},
		// }))(MuiDialogContent);

		dayjs.extend(relativeTime);
		const { classes } = this.props;
		const { open, errors, viewOpen } = this.state;

		const handleClickOpen = () => {
			this.setState({
				choreId: '',
				title: '',
				body: '',
				type: '',
				location: '',
				buttonType: '',
				open: true,
			});
		};

		const handleSubmit = (event) => {
			authMiddleWare(this.props.history);
			event.preventDefault();
			const userChore = {
				title: this.state.title,
				body: this.state.body,
				type: this.state.type,
				location: this.state.location,
			};
			let options = {};
			if (this.state.buttonType === 'Edit') {
				options = {
					url: `/chore/${this.state.choreId}`,
					method: 'put',
					data: userChore,
				};
			} else {
				options = {
					url: '/chore',
					method: 'post',
					data: userChore,
				};
			}
			const authToken = localStorage.getItem('AuthToken');
			axios.defaults.headers.common = { Authorization: `${authToken}` };
			axios(options)
				.then(() => {
					this.setState({ open: false });
					window.location.reload();
				})
				.catch((error) => {
					this.setState({ open: true, errors: error.response.data });
					console.log(error);
				});
		};

		const handleViewClose = () => {
			this.setState({ viewOpen: false });
		};

		const handleClose = (event) => {
			this.setState({ open: false });
		};

		if (this.state.uiLoading === true) {
			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />
					{this.state.uiLoading && (
						<CircularProgress size={150} className={classes.uiProgress} />
					)}
				</main>
			);
		} else {
			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />

					<IconButton
						className={classes.floatingButton}
						color='primary'
						aria-label='Add Chore'
						onClick={handleClickOpen}
					>
						<AddCircleIcon style={{ fontSize: 60 }} />
					</IconButton>

					<Dialog
						open={open}
						onClose={handleClose}
						TransitionComponent={Transition}
					>
						<DialogTitle id='form-dialog-title'>
							{this.state.buttonType === 'Edit'
								? 'Edit Chore'
								: 'Create a new Chore'}
						</DialogTitle>
						<DialogContent>
							<form className={classes.form} noValidate>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<TextField
											fullWidth
											variant='outlined'
											required
											id='choreTitle'
											label='Title'
											name='title'
											helperText={errors.title}
											value={this.state.title}
											error={errors.title ? true : false}
											onChange={this.handleChange}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant='outlined'
											required
											fullWidth
											id='choreType'
											label='Type'
											name='type'
											autoComplete='choreType'
											multiline
											helperText={errors.type}
											error={errors.type ? true : false}
											onChange={this.handleChange}
											value={this.state.type}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant='outlined'
											multiline
											rows={4}
											required
											fullWidth
											id='choreDetails'
											label='Description'
											name='body'
											autoComplete='choreDetails'
											multiline
											helperText={errors.body}
											error={errors.body ? true : false}
											onChange={this.handleChange}
											value={this.state.body}
										/>
									</Grid>

									<Grid item xs={12}>
										<TextField
											variant='outlined'
											fullWidth
											id='choreLocation'
											label='Location'
											name='location'
											autoComplete='choreLocation'
											multiline
											helperText={errors.location}
											error={errors.location ? true : false}
											onChange={this.handleChange}
											value={this.state.location}
										/>
									</Grid>
								</Grid>
							</form>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleClose} color='primary'>
								Cancel
							</Button>
							<Button onClick={handleSubmit} color='primary'>
								{this.state.buttonType === 'Edit' ? 'Save' : 'Submit'}
							</Button>
						</DialogActions>
					</Dialog>

					<Grid container spacing={3} className='THE GRID' xs={12}>
						<Grid item xs={4}>
							{this.state.chores.map((chore) => (
								<Grid item lg={4} zeroMinWidth>
									<Card
										className={classes.root}
										variant='outlined'
										key={chore.title}
									>
										<CardContent>
											<Typography variant='h5' component='h2'>
												{chore.title}
											</Typography>
											<Typography className={classes.pos} color='textSecondary'>
												{dayjs(chore.createdAt).fromNow()}{' '}
												{chore.location ? '-' : ''} {`${chore.location}`}
											</Typography>
											<Typography variant='body2' component='p'>
												{`${chore.body.substring(0, 65)}`}
											</Typography>
											<Typography variant='body2' component='p'>
												{`${chore.type}`}
											</Typography>
										</CardContent>
										<CardActions>
											<Button
												size='small'
												color='primary'
												onClick={() => this.handleViewOpen({ chore })}
											>
												View
											</Button>
											<Button
												size='small'
												color='primary'
												onClick={() => this.handleEditClickOpen({ chore })}
											>
												Edit
											</Button>
											<Button
												size='small'
												color='primary'
												onClick={() => this.deleteChoreHandler({ chore })}
											>
												Delete
											</Button>
										</CardActions>
									</Card>
								</Grid>
							))}
						</Grid>
						<Grid item xs={8}>
							<GoogleMap chores={this.state.chores} />
						</Grid>
					</Grid>

					{/* <Dialog
						onClose={handleViewClose}
						aria-labelledby='customized-dialog-title'
						open={viewOpen}
						fullWidth
						classes={{ paperFullWidth: classes.dialogueStyle }}
					>
						<DialogTitle id='customized-dialog-title' onClose={handleViewClose}>
							{this.state.title}
						</DialogTitle>
						<DialogContent dividers>
							<TextField
								fullWidth
								id='choreDetails'
								name='body'
								multiline
								readonly
								rows={1}
								rowsMax={25}
								value={this.state.body}
								InputProps={{
									disableUnderline: true,
								}}
							/>
							<TextField
								fullWidth
								id='choreType'
								name='type'
								multiline
								readonly
								rows={1}
								rowsMax={25}
								value={this.state.type}
								InputProps={{
									disableUnderline: true,
								}}
							/>
							<TextField
								fullWidth
								id='choreLocation'
								name='location'
								multiline
								readonly
								rows={1}
								rowsMax={25}
								value={this.state.location}
								InputProps={{
									disableUnderline: true,
								}}
							/>
						</DialogContent>
					</Dialog> */}
				</main>
			);
		}
	}
}

export default withStyles(styles)(Chore);
