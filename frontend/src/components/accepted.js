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
		marginLeft: 13,
		marginTop: theme.spacing(3),
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

class accepted extends Component {
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

		this.handleViewOpen = this.handleViewOpen.bind(this);
		this.handleComplete = this.handleComplete.bind(this);
	}

	componentWillMount = () => {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get('/accepted_chores')
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

	handleViewOpen(data) {
		this.setState({
			title: data.chore.title,
			body: data.chore.body,
			type: data.chore.type,
			location: data.chore.location,
			viewOpen: true,
		});
	}

	handleComplete(data) {
		authMiddleWare(this.props.history);
		let options = {
			url: `/complete_chore/${data.chore.choreId}`,
			method: 'put',
		};
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

		const DialogContent = withStyles((theme) => ({
			viewRoot: {
				padding: theme.spacing(2),
			},
		}))(MuiDialogContent);

		dayjs.extend(relativeTime);
		const { classes } = this.props;
		const { open, errors, viewOpen } = this.state;

		const handleViewClose = () => {
			this.setState({ viewOpen: false });
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

					<Grid container spacing={2}>
						{this.state.chores.map((chore) => (
							<Grid item lg={4} zeroMinWidth>
								<Card className={classes.root} variant='outlined'>
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
											onClick={() => this.handleComplete({ chore })}
										>
											Mark as Complete
										</Button>
									</CardActions>
								</Card>
							</Grid>
						))}
					</Grid>

					<Dialog
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
					</Dialog>
				</main>
			);
		}
	}
}

export default withStyles(styles)(accepted);
