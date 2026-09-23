import { useEffect, useState } from "react";
import api from "../services/api.js";
import TransactionTable from "../components/TransactionTable.jsx";
import { toast } from "react-toastify";

const Expenses = () => {
  // Initial form
  const initial = {
    title: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    description: ""
  };

  // States
  const [form, setForm] = useState(initial);
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // GET ALL EXPENSES
  // =====================================================

  const load = async () => {
    try {
      const response = await api.get("/expense");

      setExpenses(response.data);

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to load expense records"
      );
    }
  };

  // Load expenses when page opens
  useEffect(() => {
    load();
  }, []);

  // =====================================================
  // ADD / UPDATE EXPENSE
  // =====================================================

  const submit = async (e) => {
    e.preventDefault();

    // Prevent double click
    if (loading) return;

    setLoading(true);

    try {

      // UPDATE EXPENSE
      if (editingId) {

        await api.put(
          `/expense/${editingId}`,
          form
        );

        toast.success(
          "Expense updated successfully!"
        );

      }

      // ADD EXPENSE
      else {

        await api.post(
          "/expense",
          form
        );

        toast.success(
          "Expense added successfully!"
        );

      }

      // Reset form
      setForm(initial);

      // Exit edit mode
      setEditingId(null);

      // Refresh records
      await load();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // DELETE EXPENSE
  // =====================================================

  const remove = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await api.delete(
        `/expense/${id}`
      );

      toast.success(
        "Expense deleted successfully!"
      );

      await load();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Delete failed"
      );

    }
  };

  // =====================================================
  // EDIT EXPENSE
  // =====================================================

  const edit = (item) => {

    setEditingId(item._id);

    setForm({
      title: item.title,
      amount: item.amount,
      category: item.category,
      date: new Date(item.date)
        .toISOString()
        .split("T")[0],
      description: item.description || ""
    });

    toast.info(
      "Expense loaded for editing"
    );

    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEdit = () => {

    setEditingId(null);

    setForm(initial);

    toast.info(
      "Edit cancelled"
    );
  };

  // =====================================================
  // RETURN UI
  // =====================================================

  return (
    <div className="container-fluid px-0">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">

        <div>

          <div className="d-flex align-items-center gap-2 mb-1">

            {/* Expense Icon */}

            <div
              className="rounded-circle bg-danger bg-opacity-10 text-danger d-flex justify-content-center align-items-center"
              style={{
                width: "42px",
                height: "42px"
              }}
            >

              <i
                className="bi bi-arrow-up-right"
                style={{
                  fontSize: "20px"
                }}
              ></i>

            </div>

            {/* Heading */}

            <div>

              <h1 className="fw-bold mb-0">
                Expense Management
              </h1>

              <p className="text-muted mb-0">
                Add and manage all your expense records.
              </p>

            </div>

          </div>

        </div>

        {/* Records Count */}

        <div className="mt-3 mt-md-0">

          <span className="badge bg-white text-dark border px-3 py-2 shadow-sm">

            <i className="bi bi-receipt me-2 text-danger"></i>

            {expenses.length} Records

          </span>

        </div>

      </div>


      {/* =================================================
          ADD / EDIT EXPENSE FORM
      ================================================= */}

      <div className="card border-0 shadow-sm rounded-4 mb-4">

        {/* Card Header */}

        <div className="card-header bg-white border-0 pt-4 px-4">

          <div className="d-flex justify-content-between align-items-center">

            <div>

              <h5 className="fw-bold mb-1">

                <i
                  className={
                    editingId
                      ? "bi bi-pencil-square text-primary me-2"
                      : "bi bi-plus-circle text-danger me-2"
                  }
                ></i>

                {editingId
                  ? "Edit Expense"
                  : "Add New Expense"}

              </h5>

              <small className="text-muted">

                {editingId
                  ? "Update your expense information below."
                  : "Enter the details of your new expense."}

              </small>

            </div>

            {/* Card Icon */}

            <div
              className="bg-danger bg-opacity-10 text-danger rounded-3 d-flex align-items-center justify-content-center"
              style={{
                width: "45px",
                height: "45px"
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


        {/* Form Body */}

        <div className="card-body p-4">

          <form onSubmit={submit}>

            <div className="row g-4">

              {/* =================================================
                  TITLE
              ================================================= */}

              <div className="col-lg-6">

                <label className="form-label fw-semibold">

                  Expense Title

                  <span className="text-danger ms-1">
                    *
                  </span>

                </label>

                <div className="input-group">

                  <span className="input-group-text bg-white">

                    <i className="bi bi-pencil text-muted"></i>

                  </span>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Grocery"
                    value={form.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title: e.target.value
                      })
                    }
                    required
                  />

                </div>

              </div>


              {/* =================================================
                  AMOUNT
              ================================================= */}

              <div className="col-lg-6">

                <label className="form-label fw-semibold">

                  Amount

                  <span className="text-danger ms-1">
                    *
                  </span>

                </label>

                <div className="input-group">

                  <span className="input-group-text bg-white fw-semibold">

                    Rs.

                  </span>

                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="Enter amount"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        amount: e.target.value
                      })
                    }
                    required
                  />

                </div>

              </div>


              {/* =================================================
                  CATEGORY
              ================================================= */}

              <div className="col-lg-6">

                <label className="form-label fw-semibold">

                  Category

                </label>

                <div className="input-group">

                  <span className="input-group-text bg-white">

                    <i className="bi bi-tags text-muted"></i>

                  </span>

                  <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value
                      })
                    }
                  >

                    <option value="Food">
                      Food
                    </option>

                    <option value="Transport">
                      Transport
                    </option>

                    <option value="Shopping">
                      Shopping
                    </option>

                    <option value="Bills">
                      Bills
                    </option>

                    <option value="Rent">
                      Rent
                    </option>

                    <option value="Health">
                      Health
                    </option>

                    <option value="Education">
                      Education
                    </option>

                    <option value="Entertainment">
                      Entertainment
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

              </div>


              {/* =================================================
                  DATE
              ================================================= */}

              <div className="col-lg-6">

                <label className="form-label fw-semibold">

                  Date

                  <span className="text-danger ms-1">
                    *
                  </span>

                </label>

                <div className="input-group">

                  <span className="input-group-text bg-white">

                    <i className="bi bi-calendar3 text-muted"></i>

                  </span>

                  <input
                    type="date"
                    className="form-control"
                    value={form.date}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        date: e.target.value
                      })
                    }
                    required
                  />

                </div>

              </div>


              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <div className="col-12">

                <label className="form-label fw-semibold">

                  Description

                  <span className="text-muted fw-normal ms-1">
                    (Optional)
                  </span>

                </label>

                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter a short description about this expense..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value
                    })
                  }
                ></textarea>

              </div>


              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="col-12 d-flex flex-wrap gap-2">

                {/* ADD / UPDATE BUTTON */}

                <button
                  type="submit"
                  className={
                    editingId
                      ? "btn btn-primary px-4"
                      : "btn btn-danger px-4"
                  }
                  disabled={loading}
                >

                  {loading ? (

                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>

                      {editingId
                        ? "Updating..."
                        : "Adding..."}

                    </>

                  ) : (

                    <>

                      <i
                        className={
                          editingId
                            ? "bi bi-check2-circle me-2"
                            : "bi bi-plus-circle me-2"
                        }
                      ></i>

                      {editingId
                        ? "Update Expense"
                        : "Add Expense"}

                    </>

                  )}

                </button>


                {/* CANCEL BUTTON */}

                {editingId && (

                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={cancelEdit}
                    disabled={loading}
                  >

                    <i className="bi bi-x-circle me-2"></i>

                    Cancel

                  </button>

                )}

              </div>

            </div>

          </form>

        </div>

      </div>


      {/* =================================================
          EXPENSE RECORDS
      ================================================= */}

      <div className="card border-0 shadow-sm rounded-4">

        {/* Records Header */}

        <div className="card-header bg-white border-0 p-4">

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">

            <div>

              <h5 className="fw-bold mb-1">

                <i className="bi bi-list-ul text-primary me-2"></i>

                Expense Records

              </h5>

              <small className="text-muted">

                All your recorded expense transactions.

              </small>

            </div>


            {/* Total Expense */}

            <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-3 py-2">

              Total: Rs.{" "}

              {expenses
                .reduce(
                  (total, item) =>
                    total + Number(item.amount),
                  0
                )
                .toLocaleString()}

            </span>

          </div>

        </div>


        {/* Table */}

        <div className="card-body pt-0 px-4 pb-4">

          <TransactionTable
            transactions={expenses}
            type="expense"
            onEdit={edit}
            onDelete={remove}
          />

        </div>

      </div>

    </div>
  );
};

export default Expenses;