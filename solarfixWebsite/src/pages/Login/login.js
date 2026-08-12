import React, { useState } from "react";
import {
    Box,
    Card,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    Divider,
} from "@mui/material";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

/**
 * Solarfix - Login Page (UI only)
 * -------------------------------------------------
 * Pure presentational component. No auth logic, no API calls.
 * Replace `heroImageUrl` with your own asset path (e.g. import from /assets).
 * Wire `onSubmit` / field state to your auth logic wherever you integrate this.
 */

const GREEN = "#6DAF3C"; // primary brand green
const GREEN_DARK = "#274b3f"; // dark navy-green text
const heroImageUrl = "/assets/solar-technician-hero.jpg"; // <-- put your own image here

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleTogglePassword = () => setShowPassword((prev) => !prev);

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
            {/* ---------- Hero section ---------- */}
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
                    backgroundColor: "#bcd8ea", // fallback sky tone if image is missing
                    overflow: "hidden",
                }}
            >
                {/* Brand logo / wordmark */}
                <Typography
                    sx={{
                        fontFamily: "'Segoe Script','Brush Script MT',cursive",
                        fontSize: { xs: 22, sm: 26 },
                        color: GREEN,
                        fontWeight: 600,
                        lineHeight: 1,
                    }}
                >
                    green
                    <Box component="span" sx={{ display: "block", fontSize: "0.7em" }}>
                        park <Box component="span" sx={{ fontStyle: "italic" }}>energy</Box>
                    </Box>
                </Typography>

                {/* Product title */}
                <Typography
                    variant="h2"
                    sx={{
                        mt: 2,
                        fontWeight: 800,
                        fontSize: { xs: "2.6rem", sm: "3.2rem" },
                        color: GREEN_DARK,
                        letterSpacing: -1,
                    }}
                >
                    Solar
                    <Box component="span" sx={{ color: GREEN }}>
                        fix
                    </Box>
                </Typography>

                <Typography
                    sx={{
                        mt: 1,
                        color: "rgba(30,40,35,0.75)",
                        fontSize: { xs: "0.95rem", sm: "1.05rem" },
                    }}
                >
                    Powering performance. Fixing the future.
                </Typography>

                {/* small accent underline */}
                <Box
                    sx={{
                        mt: 1.5,
                        width: 40,
                        height: 3,
                        borderRadius: 2,
                        bgcolor: GREEN,
                    }}
                />
            </Box>

            {/* ---------- Login card (overlaps hero) ---------- */}
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
                <Typography
                    variant="h4"
                    align="center"
                    sx={{ fontWeight: 800, color: GREEN_DARK, mb: 0.5 }}
                >
                    Logging
                </Typography>

                {/* accent underline under title */}
                <Box
                    sx={{
                        width: 36,
                        height: 3,
                        borderRadius: 2,
                        bgcolor: GREEN,
                        mx: "auto",
                        mb: 2,
                    }}
                />

                <Typography
                    align="center"
                    sx={{ color: "text.secondary", mb: 3, fontSize: "0.95rem" }}
                >
                    Enter your credentials to access your account
                </Typography>

                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
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
                                    <PersonOutlineRoundedIcon sx={{ color: GREEN }} />
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
                                    <LockOutlinedIcon sx={{ color: GREEN }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleTogglePassword} edge="end">
                                        {showPassword ? (
                                            <VisibilityOffOutlinedIcon />
                                        ) : (
                                            <VisibilityOutlinedIcon />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: { borderRadius: "14px" },
                        }}
                    />

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        disableElevation
                        sx={{
                            mt: 1,
                            py: 1.4,
                            borderRadius: "14px",
                            bgcolor: GREEN,
                            fontWeight: 700,
                            fontSize: "1rem",
                            textTransform: "none",
                            "&:hover": { bgcolor: "#5f9b33" },
                        }}
                    >
                        Log in
                    </Button>
                </Box>

                {/* Divider with "or" */}
                <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
                    <Divider sx={{ flexGrow: 1 }} />
                    <Typography sx={{ mx: 2, color: "text.secondary" }}>or</Typography>
                    <Divider sx={{ flexGrow: 1 }} />
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                    }}
                >
                    <VerifiedUserOutlinedIcon sx={{ color: GREEN, fontSize: 20 }} />
                    <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
                        Secure access for authorized users only
                    </Typography>
                </Box>
            </Card>
        </Box>
    );
}
