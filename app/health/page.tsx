import ReportBlock from '../components/ReportBlock'   // ✅ 用相对路径

export default function Home() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: '40px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>GARROD · AI 健康助手</h1>
      <p style={{ marginTop: '8px', color: '#555' }}>
        输入日常健康数据，让 AI 为你提供个性化饮食与生活方式建议。
        <br />
        （本应用仅提供一般性信息，不构成医疗建议）
      </p>

      <h2 style={{ marginTop: '40px', fontSize: '20px' }}>录入今日指标</h2>
      <form style={{ display: 'grid', gap: '8px', maxWidth: '320px', marginTop: '8px' }}>
        <input placeholder="血糖 (mg/dL)" />
        <input placeholder="血压 (mmHg)" />
        <input placeholder="尿酸 (mg/dL)" />
        <input placeholder="睡眠时长 (小时)" />
        <input placeholder="步数 (steps)" />
        <button style={{ marginTop: '8px', padding: '8px', background: '#000', color: '#fff' }}>
          保存
        </button>
      </form>

      <h2 style={{ marginTop: '40px', fontSize: '20px' }}>趋势曲线</h2>
      <p>（这里将显示折线图）</p>

      <h2 style={{ marginTop: '40px', fontSize: '20px' }}>AI 分析结果</h2>

      {/* ✅ 在页面底部区域渲染 AI 报告模块 */}
      <ReportBlock />  {/* 这行相当于“插入” ReportBlock 组件 */}
    </main>
  );
}


