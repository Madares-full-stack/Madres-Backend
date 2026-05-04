const axios = require("axios");
const attendanceModel = require("../models/attendanceSchema");

const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    const studentId = req.user.id;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required." });
    }

    
    const attendanceRecords = await attendanceModel.find({ studentId });
    const totalClasses = attendanceRecords.length;
    const presentCount = attendanceRecords.filter((r) => r.status === "present").length;
    const absentCount = attendanceRecords.filter((r) => r.status === "absent").length;
    const attendanceRate =
      totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(1) : 0;

    const lastRecords = attendanceRecords
      .slice(-5)
      .map(
        (r) =>
          `- ${new Date(r.date).toLocaleDateString("ar-EG")}: ${
            r.status === "present" ? "حاضر" : "غائب"
          }`
      )
      .join("\n");

    const systemPrompt = `أنت مساعد ذكي مخصص للطلاب في منصة مدارس التعليمية.
مهمتك:
1. الإجابة على أسئلة الطالب المتعلقة بالدراسة والمواد التعليمية
2. إعطاء معلومات عن حضور الطالب من بياناته الحقيقية

بيانات حضور الطالب:
- إجمالي الحصص: ${totalClasses}
- عدد مرات الحضور: ${presentCount}
- عدد مرات الغياب: ${absentCount}
- نسبة الحضور: ${attendanceRate}%
- آخر 5 سجلات:
${lastRecords || "لا يوجد سجلات بعد"}

قواعد:
- رد دائماً بالعربية
- كن مشجعاً وإيجابياً مع الطالب
- إذا كانت نسبة الحضور أقل من 75% حذّر الطالب بلطف
- لا تجاوب على أسئلة خارج نطاق الدراسة والحضور`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((msg) => ({ role: msg.role, content: msg.content })),
      { role: "user", content: message },
    ];

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: process.env.GROQ_MODEL || "llama3-8b-8192",
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    return res.status(200).json({
      success: true,
      reply,
      usage: response.data.usage,
    });
  } catch (err) {
    const errorMsg = err.response?.data?.error?.message || err.message;
    return res.status(500).json({ success: false, message: errorMsg });
  }
};

module.exports = { chat };