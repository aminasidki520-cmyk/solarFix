import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ children }) {
    const { user, isLoading } = useAuth();

    console.log("🔍 [ProtectedRoute] isLoading =", isLoading);
    console.log("🔍 [ProtectedRoute] user =", user);

    if (isLoading) {
        return <div style={{ padding: 20, textAlign: 'center' }}>Loading...</div>;
    }

    if (!user) {
        console.warn("🚨 [ProtectedRoute] User is null. Redirecting to /login");
        return <Navigate to="/login" replace />;
    }

    console.log("✅ [ProtectedRoute] User is valid. Rendering children.");
    return children;
}