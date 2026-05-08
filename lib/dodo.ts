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
  link?: string;
}

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
      },
    );

    let historyData: DodoHistoryResponse = { items: [] };

    if (historyRes.ok) {
      historyData = (await historyRes.json()) as DodoHistoryResponse;
    } else {
      const errorText = await historyRes.text();
      console.error("❌ Dodo History API Error:", historyRes.status, errorText);
    }

    // 2. Fetch Portal URL Safely
    const portalRes = await fetch(
      `https://test.dodopayments.com/customers/${customerId}/customer-portal/session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({}),
        cache: "no-store",
      },
    );

    let portalData: DodoPortalResponse = { link: "" };

    if (portalRes.ok) {
      portalData = (await portalRes.json()) as DodoPortalResponse;
    } else {
      const errorText = await portalRes.text();
      console.error("❌ Dodo Portal API Error:", portalRes.status, errorText);
    }

    const rawHistory = historyData.data || historyData.items;

    return {
      history: Array.isArray(rawHistory) ? rawHistory : [],
      portalUrl: portalData.link || "",
    };
  } catch (error) {
    console.error("❌ Dodo API Fetch Exception:", error);
    return { history: [], portalUrl: "" };
  }
}
