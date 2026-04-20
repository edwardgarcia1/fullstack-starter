import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Drawer,
	List,
	ListItemIcon,
	ListItemText,
	Box,
	ListItemButton,
	Typography,
	Menu,
	MenuItem,
	Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { Can } from "@casl/react";
import { useAbility } from "../config/AbilityProvider";
import { useAuthStore } from "../store/useAuthStore";

interface AppSidebarProps {
	mobileOpen: boolean;
	onToggle: () => void;
	drawerWidth: number;
}

const AppSidebar: React.FC<AppSidebarProps> = ({
	mobileOpen,
	onToggle,
	drawerWidth,
}) => {
	const appName = import.meta.env.VITE_APP_NAME || "App";
	const navigate = useNavigate();
	const ability = useAbility();
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		handleMenuClose();
		logout();
		navigate("/login");
	};

	const drawer = (
		<Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
			<Box
				sx={{
					p: 2,
					display: "flex",
					alignItems: "center",
					gap: 1,
				}}
			>
				<Typography variant="h6" component="div">
					{appName}
				</Typography>
			</Box>
			<List sx={{ flexGrow: 1 }}>
				<ListItemButton onClick={() => navigate("/")}>
					<ListItemIcon>
						<DashboardIcon />
					</ListItemIcon>
					<ListItemText primary="Dashboard" />
				</ListItemButton>
				<Can I="read" a="users" ability={ability}>
					<ListItemButton onClick={() => navigate("/users")}>
						<ListItemIcon>
							<PeopleIcon />
						</ListItemIcon>
						<ListItemText primary="Users" />
					</ListItemButton>
				</Can>
				<Can I="read" a="settings" ability={ability}>
					<ListItemButton onClick={() => navigate("/settings")}>
						<ListItemIcon>
							<SettingsIcon />
						</ListItemIcon>
						<ListItemText primary="Settings" />
					</ListItemButton>
				</Can>
			</List>
			<Divider />
			<Box>
				<ListItemButton
					onClick={handleMenuClick}
					sx={{
						borderRadius: 0,
						px: 2,
						"&:hover": {
							backgroundColor: "action.hover",
						},
					}}
				>
					<ListItemIcon>
						<AccountCircleIcon />
					</ListItemIcon>
					<ListItemText
						primary={user?.name || user?.username || "User"}
						secondary={user?.username ? `@${user.username}` : ""}
					/>
				</ListItemButton>
				<Menu
					anchorEl={anchorEl}
					open={open}
					onClose={handleMenuClose}
					anchorOrigin={{
						vertical: "top",
						horizontal: "left",
					}}
					transformOrigin={{
						vertical: "bottom",
						horizontal: "left",
					}}
				>
					<MenuItem
						onClick={() => {
							handleMenuClose();
							navigate("/profile");
						}}
					>
						<ListItemIcon>
							<AccountCircleIcon fontSize="small" />
						</ListItemIcon>
						Profile
					</MenuItem>
					<MenuItem onClick={handleLogout}>
						<ListItemIcon>
							<LogoutIcon fontSize="small" />
						</ListItemIcon>
						Logout
					</MenuItem>
				</Menu>
			</Box>
		</Box>
	);

	return (
		<Box
			component="nav"
			sx={{
				width: { md: drawerWidth },
				flexShrink: { md: 0 },
				position: "relative",
			}}
		>
			<Drawer
				variant="temporary"
				open={mobileOpen}
				onClose={onToggle}
				ModalProps={{
					keepMounted: true,
				}}
				sx={{
					display: { xs: "block", md: "none" },
					"& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
				}}
			>
				{drawer}
			</Drawer>
			<Drawer
				variant="permanent"
				sx={{
					display: { xs: "none", md: "block" },
					"& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
				}}
				open
			>
				{drawer}
			</Drawer>
		</Box>
	);
};

export default AppSidebar;
