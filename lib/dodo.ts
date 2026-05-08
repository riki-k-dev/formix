// Dodo Payments ke responses ka strict TypeScript Type
export type DodoPayment = {
  payment_id: string;
  amount: number;
  created_at: string;
  status: string;
  receipt_url?: string;
};

interface DodoHistoryResponse {
  data?: DodoPayment[];
  items?: DodoPayment[];
}

interface DodoPortalResponse {
  url?: string;
  portal_url?: string;
}

// 'export' lagana zaroori hai taaki page.tsx isko import kar sake
export async function getDodoBillingData(customerId: string) {
  const apiKey = process.env.DODO_API_KEY;
  if (!apiKey || !customerId) return { history: [], portalUrl: "" };

  try {
    console.log("🔍 Fetching Billing History for Customer:", customerId);

    // 1. Fetch History Safely
    const historyRes = await fetch(
      `https://test.dodopayments.com/payments?customer_id=${customerId}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: "no-store",
      }
    );

    // Yahan humne 'any' hata kar apna strict Type laga diya
    let historyData: DodoHistoryResponse = { items: [] };
    
    if (historyRes.ok) {
      historyData = (await historyRes.json()) as DodoHistoryResponse;
    } else {
      const errorText = await historyRes.text();
      console.error("❌ Dodo History API Error:", historyRes.status, errorText);
    }

    // 2. Fetch Portal URL Safely
    const portalRes = await fetch(
      `https://test.dodopayments.com/customer-portal-sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ customer_id: customerId }),
        cache: "no-store",
      }
    );

    // Yahan bhi 'any' hata kar strict Type laga diya
    let portalData: DodoPortalResponse = { url: "" };
    
    if (portalRes.ok) {
      portalData = (await portalRes.json()) as DodoPortalResponse;
    } else {
      const errorText = await portalRes.text();
      console.error("❌ Dodo Portal API Error:", portalRes.status, errorText);
    }

    const rawHistory = historyData.data || historyData.items;

    return {
      history: Array.isArray(rawHistory) ? rawHistory : [],
      portalUrl: portalData.url || portalData.portal_url || "",
    };
  } catch (error) {
    console.error("❌ Dodo API Fetch Exception:", error);
    return { history: [], portalUrl: "" };
  }
}