/* ==========================================================================
   eCatarman — Email Notification Service
   Sends transactional emails to citizens on request status changes
   ========================================================================== */

const nodemailer = require("nodemailer");

// Create transporter from env credentials
let transporter = null;

function init() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass || user === "your-email@gmail.com") {
    console.log("⚠  Email not configured — set EMAIL_USER and EMAIL_PASS in .env");
    return false;
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  // Verify connection
  transporter.verify(function (error) {
    if (error) {
      console.log("⚠  Email verification failed:", error.message);
      transporter = null;
    } else {
      console.log("✅ Email service ready — sending from", user);
    }
  });

  return true;
}

// ── HTML Email Template ──────────────────────────────────────────────────
function template(title, body, txnId) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:2rem 1rem;">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0f766e,#115e59);border-radius:1.5rem 1.5rem 0 0;padding:2rem;text-align:center;">
      <h1 style="color:#fff;font-size:1.5rem;margin:0;font-weight:900;letter-spacing:-0.025em;">e<span style="color:#5eead4;">Catarman</span></h1>
      <p style="color:#99f6e4;font-size:0.75rem;margin:0.5rem 0 0;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;">Municipality of Catarman, Northern Samar</p>
    </div>

    <!-- Body -->
    <div style="background:#fff;padding:2rem;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
      <h2 style="color:#0f172a;font-size:1.25rem;font-weight:900;margin:0 0 1rem;">${title}</h2>
      ${body}
      ${txnId ? `
      <div style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:0.75rem;padding:1rem;text-align:center;margin:1.5rem 0;">
        <p style="color:#64748b;font-size:0.75rem;font-weight:700;margin:0 0 0.25rem;text-transform:uppercase;letter-spacing:0.1em;">Transaction ID</p>
        <p style="color:#0f766e;font-size:1.25rem;font-weight:900;margin:0;font-family:monospace;">${txnId}</p>
      </div>
      <p style="color:#64748b;font-size:0.875rem;margin:0;">
        Track your request anytime at: <a href="http://localhost:3000/services?track=${txnId}" style="color:#0f766e;font-weight:700;">eCatarman Services Portal</a>
      </p>` : ""}
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;border-radius:0 0 1.5rem 1.5rem;padding:1.5rem 2rem;text-align:center;border:1px solid #e2e8f0;border-top:none;">
      <p style="color:#94a3b8;font-size:0.75rem;margin:0;">This is an automated message from the eCatarman E-Governance Platform.</p>
      <p style="color:#94a3b8;font-size:0.75rem;margin:0.25rem 0 0;">Municipality of Catarman, Northern Samar</p>
    </div>

  </div>
</body>
</html>`;
}

// ── Send Email ───────────────────────────────────────────────────────────
async function send(to, subject, title, bodyHtml, txnId) {
  if (!transporter) {
    console.log("📧 [SIMULATED] To:", to, "| Subject:", subject);
    return { simulated: true };
  }

  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: template(title, bodyHtml, txnId),
    });
    console.log("📧 Email sent to", to, "—", subject);
    return { success: true, messageId: result.messageId };
  } catch (err) {
    console.error("📧 Email failed:", err.message);
    return { success: false, error: err.message };
  }
}

// ── Pre-built Email Types ────────────────────────────────────────────────

function sendSubmissionConfirmation(email, citizenName, serviceName, deptName, txnId) {
  return send(
    email,
    `Application Received — ${txnId}`,
    "Your Application Has Been Received",
    `<p style="color:#334155;font-size:0.9375rem;line-height:1.7;margin:0 0 1rem;">
      Hello <strong>${citizenName}</strong>,
    </p>
    <p style="color:#334155;font-size:0.9375rem;line-height:1.7;margin:0 0 1rem;">
      Your application for <strong>${serviceName}</strong> has been successfully submitted to the <strong>${deptName}</strong>.
    </p>
    <p style="color:#334155;font-size:0.9375rem;line-height:1.7;margin:0;">
      Please save your Transaction ID below. You can use it to track your request status anytime through our online portal.
    </p>`,
    txnId
  );
}

function sendStatusUpdate(email, citizenName, serviceName, newStatus, txnId, note) {
  const statusColors = {
    "Received": "#3b82f6",
    "Under Review": "#d97706",
    "Processing": "#0f766e",
    "For Release": "#7c3aed",
    "Completed": "#059669",
    "Rejected": "#e11d48",
  };
  const color = statusColors[newStatus] || "#0f766e";

  return send(
    email,
    `Status Update: ${newStatus} — ${txnId}`,
    "Request Status Updated",
    `<p style="color:#334155;font-size:0.9375rem;line-height:1.7;margin:0 0 1rem;">
      Hello <strong>${citizenName}</strong>,
    </p>
    <p style="color:#334155;font-size:0.9375rem;line-height:1.7;margin:0 0 1rem;">
      Your request for <strong>${serviceName}</strong> has been updated to:
    </p>
    <div style="text-align:center;margin:1rem 0;">
      <span style="background:${color};color:#fff;padding:0.5rem 1.5rem;border-radius:9999px;font-weight:900;font-size:0.875rem;display:inline-block;">${newStatus}</span>
    </div>
    ${note ? `<p style="color:#64748b;font-size:0.875rem;line-height:1.6;margin:1rem 0 0;padding:0.75rem 1rem;background:#f8fafc;border-radius:0.5rem;border-left:3px solid ${color};"><strong>Note:</strong> ${note}</p>` : ""}
    ${newStatus === "Completed" ? `<p style="color:#059669;font-size:0.9375rem;font-weight:700;line-height:1.7;margin:1rem 0 0;">✓ Your request is complete! Please visit the municipal office to claim your document.</p>` : ""}
    ${newStatus === "For Release" ? `<p style="color:#7c3aed;font-size:0.9375rem;font-weight:700;line-height:1.7;margin:1rem 0 0;">Your document is ready for release. Please visit the office during business hours to collect it.</p>` : ""}`,
    txnId
  );
}

function sendRouteNotification(email, citizenName, serviceName, fromDept, toDept, txnId) {
  return send(
    email,
    `Request Routed — ${txnId}`,
    "Request Forwarded to Another Department",
    `<p style="color:#334155;font-size:0.9375rem;line-height:1.7;margin:0 0 1rem;">
      Hello <strong>${citizenName}</strong>,
    </p>
    <p style="color:#334155;font-size:0.9375rem;line-height:1.7;margin:0 0 1rem;">
      Your request for <strong>${serviceName}</strong> has been forwarded from <strong>${fromDept}</strong> to <strong>${toDept}</strong> for additional processing.
    </p>
    <p style="color:#334155;font-size:0.9375rem;line-height:1.7;margin:0;">
      This is part of our cross-department workflow to ensure your request is handled correctly. No action is required from your side.
    </p>`,
    txnId
  );
}

module.exports = { init, send, sendSubmissionConfirmation, sendStatusUpdate, sendRouteNotification };
