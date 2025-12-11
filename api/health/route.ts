

import { NextRequest, NextResponse } from 'next/server'

// ======================
// 1) 每日限制调用次数（无需账号系统）
// ======================
let callCount = 0
let lastDate = ''

function checkDailyLimit(limit = 3) {
  const today = new Date().toISOString().slice(0, 10)

  // 新的一天 → 重置计数
  if (today !== lastDate) {
    lastDate = today
    callCount = 0
  }

  // 是否达到上限
  if (callCount >= limit) return false

  callCount++
  return true
}

// ======================
// 2) AI 调用函数（不足额度时返回“模拟AI报告”）
// ======================
async function callAI(prompt: string) {
  const key = process.env.OPENAI_API_KEY
  if (!key) return "（错误）后台缺少 API KEY"

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      input: prompt
    })
  })

  const raw = await res.text()

  // 余额不足 → 使用本地“模拟报告”
  if (raw.includes("insufficient_quota")) {
    return `
（演示模式）AI 报告：
您的健康指标已记录。建议：
1. 多喝水、减少高盐和高嘌呤食物；
2. 多吃蔬菜水果、保持清淡饮食；
3. 每天保证 7 小时睡眠；
4. 多运动，比如步行 8000 步以上；
（此为演示报告，无需任何 AI 费用）
    `
  }

  // 正常返回
  let json: any = null
  try {
    json = JSON.parse(raw)
    return json.output_text || json.choices?.[0]?.message?.content || raw
  } catch {
    return raw
  }
}

// ======================
// 3) 主 API 路由
// ======================
export async function POST(req: NextRequest) {
  // ① 调用次数限制（无用户系统也能保护你的费用）
  if (!checkDailyLimit(3)) {
    return NextResponse.json({
      text: "今日免费 AI 调用次数已用完，请明天再试。"
    })
  }

  // ② 接收前端数据
  const body = await req.json().catch(() => ({}))
  const { glucose, uric, sleep } = body

  // ③ 构造提示词（你后面可改）
  const prompt = `
根据以下健康数据提供饮食与生活建议（非医疗）：
血糖：${glucose}
尿酸：${uric}
睡眠：${sleep}
请给我三个饮食建议 + 三条生活方式建议。
  `

  // ④ 调 OpenAI（或模拟）
  const result = await callAI(prompt)

  return NextResponse.json({ text: result })
}

// GET 请求用于健康检查
export async function GET() {
  return NextResponse.json({ ok: true })
}
