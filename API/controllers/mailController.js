import { sendEmailLogic } from "../service/mailService.js";

export const sendEmail = async (_req, _res) => {
  const emails = _req.body.donors.map((t) => t.email);
  const isTargetBloodBank = _req.body.isTargetBloodBank;
  
  const greeting = isTargetBloodBank ? "Hello Blood Bank," : "Hello Donor,";
  const matchMessage = isTargetBloodBank
    ? "We have an <strong>urgent blood requirement</strong> and your blood bank has the required blood."
    : "We have an <strong>urgent blood requirement</strong> and your blood group matches the need.";

  const emailPayload = {
    to: emails, // array or single email
    subject: "🩸 Urgent Blood Requirement",
    replyTo: _req.body.requesterEmail,
    senderName: _req.body.requesterName,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
      
      <h2 style="color: #c62828; text-align: center;">
        🩸 Blood Donation Request
      </h2>

      <p>${greeting}</p>

      <p>
        ${matchMessage}
      </p>

      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Blood Group</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            _req.body.bloodGroup || "Any"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>City</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            _req.body.city || "Nearby Location"
          }</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Message</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            _req.body.message
          }</td>
        </tr>
      </table>

      <p>
        If you are available, please contact immediately:
      </p>

      <p style="font-size: 16px;">
        📞 <strong>${_req.body.contact || "Hospital Reception"}</strong>
      </p>

      <hr />

      <p style="font-size: 12px; color: #777; text-align: center;">
        Thank you for being a lifesaver ❤️ <br/>
        
      </p>

    </div>
  `,
  };

  try {
    console.log(emailPayload);
    const res = await sendEmailLogic(emailPayload);
    return _res.status(200).send({
      message: "Email sent successfully!",
      status: 200,
    });
  } catch (error) {
    console.log(error)
    return _res.status(500).json({
      message: "Internal Server Error",
      error: error,
      status: 500,
    });
  }
};
