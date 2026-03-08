// Mobile navigation toggle
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMobile = document.querySelector(".nav-links-mobile");

  if (navToggle && navMobile) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("is-open");
      const isOpen = navToggle.classList.contains("is-open");
      navMobile.style.display = isOpen ? "flex" : "none";
    });
  }

  // WhatsApp click-to-chat
  const whatsappButtons = document.querySelectorAll("[data-whatsapp-button]");
  whatsappButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const phone = btn.getAttribute("data-phone") || "2349024524116";
      const text =
        btn.getAttribute("data-message") ||
        "Hello Sonsek Cleaning & Fumigation Services, I would like to book a service.";
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    });
  });

  // Generic AJAX form handler (booking + contact + hero quick quote)
  const forms = document.querySelectorAll("[data-ajax-form]");

  forms.forEach((form) => {
    const endpoint = form.getAttribute("data-endpoint");
    const statusEl = form.querySelector("[data-form-status]");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!endpoint) return;

      if (statusEl) {
        statusEl.textContent = "Sending...";
        statusEl.classList.remove("success", "error");
      }

      const formData = new FormData(form);
      const payload = {};
      formData.forEach((value, key) => {
        payload[key] = value;
      });

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Something went wrong");
        }

        if (statusEl) {
          statusEl.textContent = "Thank you! We will contact you shortly.";
          statusEl.classList.add("success");
        }
        form.reset();
      } catch (error) {
        console.error(error);
        if (statusEl) {
          statusEl.textContent =
            "Sorry, we could not submit your request. Please try again or call us directly.";
          statusEl.classList.add("error");
        }
      }
    });
  });

  // Paystack payment integration (optional, triggered from booking page)
  const paystackButton = document.querySelector("[data-paystack-button]");
  if (paystackButton) {
    paystackButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (typeof PaystackPop === "undefined") {
        alert("Payment system not loaded yet. Please try again.");
        return;
      }

      const amountField = document.querySelector("[data-amount-field]");
      const emailField = document.querySelector("[data-email-field]");
      const nameField = document.querySelector("[data-name-field]");

      const amountValue = amountField ? Number(amountField.value) : 0;
      const emailValue = emailField ? emailField.value : "";
      const nameValue = nameField ? nameField.value : "Sonsek Customer";

      if (!emailValue) {
        alert("Please enter your email address for payment.");
        return;
      }

      const publicKey = window.PAYSTACK_PUBLIC_KEY;
      if (!publicKey) {
        alert(
          "Payment is not fully configured. Please contact Sonsek Cleaning directly."
        );
        return;
      }

      const handler = PaystackPop.setup({
        key: publicKey,
        email: emailValue,
        amount: (amountValue || 1000) * 100, // amount in kobo, default small value
        currency: "NGN",
        ref: "SONSEK-" + Date.now(),
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: nameValue,
            },
          ],
        },
        callback: function () {
          alert(
            "Payment successful. Thank you for booking with Sonsek Cleaning!"
          );
        },
        onClose: function () {
          // Optional: handle close
        },
      });

      handler.openIframe();
    });
  }
});

