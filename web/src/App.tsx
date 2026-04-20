import React, { useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	useLocation,
	Outlet,
} from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { AbilityProvider } from "./config/AbilityProvider";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

const getCurrentTab = (path: string): string => {
	switch (path) {
		case "/":
			return "Dashboard";
		case "/users":
			return "Users";
		case "/settings":
			return "Settings";
		case "/profile":
			return "Profile";
		default:
			return "";
	}
};

const AuthenticatedLayout: React.FC = () => {
	const location = useLocation();
	const currentTab = getCurrentTab(location.pathname);
	return (
		<AppLayout currentTab={currentTab}>
			<Outlet />
		</AppLayout>
	);
};

const AppRoutes: React.FC = () => {
	const { user, isLoading } = useAuthStore();
	const isAuthenticated = !!user;

	if (isLoading) {
		return null;
	}

	return (
		<Routes>
			<Route
				path="/login"
				element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
			/>
			<Route path="/register" element={<Register />} />
			<Route element={<AuthenticatedLayout />}>
				<Route
					path="/"
					element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
				/>
				<Route
					path="/profile"
					element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />}
				/>
				<Route
					path="/users"
					element={isAuthenticated ? <Users /> : <Navigate to="/login" replace />}
				/>
				<Route
					path="/settings"
					element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />}
				/>
			</Route>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
};

function App() {
	const checkAuth = useAuthStore((state) => state.checkAuth);

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	return (
		<AbilityProvider>
			<Router>
				<AppRoutes />
			</Router>
		</AbilityProvider>
	);
}

export default App;
