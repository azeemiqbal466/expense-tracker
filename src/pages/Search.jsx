import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import api from "../services/api.js";

const Search = () => {

  const [searchParams] = useSearchParams();

  const query = searchParams.get("q") || "";

  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);


  // =====================================================
  // LOAD BOTH INCOME & EXPENSE
  // =====================================================

  useEffect(() => {

    const loadData = async () => {

      try {

        setLoading(true);

        const [incomeResponse, expenseResponse] =
          await Promise.all([
            api.get("/income"),
            api.get("/expense")
          ]);

        setIncomes(incomeResponse.data);
        setExpenses(expenseResponse.data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    loadData();

  }, []);


  // =====================================================
  // SEARCH
  // =====================================================

  const results = useMemo(() => {

    const searchText = query
      .toLowerCase()
      .trim();

    if (!searchText) {
      return [];
    }


    const incomeResults = incomes
      .filter((item) =>
        `${item.title} ${item.category} ${item.description || ""}`
          .toLowerCase()
          .includes(searchText)
      )
      .map((item) => ({
        ...item,
        type: "income"
      }));


    const expenseResults = expenses
      .filter((item) =>
        `${item.title} ${item.category} ${item.description || ""}`
          .toLowerCase()
          .includes(searchText)
      )
      .map((item) => ({
        ...item,
        type: "expense"
      }));


    return [
      ...incomeResults,
      ...expenseResults
    ].sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );

  }, [query, incomes, expenses]);


  return (

    <div>

      <div className="page-header">

        <span className="chart-eyebrow">
          SEARCH
        </span>

        <h1>
          Search Results
        </h1>

        <p>
          Results for:
          {" "}
          <strong>
            "{query}"
          </strong>
        </p>

      </div>


      <div className="content-card">

        {loading ? (

          <div className="text-center py-5">

            <div
              className="spinner-border text-primary"
              role="status"
            ></div>

            <p className="text-muted mt-3 mb-0">
              Searching transactions...
            </p>

          </div>

        ) : results.length === 0 ? (

          <div className="text-center py-5">

            <div className="empty-dashboard-icon mx-auto">

              <i className="bi bi-search"></i>

            </div>

            <h5 className="fw-bold mt-3">
              No results found
            </h5>

            <p className="text-muted small">
              Try searching another transaction,
              category or description.
            </p>

            <Link
              to="/dashboard"
              className="btn btn-primary btn-sm px-4"
            >
              Back to Dashboard
            </Link>

          </div>

        ) : (

          <>

            <div className="d-flex justify-content-between align-items-center mb-3">

              <div>

                <h5 className="fw-bold mb-1">
                  Matching Transactions
                </h5>

                <small className="text-muted">
                  {results.length} result(s) found
                </small>

              </div>

            </div>


            <div className="table-responsive">

              <table className="table align-middle">

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

                  {results.map((item) => (

                    <tr
                      key={`${item.type}-${item._id}`}
                    >

                      <td>

                        <div className="d-flex align-items-center gap-2">

                          <div
                            className={
                              item.type === "income"
                                ? "dashboard-transaction-icon income"
                                : "dashboard-transaction-icon expense"
                            }
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

                  ))}

                </tbody>

              </table>

            </div>

          </>

        )}

      </div>

    </div>
  );
};

export default Search;