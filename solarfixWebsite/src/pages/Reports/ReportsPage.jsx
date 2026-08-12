// src/pages/ReportsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  InputBase,
  Select,
  MenuItem,
  TextField,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  Snackbar,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";

import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";

import reportService from "../../services/reportService";
import ticketService from "../../services/ticketService";

const COLORS = {
  pageBg: "#F8FAFC",
  cardBorder: "#E8ECEE",
  accentDark: "#7FB35C",
  titleDark: "#183B2B",
  sectionHeaderBg: "#EEF7E9",
  textMuted: "#64748B",
  textSecondary: "#3F4A44",
  white: "#FFFFFF",
  warningBg: "#FDEFD9",
  warningText: "#B8791F",
  dangerBg: "#FBE4E4",
  dangerText: "#C0392B",
  neutralBg: "#EEF1EF",
  neutralText: "#5B655F",
  focusRing: "rgba(127, 179, 92, 0.4)",
};

const SECTION_GAP = 2.5; 
const RADIUS = "22px";

const STATUS_STYLES = {
  DRAFT: { bg: COLORS.neutralBg, text: COLORS.neutralText, label: "Draft" },
  SUBMITTED: { bg: COLORS.warningBg, text: COLORS.warningText, label: "Submitted" },
  APPROVED: { bg: "#E4F3DC", text: "#4C8A34", label: "Approved" },
  REJECTED: { bg: COLORS.dangerBg, text: COLORS.dangerText, label: "Rejected" },
};

function formatDate(dateString) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  const datePart = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  const timePart = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return `${datePart} à ${timePart}`;
}

function StatusChip({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.DRAFT;
  return <Chip label={style.label} size="small" sx={{ backgroundColor: style.bg, color: style.text, fontWeight: 600, fontSize: "0.7rem", borderRadius: "6px" }} />;
}

function GenerateReportDialog({ open, onClose, tickets, onCreated, onToast }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => { setTitle(""); setContent(""); setTicketId(""); };
  const handleClose = () => { if (submitting) return; reset(); onClose(); };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !ticketId) return;
    setSubmitting(true);
    try {
      await reportService.create({ title: title.trim(), content: content.trim(), ticketId });
      onToast({ type: "success", message: "Rapport généré avec succès." });
      reset(); onCreated(); onClose();
    } catch (error) {
      onToast({ type: "error", message: "Impossible de créer le rapport." });
    } finally { setSubmitting(false); }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "18px" } }}>
      <DialogTitle sx={{ fontWeight: 700, color: COLORS.titleDark }}>Generate Report</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 0.5 }}>
          <TextField label="Titre" fullWidth size="small" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField select label="Ticket lié" fullWidth size="small" value={ticketId} onChange={(e) => setTicketId(e.target.value)}>
            {tickets.map((t) => <MenuItem key={t.ticketId} value={t.ticketId}>#{t.ticketId} — {t.title}</MenuItem>)}
          </TextField>
          <TextField label="Contenu" fullWidth multiline minRows={5} value={content} onChange={(e) => setContent(e.target.value)} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={handleClose} disabled={submitting} sx={{ textTransform: "none", color: COLORS.textMuted }}>Annuler</Button>
        <Button onClick={handleSubmit} disabled={submitting || !title.trim() || !content.trim() || !ticketId} variant="contained" sx={{ textTransform: "none", fontWeight: 600, borderRadius: "10px", backgroundColor: COLORS.accentDark, "&:hover": { backgroundColor: "#6EA24E" } }}>
          {submitting ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Générer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ViewReportDialog({ report, onClose }) {
  if (!report) return null;
  return (
    <Dialog open={!!report} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "18px" } }}>
      <DialogTitle sx={{ fontWeight: 700, color: COLORS.titleDark }}>{report.title}</DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
          <StatusChip status={report.status} />
          <Typography fontSize="0.78rem" color={COLORS.textMuted}>Ticket #{report.ticketId}</Typography>
        </Box>
        <Typography sx={{ fontSize: "0.95rem", color: COLORS.textSecondary, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
          {report.content}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} sx={{ textTransform: "none", color: COLORS.textMuted }}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [generateOpen, setGenerateOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuReport, setMenuReport] = useState(null);
  const [downloadAnchor, setDownloadAnchor] = useState(null);
  const [downloadReport, setDownloadReport] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reportsRes, ticketsRes] = await Promise.allSettled([ reportService.getAll(), ticketService.getAll() ]);
      setReports(Array.isArray(reportsRes.value) ? reportsRes.value : []);
      setTickets(Array.isArray(ticketsRes.value) ? ticketsRes.value : []);
    } catch (error) {
      console.error("Erreur de chargement des rapports :", error);
    } finally { setLoading(false); }
  };

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches = r.title?.toLowerCase().includes(q) || r.ticket?.title?.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (dateFrom && new Date(r.createdAt) < new Date(dateFrom)) return false;
      if (dateTo && new Date(r.createdAt) > new Date(`${dateTo}T23:59:59`)) return false;
      return true;
    });
  }, [reports, searchTerm, statusFilter, dateFrom, dateTo]);

  const handleDownload = (report, format) => {
    let blob, filename = `${report.title.replace(/\s+/g, "_")}.${format}`;
    switch (format) {
      case 'txt': blob = new Blob([`${report.title}\n\n${report.content}`], { type: 'text/plain' }); break;
      case 'md': blob = new Blob([`# ${report.title}\n\n${report.content}`], { type: 'text/markdown' }); break;
      case 'json': blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }); break;
      case 'html':
        const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${report.title}</title><style>body{font-family:system-ui;max-width:800px;margin:40px auto;padding:20px;line-height:1.6}h1{color:#183B2B;border-bottom:2px solid #A7D08C}</style></head><body><h1>${report.title}</h1><p><em>Ticket #${report.ticketId} - ${formatDate(report.createdAt)}</em></p><pre>${report.content}</pre></body></html>`;
        blob = new Blob([html], { type: 'text/html' }); break;
      default: blob = new Blob([`${report.title}\n\n${report.content}`], { type: 'text/plain' });
    }
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
    setDownloadAnchor(null); setDownloadReport(null);
  };

  const handleChangeStatus = async (reportId, newStatus) => {
    try {
      await reportService.updateStatus(reportId, newStatus);
      setToast({ type: "success", message: `Statut mis à jour : ${STATUS_STYLES[newStatus]?.label}` });
      loadData();
    } catch (error) {
      setToast({ type: "error", message: "Erreur lors de la mise à jour." });
    } finally { setMenuAnchor(null); setMenuReport(null); }
  };

  const handleDelete = async (reportId) => {
    try {
      await reportService.delete(reportId);
      setToast({ type: "success", message: "Rapport supprimé avec succès." });
      loadData();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || "Erreur lors de la suppression.";
      setToast({ type: "error", message: errorMessage });
    } finally { setMenuAnchor(null); setMenuReport(null); }
  };

  if (loading) {
    return (
      <Box sx={{ height: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress sx={{ color: COLORS.accentDark }} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: COLORS.pageBg, p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      

      {/* 2. STAT CARD */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: RADIUS, border: `1px solid ${COLORS.cardBorder}`, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', maxWidth: 320 }}>
        <Box sx={{ width: 48, height: 48, borderRadius: "12px", bgcolor: COLORS.sectionHeaderBg, color: COLORS.accentDark, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
          <DescriptionRoundedIcon fontSize="medium" />
        </Box>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.textSecondary }}>Total Reports</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: COLORS.titleDark, lineHeight: 1.2 }}>{reports.length}</Typography>
          <Typography variant="caption" sx={{ color: COLORS.textMuted }}>report{reports.length > 1 ? 's' : ''} generated</Typography>
        </Box>
      </Paper>

      {/* 3. TOOLBAR (FILTRES) */}
      <Paper elevation={0} sx={{ borderRadius: RADIUS, border: `1px solid ${COLORS.cardBorder}`, p: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${COLORS.cardBorder}`, borderRadius: '999px', px: 1.5, py: 0.6, bgcolor: COLORS.white, minWidth: 180, "&:focus-within": { borderColor: COLORS.accentDark, boxShadow: `0 0 0 2px ${COLORS.focusRing}` } }}>
            <SearchRoundedIcon sx={{ color: COLORS.textMuted, fontSize: 18, mr: 1 }} />
            <InputBase placeholder="Search reports..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ fontSize: "0.85rem", width: "100%" }} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${COLORS.cardBorder}`, borderRadius: '999px', px: 1.5, py: 0.6, bgcolor: COLORS.white, gap: 0.5, "&:focus-within": { borderColor: COLORS.accentDark, boxShadow: `0 0 0 2px ${COLORS.focusRing}` } }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: COLORS.textMuted, fontSize: "0.75rem" }}>From</Typography>
            <input type="date" style={{ border: 'none', outline: 'none', fontSize: '0.85rem', width: '105px', background: 'transparent', color: COLORS.textPrimary }} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <CalendarMonthRoundedIcon sx={{ color: COLORS.textMuted, fontSize: 16 }} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${COLORS.cardBorder}`, borderRadius: '999px', px: 1.5, py: 0.6, bgcolor: COLORS.white, gap: 0.5, "&:focus-within": { borderColor: COLORS.accentDark, boxShadow: `0 0 0 2px ${COLORS.focusRing}` } }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: COLORS.textMuted, fontSize: "0.75rem" }}>To</Typography>
            <input type="date" style={{ border: 'none', outline: 'none', fontSize: '0.85rem', width: '105px', background: 'transparent', color: COLORS.textPrimary }} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            <CalendarMonthRoundedIcon sx={{ color: COLORS.textMuted, fontSize: 16 }} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Select size="small" value="ALL" disabled sx={{ fontSize: "0.8rem", minWidth: 80, borderRadius: "999px", bgcolor: COLORS.white, "& .MuiOutlinedInput-notchedOutline": { borderColor: COLORS.cardBorder } }}>
            <MenuItem value="ALL">Types</MenuItem>
          </Select>
          <Select size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ fontSize: "0.8rem", minWidth: 80, borderRadius: "999px", bgcolor: COLORS.white, "& .MuiOutlinedInput-notchedOutline": { borderColor: COLORS.cardBorder } }}>
            <MenuItem value="ALL">Statuses</MenuItem>
            {Object.keys(STATUS_STYLES).map((s) => (<MenuItem key={s} value={s}>{STATUS_STYLES[s].label}</MenuItem>))}
          </Select>
          <Button onClick={() => setGenerateOpen(true)} startIcon={<AddRoundedIcon />} size="small" sx={{ textTransform: "none", fontWeight: 600, borderRadius: "999px", backgroundColor: COLORS.accentDark, color: "#fff", px: 2.5, py: 0.8, "&:hover": { backgroundColor: "#6EA24E" } }}>
            Generate Report
          </Button>
        </Box>
      </Paper>

      {/* 4. TABLEAU DE RAPPORTS (Colonnes Size et Downloads supprimées) */}
      <Paper elevation={0} sx={{ borderRadius: RADIUS, border: `1px solid ${COLORS.cardBorder}`, overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <TableContainer sx={{ bgcolor: COLORS.white }}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: COLORS.sectionHeaderBg }}>
                {/*  On retire SIZE et DOWNLOADS du Header */}
                {["REPORT", "CATEGORY", "GENERATED", "STATUS", "ACTIONS"].map((head) => (
                  <TableCell key={head} sx={{ color: COLORS.textMuted, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", py: 1.5, px: 2 }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  {/* 🚀 Le colSpan passe de 7 à 5 */}
                  <TableCell colSpan={5} sx={{ border: "none", py: 4, textAlign: "center", verticalAlign: "middle" }}>
                    <Typography color={COLORS.textMuted} fontSize="0.85rem">Aucun rapport trouvé.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report.reportId} sx={{ "&:last-of-type td": { borderBottom: "none" } }}>
                    {/* REPORT */}
                    <TableCell sx={{ borderBottom: `1px solid ${COLORS.cardBorder}`, py: 1.5, px: 2 }}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Box sx={{ width: 30, height: 30, borderRadius: "8px", bgcolor: COLORS.sectionHeaderBg, color: COLORS.accentDark, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <DescriptionRoundedIcon fontSize="small" />
                        </Box>
                        <Box>
                          <Typography fontSize="0.85rem" fontWeight={600} color={COLORS.titleDark}>{report.title}</Typography>
                          <Typography fontSize="0.7rem" color={COLORS.textMuted}>Ticket #{report.ticketId}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    {/* CATEGORY */}
                    <TableCell sx={{ borderBottom: `1px solid ${COLORS.cardBorder}`, px: 2 }}><Typography fontSize="0.78rem" color={COLORS.textMuted}>—</Typography></TableCell>
                    {/* GENERATED */}
                    <TableCell sx={{ borderBottom: `1px solid ${COLORS.cardBorder}`, px: 2 }}><Typography fontSize="0.78rem" color={COLORS.textSecondary} noWrap>{formatDate(report.createdAt)}</Typography></TableCell>
                    {/* STATUS */}
                    <TableCell sx={{ borderBottom: `1px solid ${COLORS.cardBorder}`, px: 2 }}><StatusChip status={report.status} /></TableCell>
                    {/* ACTIONS */}
                    <TableCell sx={{ borderBottom: `1px solid ${COLORS.cardBorder}`, px: 2 }} align="right">
                      <Box display="flex" justifyContent="flex-end">
                        <IconButton size="small" onClick={() => setViewingReport(report)}>
                          <VisibilityRoundedIcon sx={{ fontSize: 18, color: COLORS.textMuted }} />
                        </IconButton>
                        <IconButton size="small" onClick={(e) => { setDownloadAnchor(e.currentTarget); setDownloadReport(report); }}>
                          <FileDownloadRoundedIcon sx={{ fontSize: 18, color: COLORS.textMuted }} />
                        </IconButton>
                        <IconButton size="small" onClick={(e) => { setMenuAnchor(e.currentTarget); setMenuReport(report); }}>
                          <MoreVertRoundedIcon sx={{ fontSize: 18, color: COLORS.textMuted }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 5. BANNIÈRE "SECURE & RELIABLE" */}
      <Paper elevation={0} sx={{ borderRadius: RADIUS, bgcolor: COLORS.sectionHeaderBg, px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${COLORS.cardBorder}`, flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: "12px", bgcolor: COLORS.white, color: COLORS.accentDark, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SecurityRoundedIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: COLORS.titleDark }}>Secure & Reliable</Typography>
            <Typography variant="body2" sx={{ color: COLORS.textMuted, fontSize: "0.8rem" }}>
              All reports are securely stored and available for download anytime.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ color: COLORS.accentDark, opacity: 0.5, display: { xs: 'none', sm: 'block' } }}>
          <InsertDriveFileRoundedIcon sx={{ width: 36, height: 36 }} />
        </Box>
      </Paper>

      {/* Dialogues & Menus */}
      <GenerateReportDialog open={generateOpen} onClose={() => setGenerateOpen(false)} tickets={tickets} onCreated={loadData} onToast={setToast} />
      <ViewReportDialog report={viewingReport} onClose={() => setViewingReport(null)} />

      {/* Menu Download */}
      <Menu anchorEl={downloadAnchor} open={!!downloadAnchor} onClose={() => { setDownloadAnchor(null); setDownloadReport(null); }}>
        <MenuItem onClick={() => handleDownload(downloadReport, 'txt')}><Typography variant="body2">Plain Text (.txt)</Typography></MenuItem>
        <MenuItem onClick={() => handleDownload(downloadReport, 'md')}><Typography variant="body2">Markdown (.md)</Typography></MenuItem>
        <MenuItem onClick={() => handleDownload(downloadReport, 'json')}><Typography variant="body2">JSON (.json)</Typography></MenuItem>
        <MenuItem onClick={() => handleDownload(downloadReport, 'html')}><Typography variant="body2">HTML (.html)</Typography></MenuItem>
      </Menu>

      {/* Menu Actions */}
      <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => { setMenuAnchor(null); setMenuReport(null); }}>
        {menuReport?.status === "DRAFT" && <MenuItem onClick={() => handleChangeStatus(menuReport.reportId, "SUBMITTED")}><Typography variant="body2">Submit</Typography></MenuItem>}
        {menuReport?.status === "SUBMITTED" && <MenuItem onClick={() => handleChangeStatus(menuReport.reportId, "APPROVED")}><Typography variant="body2">Approve</Typography></MenuItem>}
        {menuReport?.status === "SUBMITTED" && <MenuItem onClick={() => handleChangeStatus(menuReport.reportId, "REJECTED")}><Typography variant="body2">Reject</Typography></MenuItem>}
        <MenuItem onClick={() => handleDelete(menuReport?.reportId)} sx={{ color: COLORS.dangerText }}><DeleteOutlineRoundedIcon sx={{ fontSize: 16, mr: 1 }} /> <Typography variant="body2">Delete</Typography></MenuItem>
      </Menu>

      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        {toast ? <Alert severity={toast.type} onClose={() => setToast(null)} sx={{ width: "100%", borderRadius: 3, boxShadow: 2 }}>{toast.message}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
}