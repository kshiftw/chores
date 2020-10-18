import React, { Component } from 'react';
import axios from 'axios';

import Account from '../components/account';
import Chore from '../components/chore';
import Assist from '../components/assist';
import Accepted from '../components/accepted';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import Avatar from '@material-ui/core/avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';

import { authMiddleWare } from '../util/auth';

const drawerWidth = 240;

const styles = (theme) => ({
	root: {
		display: 'flex',
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	avatar: {
		height: 110,
		width: 100,
		flexShrink: 0,
		flexGrow: 0,
		marginTop: 20,
	},
	uiProgress: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '45%',
		top: '35%',
	},
	toolbar: theme.mixins.toolbar,
});

class home extends Component {
	loadAccountPage = (event) => {
		this.setState({
			renderAccount: true,
			renderChore: false,
			renderAssist: false,
			renderAccepted: false,
		});
	};

	loadChorePage = (event) => {
		this.setState({
			renderAccount: false,
			renderChore: true,
			renderAssist: false,
			renderAccepted: false,
		});
	};

	loadAssistPage = (event) => {
		this.setState({
			renderAccount: false,
			renderChore: false,
			renderAssist: true,
			renderAccepted: false,
		});
	};

	loadAcceptedPage = (event) => {
		this.setState({
			renderAccount: false,
			renderChore: false,
			renderAssist: false,
			renderAccepted: true,
		});
	};

	logoutHandler = (event) => {
		localStorage.removeItem('AuthToken');
		this.props.history.push('/login');
	};

	constructor(props) {
		super(props);

		this.state = {
			firstName: '',
			lastName: '',
			profilePicture: '',
			uiLoading: true,
			imageLoading: false,
			renderAccount: false,
			renderChore: true,
			renderAssist: false,
			renderAccepted: false,
		};
	}

	componentWillMount = () => {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		axios
			.get('/user')
			.then((response) => {
				console.log(response.data);
				this.setState({
					firstName: response.data.userCredentials.firstName,
					lastName: response.data.userCredentials.lastName,
					email: response.data.userCredentials.email,
					phoneNumber: response.data.userCredentials.phoneNumber,
					country: response.data.userCredentials.country,
					username: response.data.userCredentials.username,
					uiLoading: false,
					profilePicture: response.data.userCredentials.imageUrl,
				});
			})
			.catch((error) => {
				if (error.response.status === 403) {
					this.props.history.push('/login');
				}
				console.log(error);
				this.setState({ errorMsg: 'Error in retrieving the data' });
			});
	};

	render() {
		const { classes } = this.props;
		const {
			renderAccount,
			renderChore,
			renderAssist,
			renderAccepted,
		} = this.state;
		if (this.state.uiLoading === true) {
			return (
				<div className={classes.root}>
					{this.state.uiLoading && (
						<CircularProgress size={150} className={classes.uiProgress} />
					)}
				</div>
			);
		} else {
			let subpage;
			if (renderAccount && !renderChore && !renderAssist && !renderAccepted) {
				subpage = <Account />;
			} else if (
				!renderAccount &&
				renderChore &&
				!renderAssist &&
				!renderAccepted
			) {
				subpage = <Chore />;
			} else if (
				!renderAccount &&
				!renderChore &&
				renderAssist &&
				!renderAccepted
			) {
				subpage = <Assist />;
			} else if (
				!renderAccount &&
				!renderChore &&
				!renderAssist &&
				renderAccepted
			) {
				subpage = <Accepted />;
			}

			return (
				<div className={classes.root}>
					<CssBaseline />
					<AppBar position='fixed' className={classes.appBar}>
						<Toolbar>
							<Typography variant='h6' noWrap>
								Chores Backspace
							</Typography>
						</Toolbar>
					</AppBar>
					<Drawer
						className={classes.drawer}
						variant='permanent'
						classes={{
							paper: classes.drawerPaper,
						}}
					>
						<div className={classes.toolbar} />
						<Divider />
						<center>
							<Avatar
								src={this.state.profilePicture}
								className={classes.avatar}
							/>
							<p>
								{this.state.firstName} {this.state.lastName}
							</p>
						</center>
						<Divider />
						<List>
							<ListItem
								button
								key='Chore'
								onClick={this.loadChorePage}
								selected={renderChore}
							>
								<ListItemIcon>
									<NotesIcon />
								</ListItemIcon>
								<ListItemText primary='My Chores' />
							</ListItem>

							<ListItem
								button
								key='Assist'
								onClick={this.loadAssistPage}
								selected={renderAssist}
							>
								<ListItemIcon>
									<NotesIcon />
								</ListItemIcon>
								<ListItemText primary='Assist' />
							</ListItem>

							<ListItem
								button
								key='Accepted'
								onClick={this.loadAcceptedPage}
								selected={renderAccepted}
							>
								<ListItemIcon>
									<NotesIcon />
								</ListItemIcon>
								<ListItemText primary='Accepted' />
							</ListItem>

							<ListItem
								button
								key='Account'
								onClick={this.loadAccountPage}
								selected={renderAccount}
							>
								<ListItemIcon>
									<AccountBoxIcon />
								</ListItemIcon>
								<ListItemText primary='Account' />
							</ListItem>

							<ListItem button key='Logout' onClick={this.logoutHandler}>
								<ListItemIcon>
									<ExitToAppIcon />
								</ListItemIcon>
								<ListItemText primary='Logout' />
							</ListItem>
						</List>
					</Drawer>

					<div>{subpage}</div>
				</div>
			);
		}
	}
}

export default withStyles(styles)(home);
