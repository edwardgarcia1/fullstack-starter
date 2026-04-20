import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
	Drawer,
	List,
	ListItemIcon,
	ListItemText,
	Box,
	ListItemButton,
	Typography,
	Divider,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Can } from "@casl/react";
import { useAbility } from "../config/AbilityProvider";
import { useAuthStore } from "../store/useAuthStore";

interface AppSidebarProps {
	mobileOpen: boolean;
	onToggle: () => void;
	drawerWidth: number;
	collapsed: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({
	mobileOpen,
	onToggle,
	drawerWidth,
	collapsed,
}) => {
	const appName = import.meta.env.VITE_APP_NAME || "App";
	const abbreviation = appName
		.split(/[\s-]+/)
		.map((w: string) => w[0]?.toUpperCase() ?? "")
		.join("")
		.slice(0, 2);
	const navigate = useNavigate();
	const ability = useAbility();
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);
	const collapsedWidth = 56;
	const effectiveWidth = collapsed ? collapsedWidth : drawerWidth;

	// Swipe handling state
	const touchStartX = useRef(0);
	const touchEndX = useRef(0);
	const MIN_SWIPE_THRESHOLD = 50;

	const handleTouchStart = (e: React.TouchEvent) => {
		touchStartX.current = e.changedTouches[0].screenX;
	};

	const handleTouchEnd = (e: React.TouchEvent) => {
		touchEndX.current = e.changedTouches[0].screenX;
		handleSwipe();
	};

	const handleSwipe = () => {
		const swipeDistance = touchEndX.current - touchStartX.current;

		// Swipe right to open
		if (swipeDistance > MIN_SWIPE_THRESHOLD && !mobileOpen) {
			onToggle();
		}
		// Swipe left to close
		if (swipeDistance < -MIN_SWIPE_THRESHOLD && mobileOpen) {
			onToggle();
		}
	};

	const handleLogout = () => {
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
					{collapsed ? abbreviation : appName}
				</Typography>
			</Box>
			<List sx={{ flexGrow: 1 }}>
				<ListItemButton onClick={() => navigate("/")}>
					<ListItemIcon>
						<DashboardIcon />
					</ListItemIcon>
					{!collapsed && <ListItemText primary="Dashboard" />}
				</ListItemButton>
				<Can I="read" a="users" ability={ability}>
					<ListItemButton onClick={() => navigate("/users")}>
						<ListItemIcon>
							<PeopleIcon />
						</ListItemIcon>
						{!collapsed && <ListItemText primary="Users" />}
					</ListItemButton>
				</Can>
				<Can I="read" a="settings" ability={ability}>
					<ListItemButton onClick={() => navigate("/settings")}>
						<ListItemIcon>
							<SettingsIcon />
						</ListItemIcon>
						{!collapsed && <ListItemText primary="Settings" />}
					</ListItemButton>
				</Can>
			</List>
			<Divider />
			<Accordion
				sx={{
					boxShadow: "none",
					"&:before": { display: "none" },
					"&.Mui-expanded": { margin: 0 },
				}}
			>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					sx={{
						px: 2,
						minHeight: 48,
						"&.Mui-expanded": { minHeight: 48 },
						display: "flex",
						alignItems: "center",
					}}
				>
					{!collapsed && (
						<ListItemIcon sx={{ minWidth: 40 }}>
							<AccountCircleIcon />
						</ListItemIcon>
					)}
					{!collapsed && (
						<Box>
							<Typography variant="body2" sx={{ fontWeight: "bold" }}>
								{user?.name || user?.username || "User"}
							</Typography>
							{user?.username && (
								<Typography variant="caption" color="text.secondary">
									@{user.username}
								</Typography>
							)}
						</Box>
					)}
				</AccordionSummary>
				<AccordionDetails sx={{ p: 0 }}>
					<ListItemButton onClick={() => navigate("/profile")} sx={{ py: 1 }}>
						<ListItemIcon>
							<AccountCircleIcon fontSize="small" />
						</ListItemIcon>
						{!collapsed && <ListItemText primary="Profile" />}
					</ListItemButton>
					<ListItemButton onClick={handleLogout} sx={{ py: 1 }}>
						<ListItemIcon>
							<LogoutIcon fontSize="small" />
						</ListItemIcon>
						{!collapsed && <ListItemText primary="Logout" />}
					</ListItemButton>
				</AccordionDetails>
			</Accordion>
		</Box>
	);

	return (
		<Box
			component="nav"
			sx={{
				width: { md: effectiveWidth },
				flexShrink: { md: 0 },
				position: "relative",
			}}
		>
			{/* Touch edge for opening sidebar on mobile */}
			<Box
				sx={{
					display: { xs: "block", md: "none" },
					position: "fixed",
					left: 0,
					top: 0,
					width: 20,
					height: "100vh",
					zIndex: 1300, // Above drawer
					cursor: "pointer",
				}}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
			/>
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
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
			>
				{drawer}
			</Drawer>
			<Drawer
				variant="permanent"
				sx={{
					display: { xs: "none", md: "block" },
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: effectiveWidth,
					},
				}}
				open
			>
				{drawer}
			</Drawer>
		</Box>
	);
};

export default AppSidebar;
