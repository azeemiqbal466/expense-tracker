import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

import api from "../services/api.js";
import SummaryCard from "../components/SummaryCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {

  const { user } = useAuth();

  const [data, setData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    recentTransactions: [],
    expenseByCategory: []
  });

  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD DASHBOARD DATA
  // =====================================================

  const loadDashboard = async () => {

    try {

      setLoading(true);

      const response = await api.get("/dashboard");

      setData(response.data);

    } catch (err) {

      console.log(
        err.response?.data?.message ||
        "Failed to load dashboard"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    loadDashboard();

  }, []);


  // =====================================================
  // CHART DATA
  // =====================================================

  const cashFlowData = [
    {
      name: "Overview",
      Income: Number(data.totalIncome || 0),
      Expense: Number(data.totalExpense || 0)
    }
  ];


  // =====================================================
  // CATEGORY COLORS
  // =====================================================

  const categoryColors = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#7c3aed",
    "#0891b2",
    "#ea580c",
    "#db2777",
    "#64748b"
  ];


  // =====================================================
  // NAME
  // =====================================================

  const displayName =
    user?.name?.split(" ")[0] || "there";


  return (

    <div>


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="dashboard-welcome">

        <div>

          <span className="dashboard-eyebrow">
            FINANCIAL SNAPSHOT
          </span>

          <h1>
            Good to see you, {displayName}.
          </h1>

          <p>
            Here's what's happening with your money today.
          </p>

        </div>


        

      </div>


      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="row g-4 mb-4">

        <div className="col-xl-4 col-md-6">

          <SummaryCard
            title="Total Income"
            value={data.totalIncome}
            icon="bi-arrow-down-left"
            type="income-card"
            note="Money In"
          />

        </div>


        <div className="col-xl-4 col-md-6">

          <SummaryCard
            title="Total Expense"
            value={data.totalExpense}
            icon="bi-arrow-up-right"
            type="expense-card"
            note="Money Out"
          />

        </div>


        <div className="col-xl-4 col-md-12">

          <SummaryCard
            title="Available Balance"
            value={data.balance}
            icon="bi-wallet2"
            type="balance-card"
            note="Current"
          />

        </div>

      </div>


      {/* =================================================
          CHARTS
      ================================================= */}

      <div className="row g-4 mb-4">


        {/* =================================================
            CASH FLOW
        ================================================= */}

        <div className="col-xl-7">

          <div className="content-card dashboard-chart-card">

            <div className="chart-header">

              <div>

                <span className="chart-eyebrow">
                  CASH FLOW
                </span>

                <h5>
                  Income vs Expense
                </h5>

                <p>
                  Compare money coming in with money going out.
                </p>

              </div>


              <span className="chart-period">
                All Time
              </span>

            </div>


            {loading ? (

              <div className="chart-loading">

                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>

              </div>

            ) : (

              <>

                <div className="professional-chart">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <BarChart
                      data={cashFlowData}
                      margin={{
                        top: 20,
                        right: 20,
                        left: 10,
                        bottom: 10
                      }}
                      barGap={20}
                    >

                      <CartesianGrid
                        stroke="#edf1f5"
                        strokeDasharray="4 4"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#667085",
                          fontSize: 11,
                          fontWeight: 600
                        }}
                      />

                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#98a2b3",
                          fontSize: 10
                        }}
                        tickFormatter={(value) =>
                          `Rs.${Number(value).toLocaleString()}`
                        }
                      />

                      <Tooltip
                        cursor={{
                          fill: "rgba(37,99,235,.04)"
                        }}
                        contentStyle={{
                          border: "none",
                          borderRadius: "12px",
                          boxShadow:
                            "0 10px 30px rgba(15,23,42,.12)"
                        }}
                        formatter={(value) => [
                          `Rs. ${Number(value).toLocaleString()}`
                        ]}
                      />

                      <Bar
                        dataKey="Income"
                        fill="#16a34a"
                        radius={[
                          9,
                          9,
                          0,
                          0
                        ]}
                        maxBarSize={65}
                      />

                      <Bar
                        dataKey="Expense"
                        fill="#dc2626"
                        radius={[
                          9,
                          9,
                          0,
                          0
                        ]}
                        maxBarSize={65}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>


                {/* CUSTOM LEGEND */}

                <div className="custom-chart-legend">

                  <span>

                    <i className="legend-dot income"></i>

                    Income

                  </span>


                  <span>

                    <i className="legend-dot expense"></i>

                    Expense

                  </span>

                </div>

              </>

            )}

          </div>

        </div>


        {/* =================================================
            EXPENSE CATEGORY
        ================================================= */}

        <div className="col-xl-5">

          <div className="content-card dashboard-chart-card">

            <div className="chart-header">

              <div>

                <span className="chart-eyebrow">
                  SPENDING
                </span>

                <h5>
                  Expense Categories
                </h5>

                <p>
                  Breakdown of where your money is going.
                </p>

              </div>


              <div className="chart-header-icon">

                <i className="bi bi-pie-chart-fill"></i>

              </div>

            </div>


            {data.expenseByCategory.length === 0 ? (

              <div className="empty-dashboard-chart">

                <div className="empty-dashboard-icon">

                  <i className="bi bi-pie-chart"></i>

                </div>

                <strong>
                  No expenses yet
                </strong>

                <span>
                  Add an expense to see the breakdown.
                </span>

              </div>

            ) : (

              <>

                <div className="donut-wrapper">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <PieChart>

                      <Pie
                        data={data.expenseByCategory}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="48%"
                        innerRadius={72}
                        outerRadius={108}
                        paddingAngle={4}
                        stroke="#ffffff"
                        strokeWidth={3}
                      >

                        {data.expenseByCategory.map(
                          (entry, index) => (

                            <Cell
                              key={index}
                              fill={
                                categoryColors[
                                  index %
                                  categoryColors.length
                                ]
                              }
                            />

                          )
                        )}

                      </Pie>


                      <Tooltip
                        contentStyle={{
                          border: "none",
                          borderRadius: "12px",
                          boxShadow:
                            "0 10px 30px rgba(15,23,42,.12)"
                        }}
                        formatter={(value) => [
                          `Rs. ${Number(value).toLocaleString()}`,
                          "Expense"
                        ]}
                      />


                      <text
                        x="50%"
                        y="45%"
                        textAnchor="middle"
                        fill="#7a8698"
                        fontSize="10"
                        fontWeight="600"
                      >
                        Total Expense
                      </text>


                      <text
                        x="50%"
                        y="53%"
                        textAnchor="middle"
                        fill="#172033"
                        fontSize="17"
                        fontWeight="800"
                      >
                        Rs.{" "}
                        {Number(
                          data.totalExpense
                        ).toLocaleString()}
                      </text>

                    </PieChart>

                  </ResponsiveContainer>

                </div>


                {/* CATEGORY LEGEND */}

                <div className="category-legend">

                  {data.expenseByCategory.map(
                    (item, index) => (

                      <div
                        className="category-legend-item"
                        key={item.name}
                      >

                        <span>

                          <i
                            style={{
                              background:
                                categoryColors[
                                  index %
                                  categoryColors.length
                                ]
                            }}
                          ></i>

                          {item.name}

                        </span>

                        <strong>

                          Rs.{" "}
                          {Number(
                            item.value
                          ).toLocaleString()}

                        </strong>

                      </div>

                    )
                  )}

                </div>

              </>

            )}

          </div>

        </div>

      </div>


      {/* =================================================
          RECENT TRANSACTIONS
      ================================================= */}

      <div className="content-card">

        <div className="recent-header">

          <div>

            <span className="chart-eyebrow">
              ACTIVITY
            </span>

            <h5>
              Recent Transactions
            </h5>

          </div>


          <span className="records-badge">

            {data.recentTransactions.length}

            {" "}

            Recent

          </span>

        </div>


        <div className="table-responsive">

          <table className="table align-middle dashboard-table">

            <thead>

              <tr>

                <th>
                  Transaction
                </th>

                <th>
                  Type
                </th>

                <th>
                  Category
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Date
                </th>

              </tr>

            </thead>


            <tbody>

              {data.recentTransactions.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center py-5 text-muted"
                  >

                    No transactions yet.

                  </td>

                </tr>

              ) : (

                data.recentTransactions.map(
                  (item) => (

                    <tr
                      key={`${item.type}-${item._id}`}
                    >

                      <td>

                        <div className="dashboard-transaction">

                          <div
                            className={`dashboard-transaction-icon ${
                              item.type
                            }`}
                          >

                            <i
                              className={
                                item.type === "income"
                                  ? "bi bi-arrow-down-left"
                                  : "bi bi-arrow-up-right"
                              }
                            ></i>

                          </div>


                          <strong>
                            {item.title}
                          </strong>

                        </div>

                      </td>


                      <td>

                        <span
                          className={
                            item.type === "income"
                              ? "dashboard-type income"
                              : "dashboard-type expense"
                          }
                        >

                          {item.type}

                        </span>

                      </td>


                      <td>

                        <span className="dashboard-category">

                          {item.category}

                        </span>

                      </td>


                      <td
                        className={
                          item.type === "income"
                            ? "dashboard-income"
                            : "dashboard-expense"
                        }
                      >

                        {item.type === "income"
                          ? "+"
                          : "-"}

                        {" Rs. "}

                        {Number(
                          item.amount
                        ).toLocaleString()}

                      </td>


                      <td className="text-muted">

                        {new Date(
                          item.date
                        ).toLocaleDateString()}

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;