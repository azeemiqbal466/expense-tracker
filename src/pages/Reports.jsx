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
  CartesianGrid,
  Legend
} from "recharts";

import api from "../services/api.js";

const Reports = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [data, setData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    expenseByCategory: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD REPORT DATA
  // =====================================================

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard");

      setData(response.data);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load financial reports"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD DATA ON PAGE OPEN
  // =====================================================

  useEffect(() => {
    loadReports();
  }, []);

  // =====================================================
  // BAR CHART DATA
  // =====================================================

  const barData = [
    {
      name: "Financial Overview",
      Income: Number(data.totalIncome),
      Expense: Number(data.totalExpense)
    }
  ];

  // =====================================================
  // PIE CHART COLORS
  // =====================================================

  const categoryColors = [
    "#2563eb", // Blue
    "#16a34a", // Green
    "#f59e0b", // Yellow
    "#dc2626", // Red
    "#7c3aed", // Purple
    "#0891b2", // Cyan
    "#ea580c", // Orange
    "#db2777", // Pink
    "#64748b"  // Gray
  ];

  // =====================================================
  // TOTAL EXPENSE
  // =====================================================

  const totalExpense = Number(
    data.totalExpense || 0
  );

  const totalIncome = Number(
    data.totalIncome || 0
  );

  const balance = Number(
    data.balance || 0
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="container-fluid px-0">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <div
            className="text-primary fw-bold text-uppercase mb-1"
            style={{
              fontSize: "10px",
              letterSpacing: "2px"
            }}
          >
            FINANCIAL ANALYTICS
          </div>

          <h1 className="fw-bold mb-1">
            Financial Reports
          </h1>

          <p className="text-muted mb-0">
            View your income, expenses and financial summary.
          </p>

        </div>

        {/* Refresh Button */}

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={loadReports}
          disabled={loading}
        >

          <i className="bi bi-arrow-clockwise me-2"></i>

          Refresh

        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="alert alert-danger">

          <i className="bi bi-exclamation-circle me-2"></i>

          {error}

        </div>

      )}


      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="row g-4 mb-4">

        {/* TOTAL INCOME */}

        <div className="col-xl-4 col-md-6">

          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderRadius: "16px"
            }}
          >

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-start">

                <div>

                  <p className="text-muted mb-2">
                    Total Income
                  </p>

                  <h3 className="fw-bold mb-0 text-success">

                    Rs.{" "}

                    {totalIncome.toLocaleString()}

                  </h3>

                </div>

                <div
                  className="bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px"
                  }}
                >

                  <i
                    className="bi bi-arrow-down-left"
                    style={{
                      fontSize: "21px"
                    }}
                  ></i>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* TOTAL EXPENSE */}

        <div className="col-xl-4 col-md-6">

          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderRadius: "16px"
            }}
          >

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-start">

                <div>

                  <p className="text-muted mb-2">
                    Total Expense
                  </p>

                  <h3 className="fw-bold mb-0 text-danger">

                    Rs.{" "}

                    {totalExpense.toLocaleString()}

                  </h3>

                </div>

                <div
                  className="bg-danger bg-opacity-10 text-danger rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px"
                  }}
                >

                  <i
                    className="bi bi-arrow-up-right"
                    style={{
                      fontSize: "21px"
                    }}
                  ></i>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* BALANCE */}

        <div className="col-xl-4 col-md-12">

          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderRadius: "16px"
            }}
          >

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-start">

                <div>

                  <p className="text-muted mb-2">
                    Current Balance
                  </p>

                  <h3
                    className={`fw-bold mb-0 ${
                      balance >= 0
                        ? "text-primary"
                        : "text-danger"
                    }`}
                  >

                    Rs.{" "}

                    {balance.toLocaleString()}

                  </h3>

                </div>

                <div
                  className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "48px",
                    height: "48px"
                  }}
                >

                  <i
                    className="bi bi-wallet2"
                    style={{
                      fontSize: "21px"
                    }}
                  ></i>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          CHARTS
      ================================================= */}

      <div className="row g-4 mb-4">

        {/* =================================================
            INCOME / EXPENSE BAR CHART
        ================================================= */}

        <div className="col-xl-7">

          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderRadius: "16px"
            }}
          >

            <div className="card-body p-4">

              {/* Chart Header */}

              <div className="d-flex justify-content-between align-items-center mb-3">

                <div>

                  <small
                    className="text-primary fw-bold"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "1.5px"
                    }}
                  >
                    OVERVIEW
                  </small>

                  <h5 className="fw-bold mb-0 mt-1">
                    Income vs Expense
                  </h5>

                  <small className="text-muted">
                    Compare your total money in and money out.
                  </small>

                </div>

                <span className="badge bg-light text-secondary rounded-pill px-3 py-2">

                  All Time

                </span>

              </div>


              {/* Loading */}

              {loading ? (

                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    height: "340px"
                  }}
                >

                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>

                </div>

              ) : (

                <div
                  style={{
                    width: "100%",
                    height: "340px"
                  }}
                >

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <BarChart
                      data={barData}
                      margin={{
                        top: 20,
                        right: 20,
                        left: 10,
                        bottom: 10
                      }}
                      barGap={18}
                    >

                      <CartesianGrid
                        stroke="#edf0f5"
                        strokeDasharray="4 4"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#64748b",
                          fontSize: 11,
                          fontWeight: 600
                        }}
                      />

                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#94a3b8",
                          fontSize: 10
                        }}
                        tickFormatter={(value) =>
                          Number(value).toLocaleString()
                        }
                      />

                      <Tooltip
                        contentStyle={{
                          border: "none",
                          borderRadius: "12px",
                          boxShadow:
                            "0 10px 30px rgba(15, 23, 42, 0.12)"
                        }}
                        formatter={(value) => [
                          `Rs. ${Number(value).toLocaleString()}`,
                          ""
                        ]}
                      />

                      <Legend
                        verticalAlign="bottom"
                        height={35}
                        iconType="circle"
                        wrapperStyle={{
                          fontSize: "11px"
                        }}
                      />

                      {/* INCOME */}

                      <Bar
                        dataKey="Income"
                        name="Income"
                        fill="#16a34a"
                        radius={[
                          8,
                          8,
                          0,
                          0
                        ]}
                        maxBarSize={75}
                      />

                      {/* EXPENSE */}

                      <Bar
                        dataKey="Expense"
                        name="Expense"
                        fill="#dc2626"
                        radius={[
                          8,
                          8,
                          0,
                          0
                        ]}
                        maxBarSize={75}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              )}

            </div>

          </div>

        </div>


        {/* =================================================
            EXPENSE CATEGORY DONUT
        ================================================= */}

        <div className="col-xl-5">

          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderRadius: "16px"
            }}
          >

            <div className="card-body p-4">

              {/* Header */}

              <div className="d-flex justify-content-between align-items-center mb-3">

                <div>

                  <small
                    className="text-primary fw-bold"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "1.5px"
                    }}
                  >
                    BREAKDOWN
                  </small>

                  <h5 className="fw-bold mb-0 mt-1">
                    Expense Categories
                  </h5>

                  <small className="text-muted">
                    See where your money is going.
                  </small>

                </div>

                <div
                  className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "42px",
                    height: "42px"
                  }}
                >

                  <i className="bi bi-pie-chart-fill"></i>

                </div>

              </div>


              {/* No Data */}

              {data.expenseByCategory.length === 0 ? (

                <div
                  className="d-flex flex-column justify-content-center align-items-center"
                  style={{
                    height: "340px"
                  }}
                >

                  <div
                    className="bg-light rounded-circle d-flex justify-content-center align-items-center mb-3"
                    style={{
                      width: "70px",
                      height: "70px"
                    }}
                  >

                    <i
                      className="bi bi-pie-chart text-secondary"
                      style={{
                        fontSize: "28px"
                      }}
                    ></i>

                  </div>

                  <h6 className="fw-bold mb-1">
                    No Expense Data
                  </h6>

                  <small className="text-muted text-center">
                    Add expenses from the Expense page
                    to see category breakdown.
                  </small>

                </div>

              ) : (

                <div
                  style={{
                    width: "100%",
                    height: "340px",
                    position: "relative"
                  }}
                >

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
                        cy="46%"
                        innerRadius={68}
                        outerRadius={108}
                        paddingAngle={4}
                        stroke="#ffffff"
                        strokeWidth={3}
                      >

                        {data.expenseByCategory.map(
                          (entry, index) => (

                            <Cell
                              key={`cell-${index}`}
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
                            "0 10px 30px rgba(15, 23, 42, 0.12)"
                        }}
                        formatter={(value) => [
                          `Rs. ${Number(value).toLocaleString()}`,
                          "Expense"
                        ]}
                      />


                      <Legend
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                        wrapperStyle={{
                          fontSize: "10px",
                          paddingTop: "10px"
                        }}
                      />


                      {/* CENTER TEXT */}

                      <text
                        x="50%"
                        y="43%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#64748b"
                        fontSize="11"
                        fontWeight="600"
                      >
                        Total Expense
                      </text>

                      <text
                        x="50%"
                        y="51%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#111827"
                        fontSize="17"
                        fontWeight="800"
                      >
                        Rs.{" "}
                        {totalExpense.toLocaleString()}
                      </text>

                    </PieChart>

                  </ResponsiveContainer>

                </div>

              )}

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          REPORT SUMMARY
      ================================================= */}

      <div
        className="card border-0 shadow-sm"
        style={{
          borderRadius: "16px"
        }}
      >

        <div className="card-body p-4">

          <div className="d-flex align-items-center mb-3">

            <div
              className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center me-3"
              style={{
                width: "42px",
                height: "42px"
              }}
            >

              <i className="bi bi-info-circle"></i>

            </div>

            <div>

              <h5 className="fw-bold mb-0">
                Financial Summary
              </h5>

              <small className="text-muted">
                Your overall financial position
              </small>

            </div>

          </div>


          <div className="row g-3">

            <div className="col-md-4">

              <div className="bg-light rounded-3 p-3">

                <small className="text-muted">
                  Money Received
                </small>

                <div className="fw-bold text-success mt-1">

                  Rs.{" "}
                  {totalIncome.toLocaleString()}

                </div>

              </div>

            </div>


            <div className="col-md-4">

              <div className="bg-light rounded-3 p-3">

                <small className="text-muted">
                  Money Spent
                </small>

                <div className="fw-bold text-danger mt-1">

                  Rs.{" "}
                  {totalExpense.toLocaleString()}

                </div>

              </div>

            </div>


            <div className="col-md-4">

              <div className="bg-light rounded-3 p-3">

                <small className="text-muted">
                  Remaining Balance
                </small>

                <div
                  className={`fw-bold mt-1 ${
                    balance >= 0
                      ? "text-primary"
                      : "text-danger"
                  }`}
                >

                  Rs.{" "}
                  {balance.toLocaleString()}

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Reports;