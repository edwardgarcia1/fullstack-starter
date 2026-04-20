import React, { useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Users from "./pages/Users";

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
			<Route
				path="/"
				element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
			/>
			<Route
				path="/users"
				element={isAuthenticated ? <Users /> : <Navigate to="/login" replace />}
			/>
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
		<Router>
			<AppRoutes />
		</Router>
	);
}

export default App;
