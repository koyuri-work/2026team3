import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const DiagnosisRadar = ({ scores }) => {
  const data = [
    { subject: '開放性(O)', A: scores.O || 0, fullMark: 5 },
    { subject: '誠実性(C)', A: scores.C || 0, fullMark: 5 },
    { subject: '外向性(E)', A: scores.E || 0, fullMark: 5 },
    { subject: '協調性(A)', A: scores.A || 0, fullMark: 5 },
    { subject: '神経症(N)', A: scores.N || 0, fullMark: 5 },
  ];
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#fff" /><PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: 'white' }} />
          <Radar name="Score" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DiagnosisRadar;