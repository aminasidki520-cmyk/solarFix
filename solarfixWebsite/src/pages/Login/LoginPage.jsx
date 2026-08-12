import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Box,
  Card,
  TextField,
  CircularProgress,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

/**
 * Solarfix - Login Page (wired to auth)
 */
const heroImageUrl = "/assets/solar-technician-hero.jpg"; 

export default function LoginPage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // true from ~900px wide

  const green = theme.palette.primary.main;
  const greenDark = theme.palette.secondary.main;

  const { login, user } = useAuth();
  const navigate = useNavigate(); // Gardé pour d'autres usages futurs

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (user) {
      console.log("🚀 [LoginPage] User detected! Navigating to Dashboard.");
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage("Please enter your username and password.");
      return;
    }
    try {
      setLoading(true);
      setErrorMessage("");
      await login(username, password);
      
      // 🚀 FIX : On supprime totalement le navigate() manuel ici.
      // C'est ProtectedRoute dans App.jsx qui gérera la redirection automatiquement.
      
    } catch (err) {
      setErrorMessage("Nom d'utilisateur ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Shared pieces (used in both layouts) ----------

  const brandBlock = (
    <>
      <Typography
        sx={{
          fontFamily: "'Segoe Script','Brush Script MT',cursive",
          fontSize: { xs: 22, sm: 26 },
          color: green,
          fontWeight: 600,
          lineHeight: 1,
        }}
      >
        green
        <Box component="span" sx={{ display: "block", fontSize: "0.7em" }}>
          park <Box component="span" sx={{ fontStyle: "italic" }}>energy</Box>
        </Box>
      </Typography>

      <Typography
        variant="h2"
        sx={{
          mt: 2,
          fontWeight: 800,
          fontSize: { xs: "2.6rem", sm: "3.2rem", md: "3.6rem" },
          color: greenDark,
          letterSpacing: -1,
        }}
      >
        Solar
        <Box component="span" sx={{ color: green }}>
          fix
        </Box>
      </Typography>

      <Typography
        sx={{
          mt: 1,
          color: isDesktop ? "rgba(255,255,255,0.9)" : "rgba(30,40,35,0.75)",
          fontSize: { xs: "0.95rem", sm: "1.05rem" },
        }}
      >
        Powering performance. Fixing the future.
      </Typography>

      <Box sx={{ mt: 1.5, width: 40, height: 3, borderRadius: 2, bgcolor: green }} />
    </>
  );

  const loginForm = (
    <>
      <Typography variant="h4" align="center" sx={{ fontWeight: 800, color: greenDark, mb: 0.5 }}>
        Logging
      </Typography>

      <Box sx={{ width: 36, height: 3, borderRadius: 2, bgcolor: green, mx: "auto", mb: 2 }} />

      <Typography align="center" sx={{ color: "text.secondary", mb: 3, fontSize: "0.95rem" }}>
        Enter your credentials to access your account
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
          {errorMessage}
        </Alert>
      )}

      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleLogin}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          placeholder="Username"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineRoundedIcon sx={{ color: green }} />
              </InputAdornment>
            ),
            sx: { borderRadius: "14px" },
          }}
        />

        <TextField
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ color: green }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                </IconButton>
              </InputAdornment>
            ),
            sx: { borderRadius: "14px" },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disableElevation
          disabled={loading}
          sx={{
            mt: 1,
            py: 1.4,
            borderRadius: "14px",
            bgcolor: green,
            fontWeight: 700,
            fontSize: "1rem",
            textTransform: "none",
            "&:hover": { bgcolor: "#5f9b33" },
          }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : "Log in"}
        </Button>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
        <Divider sx={{ flexGrow: 1 }} />
        <Typography sx={{ mx: 2, color: "text.secondary" }}>or</Typography>
        <Divider sx={{ flexGrow: 1 }} />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
        <VerifiedUserOutlinedIcon sx={{ color: green, fontSize: 20 }} />
        <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
          Secure access for authorized users only
        </Typography>
      </Box>
    </>
  );

  // ---------- DESKTOP LAYOUT ----------
  if (isDesktop) {
    return (
      <Box sx={{ minHeight: "100vh", width: "100%", display: "flex" }}>
        <Box
          sx={{
            flex: 1,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 6,
            backgroundImage: `linear-gradient(180deg, rgba(10,30,20,0.35) 0%, rgba(10,30,20,0.55) 100%), url(${heroImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#274b3f",
          }}
        >
          {brandBlock}
        </Box>
        <Box
          sx={{
            flex: 1,
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#ffffff",
            px: 6,
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 420 }}>{loginForm}</Box>
        </Box>
      </Box>
    );
  }

  // ---------- MOBILE LAYOUT ----------
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "#eaf2e4",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 480,
          minHeight: { xs: 420, sm: 480 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          pt: { xs: 5, sm: 6 },
          px: 3,
          textAlign: "center",
          backgroundImage: `linear-gradient(180deg, rgba(120,180,220,0.15) 0%, rgba(120,180,220,0.05) 60%), url(${heroImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#bcd8ea",
          overflow: "hidden",
        }}
      >
        {brandBlock}
      </Box>

      <Card
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 480,
          mt: { xs: -6, sm: -8 },
          borderRadius: "28px 28px 0 0",
          px: { xs: 3, sm: 5 },
          py: { xs: 4, sm: 5 },
          zIndex: 1,
          flexGrow: 1,
        }}
      >
        {loginForm}
      </Card>
    </Box>
  );
}