import type { NextApiRequest, NextApiResponse } from "next";
import { submitFeedback, dispatchEmail } from "../../lib/feedback";
import { SUPPORT } from "../../lib/support.config";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = (req.body || {}) as {
      category?: string;
      body?: string;
      email?: string;
      attachment?: { name: string; data: string };
    };

    if (!body.category || !body.body) {
      return res.status(400).json({ error: "CATEGORY_AND_BODY_REQUIRED" });
    }

    const fb = submitFeedback({
      category: body.category,
      body: body.body,
      email: body.email,
      attachment: body.attachment,
    });

    void dispatchEmail(fb, {
      to: SUPPORT.feedbackEmail,
      subjectPrefix: `[${SUPPORT.productName} feedback]`,
    }).catch(() => {});

    return res.status(200).json({
      ok: true,
      id: fb.id,
      message: "Feedback submitted - we will look into it shortly.",
    });
  } catch (e: any) {
    const code = e?.message || "UNKNOWN";
    return res.status(400).json({ error: code });
  }
}
