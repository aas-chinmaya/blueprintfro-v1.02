"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useMemo } from "react";

export default function MarketingOverview() {
  const stats = [
    { title: "Total Contacts Received", value: 124 },
    { title: "New Leads Created", value: 38 },
    { title: "Follow-ups Scheduled", value: 22 },
    { title: "Follow-ups Due Today", value: 6 },
    { title: "Leads Converted", value: 11 },
    { title: "Dropped Leads", value: 4 },
  ];

  const leadSources = useMemo(
    () => [
      { name: "Website Form", value: 18 },
      { name: "Social Media", value: 10 },
      { name: "Referral", value: 6 },
      { name: "Event / Expo", value: 4 },
    ],
    []
  );

  const followUps = [
    { name: "Rajesh Patnaik", company: "BrightSoft Pvt. Ltd.", status: "In Progress", date: "27 Oct 2025", assigned: "Priya Sharma" },
    { name: "Ananya Mohanty", company: "TechHive Solutions", status: "Contacted", date: "27 Oct 2025", assigned: "Ravi Kumar" },
    { name: "Subham Rout", company: "Freelance", status: "Qualified", date: "27 Oct 2025", assigned: "Unassigned" },
    { name: "Nisha Das", company: "GreenCore Agencies", status: "In Progress", date: "28 Oct 2025", assigned: "Ankit Sinha" },
  ];

  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((item, idx) => (
          <Card key={idx} className="shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-gray-900">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lead Source Pie Chart */}
      <Card className="shadow-sm border border-gray-100">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-800">Lead Source Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={leadSources}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                nameKey="name"
                label
              >
                {leadSources.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Follow-ups Table */}
      <Card className="shadow-sm border border-gray-100">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-800">Recent Follow-ups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="p-3 font-medium">Lead Name</th>
                  <th className="p-3 font-medium">Company</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Follow-up Date</th>
                  <th className="p-3 font-medium">Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {followUps.map((lead, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="p-3">{lead.name}</td>
                    <td className="p-3">{lead.company}</td>
                    <td className="p-3">{lead.status}</td>
                    <td className="p-3">{lead.date}</td>
                    <td className="p-3">{lead.assigned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
