/* ==========================================================================
   eCatarman — UI Utilities Module
   Shared UI helpers: toast notifications, attachment renderers, etc.
   ========================================================================== */

var eCatarmanUI = (function () {
  "use strict";

  // ── Toast Notifications ────────────────────────────────────────────────

  var _toastTimeout;

  /**
   * Show a toast notification.
   * Requires a #admin-toast container and #toast-text span in the page.
   * @param {string} message
   * @param {string} type — "success" | "error" | "info"
   */
  function showToast(message, type) {
    var toastEl = document.getElementById("admin-toast");
    var toastText = document.getElementById("toast-text");
    if (!toastEl || !toastText) return;

    clearTimeout(_toastTimeout);
    toastEl.className = "admin-toast admin-toast--" + (type || "success") + " admin-toast--visible";
    toastText.textContent = message;
    _toastTimeout = setTimeout(function () {
      toastEl.classList.remove("admin-toast--visible");
    }, 3000);
  }

  // ── Attachment Rendering ───────────────────────────────────────────────

  /**
   * Build HTML string for displaying file attachments in a detail view.
   * @param {Array} attachments — array of { originalName, url, size, type }
   * @returns {string} HTML
   */
  function renderAttachments(attachments) {
    if (!attachments || attachments.length === 0) return "";

    var html = '<p class="svc-module__sub-title">📎 Attached Documents</p>';
    html += '<div style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:1rem;">';
    attachments.forEach(function (file) {
      var icon = file.type === "application/pdf" ? "📄" : (file.type && file.type.startsWith("image/") ? "🖼️" : "📎");
      var sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      html += '<a href="' + file.url + '" target="_blank" style="display:flex;align-items:center;gap:0.75rem;padding:0.625rem 1rem;background:var(--slate-50);border:1px solid var(--slate-200);border-radius:0.75rem;text-decoration:none;transition:all 0.2s;">'
        + '<span style="font-size:1.25rem;">' + icon + '</span>'
        + '<div style="flex:1;min-width:0;">'
        + '<p style="font-weight:700;font-size:0.8125rem;color:var(--slate-700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0;">' + file.originalName + '</p>'
        + '<p style="font-size:0.6875rem;color:var(--slate-400);margin:0;">' + sizeMB + ' MB</p>'
        + '</div>'
        + '<span style="font-size:0.75rem;font-weight:700;color:var(--teal-600);">View ↗</span>'
        + '</a>';
    });
    html += '</div>';
    return html;
  }

  // ── Activity Log (localStorage) ────────────────────────────────────────

  var LOG_KEY = "ecatarman_activity_log";

  function getActivityLog() {
    try { return JSON.parse(localStorage.getItem(LOG_KEY)) || []; }
    catch (e) { return []; }
  }

  function logActivity(action, txnId, details) {
    var log = getActivityLog();
    log.unshift({
      action: action,
      txnId: txnId || "",
      details: details || "",
      timestamp: new Date().toISOString(),
    });
    if (log.length > 100) log = log.slice(0, 100);
    localStorage.setItem(LOG_KEY, JSON.stringify(log));
  }

  function clearActivityLog() {
    localStorage.removeItem(LOG_KEY);
  }

  // ── Public API ─────────────────────────────────────────────────────────

  return {
    showToast: showToast,
    renderAttachments: renderAttachments,
    getActivityLog: getActivityLog,
    logActivity: logActivity,
    clearActivityLog: clearActivityLog,
  };
})();
