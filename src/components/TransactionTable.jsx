const TransactionTable = ({
  transactions,
  onDelete,
  onEdit,
  type
}) => {
  return (
    <div className="table-responsive">

      <table className="table align-middle">

        {/* Table Header */}
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
            <th className="text-center">
              Action
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>

          {transactions.length === 0 ? (

            <tr>
              <td
                colSpan="5"
                className="text-center py-5 text-muted"
              >
                <i
                  className="bi bi-inbox"
                  style={{ fontSize: "30px" }}
                ></i>

                <div className="mt-2">
                  No income records found
                </div>
              </td>
            </tr>

          ) : (

            transactions.map((item) => (

              <tr key={item._id}>

                {/* Title */}
                <td>

                  <div className="d-flex align-items-center gap-2">

                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: "#e8f7ed",
                        color: "#198754"
                      }}
                    >
                      <i className="bi bi-arrow-down-left"></i>
                    </div>

                    <div>

                      <div className="fw-semibold">
                        {item.title}
                      </div>

                      {item.description && (
                        <small className="text-muted">
                          {item.description}
                        </small>
                      )}

                    </div>

                  </div>

                </td>

                {/* Category */}
                <td>

                  <span className="badge rounded-pill text-bg-light">

                    {item.category}

                  </span>

                </td>

                {/* Amount */}
                <td
                  className={
                    type === "income"
                      ? "text-success fw-bold"
                      : "text-danger fw-bold"
                  }
                >

                  {type === "income" ? "+" : "-"}

                  {" Rs. "}

                  {Number(
                    item.amount
                  ).toLocaleString()}

                </td>

                {/* Date */}
                <td>

                  {new Date(
                    item.date
                  ).toLocaleDateString()}

                </td>

                {/* Action */}
                <td className="text-center">

                  <div className="d-flex justify-content-center gap-2">

                    {/* EDIT BUTTON */}
                    {onEdit && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          onEdit(item)
                        }
                        title="Edit Income"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    )}

                    {/* DELETE BUTTON */}
                    {onDelete && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          onDelete(item._id)
                        }
                        title="Delete Income"
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    )}

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
};

export default TransactionTable;