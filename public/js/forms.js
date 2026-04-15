/* ==========================================================================
   eCatarman — Form Utilities Module
   Reusable form validation, data collection, and file upload UI helpers.
   ========================================================================== */

var eCatarmanForms = (function () {
  "use strict";

  // ── Constants ──────────────────────────────────────────────────────────

  var MAX_FILES = 5;
  var MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  var ACCEPTED_TYPES = ".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx";

  // ── Field Validation ───────────────────────────────────────────────────

  /**
   * Attach real-time blur/input validation to a field + error span pair.
   * @param {HTMLElement} inputEl  — The input, select, or textarea element
   * @param {HTMLElement} errMsgEl — The span that shows the error message
   */
  function bindFieldValidation(inputEl, errMsgEl) {
    function validate() {
      if (!inputEl.checkValidity()) {
        errMsgEl.textContent = inputEl.validationMessage || "Invalid input.";
        errMsgEl.style.display = "block";
        inputEl.classList.add("form-input--error");
        return false;
      } else {
        errMsgEl.style.display = "none";
        inputEl.classList.remove("form-input--error");
        return true;
      }
    }
    inputEl.addEventListener("blur", validate);
    inputEl.addEventListener("input", function () {
      if (inputEl.classList.contains("form-input--error")) validate();
    });
    return validate; // return for manual invocation if needed
  }

  /**
   * Validate all visible required fields in a form.
   * Scrolls to first error if found.
   * @param {HTMLFormElement} form
   * @returns {boolean} true if all valid
   */
  function validateVisibleFields(form) {
    var allValid = true;
    form.querySelectorAll("input:not([type='file']), select, textarea").forEach(function (el) {
      var parentGroup = el.closest(".form-group");
      if (parentGroup && parentGroup.style.display === "none") return;
      if (!el.checkValidity()) {
        allValid = false;
        el.classList.add("form-input--error");
        var errEl = parentGroup ? parentGroup.querySelector(".form-error-msg") : null;
        if (errEl) {
          errEl.textContent = el.validationMessage || "This field is required.";
          errEl.style.display = "block";
        }
      }
    });
    if (!allValid) {
      var firstErr = form.querySelector(".form-input--error");
      if (firstErr) firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return allValid;
  }

  /**
   * Collect form data from visible fields only (skip sections & hidden).
   * @param {HTMLFormElement} form
   * @param {Array} fields — service field definitions from data.js
   * @returns {Object} key-value pairs
   */
  function collectFormData(form, fields) {
    var data = {};
    fields.forEach(function (field) {
      if (field.type === "section") return;
      var input = form.querySelector("#field-" + field.name);
      if (input) {
        var group = input.closest(".form-group");
        if (group && group.style.display === "none") return;
      }
      var el = form.querySelector("[name='" + field.name + "']");
      data[field.name] = el ? el.value : "";
    });
    return data;
  }

  // ── File Upload UI ─────────────────────────────────────────────────────

  /**
   * Create an upload dropzone UI and attach it to a container.
   * Returns an object with getFiles() to retrieve selected files.
   *
   * @param {HTMLElement} container — The element to append upload UI into
   * @returns {{ getFiles: function(): File[] }}
   */
  function createUploadZone(container) {
    var selectedFiles = [];

    // Section header
    var header = document.createElement("div");
    header.className = "form-section-header";
    header.textContent = "Upload Requirements (Optional)";
    header.style.marginTop = "0.5rem";

    // Description
    var desc = document.createElement("p");
    desc.style.cssText = "font-size:0.8125rem;color:var(--slate-500);font-weight:500;margin-bottom:1rem;";
    desc.textContent = "Attach supporting documents such as IDs, birth certificates, tax declarations, or other requirements. Max " + MAX_FILES + " files, 10MB each. (PDF, JPG, PNG, DOCX)";

    // Dropzone
    var dropzone = document.createElement("div");
    dropzone.className = "upload-dropzone";
    dropzone.innerHTML = '<div class="upload-dropzone__inner">'
      + '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--teal-400)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>'
      + '<p style="font-weight:700;color:var(--slate-700);margin-top:0.5rem;">Drag & drop files here</p>'
      + '<p style="font-size:0.75rem;color:var(--slate-400);">or click to browse</p>'
      + '</div>';

    // Hidden file input
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = true;
    fileInput.accept = ACCEPTED_TYPES;
    fileInput.style.display = "none";

    // File list
    var fileList = document.createElement("div");
    fileList.className = "upload-file-list";

    // ── Event handlers ──

    dropzone.addEventListener("click", function () { fileInput.click(); });
    dropzone.addEventListener("dragover", function (e) {
      e.preventDefault();
      dropzone.classList.add("upload-dropzone--active");
    });
    dropzone.addEventListener("dragleave", function () {
      dropzone.classList.remove("upload-dropzone--active");
    });
    dropzone.addEventListener("drop", function (e) {
      e.preventDefault();
      dropzone.classList.remove("upload-dropzone--active");
      addFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener("change", function () {
      addFiles(fileInput.files);
      fileInput.value = "";
    });

    function addFiles(newFiles) {
      for (var i = 0; i < newFiles.length; i++) {
        if (selectedFiles.length >= MAX_FILES) break;
        var f = newFiles[i];
        if (f.size > MAX_FILE_SIZE) {
          alert(f.name + " exceeds 10MB limit.");
          continue;
        }
        selectedFiles.push(f);
      }
      renderFileList();
    }

    function renderFileList() {
      fileList.innerHTML = "";
      selectedFiles.forEach(function (f, i) {
        var item = document.createElement("div");
        item.className = "upload-file-item";

        var icon = f.type.startsWith("image/") ? "🖼️" : (f.type === "application/pdf" ? "📄" : "📎");
        var sizeMB = (f.size / (1024 * 1024)).toFixed(2);

        item.innerHTML = '<span style="font-size:1.25rem;">' + icon + '</span>'
          + '<div style="flex:1;min-width:0;">'
          + '  <p style="font-weight:700;font-size:0.8125rem;color:var(--slate-700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + f.name + '</p>'
          + '  <p style="font-size:0.6875rem;color:var(--slate-400);">' + sizeMB + ' MB</p>'
          + '</div>'
          + '<button type="button" class="upload-file-remove" title="Remove">&times;</button>';

        item.querySelector(".upload-file-remove").addEventListener("click", function () {
          selectedFiles.splice(i, 1);
          renderFileList();
        });

        fileList.appendChild(item);
      });
    }

    // ── Append to container ──

    container.appendChild(header);
    container.appendChild(desc);
    container.appendChild(dropzone);
    container.appendChild(fileInput);
    container.appendChild(fileList);

    // ── Return handle ──

    return {
      getFiles: function () { return selectedFiles; },
    };
  }

  // ── Public API ─────────────────────────────────────────────────────────

  return {
    bindFieldValidation: bindFieldValidation,
    validateVisibleFields: validateVisibleFields,
    collectFormData: collectFormData,
    createUploadZone: createUploadZone,
  };
})();
