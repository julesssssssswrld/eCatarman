/* ==========================================================================
   eCatarman — API Client Module
   Centralised wrapper for all server API calls.
   Usage: eCatarmanAPI.<method>(...)
   ========================================================================== */

var eCatarmanAPI = (function () {
  "use strict";

  // ── Private helpers ────────────────────────────────────────────────────

  /** Parse JSON response, rejecting on non-OK HTTP status */
  function handleResponse(response) {
    if (!response.ok) {
      return response.text().then(function (text) {
        var err = new Error("HTTP " + response.status);
        try { err.data = JSON.parse(text); } catch (e) { err.data = text; }
        throw err;
      });
    }
    return response.json();
  }

  function postJSON(url, payload) {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handleResponse);
  }

  function putJSON(url, payload) {
    return fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handleResponse);
  }

  function getJSON(url) {
    return fetch(url).then(handleResponse);
  }

  // ── Requests ───────────────────────────────────────────────────────────

  function createRequest(data) {
    return postJSON("/api/requests", data);
  }

  // ── File Uploads ───────────────────────────────────────────────────────

  /** Upload files via FormData. Returns { files: [...] } */
  function uploadFiles(filesArray) {
    var fd = new FormData();
    filesArray.forEach(function (f) { fd.append("files", f); });
    return fetch("/api/upload", { method: "POST", body: fd })
      .then(handleResponse);
  }

  // ── Email (fire-and-forget — errors are silently swallowed) ────────────

  /** Send submission confirmation email.
   *  Unlike status/route emails, this one returns the result so the
   *  caller can update the UI with success/failure feedback. */
  function sendSubmissionEmail(params) {
    return postJSON("/api/email/submission", {
      email: params.email,
      citizenName: params.citizenName,
      serviceName: params.serviceName,
      deptName: params.deptName,
      txnId: params.txnId,
    });
  }

  /** Send status update email (also used for rejection).
   *  Fire-and-forget: errors never bubble to caller. */
  function sendStatusEmail(request, newStatus, note) {
    if (!request || !request.citizenEmail) return Promise.resolve(null);
    return postJSON("/api/email/status", {
      email: request.citizenEmail,
      citizenName: request.citizenName,
      serviceName: request.serviceName,
      newStatus: newStatus,
      txnId: request.id,
      note: note || "Status updated to " + newStatus,
    }).catch(function () { return null; });
  }

  /** Send route notification email.
   *  Fire-and-forget: errors never bubble to caller. */
  function sendRouteEmail(params) {
    return postJSON("/api/email/route", {
      email: params.email,
      citizenName: params.citizenName,
      serviceName: params.serviceName,
      fromDept: params.fromDept,
      toDept: params.toDept,
      txnId: params.txnId,
    }).catch(function () { return null; });
  }

  // ── Emergency Contacts ─────────────────────────────────────────────────

  function getEmergencyContacts() {
    return getJSON("/api/emergency-contacts");
  }

  function updateEmergencyContacts(contacts) {
    return putJSON("/api/emergency-contacts", contacts);
  }

  // ── Public API ─────────────────────────────────────────────────────────

  return {
    // Requests
    createRequest: createRequest,

    // Files
    uploadFiles: uploadFiles,

    // Email
    sendSubmissionEmail: sendSubmissionEmail,
    sendStatusEmail: sendStatusEmail,
    sendRouteEmail: sendRouteEmail,

    // Emergency
    getEmergencyContacts: getEmergencyContacts,
    updateEmergencyContacts: updateEmergencyContacts,
  };
})();
