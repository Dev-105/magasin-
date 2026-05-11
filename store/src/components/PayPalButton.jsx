import { useEffect, useRef } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function PayPalButton({ amount, promoCode, onSuccess, onError }) {
  const containerRef = useRef(null);
  const rendered = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (rendered.current) return; // 🔥 prevent double render
    rendered.current = true;

    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    const currency = import.meta.env.VITE_PAYPAL_FALLBACK_CURRENCY || "USD";

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`;
    script.async = true;

    script.onload = () => {
      if (!window.paypal || !containerRef.current) return;

      window.paypal.Buttons({
        createOrder: async () => {
          const payload = promoCode ? { promo_code: promoCode } : {};
          const res = await api.post("/paypal/create-order", payload);
          return res.data.id;
        },

        onApprove: async (data) => {
          try {
            const res = await api.post(`/paypal/capture-order/${data.orderID}`);

            if (onSuccess) onSuccess(res.data);
            else navigate("/orders");
          } catch (err) {
            const msg =
              err.response?.data?.message || err.message || "Capture failed";
            if (onError) onError(msg);
          }
        },

        onError: (err) => {
          const msg = err.message || "PayPal error";
          if (onError) onError(msg);
        },
      }).render(containerRef.current);
    };

    document.body.appendChild(script);

    return () => {
      // cleanup DOM safely
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []); // 🔥 IMPORTANT: EMPTY deps

  return <div ref={containerRef}></div>;
}