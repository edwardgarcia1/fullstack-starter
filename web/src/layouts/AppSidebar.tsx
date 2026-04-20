import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Drawer,
	List,
	ListItemIcon,
	ListItemText,
	Box,
	Divider,
	ListItemButton,
	Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import { Can } from '@casl/react';
import { useAbility } from '../config/AbilityProvider';

interface AppSidebarProps {
	mobileOpen: boolean;
	onToggle: () => void;
	drawerWidth: number;
	appName: string;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ mobileOpen, onToggle, drawerWidth, appName }) => {
	const navigate = useNavigate();
	const ability = useAbility();
	
	const drawer = (
		<div>
			<Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
				<Typography variant="h6" component="div">
					{appName}
				</Typography>
			</Box>
			<Divider />
			<List>
				<ListItemButton onClick={() => navigate('/')}>
					<ListItemIcon>
						<DashboardIcon />
					</ListItemIcon>
					<ListItemText primary="Dashboard" />
				</ListItemButton>
				<Can I="read" a="users" ability={ability}>
					<ListItemButton onClick={() => navigate('/users')}>
						<ListItemIcon>
							<PeopleIcon />
						</ListItemIcon>
						<ListItemText primary="Users" />
					</ListItemButton>
				</Can>
				<Can I="read" a="settings" ability={ability}>
					<ListItemButton onClick={() => navigate('/settings')}>
						<ListItemIcon>
							<SettingsIcon />
						</ListItemIcon>
						<ListItemText primary="Settings" />
					</ListItemButton>
				</Can>
			</List>
		</div>
	);

	return (
		<Box
			component="nav"
			sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 }, position: 'relative' }}
		>
			<Drawer
				variant="temporary"
				open={mobileOpen}
				onClose={onToggle}
				ModalProps={{
					keepMounted: true,
				}}
				sx={{
					display: { xs: 'block', md: 'none' },
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
				}}
			>
				{drawer}
			</Drawer>
			<Drawer
				variant="permanent"
				sx={{
					display: { xs: 'none', md: 'block' },
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
				}}
				open
			>
				{drawer}
			</Drawer>
		</Box>
	);
};

export default AppSidebar;
