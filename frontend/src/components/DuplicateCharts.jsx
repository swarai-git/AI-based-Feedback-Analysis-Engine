import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DuplicateCharts = ({ distribution, topSuggestions }) => {
  // Prepare pie chart data
  const pieData = [
    { name: 'Unique Feedbacks', value: distribution.single, color: '#10b981' },
    { name: 'Small Groups (2-5)', value: distribution.small, color: '#3b82f6' },
    { name: 'Medium Groups (6-10)', value: distribution.medium, color: '#f59e0b' },
    { name: 'Large Groups (11+)', value: distribution.large, color: '#ef4444' }
  ];

  // Prepare bar chart data
  const barData = topSuggestions.slice(0, 10).map(s => ({
    word: s.word,
    count: s.count
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart - Distribution */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Duplicate Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Top Suggestions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top 10 Keywords
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="word" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DuplicateCharts;